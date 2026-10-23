# 🕯️ Exame de Consciência — iOS (SwiftUI Liquid Glass)

Aplicativo nativo para iOS desenvolvido em **Swift & SwiftUI**, criado para auxiliar no **Exame de Consciência Católico** em preparação para o **Sacramento da Confissão (Penitência / Reconciliação)**.

---

## 🎯 Propósito

Substituir pesquisas dispersas na internet e anotações improvisadas no bloco de notas do celular por uma ferramenta dedicada, sóbria, fiel ao Magistério da Igreja Católica e projetada com **privacidade absoluta**.

---

## ✨ Funcionalidades Planejadas

- **Doutrina Tradicional e Segura:**
  - Oração preparatória ao Espírito Santo.
  - Exame estruturado nos **Dez Mandamentos da Lei de Deus**, **Cinco Preceitos da Igreja**, **Sete Pecados Capitais** e **Deveres de Estado**.
  - **Ato de Contrição** integrado para o momento da confissão.
- **Marcação & Notas Personalizadas:**
  - Seleção rápida das perguntas do guia com um toque.
  - Adição de notas contextuais opcionais em cada item (ex: frequência ou circunstância).
  - Adição de **faltas ou anotações livres avulsas** que não estejam listadas no roteiro fixo.
- **Modo Confessionário (Resumo Consolidado):**
  - Tela limpa e organizada reunindo apenas os pontos marcados e anotações feitas, facilitando a leitura discreta diante do sacerdote.
  - Toque rápido para atenuar itens já confessados durante a acusação.
- **Privacidade Absoluta & Registro da Última Confissão:**
  - **100% Offline:** Sem servidores, sem contas, sem telemetria e sem nuvem.
  - **Destruição Imediata Pós-Absolvição:** Ao tocar em *"Recebi a Absolvição"*, toda a lista de pecados e anotações é permanentemente apagada do aparelho.
  - **Memória Apenas da Data:** O aplicativo guarda unicamente a data da última confissão realizada (ex: *"Última confissão: há 15 dias"*) para ajudar o penitente a saber há quanto tempo não se confessa.
  - **Proteção no App Switcher:** Oculta automaticamente a tela quando o aplicativo fica em segundo plano.

---

## 🎨 Identidade Visual: Liquid Glass ("Luz de Vela")

- **Estética Liquid Glass (iOS):** Superfícies translúcidas com desfoque dinâmico (`backdrop blur`), refração sutil nas bordas e profundidade em camadas.
- **Atmosfera Luz de Vela:** Fundo escuro obsidiana com acentos acolhedores em tons de **âmbar e bronze**, pensado para não ofuscar a vista na penumbra da igreja ou do confessionário.
- **Feedback Tátil (Haptics):** Interações silenciosas com resposta tátil suave.

---

## 🛠️ Arquitetura e Tecnologias

- **Linguagem:** Swift 6
- **Interface:** SwiftUI Nativo
- **Persistência:**
  - Rascunho temporário protegido por criptografia de hardware (`FileProtectionType.complete`) enquanto o exame estiver em andamento (evitando perda caso o iOS suspenda o app na fila da confissão), destruído ao concluir a confissão.
  - Armazenamento local (`UserDefaults`) restrito exclusivamente ao timestamp `lastConfessionDate`.
- **Compilação & Instalação (CI/CD):**
  - Workflow do **GitHub Actions** (`macos-latest`) para compilar o projeto Xcode na nuvem e gerar o pacote `.ipa` para instalação pessoal (via AltStore / Sideloadly / Xcode).

---

## 📄 Documentação de Design

A especificação completa da arquitetura e das decisões de produto encontra-se em:
- [`docs/superpowers/specs/2026-10-23-exame-consciencia-ios-design.md`](docs/superpowers/specs/2026-10-23-exame-consciencia-ios-design.md)
