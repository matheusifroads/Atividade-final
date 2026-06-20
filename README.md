# Atividade Final

Esse projeto é uma página simples que eu montei para mostrar um pouco do que eu já consigo fazer com HTML, CSS e JavaScript.

## Páginas do projeto

- `Index.html`
  - É a página principal.
  - Tem um menu que aparece por cima da tela e um botão fixo para abrir esse menu.
  - Também tem uma área com informações sobre mim, organizada em caixas.
- `html/Atividade.html`
  - É o jogo educativo.
  - A ideia é arrastar números para as operações certas e ver o tempo, acertos e erros.
  - Quando termina, mostra uma medalha dependendo do tempo.
- `html/contato.html`
  - É a página de contato.
  - Tem formulário com nome, email, data, número, motivo, assunto e mensagem.
  - Tem `select`, `radio` e `checkbox` para mostrar que eu sei usar esses componentes.

## O que o JavaScript faz

- `js/comportamento.js`
  - Esse arquivo cuida de duas coisas: o círculo colorido que muda de cor quando a tela muda de tamanho e o menu retrátil.
  - Ele detecta se a tela está em desktop, tablet ou celular e adiciona as classes certas.
  - Também abre e fecha o menu e mostra o fundo escuro enquanto ele está aberto.
- `js/Contato.js`
  - Aqui eu tratei o envio do formulário.
  - Ele pega os valores do formulário, valida se os campos obrigatórios estão preenchidos e mostra uma mensagem de aviso.
  - Salva os dados no `localStorage` para ficar visível na mesma página e permite limpar o formulário.
- `js/jogo.js`
  - Esse é o código do jogo de arrastar e soltar.
  - Ele gera um conjunto de operações e uma lista de respostas embaralhadas.
  - Controla o cronômetro, conta acertos e erros e mostra a medalha quando o jogo termina.

## Observações

- O CSS principal está em `CSS/site.css`.
- As páginas usam a biblioteca Pico CSS como base, mas também tem estilos extras para o jogo e para o layout do site.
- Eu tentei escrever o código de forma bem simples para tentar manter organizado e fácil de entender
