# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

## [0.2.1] - 2026-01-08

### Added

- New helper functions: `isJsonArrayValue`, `isJsonStringValue`, `isJsonObjectValue`
  - Individual type checks for JSON format detection
  - `isJsonEncodedValue` now uses these helpers internally

## [0.2.0] - 2026-01-08

### Added

- `jsonFallback` option for backward compatibility with TanStack Router's default JSON format URLs
  - Parses JSON arrays: `["1","2"]` → `['1', '2']`
  - Parses JSON strings: `"123"` → `'123'`
  - Parses JSON objects: `{"name":"john"}` → `{ name: 'john' }`
- New helper functions: `tryParseJsonValue`, `isJsonEncodedValue`

## [0.1.0] - 2026-01-02

### Added

- Initial release
- `parseSearchParams` - Parse URLSearchParams format string to object
- `stringifySearchParams` - Serialize object to URLSearchParams format string
- `createSerializer` - Create custom serializer with feature options
- Zod helpers (`commaSeparatedArray`, `joinCommaArray`)
- Support for comma-separated arrays
- Support for boolean string conversion
- Support for Rails-style nested objects
- Support for PHP-style arrays
- Support for duplicate key arrays
- Support for numeric index arrays
