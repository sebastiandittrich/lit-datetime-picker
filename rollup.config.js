import typescript from "rollup-plugin-typescript2";
import resolve from "@rollup/plugin-node-resolve";
import postcss from "rollup-plugin-postcss";
import litcss from "rollup-plugin-postcss-lit";
import tailwindcss from "tailwindcss";
import aspectRatio from "@tailwindcss/aspect-ratio";

export default {
  input: "src/index.ts",
  output: [
    {
      dir: "lib",
      format: "es",
      sourcemap: true,
    },
  ],
  plugins: [
    resolve({
      browser: true,
    }),
    typescript(),
    postcss({
      minimize: true,
      plugins: [
        tailwindcss({
          mode: "jit",
          purge: ["./src/**/*.ts", "./src/main.css"],
          darkMode: false, // or 'media' or 'class'
          theme: {
            extend: {},
          },
          variants: {
            extend: {},
          },
          plugins: [aspectRatio],
        }),
      ],
    }),
    litcss(),
  ],
};
