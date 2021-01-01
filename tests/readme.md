# Integration Tests

The integration tests depend on an Airtable configuration that can not be automatically generated. In order to successfully run these tests, a `.env` file must be created (using the `sample.env` template) with a valid Airtable API key, base ID, and table ID.  The table used for the integration tests must meet the following criteria:
- It must have exactly 2 columns
  - `ID`: type `Text`
  - `Col1`: type `Text`
- It must have >= 6 existing rows