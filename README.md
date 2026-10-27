# 🕯️ Exame de Consciência (iOS e Expo)

Aplicativo criado pra auxiliar no exame de consciência católico antes do sacramento da confissão.

A ideia nasceu de uma necessidade prática: em vez de levar anotações soltas no bloco de notas ou caçar roteiros em sites na porta da igreja, você tem um roteiro seguro, discreto e com privacidade absoluta na mão.

---

## Como Funciona a Privacidade

A regra número um do projeto é proteger a sua privacidade no confessionário:

- **100% offline:** nada vai pra nuvem. Não tem login, banco de dados externo ou telemetria.
- **Destruição total pós-absolvição:** quando você toca no botão para confirmar a absolvição, cada anotação sua e cada falta marcada somem imediatamente da memória do celular.
- **Apenas a data fica:** guardamos somente a data da sua confissão mais recente, ajudando você a lembrar há quantos dias não se confessa.
- **Proteção de tela:** se você alternar de aplicativo ou receber uma ligação, a tela se oculta pra ninguém ao seu lado ler nada.

---

## Roteiro e Estrutura

- **Oração preparatória:** invocação tradicional ao Espírito Santo antes de começar a reflexão.
- **Exame guiado:** perguntas organizadas pelos Dez Mandamentos, Cinco Preceitos da Igreja, Pecados Capitais e Deveres de Estado do seu cotidiano.
- **Notas livres:** além dos itens prontos pra marcar com um toque, dá pra escrever apontamentos pessoais rápidos.
- **Modo Confessionário:** na hora da confissão com o padre, o app reúne numa tela limpa apenas as faltas que você selecionou. Conforme você for falando, basta tocar no item pra atenuar a linha.
- **Ato de Contrição:** oração completa disponível na mesma tela pra você rezar com tranquilidade.

---

## Visual: Estética Breviário e Luz de Vela

- **Fundo preto OLED e acentos em âmbar:** planejado especialmente pra você usar no interior escuro da igreja sem chamar atenção e sem cansar a sua vista.
- **Tipografia Cinzel:** inspiração nos antigos missais e breviários em harmonia com a usabilidade moderna do iOS.
- **Feedback tátil:** respostas hápticas suaves a cada seleção.

---

## Tecnologias do Projeto

O repositório reúne duas formas de execução:

1. **React Native com Expo (pasta raiz e `src/`):** interface rápida e interativa pra rodar no seu aparelho sem precisar de Mac.
2. **Swift 6 nativo com SwiftUI (pasta `ExameConsciencia/`):** implementação nativa feita pra compilar o app puro pra iOS.

---

## Como Rodar no seu iPhone em 1 Minuto (Expo Go)

1. Baixe o aplicativo gratuito **[Expo Go](https://apps.apple.com/app/expo-go/id982107779)** na App Store do seu iPhone.
2. No seu computador, instale as dependências e inicie o projeto:
   ```bash
   npm install
   npm start
   ```
3. Aponte a câmera do seu iPhone pro QR Code que aparecer no terminal e toque em abrir com o Expo Go. Pronto, o app já carrega no seu aparelho!

---

## Como Gerar o Pacote .ipa (Build Nativo)

O projeto conta com um workflow automatizado no GitHub Actions em `.github/workflows/build-ios.yml`. Ele roda num runner macOS, gera o projeto Xcode via XcodeGen, roda os testes unitários e compila o `.ipa` pronto pra instalação via AltStore, Sideloadly ou Xcode.

---

## Documentação e Especificações

- Especificação de Design: [`docs/superpowers/specs/2026-10-23-exame-consciencia-ios-design.md`](docs/superpowers/specs/2026-10-23-exame-consciencia-ios-design.md)
- Plano de Implementação: [`docs/superpowers/plans/2026-10-23-exame-consciencia-ios.md`](docs/superpowers/plans/2026-10-23-exame-consciencia-ios.md)
