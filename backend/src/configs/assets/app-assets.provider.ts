import { AssetsProvider } from '@common/helpers/assets-provider';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AppAssetsProvider extends AssetsProvider {
  constructor(private readonly configService: ConfigService) {
    super([]);
    const basePath = [
      __dirname,
      '../../',
      this.configService.get(`assetsProvider.app`),
    ];
    this.setBasePath(basePath);
  }
}
