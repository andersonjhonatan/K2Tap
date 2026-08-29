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
    demo/[slug]/          # demonstração real de cada projeto, em tela cheia
    demo/mesa/[numero]/   # a mesma experiência aberta a partir de uma peça de mesa
    garcom/               # painel de chamados de quem atende
  components/
    demo/                 # experiência em tela cheia e modal das rotas /demo
    facilities/           # modal e seis painéis de facilidades
    feedback/             # toast interno
    landing/              # Hero, demo NFC, possibilidades, métricas e CTA
    layout/               # Header e Footer
    showcase/             # seletor, telefone, quatro experiências e chamada da demonstração
    waiter/               # painel da equipe (PWA) em /garcom
    ui/                   # elementos compartilhados
  config/                 # dados institucionais
  data/                   # navegação e projetos fictícios
  hooks/                  # clipboard, foco, motion, toast e fila de chamados
  lib/                    # Wi-Fi, Pix, URLs do chamado, fila e alertas da equipe
  types/                  # contratos TypeScript
public/
  sw.js                   # service worker do painel da equipe
  garcom.webmanifest      # manifesto do PWA
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

## Chamar garçom (atendimento na mesa)

Projetos com equipe de atendimento — restaurante, pizzaria, bar, recepção — podem exibir um atalho
para chamar quem atende. O recurso é opcional e aparece somente quando o projeto define `staffCall`
em `src/data/projects.ts`:

```ts
staffCall: {
  role: 'Garçom',                       // rótulo da aba, do painel e do chamado
  table: '12',                          // identificador enviado na URL do chamado
  spot: 'Mesa 12',                      // rótulo legível da origem
  actionLabel: 'Chamar garçom',
  actionDescription: 'Atendimento na mesa em um toque.',
  headline: 'Chame o garçom sem levantar a mão.',
  description: 'Texto de apoio exibido acima dos motivos.',
  reasons: [
    { id: 'pedido', label: 'Fazer o pedido', icon: 'order' },
    { id: 'conta', label: 'Pedir a conta', icon: 'bill' },
  ],                                    // icon: bell | order | drink | bill | help
  customerPath: '/demo/mesa/12',
  staffPath: '/garcom',
}
```

O cliente escolhe o motivo e confirma. O chamado entra em uma fila real e aparece no painel da
equipe, que pode aceitar e concluir — e o status volta sozinho para a tela do cliente.

### A fila

`src/lib/waiter-queue.ts` guarda os chamados no `localStorage` e avisa quem estiver escutando por
um evento próprio (mesma aba) e pelo evento `storage` (outras abas e janelas). O hook
`useWaiterQueue` expõe isso com `useSyncExternalStore`, sem efeito de sincronização e sem
descompasso na hidratação.

Na prática: abra `/demo/mesa/12` em uma aba e `/garcom` em outra, no mesmo navegador. O chamado
feito na mesa aparece na fila na hora, e ao tocar em **Atender** a tela da mesa passa a mostrar
"Garçom a caminho".

Entre aparelhos diferentes o estado não é compartilhado — isso exigiria backend. Para esse caso o
chamado viaja pela URL:

```text
/demo/mesa/12   →   /garcom?mesa=12&motivo=Pedir+a+conta&id=conta
```

`src/lib/staff-call.ts` monta essas URLs e a origem é resolvida no navegador, então os QR Codes
funcionam em `localhost`, em preview e no domínio final sem configuração extra. Ao abrir esse
endereço, o painel semeia o chamado na fila daquele aparelho.

### O painel da equipe é um PWA

`/garcom` tem manifesto (`public/garcom.webmanifest`) e service worker (`public/sw.js`), então pode
ser instalado como aplicativo no celular de quem atende. Com a permissão concedida, cada chamado
novo dispara **notificação persistente e vibração**, mesmo com a tela apagada — é o que faz o
garçom perceber a mesa sem estar olhando o aparelho. O botão _Testar alerta_ valida isso na hora.

O service worker também trata `push`, pronto para um backend com Web Push. Ele age apenas sob
`/garcom`: o restante do site nunca é servido de cache offline.

### Onde o chamado aparece

- na prévia dentro do telefone, pela aba do `role` no modal de facilidades (`StaffCallPanel`);
- na demonstração em tela cheia, na seção `#chamar` (`DemoStaffCall`). Na rota de mesa ela vem logo
  depois do topo, porque é o motivo de o cliente ter encostado o celular.

Para habilitar em outro projeto, basta adicionar o bloco `staffCall` na configuração dele — a aba, o
atalho, a seção e o painel passam a existir automaticamente. Sem o bloco, nada muda.

