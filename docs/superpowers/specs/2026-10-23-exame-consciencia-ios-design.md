# Design Document: Exame de Consciência Católico para iOS (SwiftUI)

**Data:** 2026-10-23  
**Status:** Proposta de Design  
**Plataforma:** iOS (SwiftUI puro, nativo)  
**Ambiente de Desenvolvimento:** Windows (com CI/GitHub Actions macOS para compilação do `.ipa`)

---

## 1. Intenção e Motivação ("Why")

### Contexto
O usuário necessita de um aplicativo pessoal para iPhone para realizar o **exame de consciência católico em preparação para o Sacramento da Confissão (Penitência / Reconciliação)**.

### O Problema
Atualmente, as pessoas recorrem a pesquisas na internet antes de confessar, encontrando fontes dispersas, muitas vezes de confiabilidade doutrinária duvidosa ou com formatação ruim para leitura no celular. Além disso, muitos usam o bloco de notas padrão do telefone para anotar faltas, o que é impessoal, desorganizado e traz riscos à privacidade.

### A Solução
Um aplicativo nativo para iOS, discreto, elegante e seguro, com doutrina tradicional e fiel ao Magistério da Igreja Católica. Ele guia a reflexão passo a passo, gera uma lista limpa e consolidada para ser lida diante do sacerdote no confessionário e descarta completamente as anotações após a absolvição, preservando apenas a data em que a confissão ocorreu.

---

## 2. Metas, Não-Metas e Anti-Metas

### Metas (Goals)
1. **Doutrina Segura e Estruturada:** Conteúdo integralmente fiel à doutrina católica clássica, dividido por:
   - Oração inicial ao Espírito Santo.
   - Os Dez Mandamentos da Lei de Deus.
   - Os Cinco Preceitos da Igreja.
   - Os Sete Pecados Capitais e virtudes opostas.
   - Deveres de estado (família, trabalho, oração).
   - Ato de Contrição tradicional.
2. **Fluxo de Exame & Lista de Confissão:**
   - Possibilidade de marcar itens do guia que necessitam de confissão com um toque.
   - Campo para breve nota contextual opcional vinculada à pergunta (ex: gravidade, frequência ou circunstância).
   - **Faltas e Anotações Avulsas:** Possibilidade de adicionar itens personalizados livres ("Adicionar falta ou anotação própria") para situações específicas que não estejam explicitamente nas perguntas prontas.
   - Tela "No Confessionário": visualização consolidada, direta e de fácil leitura (reunindo os itens marcados do guia e as anotações avulsas) para o momento diante do padre.
3. **Privacidade Absoluta e Opção B (Registro de Datas):**
   - Ao término da confissão, um botão de ação única ("Recebi a Absolvição") apaga permanentemente todos os pecados da memória do dispositivo.
   - O app atualiza e armazena **apenas** o carimbo de data da última confissão (ex: *"Última confissão: 14 de Outubro — há 10 dias"*), sem qualquer histórico de pecados pregressos.
4. **Identidade Visual "Liquid Glass" (Luz de Vela):**
   - Estética inspirada no design de vidro líquido e translúcido do ecossistema Apple.
   - Paleta escura ("Luz de Vela" / Âmbar e Bronze): fundo obsidiana profundo, superfícies de vidro translúcido (`.ultraThinMaterial` / `blur`), realces dourados suaves e bordas reflexivas.
   - Alta discrição para não ofuscar a visão ou chamar atenção em ambientes com pouca luz (bancos de igreja ou confessionário).
5. **100% Offline e Nativo:** Zero dependência de rede, servidores, cadastros ou APIs externas.

### Não-Metas (Non-Goals)
- Publicação na Apple App Store pública (projeto para uso exclusivamente pessoal do usuário no próprio iPhone).
- Sincronização em nuvem (iCloud/Firebase), contas de usuário, login ou telemetria.
- Recursos sociais, compartilhamento de orações ou exportação de anotações para PDF/e-mail.

### Anti-Metas (Anti-Goals)
- **Reter pecados passados:** Jamais guardar histórico de faltas após a absolvição sacramental.
- **Gamificação mundana:** Não usar rankings, medalhas, pontos ou notificações intrusivas, preservando a dignidade sacra.
- **Telas brilhantes ou barulhos altos:** Sem sons que possam tocar acidentalmente dentro da igreja; foco em retorno tátil sutil (haptics nativos).

---

## 3. Restrições Técnicas (Constraints)

