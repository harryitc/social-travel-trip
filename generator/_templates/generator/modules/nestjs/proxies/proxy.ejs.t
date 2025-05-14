---
to: <%= nestjsOutputPath %>/m_<%= h.changeCase.kebabCase(moduleName)%>/proxies/<%= h.changeCase.kebabCase(moduleName)%>.proxy.ts
---
<% if (generateAxios == 'yes') { %>
import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, throwError } from 'rxjs';

@Injectable()
export class <%= h.changeCase.pascalCase(moduleName)%>Proxy {
  constructor(private readonly httpService: HttpService) {}

  async findAll(): Promise<any[]> {
    // Bạn không cần khai báo URL mà chỉ cần khai báo path của api
    // Vì phần cấu hình đã thêm phần ấy rồi.
    const path = '/get-info-from-other-service';

    // Dùng firstValueFrom() thay vì toPromise()
    const { data } = await firstValueFrom(
      this.httpService.get<any[]>(path).pipe(
        catchError((error: AxiosError) => {
          // Handle error if necessarry.
          return throwError(() => error);
        }),
      ),
    );
    return data;
  }
}
<% } %>