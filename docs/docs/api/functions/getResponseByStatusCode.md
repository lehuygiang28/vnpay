# Function: getResponseByStatusCode()

> **getResponseByStatusCode**(`responseCode`, `locale`, `responseMap`): `string`

Lấy thông tin response theo mã response

## Parameters

• **responseCode**: `string`= `''`

response code from VNPay

• **locale**: [`VnpLocale`](../enumerations/VnpLocale.md)= `VnpLocale.VN`

locale of response text

• **responseMap**: `Map`\<`string`, `Record` \<[`VnpLocale`](../enumerations/VnpLocale.md), `string`\>\>= `RESPONSE_MAP`

map of response code and response text if you want to custom

## Returns

`string`

message of response code

## En

Get response message by response code

## Source

[utils/common.ts:82](https://github.com/lehuygiang28/vnpay/blob/e5d2c2c4802c32c8fbad34e0595b2cfeb2281905/src/utils/common.ts#L82)
