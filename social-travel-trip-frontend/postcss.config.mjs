/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
  // plugins: {
  //   tailwindcss: {
  //     // config: "./tailwind.config.ts",
  //     // css: "./src/app/global.css",
  //     // baseColor: "zinc",
  //     // cssVariables: true,
  //     // prefix: "",
  //   },
  //   // autoprefixer: {},
  // },
};

export default config;
