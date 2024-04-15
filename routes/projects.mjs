import express from 'express';
const router = express.Router();

import projectsModel from "../models/projects.mjs";
import authModel from "../models/auth.mjs";

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

router.post("/",
    (req, res, next) => authModel.checkToken(req, res, next),
    async (req, res) => {
        const result = await projectsModel.create(req.body);

        if (result.hasOwnProperty("errors")) {
            const status = result.errors.status;

            return res.status(status || 500).json(result);
        }

        let returnObject = {
            id: result.lastID,
            ...req.body
        };

        return res.status(201).json({
            data: returnObject
        });
    });



export default router;
