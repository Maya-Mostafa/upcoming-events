require('@rushstack/eslint-config/patch/modern-module-resolution');
module.exports = {
  extends: ['@microsoft/eslint-config-spfx/lib/profiles/react'],
  parserOptions: { tsconfigRootDir: __dirname },
  rules : {
    "@microsoft/spfx/no-async-await": "off",
    "@typescript-eslint/no-floating-promises" : "off",
    "@typescript-eslint/no-unnecessary-type-constraint": "off",
    "@typescript-eslint/explicit-function-return-type" : "off",
    "@typescript-eslint/no-unnecessary-type-assertion" : "off",
    "@typescript-eslint/typedef" : "off"
  }
};

