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
};

export default projects;
