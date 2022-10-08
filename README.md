# InStock

## Requirements

    - Docker >=19.03
    - Enviroments variables

## Enviroment Variables

JWT_SECRET_KEY=""
DATABASE_URL=""
SENDGRID_API_KEY=_""
SYMETRIC_ENCRYPTION_KEY=""

## Database

The database container creates a directory that it uses as a volume to avoid losing the local data. This directory is located in `~/in-stock/db-data`.
If you remove this directory you will lose all your local database data.

### Migrations

To create a migration use the npm script `migration:create`. Example:

`migration:create "MigrationName"`

To apply created migrations use the npm script `migration:apply`.