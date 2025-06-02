export const decodeURIUtil = (text: string) =>
  text
    ? decodeURI(text)
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
    : '';
