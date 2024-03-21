$(> db/projects.sqlite)
cat db/migrate.sql | sqlite3 db/projects.sqlite
