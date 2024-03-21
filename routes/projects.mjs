import express from 'express';
const router = express.Router();

import projectsModel from "../models/projects.mjs";

router.get("/", async (req, res) => {
    const allProjects = await projectsModel.getAll();

    if (allProjects.hasOwnProperty("errors")) {
        const status = allProjects.errors.status;

        return res.status(status || 500).json(allProjects);
    }

    return res.json({
        data: allProjects
    });
});

export default router;
