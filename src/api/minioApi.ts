import axiosInstance from "../services/axiosInstance";

interface UploadUrlResponse {
  uploadUrl: string;
  fileName: string;
}

// MinIO API wrapper for file upload
export const minioApi = {
  async getUploadUrl(
    fileName: string,
    expirationSeconds: number = 3600
  ): Promise<UploadUrlResponse> {
    const res = await axiosInstance.post(
      "/minio/upload-url",
      {},
      {
        params: {
          fileName,
          expirationSeconds,
        },
      }
    );
    return {
      uploadUrl: res.data.uploadUrl as string,
      fileName: res.data.fileName as string,
    };
  },

  async deleteFile(fileName: string): Promise<void> {
    await axiosInstance.delete(`/minio/delete/${fileName}`);
  },

  async uploadFile(presignedUrl: string, file: File): Promise<void> {
    // Use fetch for direct upload to pre-signed URL (not going through axiosInstance)
    const response = await fetch(presignedUrl, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });

    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  },

  /**
   * Constructs the permanent URL for an uploaded file
   * Format: {MINIO_HOST}/{bucket}/{fileName}
   */
  constructPermanentUrl(fileName: string, bucketName: string = "event-photos"): string {
    const minioHost = import.meta.env.VITE_MINIO_HOST || "http://localhost:9000";
    return `${minioHost}/${bucketName}/${fileName}`;
  },
};

export default minioApi;
