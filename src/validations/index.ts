export const validarEmail = (correo: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)

export const validarRun = (run: string) => {
  const runLimpio = run.replace(/[^0-9kK]/g, '').toUpperCase()
  if (!/^\d{7,8}[0-9K]$/.test(runLimpio)) return false

  const cuerpo = runLimpio.slice(0, -1)
  const verificador = runLimpio.slice(-1)
  let suma = 0
  let multiplicador = 2

  for (let i = cuerpo.length - 1; i >= 0; i -= 1) {
    suma += Number(cuerpo[i]) * multiplicador
    multiplicador = multiplicador === 7 ? 2 : multiplicador + 1
  }

  const resto = 11 - (suma % 11)
  const esperado = resto === 11 ? '0' : resto === 10 ? 'K' : String(resto)
  return verificador === esperado
}
