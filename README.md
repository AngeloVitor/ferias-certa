# Férias Certa

Otimizador de datas de férias no Brasil. Você diz quantos dias corridos tem e ele
varre os próximos 12 meses cruzando feriados nacionais, estaduais e municipais com
fins de semana, aplicando as regras da CLT.

**Ao vivo:** https://ferias-certa.vercel.app  
**Código:** https://github.com/AngeloVitor/ferias-certa

Cada `git push` em `main` publica automaticamente. Ver `RELEASE.md` para o checklist
de atualização de feriados.

## Arquivos

| arquivo | o que é |
|---|---|
| `index.html` | O app inteiro. HTML, CSS e JS num arquivo só, sem nenhuma dependência externa. |
| `feriados.json` | A base de feriados isolada, para web, Android e iOS consumirem a mesma fonte. |
| `manifest.json` | Manifesto PWA — nome, ícones, atalhos, cor de tema. |
| `sw.js` | Service worker. Rede primeiro, cache como reserva. |
| `icon-*.png` | Ícones 180 (iOS), 192, 512 e 512 maskable (Android). |

## Publicar

Basta servir a pasta por HTTPS. Qualquer hospedagem estática serve — Netlify,
Vercel, Cloudflare Pages, GitHub Pages, um bucket S3.

O service worker exige HTTPS (ou `localhost`). Abrindo `index.html` direto do
disco, o app funciona normalmente, só não instala nem fica offline.

Para testar local:

```
python3 -m http.server 8000   # abra http://localhost:8000
```

## Regras implementadas

| regra | artigo | comportamento |
|---|---|---|
| Dias corridos | art. 130 | Fins de semana e feriados dentro do período saem do saldo. |
| Início das férias | art. 134 §3 | Proibido iniciar nos 2 dias que antecedem feriado ou repouso. Sobram segunda, terça e quarta. |
| Aviso prévio | art. 135 | Comunicação por escrito com 30 dias. Datas mais próximas ficam fora por padrão. |
| Período concessivo | art. 137 | 12 meses após o fim do aquisitivo para **começar**. Depois disso, dobra. |

O critério do art. 137 é a data de **início**: começar dentro do prazo e terminar
depois continua válido.

## Feriados móveis

Páscoa pelo algoritmo de Meeus/Jones/Butcher. Os demais são deslocamentos em dias
a partir do domingo de Páscoa:

```
carnaval (segunda)   -48
carnaval (terça)     -47
quarta de cinzas     -46
sexta-feira santa     -2
páscoa                 0
corpus christi       +60
```

## Quarta-feira de Cinzas

É o dado que os concorrentes erram. Ponto facultativo **o dia inteiro** em 14
estados (AC, AL, AP, AM, BA, ES, MA, MG, PE, PI, RJ, RO, RR, SE). Nos demais o
expediente volta às 12h, 13h ou 14h conforme o decreto estadual — ver
`cinzas.retorno` no `feriados.json`.

## Formato do feriados.json

```jsonc
{
  "versao": "2026.08",          // usado para detectar cliente desatualizado
  "revisado": "agosto de 2026",
  "nacionais": [ { "data": "09-07", "nome": "Independência do Brasil" } ],
  "estados": {
    "SP": {
      "nome": "São Paulo",
      "feriados": [ { "data": "07-09", "nome": "Revolução Constitucionalista" } ],
      "cidades": {
        "São Paulo": [ { "data": "01-25", "nome": "Aniversário de São Paulo" } ]
      }
    }
  },
  "moveis":  { "offsets": { "corpus-christi": 60 } },
  "cinzas":  { "diaInteiro": ["PE"], "retorno": { "SP": "12h" } },
  "meioExpediente": [ { "data": "12-24", "nome": "Véspera de Natal" } ]
}
```

`data` é sempre `MM-DD`, sem ano, porque são datas fixas. Os móveis se calculam.

## Manutenção

A base precisa de **revisão anual**. Feriado municipal muda por decreto e
convenção coletiva muda por categoria. Ao atualizar:

1. Edite **só** o `feriados.json` (o site busca esse arquivo em HTTP; a cópia
   embutida no `index.html` é fallback para `file://` e offline frio)
2. Suba `versao` e `revisado` no JSON
3. Se a embutida estiver muito atrás, sincronize o bloco `NACIONAIS`/`UFS` no HTML
4. Suba `CACHE` no `sw.js` para forçar atualização nos aparelhos
5. Rode `node test-motor.mjs`

### Pendências conhecidas

- Os feriados municipais vieram de fontes públicas agregadas, **não** de consulta
  município a município na legislação local. Antes de tratar isso como definitivo,
  vale auditar com fonte oficial.
- As "festas locais" (Círio, Bonfim, São João de Campina Grande e Caruaru) não são
  feriado pleno na lei em todos os casos. Estão atrás de uma chave desligada por
  padrão, com aviso. Ou viram dado auditado, ou saem.
- Escala 6x1 com folga móvel não é suportada — só jornadas com folga fixa.

## Licença dos dados

`feriados.json` sob CC BY 4.0.

## Deploy na Vercel

O projeto é estático puro: **sem build, sem framework, sem dependência**. A Vercel
serve a pasta como está.

### Caminho com GitHub (recomendado)

1. Repo no GitHub conectado ao projeto Vercel `ferias-certa`
2. Framework Preset: **Other** · Build / Output vazios (já está assim)
3. `git push origin main` → deploy de produção
4. Branches → URL de preview automática

Checklist completo: `RELEASE.md`.

### Caminho rápido (CLI, sem Git)

```bash
vercel --prod
```

### Sobre o `vercel.json`

Ele existe por causa de uma armadilha de PWA: se o CDN cachear o `sw.js`, o
service worker antigo continua servindo a versão velha do app e o usuário fica
preso nela. Por isso `sw.js` e `index.html` vão com `must-revalidate`, e só os
ícones ficam com cache longo.

O `feriados.json` vai com `Access-Control-Allow-Origin: *` para que o app do
Expo possa consumi-lo direto no futuro.

### Ao publicar uma versão nova

Suba `CACHE` no `sw.js` (ex.: `ferias-certa-2026.09`). Sem isso, quem já instalou
continua vendo a versão antiga.

### Domínio próprio

Em **Settings → Domains**, adicione `feriascerta.com.br` e aponte o DNS do
registrador para a Vercel. HTTPS é automático — e é ele que faz o PWA instalar.
