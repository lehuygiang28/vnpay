# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.1.1] - 2024-05-02

-   Update docs, fix typos in examples

## [1.1.0] - 2024-03-21

### Breaking Change

-   Rename `api_Host` to `vnpayHost` in `VnPay` constructor
-   Methods `buildPaymentUrl`, `verifyReturnUrl` and `verifyIpnCall` no longer return promise
-   Remove `verifyIpnUrl` method

### Updated

-   Add `paymentEndpoint` to `VnPay` constructor for custom payment endpoint when build payment url
-   Update examples
-   Update test cases

### Bugfix

-   Fix can not set `vnp_CreateDate` in `buildPaymentUrl` method

## [0.9.6] - 2024-03-15

### Bugfix

-   QueryDr: Remove `undefined` in string to checksum response

## [0.9.5] - 2024-03-15

### Updated

-   Type of `vnp_OrderType` can be `string`

## [0.9.0] - 2024-03-10

### Updated

-   Update to user can pass `hashAlgorithm` to `VnPay` constructor

## [0.8.0] - 2024-03-09

### Added

-   Add `getBankList`
-   Add `refund` method

## [0.7.0] - 2024-03-07

### Changed

-   Remove zod, use type of typescript instead

### Added

-   Add `isVerified` to check is pass in verify signed data

## [0.6.0] - 2024-03-04

### Added

-   Add `verifyIpnCall` method to verify ipn call from VNPay
-   Add `IpnResponse` to support `verifyIpnCall` method

### Changed

-   Deprecate `verifyIpnUrl` method due to not auto calculate amount to normalize data
-   Update README, docs, examples

## [0.5.4] - 2024-03-03

### Added

-   Add example using express, run-able

## [0.5.3] -2024-03-03

### Added

-   Use github actions to publish package to npm

### Changed

-   Change the default language of README to Vietnamese

## [0.5.2] - 2023-12-11

### Added

-   Feature `QueryDr`

### Changed

-   Switched from `axios` to `fetch`
-   Switched from `class-validator` to `zod`

## [0.1.0] - Unreleased

### Changed

-   Updated README

## [0.0.1] - Unreleased

### Added

-   Initial release