## Rotas de demonstração

Além da prévia dentro do mockup de telefone, a experiência roda de verdade em rotas próprias. É
para lá que aponta o botão **"Veja como fica na sua empresa"**, em
`src/components/showcase/DemoLaunch.tsx`, usando o slug do projeto selecionado no momento.

| Rota                  | O que é                                                             |
| --------------------- | ------------------------------------------------------------------- |
| `/demo/[slug]`        | A experiência completa em tela cheia, como o cliente final vê       |
| `/demo/mesa/[numero]` | A mesma experiência aberta pela peça de mesa, já com a mesa no topo |
| `/garcom`             | O painel de chamados de quem atende o salão                         |

`/demo/[slug]` é gerado estaticamente para os quatro projetos e entra no `sitemap.ts`. As rotas de
mesa e do painel da equipe são operacionais: ficam com `robots: noindex` e são bloqueadas em
`robots.ts`.

### Facilidades em modal

A página não abre com Wi-Fi, Pix, redes, mapa e opinião expostos: cada um é uma facilidade que o
cliente pede. Os cartões de atalho e a linha _Facilidades da casa_ abrem o `DemoModal`, um painel de
vidro — fundo escurecido com desfoque e um brilho da cor do negócio — que herda o tema do projeto.

No desktop ele aparece centralizado; no celular sobe como folha inferior, com alça e cantos
arredondados só em cima. Fecha no botão, no Escape ou tocando fora, devolve o foco ao atalho que o
abriu e trava a rolagem da página enquanto está aberto. As abas internas deixam o cliente passear
entre as facilidades sem fechar.

Os componentes ficam em `src/components/demo/` e recebem a mesma `ProjectConfig` do restante do
projeto — tema, ações, Wi-Fi, Pix, redes, localização e horários vêm todos da configuração, sem
conteúdo espalhado no JSX. O painel da equipe fica em `src/components/waiter/`.

Para trocar o número da mesa demonstrada, basta abrir outra rota: `/demo/mesa/7`, `/demo/mesa/A3`.
O identificador aceita de um a quatro caracteres alfanuméricos e qualquer outro valor cai em 404.

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

`FacilitiesModal` é renderizado dentro do mockup do telefone. As abas disponíveis dependem do
projeto: Wi-Fi, Pix, Redes, Mapa e Opinião sempre aparecem, e a aba de chamado da equipe entra
apenas quando o projeto define `staffCall`. Ele possui:

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

Os painéis Wi-Fi, Pix, Chamar garçom, Redes, Mapa e Opinião são componentes independentes.

## Demonstração NFC

`NfcDemo.tsx` controla quatro etapas com estado React. O autoplay começa quando a seção entra no viewport, mantém um único timer, limpa o timer no unmount, permite seleção manual e replay, e não executa a sequência automática quando `prefers-reduced-motion: reduce` está ativo.

## SEO

A aplicação usa Metadata API, Open Graph dinâmico, Twitter Card, ícone, `robots.ts`, `sitemap.ts` e JSON-LD para Organização e Produto.

As rotas `/demo/[slug]` entram no `sitemap.ts`; `/garcom` e `/demo/mesa/` ficam fora do índice.

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
- seleção e replay da demonstração NFC;
- chamado do garçom e exibição dos links do cliente e da equipe;
- destino do botão "Veja como fica na sua empresa" a cada troca de projeto;
- experiência em tela cheia com as facilidades fechadas;
- abertura do modal, troca de abas, Escape, fechamento e retorno de foco;
- chamado entrando na fila e link com mesa e motivo;
- painel da equipe: semeadura pela URL, atender, concluir e fila vazia;
- ida e volta completa entre a tela da mesa e o painel.

O E2E cobre o caminho completo da landing até Wi-Fi, Pix, Redes, Mapa/compartilhamento, Opinião e
chamado do garçom, seguindo para `/demo/k2-restaurante`, `/demo/mesa/12` e `/garcom`. A suíte visual registra 375×812, 390×844, 430×932 e 1440×900.

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

Os slugs `k2-restaurante`, `k2-barbearia`, `k2-loja` e `k2-servico` já resolvem rotas reais em
`/demo/[slug]`. A próxima etapa recomendada é trocar o array local por uma camada de dados
multi-tenant resolvida por slug, manter payloads reais de pagamento exclusivamente no backend e
levar a fila de chamados para um canal compartilhado (WebSocket, polling ou Web Push, que o service
worker já sabe receber), o que faria o painel da equipe passar a receber chamados de qualquer
aparelho, e não só das abas do mesmo navegador.
