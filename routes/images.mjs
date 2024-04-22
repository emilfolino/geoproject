import express from 'express';
const router = express.Router();

import imagesModel from "../models/images.mjs";
import authModel from "../models/auth.mjs";

router.get("/:project_id", async (req, res) => {
    const allImages = await imagesModel.projectImages(req.params.project_id);

    if (allImages.hasOwnProperty("errors")) {
        const status = allImages.errors.status;

        return res.status(status || 500).json(allImages);
    }

    return res.json({
        data: allImages
    });
});

router.post("/",
    // (req, res, next) => authModel.checkToken(req, res, next),
    async (req, res) => {
        const result = await imagesModel.addImage(req.body);

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
