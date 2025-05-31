/**
 * Utility functions for search functionality
 */

/**
 * Remove Vietnamese diacritics from a string for search purposes
 * @param str - The string to normalize
 * @returns The normalized string without diacritics
 */
export const removeDiacritics = (str: string): string => {
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase();
};

/**
 * Check if a search query matches a target string (with diacritic support)
 * @param query - The search query
 * @param target - The target string to search in
 * @returns True if the query matches the target
 */
export const matchesSearch = (query: string, target: string): boolean => {
  const normalizedQuery = removeDiacritics(query.trim());
  const normalizedTarget = removeDiacritics(target);
  return normalizedTarget.includes(normalizedQuery);
};

/**
 * Highlight matching text in a string
 * @param text - The text to highlight
 * @param query - The search query
 * @returns The text with highlighted matches
 */
export const highlightMatch = (text: string, query: string): string => {
  if (!query.trim()) return text;

  const normalizedQuery = removeDiacritics(query.trim());
  const normalizedText = removeDiacritics(text);

  const index = normalizedText.indexOf(normalizedQuery);
  if (index === -1) return text;

  // Find the actual position in the original text
  let actualIndex = 0;
  let normalizedIndex = 0;

  while (normalizedIndex < index && actualIndex < text.length) {
    if (removeDiacritics(text[actualIndex]) === normalizedText[normalizedIndex]) {
      normalizedIndex++;
    }
    actualIndex++;
  }

  const beforeMatch = text.substring(0, actualIndex);
  const match = text.substring(actualIndex, actualIndex + query.length);
  const afterMatch = text.substring(actualIndex + query.length);

  return `${beforeMatch}<mark class="bg-yellow-200 dark:bg-yellow-800">${match}</mark>${afterMatch}`;
};

/**
 * Common Vietnamese search terms and their variations
 */
export const SEARCH_ALIASES: Record<string, string[]> = {
  'bai': ['bãi', 'bai'],
  'bien': ['biển', 'bien'],
  'dao': ['đảo', 'dao'],
  'nui': ['núi', 'nui'],
  'ho': ['hồ', 'ho'],
  'chua': ['chùa', 'chua'],
  'den': ['đền', 'den'],
  'dinh': ['đình', 'dinh'],
  'lang': ['làng', 'lang'],
  'pho': ['phố', 'pho'],
  'duong': ['đường', 'duong'],
  'cau': ['cầu', 'cau'],
  'vuon': ['vườn', 'vuon'],
  'rung': ['rừng', 'rung'],
  'suoi': ['suối', 'suoi'],
  'thac': ['thác', 'thac'],
  'dong': ['động', 'dong'],
  'hang': ['hang', 'hàng'],
  'bao': ['bảo', 'bao'],
  'tang': ['tàng', 'tang'],
  'vien': ['viện', 'viên', 'vien'],
  'truong': ['trường', 'truong'],
  'cong': ['công', 'cong'],
  'khu': ['khu', 'khu'],
  'kv': ['khu vực', 'khu vuc'],
  'tp': ['thành phố', 'thanh pho'],
  'tt': ['thị trấn', 'thi tran'],
  'tx': ['thị xã', 'thi xa'],
  'q': ['quận', 'quan'],
  'h': ['huyện', 'huyen'],
  'p': ['phường', 'phuong'],
  'x': ['xã', 'xa']
};

/**
 * Expand search query with common aliases
 * @param query - The original search query
 * @returns Array of possible search variations
 */
export const expandSearchQuery = (query: string): string[] => {
  const normalizedQuery = removeDiacritics(query.trim());
  const variations = [query, normalizedQuery];

  // Add aliases
  Object.entries(SEARCH_ALIASES).forEach(([key, aliases]) => {
    if (normalizedQuery.includes(key)) {
      aliases.forEach(alias => {
        variations.push(query.replace(key, alias));
        variations.push(normalizedQuery.replace(key, alias));
      });
    }
  });

  return [...new Set(variations)]; // Remove duplicates
};
