# Checklist de release — Férias Certa

Use isto toda vez que for publicar (feriados novos, bugfix, texto).

## 1. Dados

- [ ] Atualizar `feriados.json` (fonte canônica)
- [ ] Subir `versao` (ex.: `2026.08` → `2027.01`) e `revisado`
- [ ] Se a base embutida no `index.html` estiver muito atrás, sincronizar `NACIONAIS` / `UFS` / Cinzas
- [ ] Conferir Cinzas (`diaInteiro` e `retorno`) se o governo mudou decreto

## 2. App

- [ ] Subir `CACHE` em `sw.js` (ex.: `ferias-certa-2026.08d` → `ferias-certa-2027.01`)
- [ ] Rodar `node test-motor.mjs`
- [ ] Testar local: `python -m http.server 8765` → abrir SP / 15 dias / dividir 2 períodos

## 3. Publicar

- [ ] `git add -A && git commit` com mensagem clara (`fix:` / `feat:` / `chore:`)
- [ ] `git push origin main` → a Vercel faz o deploy de produção
- [ ] Abrir https://ferias-certa.vercel.app no celular
- [ ] Confirmar que o service worker atualizou (hard refresh ou reabrir o PWA)
- [ ] Testar "Pedido RH" e exportar `.ics`

## Lembrete

O intervalo de 12 meses é rolante (hoje → +1 ano). Não precisa “abrir 2027” no código.
O que precisa de humano é só mudança de lei / município no JSON.
