# Liquid Glass Futurista com Caústicas & Neon Sacro

## Problem Statement
Como podemos transformar o visual do Exame de Consciência em uma experiência de Vidro Líquido hiper-moderna (estilo iOS / VisionOS levado ao limite), integrando reflexos fluidos dinâmicos (*shimmer*) e caústicas de neon sacro âmbar sobre um fundo obsidian puro?

## Recommended Direction
A direção escolhida une a precisão cirúrgica do design de vidro translúcido contemporâneo (*Liquid Glass / VisionOS*) com a espiritualidade solene da tradição católica (*Luz de Vela*):

1. **Vidro Físico Espesso & Refração Volumétrica:**
   Cartões projetados como placas físicas de vidro lapidado. A borda superior recebe luz especular pura (`rgba(255, 255, 255, 0.90)`), as laterais refratam o ambiente com sutileza, e a base projeta uma caústica dourada (`rgba(245, 158, 11, 0.45)`). Uma sombra de oclusão profunda preta no solo (`shadowOpacity: 0.6`) combinada a um halo incandescente de neon sacro âmbar (`#F59E0B`) cria sensação tridimensional palpável.

2. **Shimmer Especular Fluido (Reflexo Dinâmico):**
   Um feixe de luz translúcido e orgânico desliza continuamente em loop suave sobre o bisel curvo do vidro em cartões selecionados e botões de destaque, transmitindo a ilusão de um material óptico vivo reagindo à vela.

3. **Cápsulas e Botões em Neon Sacro:**
   Pílulas dos Mandamentos e botões primários transformados em cápsulas de vidro com núcleo incandescente, projetando halos quentes de caústica sobre o fundo escuro da igreja.

## Key Assumptions to Validate
- [x] **Legibilidade absoluta:** O contraste tipográfico das perguntas e orações permanece cristalino em fundos OLED escuros.
- [x] **Performance a 60/120 FPS:** O shimmer dinâmico utiliza `Animated.loop` com `useNativeDriver: true`, sem sobrecarregar a CPU nem consumir bateria no iPhone.
- [x] **Equilíbrio sacral:** O efeito de neon sacro é mantido estritamente na temperatura de cor do fogo e da cera de abelha (âmbar `#F59E0B` e bronze `#D97706`), evitando estéticas cibernéticas frias.

## MVP Scope
- **`LiquidGlassCard.js`**: Bisel refratado multicamada, caústicas de fundo projetadas e shimmer de luz especular animado.
- **`AmberPill.js`**: Cápsulas de vidro translúcido com halo de neon sacro e microbisel superior.
- **Botões de Ação**: Moldura de vidro líquido fundido com halo luminoso expandido e feixe de brilho.
- **`CandlelightBackground.js`**: Profundidade luminosa em camadas para interação óptica com as placas de vidro.

## Not Doing (and Why)
- **Cores neon elétricas (azul/magenta/ciano):** Quebrariam o recolhimento e a reverência do Sacramento da Confissão.
- **Animações bruscas ou de alta velocidade:** O shimmer e a pulsação de luz ocorrem em ciclos lentos e suaves (4 a 6 segundos), respeitando a paz da oração.

## Open Questions
- Nenhum bloqueio no momento: arquitetura compatível com Expo SDK 58 e validada em hardware real iOS.
