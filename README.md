# 🕯️ Exame de Consciência

[![Demo Online](https://img.shields.io/badge/Demo-GitHub%20Pages-gold?style=flat&logo=github)](https://daniloofrs.github.io/exame-consciencia/)
[![Testes](https://img.shields.io/badge/Testes-22%20passing-brightgreen?style=flat)](tests/web/)
[![PWA](https://img.shields.io/badge/PWA-100%25%20Offline-blue?style=flat)](docs/)
[![Licença](https://img.shields.io/badge/Licen%C3%A7a-MIT-green?style=flat)](LICENSE)

Aplicativo criado pra ajudar você na preparação prática do seu exame de consciência antes do sacramento da confissão.

Em vez de você carregar anotações soltas no bloco de notas ou caçar perguntas em sites na porta da igreja, você tem aqui um roteiro seguro, discreto e com privacidade absoluta na sua mão. Ele funciona direto no seu navegador do celular, pode ser instalado como app (PWA) e roda 100% offline.

---

## Como Funciona a Privacidade

A regra número um pra nós é proteger a sua privacidade no confessionário:

- **100% Offline:** todo o aplicativo roda no seu próprio aparelho através de Service Worker. Nada seu vai pra servidores externos. Você não precisa de cadastro, nem temos banco de dados ou telemetria.
- **Destruição total pós-absolvição:** quando você toca no botão pra confirmar a sua absolvição, todas as faltas que você marcou e as suas anotações pessoais somem imediatamente da memória do seu celular.
- **Apenas a data fica com você:** o app registra somente o dia da sua última confissão (ex: *"Última confissão: há 14 dias"*), ajudando você a acompanhar o tempo entre os sacramentos.
- **Proteção no alternador de apps:** se você mudar de aplicativo ou receber uma ligação, a tela se oculta pra ninguém ao seu redor ler suas notas.

---

## Como Usar no seu Dia a Dia

### 1. No Navegador do Celular (Acesso Imediato)
Abra o link oficial no seu Safari ou Chrome:
👉 **[daniloofrs.github.io/exame-consciencia](https://daniloofrs.github.io/exame-consciencia/)**

- **No seu iPhone (Safari):** toque no botão de compartilhar e escolha **"Adicionar à Tela de Início"**.
- **No seu Android (Chrome):** toque no menu de três pontos e escolha **"Instalar aplicativo"**.

Depois de instalado, você pode abrir e usar mesmo se estiver em modo avião ou num confessionário sem sinal de rede.

### 2. No seu Computador (Desenvolvimento e Testes)
Se você quiser rodar localmente e testar o código:
```bash
git clone https://github.com/daniloofrs/exame-consciencia.git
cd exame-consciencia
node --test tests/web/*.test.js
```

Pra iniciar a versão em React Native no seu Expo Go:
```bash
npm install
npm start
```

---

## Principais Funcionalidades

- **Roteiro Litúrgico Completo:** exame dividido em 13 categorias com os Dez Mandamentos, os Cinco Preceitos da Igreja, os Pecados Capitais e os seus Deveres de Estado.
- **Navegação Fluida por Gestos:** arraste pro lado (swipe horizontal) na sua tela pra trocar de mandamento, acompanhando a barra de progresso visual do seu exame.
- **Modo Confessionário com Tela Ativa:** ao entrar na tela da confissão com o padre, o app usa a API de Screen Wake Lock pra manter a sua tela acesa sem apagar enquanto você fala. Conforme você for confessando cada item, basta tocar nele pra atenuar a linha.
- **Faltas Livres Personalizadas:** campo rápido pra você acrescentar anotações avulsas que não estejam na lista padrão.
- **Ato de Contrição Ajustável:** alterne com um toque entre a fórmula breve e a fórmula tradicional pra você rezar com calma.
- **Visual Breviário (Modo Penumbra):** fundo preto OLED e acentos em âmbar, feitos pra você ler no interior escuro da igreja sem cansar a sua vista e sem chamar atenção.
- **Modo Papel (Impressão Discreta):** opção de imprimir ou salvar em PDF uma versão minimalista em folha sulfite de bolso, sem fundos escuros ou botões.
- **Guia do Penitente e Orações:** inclui as cinco condições pra uma boa confissão, a oração preparatória de São Tomás de Aquino e o Salmo 50 (Miserere).
- **Busca Rápida e Tamanho de Fonte:** encontre suas faltas digitando termos de busca e ajuste o tamanho das letras (A- / A+) pro seu conforto visual.

---

## Atalhos de Teclado (Desktop e iPad)

Se você estiver no computador ou usando teclado físico no seu iPad:

| Tecla | Ação |
| :--- | :--- |
| <kbd>→</kbd> | Avançar pra próxima categoria |
| <kbd>←</kbd> | Voltar pra categoria anterior |
| <kbd>/</kbd> | Focar imediatamente no seu campo de busca |
| <kbd>Esc</kbd> | Fechar painéis flutuantes e orações |

---

## Estrutura do Projeto

```text
├── docs/             # PWA em produção publicado no GitHub Pages (index.html, sw.js, manifest)
├── src/              # Implementação React Native / Expo e catálogo litúrgico JSON
├── ExameConsciencia/ # Implementação nativa para iOS em Swift 6 e SwiftUI
├── scripts/          # Compilador web do PWA (build-web.js) e scripts de validação
├── tests/web/        # Suíte de 22 testes automatizados (node:test)
└── .github/          # Workflows do GitHub Actions para compilação do .ipa nativo
```

---

## Testes Automatizados

A estabilidade da versão web conta com testes de regressão no test runner nativo do Node.js:

```bash
node --test tests/web/*.test.js
```

Pra você recompilar a versão de produção do PWA após alterações no catálogo:

```bash
node scripts/build-web.js
```

---

<details>
<summary><strong>Compilação Nativa para iOS (Swift 6 & SwiftUI)</strong></summary>

<br>

Além da versão web progressiva, o repositório traz uma versão nativa em Swift 6 e SwiftUI dentro da pasta `ExameConsciencia/`.

- **Criptografia por hardware:** persistência temporária de rascunho com `FileProtectionType.complete`.
- **Compilação na nuvem:** o workflow do GitHub Actions em `.github/workflows/build-ios.yml` gera o projeto via XcodeGen, roda os testes unitários e produz o pacote `.ipa` pra instalação pessoal via AltStore, Sideloadly ou Xcode.

</details>

---

## Licença

Distribuído sob a licença MIT. Consulte o arquivo `LICENSE` para mais detalhes.
