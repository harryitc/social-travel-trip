/**
 * Removes Vietnamese accents from a string
 * @param str The string to remove accents from
 * @returns The string without accents
 */
export function removeVietnameseAccents(str: string): string {
  if (!str) return '';
  
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[đĐ]/g, d => d === 'đ' ? 'd' : 'D');
}
