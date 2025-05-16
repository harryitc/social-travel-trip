import { Http } from '@/lib/custom-http';
import { attachToken } from '@/features/auth/auth.service';
import { catchError, map, throwError } from 'rxjs';

export const getHello = (_params: any, token: string | null) => {
  console.log('fetching API...');
  const url = 'http://localhost:3000/api/';

  const params = attachToken(_params, token);

  const response = Http.get(url, params).pipe(
    map((res) => res),
    catchError((err) => throwError(() => err)),
  );
  return response;
};
