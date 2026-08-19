/* Testes rápidos do motor (sem framework). Rode: node test-motor.mjs */
const assert = (cond, msg) => {
  if (!cond) throw new Error(msg)
  console.log('ok:', msg)
}

const pascoa = y => {
  const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4
  const f = Math.floor((b + 8) / 25), g = Math.floor((b - f + 1) / 3)
  const h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4
  const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451)
  const mo = Math.floor((h + l - 7 * m + 114) / 31), da = ((h + l - 7 * m + 114) % 31) + 1
  return new Date(y, mo - 1, da)
}

const key = d =>
  d.getFullYear() + '-' + String(d.getMonth() + 1).padStart(2, '0') + '-' + String(d.getDate()).padStart(2, '0')

const dividir = (total, n) => {
  const base = Math.floor(total / n), resto = total % n
  return Array.from({ length: n }, (_, k) => base + (k < resto ? 1 : 0))
}

const checarCLT = partes => {
  if (partes.length < 2) return null
  if (Math.max(...partes) < 14) return 'exige um período de no mínimo 14 dias'
  if (Math.min(...partes) < 5) return 'exige no mínimo 5 dias em cada período'
  return null
}

assert(key(pascoa(2026)) === '2026-04-05', 'Páscoa 2026 = 5 abr')
assert(key(pascoa(2027)) === '2027-03-28', 'Páscoa 2027 = 28 mar')
assert(JSON.stringify(dividir(30, 3)) === JSON.stringify([10, 10, 10]), '30/3 = 10+10+10')
assert(JSON.stringify(dividir(20, 3)) === JSON.stringify([7, 7, 6]), '20/3 = 7+7+6')
assert(checarCLT([14, 10, 6]) === null, '14+10+6 ok no art. 134 §1')
assert(checarCLT([10, 10, 10]) !== null, '10+10+10 falha (sem período ≥14)')
assert(checarCLT([20, 4]) !== null, '20+4 falha (mínimo 5)')

const fs = await import('node:fs')
const json = JSON.parse(fs.readFileSync(new URL('./feriados.json', import.meta.url), 'utf8'))
assert(json.versao === '2026.08', 'feriados.json versão 2026.08')
assert(json.nacionais.length === 9, '9 feriados nacionais')
assert(json.estados.SP.cidades['São Paulo'][0].data === '01-25', 'SP capital 25/01')
assert(json.cinzas.diaInteiro.includes('PE'), 'PE: Cinzas dia inteiro')
assert(json.cinzas.retorno.SP === '12h', 'SP: Cinzas volta 12h')

console.log('\nTodos os testes passaram.')
