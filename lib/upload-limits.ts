/** Per-file max size. Kept under Vercel's ~4.5MB serverless request body limit (with multipart overhead). */
export const MAX_IMAGE_UPLOAD_BYTES = 4 * 1024 * 1024;

export const MAX_IMAGE_UPLOAD_MB = MAX_IMAGE_UPLOAD_BYTES / 1024 / 1024;
