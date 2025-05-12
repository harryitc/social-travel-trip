export const attachToken = (config: any, token: string | null) => {
  return {
    ...config,
    headers: {
      ...config.headers,
      Authorization: token ? `Bearer ${token}` : '',
    },
  };
};
