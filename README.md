# V INTERNERD 2026 – Atlética Cyborgues (UEMA)

> **Plataforma Oficial do V Campeonato Interno da Associação Atlética Acadêmica de Engenharia de Computação Cyborgues**  
> Universidade Estadual do Maranhão (UEMA) – Campus Paulo VI, São Luís/MA  
> Período do Evento: **31/10/2026 a 06/11/2026**  
> Inscrições: Até **28/09/2026** | Sorteio: **05/11/2026** no Instagram [@atleticacyborgues](https://www.instagram.com/atleticacyborgues)  
> Chave PIX Oficial: `aaa.cyborgues@gmail.com` (Banco Santander – Luys Arthur Serejo Alves)

---

## 🚀 Como Publicar no GitHub Pages (Git Sites)

O repositório já está 100% configurado com `base: '/cyborgues-internerd/'` no `vite.config.ts` e com o workflow oficial do GitHub Actions (`.github/workflows/deploy-pages.yml`).

### 1. Inicializar e Comitar no Git Local
Execute no terminal da pasta do projeto:

```bash
git init
git add .
git commit -m "feat: V INTERNERD 2026 Cyborgues - base oficial e deploy GitHub Pages"
git branch -M main
```

### 2. Conectar ao Repositório no GitHub
```bash
git remote add origin https://github.com/caiovicrz/cyborgues-internerd.git
git push -u origin main
```

### 3. Ativar o GitHub Pages no Repositório
1. No seu repositório no GitHub (`caiovicrz/cyborgues-internerd`), acesse: **Settings** > **Pages**
2. Na seção **Build and deployment** > **Source**, selecione: **GitHub Actions**
3. O GitHub Actions executará o workflow `.github/workflows/deploy-pages.yml` automaticamente a cada `push` na branch `main`.
4. O site estará no ar em:  
   👉 **https://caiovicrz.github.io/cyborgues-internerd/**

---

## 🔐 Acesso Administrativo Inicial

A plataforma já vem com os dois Diretores Gerais Oficiais configurados no sistema:

| Diretor Geral | Nome de Usuário (Imutável) | Senha Inicial | Nível |
|---|---|---|---|
| **Caio Cruz** | `Caiocruz` | `@Cyborgues2026` | Diretoria Geral (Total) |
| **Luys Arthur Serejo Alves** | `Luisarthur` | `@Cyborgues2026` | Diretoria Geral & PIX |

> 🔒 **Regra de Segurança Oficial:**  
> - Os logins (nomes de usuário) são estritamente **imutáveis**.
> - Diretores e Capitães podem alterar sua senha a qualquer momento clicando em **Alterar Senha** (ou no ícone de chave no cabeçalho).
> - **Atletas não se inscrevem sozinhos:** os capitães de equipe realizam as inscrições de seus atletas diretamente no painel.

---

## 🏆 Estrutura do Sistema

- **Páginas Públicas:** Início, Regulamento Geral, Tabela de Jogos, Resultados e Classificação Geral Oficial com critérios de desempate do Art. 28.
- **Painel do Capitão:** Cadastro e gerenciamento de equipe, inscrição de atletas com validações do regulamento (mínimo de 15 atletas e 6 modalidades, limites por esporte e taxa de R$ 5,00 por modalidade).
- **Área do Diretor de Modalidade:** Cadastro e súmula de jogos, placares, W.O. com tolerância oficial e lançamento de colocações finais.
- **Diretoria Geral:** Gestão de credenciais (criação de diretores e capitães), controle financeiro de pagamentos PIX, ferramenta oficial de sorteio das modalidades coletivas e exportação completa em CSV/JSON.

---

## 🛠️ Comandos de Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Iniciar servidor de desenvolvimento (porta 3000)
npm run dev

# Rodar testes de regras e cálculo de pontos
npx tsx --test src/utils/rules.test.ts

# Gerar build de produção
npm run build
```

---

© 2026 A.A.A. Eng. de Computação Cyborgues – UEMA São Luís/MA
