// Genera un JWT de prueba (firma falsa) con la expiración indicada en segundos desde ahora
export function crearToken(segundosDeVida, rol = "CLIENTE", rut = "20456789-1") {
  const base64Url = (obj) =>
    btoa(JSON.stringify(obj)).replace(/=/g, "").replace(/\+/g, "-").replace(/\//g, "_");
  const exp = Math.floor(Date.now() / 1000) + segundosDeVida;
  return `${base64Url({ alg: "HS256" })}.${base64Url({ sub: rut, rol, exp })}.firma`;
}
