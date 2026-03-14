import express from "express";
import { ObjectId } from "mongodb";
import { ImageProvider } from "../ImageProvider.js";
import { imageMiddlewareFactory, handleImageFileErrors } from "../imageUploadMiddleware.js";

const MAX_NAME_LENGTH = 100;

function waitDuration(numMs) {
    return new Promise(resolve => setTimeout(resolve, numMs));
}

export function registerImageRoutes(app, imageProvider) {
    app.post(
        "/api/images",
        imageMiddlewareFactory.single("image"),
        handleImageFileErrors,
        async (req, res) => {
            const { name } = req.body || {};
            const file = req.file;

            if (!name || !file) {
                res.status(400).send({
                    error: "Bad Request",
                    message: "Missing 'name' or 'image' file"
                });
                return;
            }

            const authorId = req.userInfo?.username;
            if (!authorId) {
                res.status(401).send({
                    error: "Unauthorized",
                    message: "User not authenticated"
                });
                return;
            }

            const src = `/uploads/${file.filename}`;
            const imageId = await imageProvider.createImage(src, name, authorId);

            res.status(201).json({ id: imageId });
        }
    );

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

        const username = req.userInfo?.username;
        const matchedCount = await imageProvider.updateImageName(id, name, username);
        if (matchedCount === 0) {
            const image = await imageProvider.getOneImage(id);
            if (!image) {
                res.status(404).send({
                    error: "Not Found",
                    message: "Image does not exist"
                });
            } else {
                res.status(403).send({
                    error: "Forbidden",
                    message: "This user does not own this image"
                });
            }
            return;
        }

        res.status(204).send();
    });
}