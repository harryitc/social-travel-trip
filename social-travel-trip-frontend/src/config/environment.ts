export const environment = {
  auth: {
    app_key: process.env.NEXT_PUBLIC_APP_KEY ?? '',
    google_client_id: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ?? '',
    google_adsense_account_meta_data:
      process.env.NEXT_PUBLIC_GOOGLE_ADSENSE_ACCOUNT_META_DATA ?? '',
  },
  domain: {
    api_auth: process.env.NEXT_PUBLIC_API_AUTH ?? '',
    permission_v2: process.env.NEXT_PUBLIC_PERMISSION_V2 ?? '',
    social_travel_trip: process.env.NEXT_PUBLIC_API_SOCIAL_TRAVEL_TRIP ?? '',
    file_v2: process.env.NEXT_PUBLIC_API_FILE_V2 ?? '',
    image_root_path_quilljs: process.env.NEXT_PUBLIC_IMAGE_ROOT_FILE_QUILL ?? '',
  },
  aplication: {
    http: {
      timeout: +(process.env.NEXT_PUBLIC_TIMEOUT ?? 10000),
    },
    storage: {
      cookies: {
        expireInSeconds: +(process.env.NEXT_PUBLIC_TIMEOUT_EXPIRE_IN_SECONDS ?? 1000),
      },
    },
  },
};

export const AUTH = {
  login_route: '/auth/sign-in',
  register_route: '/auth/sign-up',
};
