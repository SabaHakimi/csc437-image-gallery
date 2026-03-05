import { useState } from "react";
import { useParams } from "react-router";
import { fetchById } from "./ImageFetcher.js";

export function ImageDetails() {
    const { id } = useParams();
    const [image, _setImage] = useState(() => fetchById(id));
    if (!image) {
        return <h2>Image not found</h2>;
    }

    return (
        <>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </>
    )
}
