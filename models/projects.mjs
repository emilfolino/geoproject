import database from '../db/database.mjs';

const projects = {
    getAll: async function getAll() {
        let db = await database.openDb();

        try {
            const allProjects = await db.all(`SELECT * FROM projects`);

            return allProjects;
        } catch(error) {
            return {
                errors: {
                    status: error.status,
                    message: error.message,
                }
            };
        } finally {
            await db.close();
        }
    },

    create: async function create(body) {
        let db = await database.openDb();

        try {

            const result = await db.run(
                  'INSERT INTO projects (name, description, responsible) VALUES (?, ?, ?)',
                  body.name,
                  body.description,
                  body.responsible,
            );

            return result;
        } catch(error) {
            return {
                errors: {
                    status: error.status,
                    message: error.message,
                }
            };
        } finally {
            await db.close();
        }
    }
};

export default projects;
