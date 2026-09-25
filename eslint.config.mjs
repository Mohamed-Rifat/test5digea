import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  {
    rules: {
      // The app fetches data in effects (`useEffect(() => { load(); }, [load])`)
      // and those loaders flip a `loading` flag first. That is the documented
      // pattern for client-side fetching without a data library, so keep the
      // React Compiler hint visible as a warning instead of failing the lint.
      "react-hooks/set-state-in-effect": "warn",
      // Images are user uploads served by ImageKit / Cloudinary CDNs with
      // unknown dimensions; they are rendered with <img loading="lazy">.
      "@next/next/no-img-element": "off",
    },
  },
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ]),
]);

export default eslintConfig;
