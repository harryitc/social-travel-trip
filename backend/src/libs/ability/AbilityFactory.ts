/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  AbilityBuilder,
  createMongoAbility,
  ForbiddenError,
  MongoAbility,
} from '@casl/ability';
import { LogicErrorException } from '@common/exceptions';

export abstract class AbilityFactory {
  abstract abilityOption;
  abstract className: string;

  constructor() { } // protected readonly ioRedis: IoRedis,

  protected async _create<T>(...args) {
    // let cacheData: any = await this.getFromCache(args)
    const ability = new AbilityBuilder<MongoAbility>(createMongoAbility);
    const { build, rules } = ability;

    // if (cacheData) {
    //     ability.rules = cacheData
    //     return <T>build(this.abilityOption)
    // }

    await this.buildRules(ability, ...args);
    // await this.setCache(rules, args)
    return <T>build(this.abilityOption);
  }

  abstract create(...args: any): any;

  abstract buildRules(ability: AbilityBuilder<MongoAbility>, ...args: any): any;

  // private async getFromCache(...args): Promise<any> {
  //     return await this.ioRedis.hget(this.className, args.join(','))
  // }

  // private async setCache(rules, ...args): Promise<any> {
  //     return await this.ioRedis.hset(this.className, args.join(','), rules)
  // }

  // async clearCache(...args): Promise<any> {
  //     console.log(args.join(','))
  //     return await this.ioRedis.hdel(this.className, args.join(','))
  // }

  getReason(ability, action, subject): any {
    if (ability.can(action, subject)) {
      return 'Có quyền';
    }
    return ForbiddenError.from(ability).unlessCan(action, subject).message;
  }

  throwError(ability, action, subject, data?): any {
    if (ability.can(action, subject)) {
      return 'Có quyền';
    }
    let message = ForbiddenError.from(ability).unlessCan(
      action,
      subject,
    ).message;
    const messageCode = +message.split(':', 1)[0];
    if (messageCode) {
      message = message.replace(`${messageCode}:`, '').trim();
    }

    throw new LogicErrorException(message, {
      code: messageCode,
      data: data
    })
  }
}
