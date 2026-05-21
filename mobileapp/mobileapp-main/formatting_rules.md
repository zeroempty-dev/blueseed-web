# Formatting Rules

## Dates
All user-facing date strings should be displayed in the standard format:
`DD-MM-YYYY` (e.g., 12-06-2025).

When sending data to the backend or managing internal state, dates can remain in ISO 8601 string format (e.g., `YYYY-MM-DDTHH:mm:ss.sssZ` or `YYYY-MM-DD`). However, any UI layer component must render dates into the standard format to ensure consistency across the application.
