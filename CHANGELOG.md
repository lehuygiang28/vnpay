# Changelog

## v2.5.2

[compare changes](https://github.com/lehuygiang28/vnpay/compare/2.5.1...2.5.2)

### 🩹 Fixes

- `queryDr` and `refund` keep the text `undefined` inside signed field values. A missing field is still an empty checksum field. `null` is still the text `null`. ([43075b5](https://github.com/lehuygiang28/vnpay/commit/43075b5d23ecb2fb5bcf49b7401a4abd10612d66))

## v2.5.1

[compare changes](https://github.com/lehuygiang28/vnpay/compare/2.5.0...2.5.1)

### 🩹 Fixes

- `verifyReturnUrl` and `verifyIpnCall`: `isSuccess` is `true` only when the signature is valid and `vnp_ResponseCode` is `00` or `0` ([6f9228f](https://github.com/lehuygiang28/vnpay/commit/6f9228f2e1c9f05195f864c1bf1b7bcd2fe380fb))
- `queryDr` and `refund`: `isVerified` is `false` when `vnp_SecureHash` is missing or invalid; `isSuccess` is `true` only when the signature is valid and the response code is successful ([6f9228f](https://github.com/lehuygiang28/vnpay/commit/6f9228f2e1c9f05195f864c1bf1b7bcd2fe380fb))

## v2.4.4

[compare changes](https://github.com/lehuygiang28/vnpay/compare/2.4.3...2.4.4)

### 🩹 Fixes

- 🐛 automate dayjs plugin import corrections in ESM files ([dd71bb5](https://github.com/lehuygiang28/vnpay/commit/dd71bb5))
- 🐛 enhance dayjs import fixing logic in ESM files ([d650004](https://github.com/lehuygiang28/vnpay/commit/d650004))

### 🏡 Chore

- 🔖 release v2.4.4 ([bae1eb4](https://github.com/lehuygiang28/vnpay/commit/bae1eb4))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v2.4.3

[compare changes](https://github.com/lehuygiang28/vnpay/compare/2.4.2...2.4.3)

### 🩹 Fixes

- 🐛 correct type for consoleLogger symbol parameter ([8e537b7](https://github.com/lehuygiang28/vnpay/commit/8e537b7))
- 🐛 update dayjs plugin imports in ESM files ([da9866d](https://github.com/lehuygiang28/vnpay/commit/da9866d))

### 🏡 Chore

- 🔖 release v2.4.3-rc.0 ([0495047](https://github.com/lehuygiang28/vnpay/commit/0495047))
- 🔖 release v2.4.3 ([23ab519](https://github.com/lehuygiang28/vnpay/commit/23ab519))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v2.4.2

[compare changes](https://github.com/lehuygiang28/vnpay/compare/2.4.1...2.4.2)

### 💅 Refactors

- ✨ streamline type exports in types-only.ts ([96cfe10](https://github.com/lehuygiang28/vnpay/commit/96cfe10))

### 📖 Documentation

- 📝 update readme ([034c630](https://github.com/lehuygiang28/vnpay/commit/034c630))
- 📝 improve documentation formatting and clarity ([58e361d](https://github.com/lehuygiang28/vnpay/commit/58e361d))
- 📝 enhance documentation formatting and consistency ([09b240d](https://github.com/lehuygiang28/vnpay/commit/09b240d))

### 🏡 Chore

- ✨ add ESLint and Prettier configuration files ([d8750ef](https://github.com/lehuygiang28/vnpay/commit/d8750ef))
- ✨ update package-lock.json with dependency upgrades ([4fdf6ef](https://github.com/lehuygiang28/vnpay/commit/4fdf6ef))
- 🔖 release v2.4.2 ([7562eb5](https://github.com/lehuygiang28/vnpay/commit/7562eb5))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v2.4.1

[compare changes](https://github.com/lehuygiang28/vnpay/compare/2.4.0...2.4.1)

### 📖 Documentation

- 📝 update introduction and support sections in documentation ([395ddb3](https://github.com/lehuygiang28/vnpay/commit/395ddb3))
- 📝 remove sponsorship sections from introduction and support documentation ([7f32dca](https://github.com/lehuygiang28/vnpay/commit/7f32dca))

### 🏡 Chore

- 📝 update readme ([cf86c5e](https://github.com/lehuygiang28/vnpay/commit/cf86c5e))
- 📝 update readme ([82d648b](https://github.com/lehuygiang28/vnpay/commit/82d648b))
- 🔖 release v2.4.1 ([a3909f4](https://github.com/lehuygiang28/vnpay/commit/a3909f4))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v2.4.0

[compare changes](https://github.com/lehuygiang28/vnpay/compare/2.3.2...2.4.0)

### 🚀 Enhancements

- ✨ add modular entry points and types-only export ([5acd285](https://github.com/lehuygiang28/vnpay/commit/5acd285))

### 💅 Refactors

- **types-only:** ✨ enhance type exports for better modularity ([96ca489](https://github.com/lehuygiang28/vnpay/commit/96ca489))

### 📖 Documentation

- ✨ update README and documentation for v2.4.0 ([1d3ec2c](https://github.com/lehuygiang28/vnpay/commit/1d3ec2c))
- ✨ update client-side usage section in README ([2c6f93c](https://github.com/lehuygiang28/vnpay/commit/2c6f93c))
- ✨ refine client-side usage documentation across multiple files ([54b97b3](https://github.com/lehuygiang28/vnpay/commit/54b97b3))

### 🏡 Chore

- 🔖 release v2.4.0-rc1 ([2db260c](https://github.com/lehuygiang28/vnpay/commit/2db260c))
- 🔖 release v2.4.0-rc2 ([ff9a2c5](https://github.com/lehuygiang28/vnpay/commit/ff9a2c5))
- 🔖 release v2.4.0 ([9a2619d](https://github.com/lehuygiang28/vnpay/commit/9a2619d))

### 🤖 CI

- ✨ add npm tag handling for release publishing ([98d592e](https://github.com/lehuygiang28/vnpay/commit/98d592e))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v2.3.2

[compare changes](https://github.com/lehuygiang28/vnpay/compare/2.3.1...2.3.2)

### 🩹 Fixes

- **payment:** 🐛 handle empty bank code in payment URL generation ([10cf2aa](https://github.com/lehuygiang28/vnpay/commit/10cf2aa))

### 🏡 Chore

- 🔖 release v2.3.2 ([bdcbac1](https://github.com/lehuygiang28/vnpay/commit/bdcbac1))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v2.3.1

[compare changes](https://github.com/lehuygiang28/vnpay/compare/2.3.0...2.3.1)

### 🩹 Fixes

- **metadata:** 🚨 remove `postinstall` and `postuninstall` script ([6d1df23](https://github.com/lehuygiang28/vnpay/commit/6d1df23))
- **version:** Revert version to 2.3.0 in package.json ([1f06648](https://github.com/lehuygiang28/vnpay/commit/1f06648))

### 🏡 Chore

- 🔖 release v2.3.1 ([a7cca61](https://github.com/lehuygiang28/vnpay/commit/a7cca61))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))
- Kevin Nitro <trannguyenthaibinh46@gmail.com>

## v2.3.0

[compare changes](https://github.com/lehuygiang28/vnpay/compare/2.2.0...2.3.0)

### 🚀 Enhancements

- ✨ add support separate host for querydr and refund ([#34](https://github.com/lehuygiang28/vnpay/pull/34))

### 📖 Documentation

- ✨ add queryDrAndRefundHost option to installation documentation ([b36b219](https://github.com/lehuygiang28/vnpay/commit/b36b219))

### 🏡 Chore

- 🔖 release v2.3.0 ([b821ba2](https://github.com/lehuygiang28/vnpay/commit/b821ba2))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))
- Ha Tien Loi <hatienloi261299@gmail.com>

## v2.2.0

[compare changes](https://github.com/lehuygiang28/vnpay/compare/2.1.1...2.2.0)

### 🚀 Enhancements

- **rules:** ✨ add TypeScript coding guidelines and best practices ([f7eb270](https://github.com/lehuygiang28/vnpay/commit/f7eb270))
- **vnpay:** ✨ add customizable API endpoints for VNPay integration ([2fbb5d0](https://github.com/lehuygiang28/vnpay/commit/2fbb5d0))
- **docs:** ✨ enhance documentation with features and customizable API endpoints ([ed94c85](https://github.com/lehuygiang28/vnpay/commit/ed94c85))
- **docs:** ✨ add quick access and step-by-step instructions for IPN configuration ([985e3a1](https://github.com/lehuygiang28/vnpay/commit/985e3a1))

### 💅 Refactors

- **common:** ♻️ replace moment-timezone import for improved clarity ([bf1719d](https://github.com/lehuygiang28/vnpay/commit/bf1719d))
- **vnpay:** ✨ refactor VNPay class to use service-oriented architecture ([38c1070](https://github.com/lehuygiang28/vnpay/commit/38c1070))
- **payment:** ✨ enhance createPaymentUrl function and update tests ([24b948d](https://github.com/lehuygiang28/vnpay/commit/24b948d))
- **types:** ✨ update type imports for BuildPaymentUrl ([3a65cdd](https://github.com/lehuygiang28/vnpay/commit/3a65cdd))
- **date:** ♻️ replace moment-timezone with dayjs for date handling ([92b3911](https://github.com/lehuygiang28/vnpay/commit/92b3911))

### 📖 Documentation

- ✨ update IPN configuration note formatting for clarity ([e7def3a](https://github.com/lehuygiang28/vnpay/commit/e7def3a))
- ✨ update code block formatting for IPN configuration documentation ([605fd5a](https://github.com/lehuygiang28/vnpay/commit/605fd5a))
- ✨ update IPN configuration note formatting for improved clarity ([5e45154](https://github.com/lehuygiang28/vnpay/commit/5e45154))

### 🏡 Chore

- ✨ update dependencies and add example TypeScript configuration ([dddc685](https://github.com/lehuygiang28/vnpay/commit/dddc685))
- 🔖 release v2.2.0 ([d592bfa](https://github.com/lehuygiang28/vnpay/commit/d592bfa))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v2.1.1

[compare changes](https://github.com/lehuygiang28/vnpay/compare/2.0.0...2.1.1)

### 🚀 Enhancements

- **vnpay:** ✨ add new IPN response for prohibited IP addresses ([cd0b7da](https://github.com/lehuygiang28/vnpay/commit/cd0b7da))

### 🩹 Fixes

- **vnpay:** 🐛 add payment endpoint configuration to VNPay constructor ([a9fb651](https://github.com/lehuygiang28/vnpay/commit/a9fb651))

### 📖 Documentation

- 📝 update README files for improved clarity and structure ([0bfdb15](https://github.com/lehuygiang28/vnpay/commit/0bfdb15))
- 📝 enhance documentation for clarity and add support resources ([6ad11df](https://github.com/lehuygiang28/vnpay/commit/6ad11df))
- 📝 add best practices and troubleshooting guide for VNPay integration ([8f32002](https://github.com/lehuygiang28/vnpay/commit/8f32002))
- 📝 update CONTRIBUTING.md for improved clarity and structure ([54b8068](https://github.com/lehuygiang28/vnpay/commit/54b8068))
- 📝 add Google Analytics tracking ([c6bab9b](https://github.com/lehuygiang28/vnpay/commit/c6bab9b))

### 🏡 Chore

- 🔖 release v2.1.0 ([b0d9759](https://github.com/lehuygiang28/vnpay/commit/b0d9759))
- **docs:** 🗑️ remove announcement bar for contributor translation request ([98c23f0](https://github.com/lehuygiang28/vnpay/commit/98c23f0))
- 🔖 release v2.1.1 ([4f3d08a](https://github.com/lehuygiang28/vnpay/commit/4f3d08a))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v2.0.0

[compare changes](https://github.com/lehuygiang28/vnpay/compare/1.6.1...2.0.0)

### 🚀 Enhancements

- **vnpay:** ✨ update build to use tsup for support both cjs and esm ([09dfb55](https://github.com/lehuygiang28/vnpay/commit/09dfb55))

### 💅 Refactors

- **utils:** 🎨 enhance `hash` function to accept additional data types ([11d50f2](https://github.com/lehuygiang28/vnpay/commit/11d50f2))

### 🏡 Chore

- ⬆️ update release-it to version 18.1.2 ([3b7236d](https://github.com/lehuygiang28/vnpay/commit/3b7236d))
- 🔖 release v2.0.0 ([414a07a](https://github.com/lehuygiang28/vnpay/commit/414a07a))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v1.6.1

[compare changes](https://github.com/lehuygiang28/vnpay/compare/1.5.5...1.6.1)

### 🚀 Enhancements

- **vnpay:** 🚀 add `vnp_ExpireDate` due to vnpay updated ([9ff10e8](https://github.com/lehuygiang28/vnpay/commit/9ff10e8))

### 💅 Refactors

- **vnpay:** ♻️ using a single parameter as an object is preferred over multiple parameters ([5b357ca](https://github.com/lehuygiang28/vnpay/commit/5b357ca))
- **utils:** 🎨 remove the nodejs import protocol ([10777de](https://github.com/lehuygiang28/vnpay/commit/10777de))

### 📖 Documentation

- **docs:** 📝 update docs to set `vnp_CreateDate` and `vnp_ExpireDate` ([69da756](https://github.com/lehuygiang28/vnpay/commit/69da756))
- **example:** 📝 update example to set `vnp_CreateDate` and `vnp_ExpireDate` ([4cd0afe](https://github.com/lehuygiang28/vnpay/commit/4cd0afe))
- **readme:** 📝 update image link ([338146d](https://github.com/lehuygiang28/vnpay/commit/338146d))

### 🏡 Chore

- 🔖 release v1.6.0 ([f7af812](https://github.com/lehuygiang28/vnpay/commit/f7af812))
- 🎨 remove eslint and prettier settings ([fb6ac23](https://github.com/lehuygiang28/vnpay/commit/fb6ac23))
- 🎨 update `loggerFn` to use arrow function syntax ([f975947](https://github.com/lehuygiang28/vnpay/commit/f975947))
- 🔖 release v1.6.1 ([095efa6](https://github.com/lehuygiang28/vnpay/commit/095efa6))

### ✅ Tests

- **utils:** ✅ add tests for `parseDate` function ([0795cc7](https://github.com/lehuygiang28/vnpay/commit/0795cc7))
- **vnpay:** ✅ add VNPay initialization tests and configurations ([8f0a5ad](https://github.com/lehuygiang28/vnpay/commit/8f0a5ad))
- **vnpay:** ✅ add unit test for `getBankList` method ([86abeb9](https://github.com/lehuygiang28/vnpay/commit/86abeb9))
- **vnpay:** ✅ add tests for `vnp_ExpireDate` ([ab8fae6](https://github.com/lehuygiang28/vnpay/commit/ab8fae6))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v1.5.5

[compare changes](https://github.com/lehuygiang28/vnpay/compare/1.5.0...1.5.5)

### 🚀 Enhancements

- 🚀 update new domain to js.org ([6d85765](https://github.com/lehuygiang28/vnpay/commit/6d85765))
- **test:** 🔧 ignore coverage report ([6866c9c](https://github.com/lehuygiang28/vnpay/commit/6866c9c))
- **test:** 🔧 config jest test ([84c312d](https://github.com/lehuygiang28/vnpay/commit/84c312d))
- ⚡️ add `release-it` ([9b2dfab](https://github.com/lehuygiang28/vnpay/commit/9b2dfab))

### 🩹 Fixes

- **vnpay:** 🐛 verfiy failed when parse number string ([a945f65](https://github.com/lehuygiang28/vnpay/commit/a945f65))
- **utils:** 🚑️ param is not used to get date ([3df7929](https://github.com/lehuygiang28/vnpay/commit/3df7929))
- **utils:** 🐛 fix wrong used way of timezone ([79fc727](https://github.com/lehuygiang28/vnpay/commit/79fc727))
- **utils:** 🚑️ remove `.toDate()` due to it alway convert to local date ([fd70ed9](https://github.com/lehuygiang28/vnpay/commit/fd70ed9))
- **utils:** 🚑️ remove `.toDate()` due to it alway convert to local date ([57d29d4](https://github.com/lehuygiang28/vnpay/commit/57d29d4))
- **utils:** ⚡️ reassigning a function parameter is confusing ([4fcab2b](https://github.com/lehuygiang28/vnpay/commit/4fcab2b))
- **deps:** Update docusaurus monorepo to v3.4.0 ([24ddbe3](https://github.com/lehuygiang28/vnpay/commit/24ddbe3))
- **vnpay:** 🐛 handle `vnp_SecureHash` if vnpay not provide it ([05f6ca8](https://github.com/lehuygiang28/vnpay/commit/05f6ca8))

### 💅 Refactors

- **vnpay:** ♻️ split to utils function ([ef72841](https://github.com/lehuygiang28/vnpay/commit/ef72841))
- **vnpay:** ⚡️ using util function to get date instead ([e955cd2](https://github.com/lehuygiang28/vnpay/commit/e955cd2))
- **test:** ✅ update to set date utc correctly ([2de613d](https://github.com/lehuygiang28/vnpay/commit/2de613d))
- **test:** ✅ update to set date utc correctly ([6c97ea7](https://github.com/lehuygiang28/vnpay/commit/6c97ea7))
- **utils:** 🚀 update `parseDate` function to support additional timezones ([480240b](https://github.com/lehuygiang28/vnpay/commit/480240b))
- **test:** ♻️ update to use `getDateInGMT7` for current time ([4a0b646](https://github.com/lehuygiang28/vnpay/commit/4a0b646))
- ⚡️ update imports are only used as types ([2925e99](https://github.com/lehuygiang28/vnpay/commit/2925e99))
- ⚡️ use the `Number` namespace for `parseInt` ([a2cc306](https://github.com/lehuygiang28/vnpay/commit/a2cc306))
- **example:** 🎨 prefer `for-of` instead forEach ([17ce36c](https://github.com/lehuygiang28/vnpay/commit/17ce36c))
- **example:** 🎨 avoid `any` ([99bbca2](https://github.com/lehuygiang28/vnpay/commit/99bbca2))
- **vnpay:** 🎨 sort import ([05649e9](https://github.com/lehuygiang28/vnpay/commit/05649e9))
- **example:** 🎨 prefer `for-of` instead forEach ([9f5b99d](https://github.com/lehuygiang28/vnpay/commit/9f5b99d))
- **test:** 🎨 avoid the `delete` operator which can impact performance. ([491bdec](https://github.com/lehuygiang28/vnpay/commit/491bdec))
- 🎨 template literals are preferred over string concatenation ([c07108e](https://github.com/lehuygiang28/vnpay/commit/c07108e))
- **example:** 🎨 prefer `for-of` instead of forEach ([7e63257](https://github.com/lehuygiang28/vnpay/commit/7e63257))
- **vnpay:** ⚡️ using array value instead template string to create string for hashing ([65720ea](https://github.com/lehuygiang28/vnpay/commit/65720ea))
- **vnpay:** 🎨 prefer spead syntax instead `Object.assign()` ([1f55f5b](https://github.com/lehuygiang28/vnpay/commit/1f55f5b))

### 📖 Documentation

- **readme:** 📝 update license section ([9bd43a5](https://github.com/lehuygiang28/vnpay/commit/9bd43a5))
- 📝 update license section ([a366106](https://github.com/lehuygiang28/vnpay/commit/a366106))
- **docs:** 🐛 fix broken anchor ([5d35de7](https://github.com/lehuygiang28/vnpay/commit/5d35de7))
- **i18n:** 📝 update `en` translations ([922c71a](https://github.com/lehuygiang28/vnpay/commit/922c71a))
- Update contributors image alt text ([520c5ed](https://github.com/lehuygiang28/vnpay/commit/520c5ed))
- **docs:** 📝 update docs ([76fb713](https://github.com/lehuygiang28/vnpay/commit/76fb713))

### 📦 Build

- 🔖 release 1.5.1 ([d074119](https://github.com/lehuygiang28/vnpay/commit/d074119))
- 🔖 release 1.5.2 ([4c1c781](https://github.com/lehuygiang28/vnpay/commit/4c1c781))

### 🏡 Chore

- **readme:** 📝 update readme ([854f8c4](https://github.com/lehuygiang28/vnpay/commit/854f8c4))
- **docs:** 📝 update en in jsdocs ([e36d088](https://github.com/lehuygiang28/vnpay/commit/e36d088))
- **readme:** 💄 linting docs ([4b171fc](https://github.com/lehuygiang28/vnpay/commit/4b171fc))
- **readme:** 📝 update momo to support section ([b1c9e38](https://github.com/lehuygiang28/vnpay/commit/b1c9e38))
- **logger:** ✨ update to select type of console ([b1c3592](https://github.com/lehuygiang28/vnpay/commit/b1c3592))
- **test:** ⚡️ set UTC timezone for Jest tests ([859265a](https://github.com/lehuygiang28/vnpay/commit/859265a))
- ⚡️ update .coderabbit.yaml with tone instructions ([e22058f](https://github.com/lehuygiang28/vnpay/commit/e22058f))
- ⚡️ using `biome` instead of `eslint` and `prettier` ([b1c4032](https://github.com/lehuygiang28/vnpay/commit/b1c4032))
- **styles:** 💄 run biome format ([41d9e2f](https://github.com/lehuygiang28/vnpay/commit/41d9e2f))
- 🎨 update ignore for biome ([94c69f8](https://github.com/lehuygiang28/vnpay/commit/94c69f8))
- **example:** 🚀 update example get data from env ([5306b10](https://github.com/lehuygiang28/vnpay/commit/5306b10))
- 🔖 release v1.5.3 ([87543a8](https://github.com/lehuygiang28/vnpay/commit/87543a8))
- Add .renovaterc.json configuration file ([f8291bc](https://github.com/lehuygiang28/vnpay/commit/f8291bc))
- **example:** 🎨 make logger prettier and more readable ([14d5307](https://github.com/lehuygiang28/vnpay/commit/14d5307))
- **example:** ⚡️ update vnp_OrderInfo with dynamic order information ([9f8c045](https://github.com/lehuygiang28/vnpay/commit/9f8c045))
- 🔧 remove editor.formatOnSaveMode setting ([07b91f9](https://github.com/lehuygiang28/vnpay/commit/07b91f9))
- 🔖 release v1.5.4 ([b304f2c](https://github.com/lehuygiang28/vnpay/commit/b304f2c))
- 🔖 release v1.5.5 ([59bfe17](https://github.com/lehuygiang28/vnpay/commit/59bfe17))

### ✅ Tests

- **logger:** ✅ add test for logger utils ([2eba6b4](https://github.com/lehuygiang28/vnpay/commit/2eba6b4))
- **utils:** ✅ add test for common utils ([1d136cf](https://github.com/lehuygiang28/vnpay/commit/1d136cf))
- **utils/payment:** ✅ add test for payment utils ([f80343e](https://github.com/lehuygiang28/vnpay/commit/f80343e))
- **vnpay:** ✅ add test for verify request ([e82655b](https://github.com/lehuygiang28/vnpay/commit/e82655b))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v1.5.0

[compare changes](https://github.com/lehuygiang28/vnpay/compare/1.4.1...1.5.0)

### 🚀 Enhancements

- Update IPN verification documentation link ([7e5dc38](https://github.com/lehuygiang28/vnpay/commit/7e5dc38))

### 💅 Refactors

- **refund:** ♻️ `refund` no longer throw error when request falied ([cff8e6e](https://github.com/lehuygiang28/vnpay/commit/cff8e6e))

### 📖 Documentation

- **refund:** 📝 update `refund`'s docs ([57aa58c](https://github.com/lehuygiang28/vnpay/commit/57aa58c))
- 📝 update docs for `getBankList` ([618e90f](https://github.com/lehuygiang28/vnpay/commit/618e90f))

### 📦 Build

- 🔖 release 1.5.0 ([4b23377](https://github.com/lehuygiang28/vnpay/commit/4b23377))

### 🏡 Chore

- Update `generateRandomString` function to support generating only numbers when specified ([ce1963a](https://github.com/lehuygiang28/vnpay/commit/ce1963a))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v1.4.1

[compare changes](https://github.com/lehuygiang28/vnpay/compare/1.4.0...1.4.1)

### 💅 Refactors

- **queryDr:** ⚡ `queryDr` no longer throw error, support logger ([#10](https://github.com/lehuygiang28/vnpay/pull/10))
- Update Buy Me A Coffee image in README files ([e0d3f6e](https://github.com/lehuygiang28/vnpay/commit/e0d3f6e))

### 📦 Build

- 🔖 release 1.4.1 ([d7540fc](https://github.com/lehuygiang28/vnpay/commit/d7540fc))

### 🏡 Chore

- And add badges for npm package ([eae5019](https://github.com/lehuygiang28/vnpay/commit/eae5019))
- Update Docusaurus configuration and metadata ([ffe4830](https://github.com/lehuygiang28/vnpay/commit/ffe4830))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))
- Lê Huy Giang ([@lehuygiang28](https://github.com/lehuygiang28))

## v1.4.0

[compare changes](https://github.com/lehuygiang28/vnpay/compare/1.3.5...1.4.0)

### 📦 Build

- 🔖 release 1.4.0 ([5d018fb](https://github.com/lehuygiang28/vnpay/commit/5d018fb))

### 🏡 Chore

- Update favicon and Algolia configuration in docusaurus.config.ts ([367ee07](https://github.com/lehuygiang28/vnpay/commit/367ee07))
- Add vercel.json file with cleanUrls set to true ([066f0a4](https://github.com/lehuygiang28/vnpay/commit/066f0a4))
- Update support documentation with Vietnamese translation ([d8a86a7](https://github.com/lehuygiang28/vnpay/commit/d8a86a7))
- Add release script to package.json ([59a9811](https://github.com/lehuygiang28/vnpay/commit/59a9811))
- Add support `en` language for docs ([6229d9c](https://github.com/lehuygiang28/vnpay/commit/6229d9c))
- Add analytics script ([3faa932](https://github.com/lehuygiang28/vnpay/commit/3faa932))
- Update analytics.js work with SPA ([45758b1](https://github.com/lehuygiang28/vnpay/commit/45758b1))
- Add page view event on page load in analytics.js ([7b90412](https://github.com/lehuygiang28/vnpay/commit/7b90412))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v1.3.5

[compare changes](https://github.com/lehuygiang28/vnpay/compare/1.3.0...1.3.5)

### 📖 Documentation

- 📝 update docs with vi version ([ef8ec24](https://github.com/lehuygiang28/vnpay/commit/ef8ec24))

### 📦 Build

- 🔖 release 1.3.5 ([d6ceb33](https://github.com/lehuygiang28/vnpay/commit/d6ceb33))

### 🏡 Chore

- Add deployment branch for docs page ([b98d4c9](https://github.com/lehuygiang28/vnpay/commit/b98d4c9))
- Update production URL in docusaurus.config.ts ([94c791c](https://github.com/lehuygiang28/vnpay/commit/94c791c))
- Add vercel-analytics plugin to Docusaurus configuration ([eca4b2d](https://github.com/lehuygiang28/vnpay/commit/eca4b2d))
- Update documentation URLs in README files ([ae90ba9](https://github.com/lehuygiang28/vnpay/commit/ae90ba9))
- Remove unused algolia configuration from docusaurus.config.ts ([de9fb52](https://github.com/lehuygiang28/vnpay/commit/de9fb52))
- Remove unused favicon from docusaurus.config.ts ([934c68e](https://github.com/lehuygiang28/vnpay/commit/934c68e))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v1.3.0

[compare changes](https://github.com/lehuygiang28/vnpay/compare/1.2.1...1.3.0)

### 📦 Build

- 🔖 release 1.3.0 ([e278518](https://github.com/lehuygiang28/vnpay/commit/e278518))

### 🏡 Chore

- Refactor verification methods in vnpay ([8ba8bed](https://github.com/lehuygiang28/vnpay/commit/8ba8bed))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v1.2.1

[compare changes](https://github.com/lehuygiang28/vnpay/compare/1.1.1...1.2.1)

### 🚀 Enhancements

- Add GitHub Actions workflow for building and testing on pull requests ([0f9f6a6](https://github.com/lehuygiang28/vnpay/commit/0f9f6a6))
- Add parseDate function for vnpay date format ([b413d68](https://github.com/lehuygiang28/vnpay/commit/b413d68))

### 📦 Build

- 🔖 release 1.2.1 ([87c109e](https://github.com/lehuygiang28/vnpay/commit/87c109e))

### 🏡 Chore

- 🎨 move CHANGELOG.md to `.github` folder ([e31db25](https://github.com/lehuygiang28/vnpay/commit/e31db25))
- 🚀 add CONTRIBUTING.md ([71c89b9](https://github.com/lehuygiang28/vnpay/commit/71c89b9))
- 🚀 add PULL_REQUEST_TEMPLATE.md ([866d0fe](https://github.com/lehuygiang28/vnpay/commit/866d0fe))
- Update readme ([367f4ca](https://github.com/lehuygiang28/vnpay/commit/367f4ca))
- Update README files with support and contribution information ([8f43406](https://github.com/lehuygiang28/vnpay/commit/8f43406))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v1.1.1

[compare changes](https://github.com/lehuygiang28/vnpay/compare/1.1.0...1.1.1)

### 🚀 Enhancements

- **buildPaymentUrl:** ✨ update type of `vnp_OrderType` ([3f4b3d0](https://github.com/lehuygiang28/vnpay/commit/3f4b3d0))

### 🩹 Fixes

- **typos:** ✏️ fix typos version ([ddc7dfb](https://github.com/lehuygiang28/vnpay/commit/ddc7dfb))
- **test:** ✅ fix test ([bc88c1f](https://github.com/lehuygiang28/vnpay/commit/bc88c1f))

### 📦 Build

- **deps-dev:** Bump express from 4.18.3 to 4.19.2 ([d08b05c](https://github.com/lehuygiang28/vnpay/commit/d08b05c))
- 🔖 release 1.1.1 ([3e79ece](https://github.com/lehuygiang28/vnpay/commit/3e79ece))

### 🏡 Chore

- 📝 update docs and example ([e53eeca](https://github.com/lehuygiang28/vnpay/commit/e53eeca))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v1.1.0

[compare changes](https://github.com/lehuygiang28/vnpay/compare/0.9.6...1.1.0)

### 🚀 Enhancements

- **test:** ✅ add test config ([30ec488](https://github.com/lehuygiang28/vnpay/commit/30ec488))
- **version:** ⬆️ update changelog, and release 1.0.0 ([4968b91](https://github.com/lehuygiang28/vnpay/commit/4968b91))
- **version:** ⬆️ release 1.1.0 ([212eca0](https://github.com/lehuygiang28/vnpay/commit/212eca0))

### 🩹 Fixes

- **build-url:** Pass optional gateway enpoint when build url ([7b253c1](https://github.com/lehuygiang28/vnpay/commit/7b253c1))
- **buildPaymentUrl:** 🐛 fix `createDate` not apply when user passing it ([aec7204](https://github.com/lehuygiang28/vnpay/commit/aec7204))

### 💅 Refactors

- **styles:** ✏️ rename `api_Host` to `vnpayHost` ([4f0e930](https://github.com/lehuygiang28/vnpay/commit/4f0e930))
- **vnpay:** ⚡️ change `buildPaymentUrl`, `verifyReturnUrl` & `verifyIpnCall` no longer return promise ([4c30690](https://github.com/lehuygiang28/vnpay/commit/4c30690))

### ✅ Tests

- **buildPaymentUrl:** ✅ add passing test ([6293ac4](https://github.com/lehuygiang28/vnpay/commit/6293ac4))

### 🎨 Styles

- Rename gateway end point to payment endpoint ([50961da](https://github.com/lehuygiang28/vnpay/commit/50961da))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))
- Thinh Bui <thinhbuihong.ma@gmail.com>

## v0.9.6

[compare changes](https://github.com/lehuygiang28/vnpay/compare/0.9.5...0.9.6)

### 🚀 Enhancements

- **version:** ⬆️ update docs, changelog and release 0.9.6 ([80d4d0b](https://github.com/lehuygiang28/vnpay/commit/80d4d0b))

### 🩹 Fixes

- **queryDr:** Remove `undefined` in string checksum response ([#4](https://github.com/lehuygiang28/vnpay/pull/4))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))
- Thinhbuihong ([@thinhbuihong](https://github.com/thinhbuihong))

## v0.9.5

[compare changes](https://github.com/lehuygiang28/vnpay/compare/0.9.0...0.9.5)

### 🚀 Enhancements

- **version:** ⬆️ update changelog, and release 0.9.5 ([2fa8c4a](https://github.com/lehuygiang28/vnpay/commit/2fa8c4a))

### 🩹 Fixes

- **type:** 🐛 fix issue type of orderType ([77a3aa2](https://github.com/lehuygiang28/vnpay/commit/77a3aa2))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v0.9.0

[compare changes](https://github.com/lehuygiang28/vnpay/compare/0.8.0...0.9.0)

### 🚀 Enhancements

- **vnpay:** ✨ update can change the default `HashAlgorithm` ([4e4c8c3](https://github.com/lehuygiang28/vnpay/commit/4e4c8c3))

### 📖 Documentation

- ✨ update docs, changelog and release 0.9.0 ([ba517fa](https://github.com/lehuygiang28/vnpay/commit/ba517fa))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v0.8.0

[compare changes](https://github.com/lehuygiang28/vnpay/compare/0.7.0...0.8.0)

### 🚀 Enhancements

- **type:** ⚡️ update docs, enum type ([897d886](https://github.com/lehuygiang28/vnpay/commit/897d886))
- **refund:** ✨ add `refund` method to request refund to vnpay ([7254904](https://github.com/lehuygiang28/vnpay/commit/7254904))
- **vnpay:** ✨ add `get bank list` ([b2d9781](https://github.com/lehuygiang28/vnpay/commit/b2d9781))

### 💅 Refactors

- **hash:** ♻️ use shoter way to hash ([a204358](https://github.com/lehuygiang28/vnpay/commit/a204358))

### 📖 Documentation

- **docs:** 📝 update docs ([4f57b2c](https://github.com/lehuygiang28/vnpay/commit/4f57b2c))

### 📦 Build

- ✨ release 0.8.0 ([236ab00](https://github.com/lehuygiang28/vnpay/commit/236ab00))

### 🏡 Chore

- **example:** 🚀 update example ([fa3c847](https://github.com/lehuygiang28/vnpay/commit/fa3c847))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v0.7.0

[compare changes](https://github.com/lehuygiang28/vnpay/compare/0.6.0...0.7.0)

### 🚀 Enhancements

- ⬆️ release 0.7.0 ([52ba784](https://github.com/lehuygiang28/vnpay/commit/52ba784))

### 🔥 Performance

- **docs:** ⚡️ add target \_blank for open new tab when user click a link ([d73ae65](https://github.com/lehuygiang28/vnpay/commit/d73ae65))

### 💅 Refactors

- ♻️ switch to only use type of ts instead of zod ([fa2472d](https://github.com/lehuygiang28/vnpay/commit/fa2472d))

### 🏡 Chore

- ✏️ fix typo in description ([daf1a4e](https://github.com/lehuygiang28/vnpay/commit/daf1a4e))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v0.6.0

[compare changes](https://github.com/lehuygiang28/vnpay/compare/0.5.4...0.6.0)

### 🚀 Enhancements

- **ipn:** ⚡️ deprecated old verify ipn method ([f7ed5d3](https://github.com/lehuygiang28/vnpay/commit/f7ed5d3))
- **vnpay:** ✨ add method `verifyIpnCall` ([29098e0](https://github.com/lehuygiang28/vnpay/commit/29098e0))
- ⬆️ release `0.6.0` ([f1ee762](https://github.com/lehuygiang28/vnpay/commit/f1ee762))

### 🔥 Performance

- **hmac:** ⚡️ use shorter way to signed ([229ec31](https://github.com/lehuygiang28/vnpay/commit/229ec31))

### 💅 Refactors

- **schema:** ♻️ remove `schema` typo from ts type ([53ff053](https://github.com/lehuygiang28/vnpay/commit/53ff053))

### 📖 Documentation

- **docs:** 🚀 update readme ([c1e1a42](https://github.com/lehuygiang28/vnpay/commit/c1e1a42))

### 🏡 Chore

- 📝 update changelog ([5e778c8](https://github.com/lehuygiang28/vnpay/commit/5e778c8))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v0.5.4

[compare changes](https://github.com/lehuygiang28/vnpay/compare/0.5.3...0.5.4)

### 🚀 Enhancements

- **example:** 🚀 update example for express, runable ([9fdd360](https://github.com/lehuygiang28/vnpay/commit/9fdd360))

### 📦 Build

- ⬆️ update version to 0.5.4 ([2109176](https://github.com/lehuygiang28/vnpay/commit/2109176))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))

## v0.5.3

[compare changes](https://github.com/lehuygiang28/vnpay/compare/1fe93c9a243a555956a662f8b38fcc8a68982a0e...0.5.3)

### 🚀 Enhancements

- **querydr:** Update feat querydr ([d3298dc](https://github.com/lehuygiang28/vnpay/commit/d3298dc))
- **querydr:** Update feat querydr ([42c0d02](https://github.com/lehuygiang28/vnpay/commit/42c0d02))
- **actions:** ✨ add github action for auto publish a npm package ([53a2e44](https://github.com/lehuygiang28/vnpay/commit/53a2e44))
- **version:** ✨ upgrade version to `0.5.3` ([b42cde1](https://github.com/lehuygiang28/vnpay/commit/b42cde1))

### 🔥 Performance

- **example:** ⚡️ add console.time for benchmark time exec ([c4358a5](https://github.com/lehuygiang28/vnpay/commit/c4358a5))

### 🩹 Fixes

- **docs:** Fix broken readme link ([d2239a2](https://github.com/lehuygiang28/vnpay/commit/d2239a2))

### 💅 Refactors

- **docs:** 📝 change vi is default language of readme ([6b549b0](https://github.com/lehuygiang28/vnpay/commit/6b549b0))
- **example:** 🔥 move example to a other folder to exclude in build ([0c43a5b](https://github.com/lehuygiang28/vnpay/commit/0c43a5b))

### 📖 Documentation

- 🚀 update CHANGELOG ([7fb3c34](https://github.com/lehuygiang28/vnpay/commit/7fb3c34))

### 📦 Build

- **deps-dev:** Bump @babel/traverse from 7.23.0 to 7.23.2 ([#1](https://github.com/lehuygiang28/vnpay/pull/1))

### 🏡 Chore

- 🚀 up to date version ([79a5d07](https://github.com/lehuygiang28/vnpay/commit/79a5d07))

### ❤️ Contributors

- Lehuygiang28 ([@lehuygiang28](https://github.com/lehuygiang28))
