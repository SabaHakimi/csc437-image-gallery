import { useState, useEffect } from "react";
import { useParams } from "react-router";
import { ImageNameEditor } from "./ImageNameEditor.tsx";

export function ImageDetails({ authToken }) {
    const { id } = useParams();
    const [image, setImage] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchImage() {
            try {
                const response = await fetch(`/api/images/${id}`, {
                    headers: {
                        "Authorization": `Bearer ${authToken}`
                    }
                });
                if (!response.ok) {
                    throw new Error(`HTTP ${response.status} ${response.statusText}`);
                }
                const data = await response.json();
                setImage(data);
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

    function handleNameChanged(newName) {
        setImage({ ...image, name: newName });
    }

    return (
        <>
            <h2>{image.name}</h2>
            <p>By {image.author.username}</p>
            <ImageNameEditor
                imageId={image._id}
                initialValue={image.name}
                onNameChanged={handleNameChanged}
                authToken={authToken}
            />
            <img className="ImageDetails-img" src={image.src} alt={image.name} />
        </>
    )
}
