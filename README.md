# Site Seminário SDC Teologia – Bahia

HTML + CSS + JavaScript puro. Sem build.

## Cores (HEX)
| Variável | HEX | Uso |
|---|---|---|
| --c-primary | #307bbf | Azul da logo (amostrado dos pixels da imagem): botões, links, ícones |
| --c-primary-dark | #12335a | Títulos, hero, CTA, rodapé (sugerido) |
| --c-accent | #e0a526 | Botões de destaque (sugerido) |
| --c-bg-alt | #eef4fa | Fundos alternados |
| --c-text | #2b3440 | Texto |

Observação: não foi possível inspecionar o CSS do site de referência; apenas o texto e a estrutura. As cores, exceto o azul da logo, são sugestões a validar.

## Executar localmente
Abra `index.html` no navegador ou rode `python3 -m http.server 8000` na pasta e acesse http://localhost:8000.

## Logo e imagens
- Logo com fundo transparente: `assets/images/logo-sdc-bahia.png` (azul) e `logo-sdc-bahia-branca.png` (rodapé). Substitua mantendo os nomes.
- Foto do hero: em `css/style.css`, defina `--hero-image: url("../assets/images/hero.jpg");` (use foto oficial).

## Mapa
Em `js/script.js` (`CONFIG`): preencha `endereco` e `mapaEmbedUrl` (Google Maps > Compartilhar > Incorporar um mapa > copie o valor do `src`).

## Envio de e-mails (EmailJS)
1. Crie conta em emailjs.com e conecte o Gmail sdcteologia@gmail.com em *Email Services* (anote o Service ID).
2. Em *Email Templates*, crie um template com as variáveis `{{from_name}}`, `{{reply_to}}`, `{{subject}}` e `{{message}}`; em "To email" use `{{to_email}}` ou o próprio endereço. Anote o Template ID.
3. Em *Account*, copie a Public Key.
4. Preencha `CONFIG.emailjs` em `js/script.js`. A Public Key é feita para ficar no navegador; nunca coloque senhas ou a Private Key.
5. Em EmailJS, restrinja os domínios permitidos ao seu site e ative o reCAPTCHA se desejar proteção extra.
O site só mostra "sucesso" após a resposta 200 do EmailJS. Proteções: campo oculto (honeypot), tempo mínimo e intervalo de 1 minuto entre envios.

## Publicar
Envie a pasta inteira para Netlify (arrastar e soltar), GitHub Pages, Vercel ou Cloudflare Pages. Depois aponte o domínio, se houver.

## Checklist de testes
- Menu mobile abre/fecha (botão, link, Esc).
- Carrossel: setas, bolinhas, teclado (← →), deslizar no celular.
- Sem rolagem horizontal em 360px, 768px e 1440px.
- Formulário: erros por campo, e-mail inválido, envio real recebido no Gmail, mensagem de falha com a internet desligada.
- Mapa e botão "Abrir no app de mapas" após configurar o endereço.
- Tab mostra foco visível; console sem erros.
