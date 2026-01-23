// Cloudinary SDK configuration and utilities
import { Cloudinary } from "@cloudinary/url-gen";

// Create and configure Cloudinary instance
export const cld = new Cloudinary({
    cloud: {
        cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME
    }
});

// Upload function using Cloudinary's unsigned upload
export async function uploadToCloudinary(file: File): Promise<string> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'study_notes');
    formData.append('folder', 'study_notes');

    try {
        const response = await fetch(
            `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
            {
                method: 'POST',
                body: formData,
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error?.message || 'Upload failed');
        }

        const data = await response.json();
        return data.secure_url;
    } catch (error) {
        console.error('Cloudinary upload error:', error);
        throw error;
    }
}
