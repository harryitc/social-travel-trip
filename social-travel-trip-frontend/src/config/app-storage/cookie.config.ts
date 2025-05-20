const CookieConfigKeys = {
  global: {},
  features: {
    auth: {
      menu_active: 'feature.auth.menu_active',
      token: 'feature.auth.token',
      result: 'feature.auth.result',
      user: 'feature.auth.user', // Thêm key để lưu thông tin người dùng
    },
  },
};
Object.freeze(CookieConfigKeys);
export { CookieConfigKeys };
