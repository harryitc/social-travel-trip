const getItem = <T>(key: string): T | any => {
  const item = sessionStorage.getItem(key);
  if (item) return JSON.parse(item);
  else return undefined;
};

const setItem = <T>(key: string, value: T | any): void =>
  sessionStorage.setItem(key, JSON.stringify(value ?? ""));

const removeItems = (keys: string[]): void =>
  keys.forEach((key) => sessionStorage.removeItem(key));

const clear = (): void => sessionStorage.clear();

const CoreSessionStorageService = { getItem, setItem, removeItems, clear };

export default CoreSessionStorageService;
