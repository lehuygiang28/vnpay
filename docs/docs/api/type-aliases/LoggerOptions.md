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

[types/logger.type.ts:23](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/types/logger.type.ts#L23)
