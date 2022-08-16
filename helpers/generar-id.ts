export const generarId = (): string => {
  const random = Math.random().toString(32).substring(2);
  const fecha = new Date().getTime().toString(32);
  return random + fecha;
}