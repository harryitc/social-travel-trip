const getItem = <T>(key: string): T | any => {
  const item = localStorage.getItem(key);
  if (item) return JSON.parse(item);
  else return undefined;
};

const setItem = <T>(key: string, value: T | any): void =>
  localStorage.setItem(key, JSON.stringify(value ?? ''));

const removeItems = (keys: string[]): void => keys.forEach((key) => localStorage.removeItem(key));

const clear = (): void => localStorage.clear();

const CoreLocalStorageService = { getItem, setItem, removeItems, clear };

export default CoreLocalStorageService;
