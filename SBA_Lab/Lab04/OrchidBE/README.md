# Orchid Backend

The application connects to SQL Server at `localhost:1433` and uses the
`OrchidDB` database. The username defaults to `sa`; set `DB_PASSWORD` in the
environment before starting the application.

In PowerShell:

```powershell
$env:DB_PASSWORD = "<your SQL Server password>"
```

Do not commit database credentials.
