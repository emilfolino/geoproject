CREATE TABLE IF NOT EXISTS projects (
    name TEXT,
    description TEXT,
    responsible TEXT
);

CREATE TABLE IF NOT EXISTS images (
    url TEXT,
    latitude REAL,
    longitude REAL,
    project_id INTEGER NOT NULL,
    FOREIGN KEY(project_id) REFERENCES projects(ROWID)
);
