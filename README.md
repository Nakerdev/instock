# InStock

## Requirements

- Docker >=19.03
- Sequilize command line installed globally (npm install -g sequelize-cli)

## Database

The database container creates a directory that it uses as a volume to avoid losing the local data. This directory is located in `~/in-stock/db-data`.
If you remove this directory you will lose all your local database data.