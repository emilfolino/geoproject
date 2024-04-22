import database from '../db/database.mjs';

const images = {
    addImage: async function addImage(body) {
        let db = await database.openDb();

        try {

            const result = await db.run(
                  'INSERT INTO images (url, latitude, longitude, project_id) VALUES (?, ?, ?, ?)',
                  body.url,
                  body.latitude,
                  body.longitude,
                  body.project_id,
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
    },

    projectImages: async function projectImages(projectId) {
        let db = await database.openDb();

        try {
            const allProjects = await db.all(`SELECT *, ROWID as id FROM images WHERE project_id = ?`, projectId);

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
    }
};

export default images;
