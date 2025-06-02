// Function to remove diacritics from a string
import slugify from 'slugify';

export class TextUtil {
  /**
   * @description Removes diacritics from a string
   * @param str The string to process
   * @returns The processed string without diacritics
   */
  public static removeDiacritics(str: string): string {
    if (!str || str.trim() === '') return '';
    return slugify(str, {
      locale: 'vi',
      replacement: ' ',
      lower: true,
    });
  }

  /**
   * @description Trims whitespace from both ends of a string
   * @param str The string to process
   * @returns The trimmed string
   */
  public static trim(str: string): string {
    if (!str) return '';
    return str.trim();
  }

  /**
   * @description Joins and trims an array of strings
   * @param strings The array of strings to process
   * @returns The joined and trimmed string
   */
  public static join(strings: string[]): string {
    if (!strings || strings.length === 0) return '';
    return strings
      .map((str) => str.trim())
      .filter(Boolean)
      .join(' ')
      .trim();
  }
}
