/**
 * Iiem tra moi truong phat triens
 * @returns 
 */
export function isDevMode() {
  return process.env.NODE_ENV === 'development';
}

export function isProdMode() {
  return process.env.NODE_ENV === 'production';
}