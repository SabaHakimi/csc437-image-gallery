import express from "express";
import { ObjectId } from "mongodb";
import { ImageProvider } from "../ImageProvider.js";

const MAX_NAME_LENGTH = 100;

function waitDuration(numMs) {
    return new Promise(resolve => setTimeout(resolve, numMs));
}

export function registerImageRoutes(app, imageProvider) {
    app.get("/api/images", async (req, res) => {
        await waitDuration(1000);
        const images = await imageProvider.getAllImages();
        res.json(images);
    });

    app.get("/api/images/:id", async (req, res) => {
        const image = await imageProvider.getOneImage(req.params.id);
        if (!image) {
            res.status(404).send({
                error: "Not Found",
                message: "No image with that ID"
            });
            return;
        }
        res.json(image);
    });

    app.patch("/api/images/:id", async (req, res) => {
        const { id } = req.params;
        const { name } = req.body || {};

        if (!name || typeof name !== "string") {
            res.status(400).send({
                error: "Bad Request",
                message: "Missing or invalid 'name' field in request body"
            });
            return;
        }

        if (name.length > MAX_NAME_LENGTH) {
            res.status(413).send({
                error: "Content Too Large",
                message: `Image name exceeds ${MAX_NAME_LENGTH} characters`
            });
            return;
        }

        if (!ObjectId.isValid(id)) {
            res.status(404).send({
                error: "Not Found",
                message: "Image does not exist"
            });
            return;
        }

        const matchedCount = await imageProvider.updateImageName(id, name);
        if (matchedCount === 0) {
            res.status(404).send({
                error: "Not Found",
                message: "Image does not exist"
            });
            return;
        }

        res.status(204).send();
    });
}