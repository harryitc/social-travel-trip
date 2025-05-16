const LocalStorageConfigKeys = {
  global: {
    theme_mode: 'global.theme_mode',
  },
  features: {
    auth: {
      menu_active: 'feature.auth.menu_active',
      token: 'feature.auth.token',
      result: 'feature.auth.result',
    },
    manage: {
      list: {
        filter: 'features.manage.list.filter',
      },
      detail: {},
    },
  },
};
Object.freeze(LocalStorageConfigKeys);
export { LocalStorageConfigKeys };
