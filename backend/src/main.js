import express from "express";
import { getEnvVar } from "./getEnvVar.js";
import { SHARED_TEST } from "./shared/example.js";
import { VALID_ROUTES } from "./shared/ValidRoutes.js";

const PORT = Number.parseInt(getEnvVar("PORT", false), 10) || 3000;
const STATIC_DIR = getEnvVar("STATIC_DIR") || "public";

const IMAGES = [
    {
        id: "0",
        src: "https://upload.wikimedia.org/wikipedia/commons/3/33/Blue_merle_koolie_short_coat_heading_sheep.jpg",
        name: "Blue merle herding sheep",
        author: {
            id: "0",
            username: "chunkylover23"
        }
    },
    {
        id: "1",
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/7/7a/Huskiesatrest.jpg/2560px-Huskiesatrest.jpg",
        name: "Huskies",
        author: {
            id: "0",
            username: "chunkylover23"
        }
    },
    {
        id: "2",
        src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/Taka_Shiba.jpg",
        name: "Shiba",
        author: {
            id: "0",
            username: "chunkylover23"
        }
    },
    {
        id: "3",
        src: "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b6/Felis_catus-cat_on_snow.jpg/2560px-Felis_catus-cat_on_snow.jpg",
        name: "Tabby cat",
        author: {
            id: "1",
            username: "silas_meow"
        },
    },
    {
        id: "4",
        src: "https://upload.wikimedia.org/wikipedia/commons/8/84/Male_and_female_chicken_sitting_together.jpg",
        name: "Chickens",
        author: {
            id: "2",
            username: "fluffycoat"
        }
    }
];

function waitDuration(numMs) {
    return new Promise(resolve => setTimeout(resolve, numMs));
}

const app = express();

app.use(express.static(STATIC_DIR));

app.get("/api/hello", (req, res) => {
    res.send("Hello, World " + SHARED_TEST);
});

app.get("/api/images", async (req, res) => {
    await waitDuration(1000);
    res.json(IMAGES);
});

app.get(Object.values(VALID_ROUTES), (req, res) => {
    res.sendFile("index.html", { root: STATIC_DIR });
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}.  CTRL+C to stop.`);
});
