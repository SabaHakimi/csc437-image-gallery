import React, { useId, useState, useActionState, useEffect } from "react";
import { useNavigate } from "react-router";

function readAsDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = (err) => reject(err);
    });
}

export function UploadPage({ authToken }) {
    const fileInputId = useId();
    const [previewUrl, setPreviewUrl] = useState(null);
    const navigate = useNavigate();

    const uploadImage = async (prevState, formData) => {
        try {
            const response = await fetch("/api/images", {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${authToken}`
                },
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                setPreviewUrl(null);
                return { error: data.message || "Upload failed" };
            }

            return { success: true, id: data.id };
        } catch (err) {
            setPreviewUrl(null);
            return { error: "An unexpected error occurred" };
        }
    };

    const [state, formAction, isPending] = useActionState(uploadImage, null);

    useEffect(() => {
        if (state?.success && state?.id) {
            navigate(`/images/${state.id}`);
        }
    }, [state, navigate]);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const dataUrl = await readAsDataURL(file);
                setPreviewUrl(dataUrl);
            } catch (err) {
                console.error("Error reading file:", err);
                setPreviewUrl(null);
            }
        } else {
            setPreviewUrl(null);
        }
    };

    return (
        <>
            <h2>Upload</h2>
            <form action={formAction}>
                <div>
                    <label htmlFor={fileInputId}>Choose image to upload: </label>
                    <input
                        id={fileInputId}
                        name="image"
                        type="file"
                        accept=".png,.jpg,.jpeg"
                        required
                        onChange={handleFileChange}
                        disabled={isPending}
                    />
                </div>
                <div>
                    <label>
                        <span>Image title: </span>
                        <input name="name" required disabled={isPending} />
                    </label>
                </div>

                <div>
                    {previewUrl && (
                        <img
                            style={{ width: "20em", maxWidth: "100%" }}
                            src={previewUrl}
                            alt="Preview"
                        />
                    )}
                </div>

                <input
                    type="submit"
                    value={isPending ? "Uploading..." : "Confirm upload"}
                    disabled={isPending}
                />

                {state?.error && <p style={{ color: "red" }}>{state.error}</p>}
                {state?.success && <p style={{ color: "green" }}>Upload successful!</p>}
            </form>
        </>
    );
}