1. **Linguagem & Framework:** Swift 6 e SwiftUI nativo direcionado ao iOS mais recente.
2. **Ambiente do Desenvolvedor:** O desenvolvedor trabalha no Windows. O repositório deve conter um workflow pronto de compilação em nuvem via GitHub Actions (`macos-latest` com Xcode) que gera o arquivo `.ipa` assinado para sideloading (via AltStore, Sideloadly ou certificado próprio).
3. **Persistência de Dados Mínima:**
   - Durante a sessão de exame: Estado mantido em memória (`@Observable` / State temporário na sessão).
   - Persistência permanente: Apenas a chave `lastConfessionDate: Date?` salva em `UserDefaults` (ou Keychain se desejado).
4. **Acessibilidade & Ergonomia:** Tipografia dinâmica (Dynamic Type), contraste elevado em modo noturno e zonas de toque confortáveis para uso com uma mão.

---

## 4. Decisões Tomadas com o Usuário

- **Plataforma:** iOS Nativo em SwiftUI (Opção 1 escolhida pelo usuário; sem PWA).
- **Tratamento de Dados Pós-Confissão:** Opção B selecionada — descarte total dos pecados após a confissão, mantendo unicamente a data da confissão para contagem de dias.
- **Estilo Visual:** Liquid Glass na atmosfera "Luz de Vela" (Opção C: superfícies translúcidas com refrações em tons de âmbar, bronze e fundo escuro profundo).
- **Anotações Personalizadas:** Suporte tanto para marcação das perguntas prontas do guia quanto para adição de faltas/anotações livres avulsas.
- **Distribuição:** Compilação pessoal para instalação direta no iPhone (repositório: `https://github.com/daniloofrs/exame-consciencia`).

---

## 5. Arquitetura e Especificação Funcional

### 5.1 Telas Principais

```
[Início / Dashboard]
  │── Data da Última Confissão (dias transcorridos)
  │── Oração Preparatória (Espírito Santo)
  └── Botão "Iniciar Exame de Consciência"
        │
        ▼
[Exame Passo a Passo]
  │── Mandamentos de Deus (1 ao 10)
  │── Preceitos da Igreja
  │── Pecados Capitais & Pecados de Omissão
  │── Deveres de Estado
  └── Botão "Revisar Lista para Confissão"
        │
        ▼
[No Confessionário (Resumo Consolidado)]
  │── Lista direta dos itens marcados com notas
  │── Guia rápido para o penitente ("Abençoai-me, padre, porque pequei...")
  │── Ato de Contrição (texto legível)
  └── Botão de Ação: "Recebi a Absolvição"
        │ (Limpa pecados instantaneamente da memória)
        │ (Grava data/hora atual como última confissão)
        ▼
[Retorno à tela inicial com mensagem de paz / data atualizada]
```

### 5.2 Estrutura de Componentes SwiftUI (Liquid Glass)

- `LiquidGlassCard`: Componente customizado com fundo translúcido, borda com gradiente linear que reflete a luz nas bordas superiores e sombra profunda suave.
- `AmberBadge`: Indicador de categoria e status em tom âmbar e bronze com brilho suave.
- `ExaminationRow`: Linha interativa com checkbox tátil e campo expansível para nota rápida.
- `HapticFeedback`: Vibrações táteis discretas ao selecionar faltas e ao concluir a confissão (`UIImpactFeedbackGenerator(.light)` e `.rigid`).

---

## 6. Decisões do Construtor (Builder's Calls)

1. **Rascunho Seguro em Fila de Espera (Ciclo de Vida):**
   - Para evitar que o iOS encerre o app por pressão de memória (`jetsam`) enquanto o penitente aguarda na fila da igreja, o exame ativo será salvo em um arquivo temporário protegido com criptografia de hardware (`FileProtectionType.completeFileProtection`).
   - Assim que o botão "Recebi a Absolvição" for pressionado, esse arquivo é destruído de forma irrecuperável.
2. **Proteção Ativa de Tela:**
   - O app oculta o conteúdo no alternador de aplicativos do iOS (`scenePhase` inativo/background) para que ninguém veja as anotações ao trocar de app.
   - Não há exigência de Face ID para manter a experiência imediata e offline (já descartado na escolha da Opção B).
3. **Ergonomia no Confessionário:**
   - Na tela de resumo diante do padre, o usuário poderá tocar em cada pecado confessado para atenuar a opacidade (riscar mentalmente), mantendo o foco no que ainda falta falar.
4. **Estrutura de Arquivos do Projeto Xcode:**
   - Organização modular (`App`, `Views`, `ViewModels`, `Models`, `Resources`, `DesignSystem`).
5. **Configuração de Build Automatizado:**
   - Workflow do GitHub Actions (`.github/workflows/build-ios.yml`) que compila no runner macOS e disponibiliza o artefato `.ipa` pronto para AltStore/Sideloadly.

