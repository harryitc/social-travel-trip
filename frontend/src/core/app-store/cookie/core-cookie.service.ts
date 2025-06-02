import { environment } from '@/config/environment';

const cookie_expire = environment.aplication.storage.cookies.expireInSeconds;
const getCookie = (name: string): string | undefined => {
  if (typeof window === 'undefined') return undefined;
  const cookieValue = document.cookie.match(`(^|;)\\s*${name}\\s*=\\s*([^;]+)`);
  return cookieValue ? decodeURIComponent(cookieValue.pop() ?? '') : undefined;
};

const setCookie = (name: string, value: string, expireInSeconds?: number): void => {
  const d = new Date();
  if (expireInSeconds) {
    d.setSeconds(d.getSeconds() + expireInSeconds);
  } else {
    d.setSeconds(d.getSeconds() + cookie_expire);
  }

  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${d.toUTCString()}; path=/`;
};

const deleteCookies = (names: string[]): void => names.forEach((name) => setCookie(name, '', -1));

const CoreCookieService = {
  getCookie,
  setCookie,
  deleteCookies,
};

export default CoreCookieService;
