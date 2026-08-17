# Site — Davi Oliveira | Gestor de Tráfego

Site institucional de página única, em HTML/CSS/JS puro. Sem build, sem dependências, sem `npm install`.

---

## Antes de publicar — 3 coisas obrigatórias

### 1. Trocar o domínio

Procure por `SEU-DOMINIO.com.br` e troque pelo endereço real em **3 arquivos**:

| Arquivo | Onde |
|---|---|
| `index.html` | `canonical`, `og:url`, `og:image` e o `image` do bloco JSON-LD |
| `robots.txt` | linha `Sitemap:` |
| `sitemap.xml` | tag `<loc>` |

Enquanto isso não for feito, **a miniatura do link não aparece** quando você mandar o site no WhatsApp ou colocar na bio do Instagram.

### 2. Colocar sua foto

Salve sua foto como `assets/img/davi.jpg` (recomendado: retrato, ~1040×1240px, até 300KB).
Sem o arquivo, o site mostra um monograma "DO" no lugar — funciona, mas a foto converte mais.

### 3. Publicar os depoimentos

A seção de depoimentos está **comentada** dentro do `index.html` (procure por `DEPOIMENTOS`).
Assim que tiver 3 depoimentos reais (print de WhatsApp, áudio transcrito ou avaliação do Google), substitua o texto de exemplo e remova os `<!--` e `-->` que envolvem o bloco.

> Não publique com o texto de exemplo no ar.

---

## Como publicar na Vercel

**Opção A — arrastar a pasta (mais rápido)**

1. Acesse [vercel.com/new](https://vercel.com/new)
2. Arraste esta pasta inteira para a área de upload
3. Pronto. O `vercel.json` já configura cache e cabeçalhos de segurança

**Opção B — pelo GitHub**

1. Suba a pasta para um repositório
2. Em vercel.com/new, importe o repositório
3. Framework Preset: **Other**. Build Command: deixe **vazio**. Output Directory: deixe **vazio**

O arquivo `server.js` é só para pré-visualizar no seu computador — pode apagar antes de publicar, ou deixar (a Vercel ignora).

---

## Como rodar no seu computador

```bash
node server.js
```

Depois abra `http://localhost:4321`.

---

## Onde mexer em cada coisa

| O que você quer mudar | Arquivo | Onde |
|---|---|---|
| Número do WhatsApp | `assets/js/main.js` | bloco `CONFIG`, no topo |
| Mensagem padrão do WhatsApp | `assets/js/main.js` | `CONFIG.msgPadrao` |
| Textos, títulos, FAQ, portfólio | `index.html` | seções comentadas |
| Cores, tamanhos, espaçamentos | `assets/css/style.css` | bloco `:root` (tokens), no topo |

### Trocar as cores

Tudo sai do bloco `:root` no começo do `style.css`:

```css
--navy: #0B2545;   /* azul principal: títulos, botões, rodapé */
--gold: #C8873F;   /* dourado: destaques, números, ícones */
--bg:   #F6F7F9;   /* fundo geral */
```

Mudou ali, mudou no site inteiro.

---

## Como o formulário funciona

Não existe backend. Ao enviar, o site:

1. Valida os campos obrigatórios e o formato do telefone
2. Monta uma mensagem formatada com todos os dados
3. Abre o WhatsApp já preenchido — o lead só toca em enviar
4. **Anexa a origem do visitante** (utm_source, utm_medium, fbclid, gclid) no fim da mensagem

Ou seja: quando o lead chegar, você já sabe se veio do Instagram, do Google Ads ou do Meta Ads. Exemplo do que chega:

```
Olá Davi! Quero minha análise gratuita.

*Nome:* Maria Souza
*WhatsApp:* (82) 99678-8351
*Empresa:* Clínica Sorriso
*Segmento:* Odontologia
*Faturamento mensal:* De R$ 10.001 a R$ 30.000
*Verba para anúncios:* De R$ 1.001 a R$ 3.000

*Principal dificuldade:* Já rodei anúncio e não veio nada.

_Origem: ig / social / link_in_bio / meta-ads_
```

Há também um campo-armadilha invisível contra robôs de spam.

### Se quiser guardar os leads em algum lugar

Hoje o lead só vai para o WhatsApp — se você não responder, ele se perde. Para gravar também numa planilha, dá para adicionar um `fetch` para o Formspree, Google Sheets ou n8n dentro do `form.addEventListener('submit', ...)` em `main.js`, logo antes do `window.open`.

---

## Rastreamento de conversão (fazer depois de publicar)

O site ainda **não tem pixel nem tag instalada**. Para medir conversão nos seus próprios anúncios:

1. **Meta Pixel** — cole o script antes de `</head>` no `index.html`
2. **Google Tag (gtag.js)** — mesma coisa
3. **Evento de conversão** — em `main.js`, dentro do `submit`, logo antes do `window.open`:

```js
if (window.fbq)  fbq('track', 'Lead');
if (window.gtag) gtag('event', 'generate_lead');
```

---

## Estrutura

```
.
├── index.html          página completa
├── assets/
│   ├── css/style.css   estilos (tokens no topo)
│   ├── js/main.js      interações + formulário (CONFIG no topo)
│   └── img/
│       ├── og-cover.jpg   miniatura do link (pronta)
│       └── davi.jpg       SUA FOTO — falta adicionar
├── vercel.json         cache e segurança
├── robots.txt          troque o domínio
├── sitemap.xml         troque o domínio
└── server.js           só para testar local
```

---

## O que já está pronto

- Responsivo de 320px até desktop, sem rolagem horizontal
- Animações de entrada, contadores e menu mobile
- FAQ em accordion (abre um por vez)
- Botão flutuante de WhatsApp, que some quando o formulário aparece
- Dados estruturados JSON-LD de `ProfessionalService` (ajuda na busca local em Arapiraca)
- Respeita `prefers-reduced-motion` e tem estilo de impressão
- Sem bibliotecas externas além das fontes do Google
