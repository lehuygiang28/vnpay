# Type alias: LoggerOptions\<T, Fields\>

> **LoggerOptions**\<`T`, `Fields`\>: `object`

Type representing logger options.

## Type parameters

• **T**

The type of the data object.

• **Fields** *extends* keyof `T`

The keys of the data object.

## Type declaration

### logger

> **logger**: `object` \| `object` \| `object`

The logger configuration, which can be one of three types:
- 'all': log all fields, optionally using a custom logger function.
- 'omit': omit certain fields from logging, optionally using a custom logger function.
- 'pick': log only certain fields, optionally using a custom logger function.

## Source

[types/logger.type.ts:23](https://github.com/lehuygiang28/vnpay/blob/ffb3f1a6e2e5cee6cec7ba4f806a92950f9f7872/src/types/logger.type.ts#L23)
