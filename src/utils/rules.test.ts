import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateAthleteFee,
  validateTeamRequirements,
  isAthleteTransferAllowed,
  calculateOverallStandings,
  OFFICIAL_MODALITIES,
  PIX_PAYMENT_INFO,
} from './rules';

test('calculates athlete fee correctly at R$ 5,00 per modality (Art. 22)', () => {
  assert.equal(calculateAthleteFee(0), 0);
  assert.equal(calculateAthleteFee(1), 5.0);
  assert.equal(calculateAthleteFee(3), 15.0);
  assert.equal(calculateAthleteFee(6), 30.0);
  assert.equal(calculateAthleteFee(-1), 0);
});

test('validates team requirements for minimum 15 athletes and 6 modalities (Art. 19)', () => {
  // Invalid: less than 15 athletes, less than 6 modalities
  const invalid1 = validateTeamRequirements(12, 4);
  assert.equal(invalid1.isValid, false);
  assert.equal(invalid1.errors.length, 2);

  // Invalid: enough modalities but fewer than 15 athletes
  const invalid2 = validateTeamRequirements(14, 7);
  assert.equal(invalid2.isValid, false);
  assert.equal(invalid2.errors.length, 1);

  // Valid: exactly 15 athletes and 6 modalities
  const valid1 = validateTeamRequirements(15, 6);
  assert.equal(valid1.isValid, true);
  assert.equal(valid1.errors.length, 0);

  // Modality limits check: Futsal max is 12
  const rosterCheck = validateTeamRequirements(16, 6, { futsal: 14 });
  assert.equal(rosterCheck.isValid, false);
  assert.match(rosterCheck.errors[0], /limite máximo permitido de 12/);
});

test('verifies athlete transfer lock after 28/09/2026 (Art. 21)', () => {
  const duringRegistration = new Date('2026-09-15T12:00:00-03:00');
  const afterRegistration = new Date('2026-10-02T10:00:00-03:00');

  assert.equal(isAthleteTransferAllowed(duringRegistration, false), true);
  assert.equal(isAthleteTransferAllowed(afterRegistration, false), false);
  // Admin exception override
  assert.equal(isAthleteTransferAllowed(afterRegistration, true), true);
});

test('calculates general standings with tie-breaker criteria (Art. 28) and limits top 2 individual results (Art. 26 §4º)', () => {
  const teams = [
    { id: 'team-alpha', name: 'Alpha Cyborgues' },
    { id: 'team-beta', name: 'Beta FC' },
    { id: 'team-gamma', name: 'Gamma Team' },
  ];

  // Alpha: 1st in Futsal (12pts collective)
  // Beta: 1st in FIFA (6pts individual), 2nd in Clash Royale (4pts individual), 3rd in FIFA (2pts individual)
  // Gamma: 1st in Voleibol (12pts collective)
  const placements = [
    { modalityId: 'futsal', teamId: 'team-alpha', placement: 1 as const }, // 12 pts (1st collective)
    { modalityId: 'fifa', teamId: 'team-beta', athleteId: 'ath-1', placement: 1 as const }, // 6 pts
    { modalityId: 'fifa', teamId: 'team-beta', athleteId: 'ath-2', placement: 2 as const }, // 4 pts
    { modalityId: 'fifa', teamId: 'team-beta', athleteId: 'ath-3', placement: 3 as const }, // 2 pts -> Should be ignored! Only top 2 count for FIFA (Art. 26 §4º)
    { modalityId: 'clash-royale', teamId: 'team-beta', athleteId: 'ath-4', placement: 1 as const }, // 6 pts
    { modalityId: 'voleibol', teamId: 'team-gamma', placement: 1 as const }, // 12 pts (1st collective)
  ];

  const standings = calculateOverallStandings(teams, placements);

  // Beta should have 6 + 4 (from FIFA, 3rd place 2pts ignored) + 6 (from Clash) = 16 pts
  const beta = standings.find((s) => s.teamId === 'team-beta')!;
  assert.equal(beta.totalPoints, 16);

  // Alpha and Gamma both have 12 pts, 1 first place, 0 second, 0 third, 1 collective first place.
  // They are tied on all criteria I to V, so manual resolution is flagged (Art. 28 VI)
  const alpha = standings.find((s) => s.teamId === 'team-alpha')!;
  const gamma = standings.find((s) => s.teamId === 'team-gamma')!;
  assert.equal(alpha.totalPoints, 12);
  assert.equal(gamma.totalPoints, 12);
  assert.equal(alpha.needsManualResolution, true);
  assert.equal(gamma.needsManualResolution, true);
});

test('has all 14 official modalities configured', () => {
  assert.equal(OFFICIAL_MODALITIES.length, 14);
  const collective = OFFICIAL_MODALITIES.filter((m) => m.category === 'coletiva');
  const individual = OFFICIAL_MODALITIES.filter((m) => m.category === 'individual');
  assert.equal(collective.length, 6);
  assert.equal(individual.length, 8);
});

test('configures Caiocruz and Luisarthur as the two general directors with @Cyborgues2026', async () => {
  const { PRESET_USERS } = await import('../data/mockTournamentData');
  const caio = PRESET_USERS.find((u) => u.username === 'Caiocruz');
  const luis = PRESET_USERS.find((u) => u.username === 'Luisarthur');

  assert.ok(caio, 'Caiocruz must exist');
  assert.equal(caio?.password, '@Cyborgues2026');
  assert.equal(caio?.role, 'admin');

  assert.ok(luis, 'Luisarthur must exist');
  assert.equal(luis?.password, '@Cyborgues2026');
  assert.equal(luis?.role, 'admin');
});
