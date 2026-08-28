# K2 Tap

Aplicação institucional e demonstrativa da **K2 Tap**, uma solução da K2 Tech que conecta uma peça física com NFC a experiências digitais personalizadas para negócios.

O projeto foi reconstruído em Next.js a partir do protótipo legado `index (3) (1).html`. O arquivo original permanece no repositório como referência visual e funcional, mas não é carregado pela aplicação.

## Stack

- Next.js 16 com App Router
- React 19
- TypeScript strict
- CSS Modules
- Lucide React
- `qrcode.react`
- Vitest + Testing Library
- Playwright

## Requisitos

- Node.js 20.9 ou superior
- npm 10 ou superior

## Instalação

```bash
npm install
```

## Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:3000`.

## Scripts

```bash
npm run dev        # servidor de desenvolvimento
npm run build      # build otimizado de produção
npm run start      # executa o build de produção
npm run lint       # ESLint
npm run typecheck  # TypeScript sem emitir arquivos
npm run test       # testes unitários e de componentes
npm run test:e2e   # fluxo completo no Chromium/Chrome
npm run format     # formata os arquivos com Prettier
```

## Estrutura

```text
src/
  app/                    # App Router, metadata, SEO e páginas
  components/
    facilities/           # modal e cinco painéis de facilidades
    feedback/             # toast interno
    landing/              # Hero, demo NFC, possibilidades, métricas e CTA
    layout/               # Header e Footer
    showcase/             # seletor, telefone e quatro experiências
    ui/                   # elementos compartilhados
  config/                 # dados institucionais
  data/                   # navegação e projetos fictícios
  hooks/                  # clipboard, foco, motion e toast
  lib/                    # payloads Wi-Fi e apresentação Pix
  types/                  # contratos TypeScript
tests/
  components/             # Vitest + Testing Library
  e2e/                    # Playwright e capturas visuais
artifacts/
  baseline/               # screenshots do legado
  final/                  # screenshots gerados pelo E2E
```

## Arquitetura de renderização

`src/app/page.tsx` é um Server Component e apenas compõe a página. Os componentes estáticos da landing também permanecem no servidor.

`"use client"` está limitado a áreas que precisam de estado ou APIs do navegador:

- menu mobile do Header;
- reveal por viewport;
- demonstração NFC;
- seletor de projetos e modal;
- clipboard, compartilhamento, toast, avaliação e trap de foco.

## Como adicionar um projeto fictício

1. Adicione um novo identificador em `ProjectId`, em `src/types/project.ts`.
2. Inclua a configuração completa em `src/data/projects.ts`.
3. Crie a composição visual em `src/components/showcase/experiences/`.
4. Registre o componente em `experienceComponents`, no arquivo `MobileExperience.tsx`.
5. Associe um ícone em `ProjectSelector.tsx`.
6. Adicione ou atualize os testes de troca de projeto.

Os dados de cliente não devem ser espalhados no JSX. Nome, slug, cores, conteúdo, ações, Wi-Fi, Pix, redes, localização e horários pertencem à configuração do projeto.

## Como alterar o Wi-Fi

Em `src/data/projects.ts`, edite:

```ts
wifi: {
  ssid: 'Nome da rede',
  password: 'Senha segura',
  security: 'WPA',
}
```

`src/lib/wifi.ts` escapa caracteres reservados e gera automaticamente um payload no formato:

```text
WIFI:T:WPA;S:Nome da rede;P:Senha segura;H:false;;
```

O QR não é uma imagem estática.

## Como alterar o Pix

Em `src/data/projects.ts`, edite o objeto `pix`.

O provider atual é deliberadamente `demo`. A aplicação gera apenas uma referência visual fictícia e deixa claro que não existe cobrança real.

Para produção, um backend ou provedor de pagamentos deve gerar o BR Code/Pix Copia e Cola e preencher `pix.payload`. O adaptador `src/lib/pix.ts` aceita esse payload sem exigir mudanças nos componentes de apresentação. Nunca coloque tokens, chaves privadas ou credenciais de provider no frontend.

## Como alterar redes sociais

Edite `socials` na configuração do projeto. Cada item contém `network`, `handle` e `href`. Os links atuais usam `example.com` para evitar que a demonstração direcione a contas reais por acidente.

## Como alterar a localização

Edite:

```ts
location: {
  address: 'Endereço exibido',
  mapQuery: 'Consulta usada pelo Google Maps',
}
```

O iframe é criado somente quando o painel Mapa está ativo, usa `loading="lazy"` e permanece contido no telefone. O botão Compartilhar usa Web Share API quando disponível e clipboard como fallback.

## Como alterar horários

O Restaurante possui `openingHours.summary`, `openingHours.period` e uma lista `openingHours.days`. Cada dia é renderizado em uma linha independente, com dia à esquerda e horário à direita.

## Modal de facilidades

`FacilitiesModal` é renderizado dentro do mockup do telefone. Ele possui:

- dialog acessível com `aria-modal`;
- fechamento por Escape;
- trap de foco;
- retorno de foco ao acionador;
- header e navegação sticky;
- conteúdo interno rolável;
- navegação em grid, sem scroll horizontal;
- QR Codes responsivos;
- toast com `aria-live`;
- clipping pelo próprio telefone.

Os painéis Wi-Fi, Pix, Redes, Mapa e Opinião são componentes independentes.

## Demonstração NFC

`NfcDemo.tsx` controla quatro etapas com estado React. O autoplay começa quando a seção entra no viewport, mantém um único timer, limpa o timer no unmount, permite seleção manual e replay, e não executa a sequência automática quando `prefers-reduced-motion: reduce` está ativo.

## SEO

A aplicação usa Metadata API, Open Graph dinâmico, Twitter Card, ícone, `robots.ts`, `sitemap.ts` e JSON-LD para Organização e Produto.

Antes de publicar em domínio definitivo, revise `siteConfig.url` e `siteConfig.commercialUrl` em `src/config/site.ts`.

## Testes

Os testes de componente cobrem:

- troca de projeto;
- abertura, abas, Escape e fechamento do modal;
- retorno de foco;
- clipboard e fallback;
- toast;
- estrelas e envio de opinião;
- fallback da Web Share API;
- seleção e replay da demonstração NFC.

O E2E cobre o caminho completo da landing até Wi-Fi, Pix, Redes, Mapa/compartilhamento e Opinião. A suíte visual registra 375×812, 390×844, 430×932 e 1440×900.

## Deploy

### Vercel

1. Importe o repositório na Vercel.
2. Mantenha o framework detectado como Next.js.
3. Use `npm run build` como comando de build.
4. Atualize o domínio em `src/config/site.ts`.
5. Publique.

Nenhuma variável de ambiente é necessária para a demonstração atual.

### Node.js

```bash
npm install
npm run build
npm run start
```

O servidor usa a porta `3000` por padrão.

## Evolução futura

A configuração já utiliza slugs como `k2-restaurante`, `k2-barbearia`, `k2-loja` e `k2-servico`. Isso prepara a base para rotas futuras `/tag/[slug]` e dados multi-tenant, sem alterar a demonstração atual. A próxima etapa recomendada é resolver o projeto por slug em uma camada de dados segura e manter payloads reais de pagamento exclusivamente no backend.
