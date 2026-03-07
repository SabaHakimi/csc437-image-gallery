import { useState, useEffect } from "react";
import { useParams } from "react-router";

export function ImageDetails() {
    const { id } = useParams();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchImage() {
            try {
                const response = await fetch("/api/images");
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                const found = data.find(img => img.id === id);
                setImage(found || null);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }
        fetchImage();
    }, [id]);

    if (loading) {
        return <p>Loading...</p>;
    }

    if (error) {
        return <p>Error: {error}</p>;
    }

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
