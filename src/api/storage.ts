import client from "./client";

interface UploadTarget {
  uploadUrl: string;
  objectKey: string;
  publicUrl: string;
}

export const storageApi = {
  async createUploadTarget(filename: string): Promise<UploadTarget> {
    const { data } = await client.post<UploadTarget>("/storage/upload-url", null, {
      params: { filename },
    });
    return data;
  },

  async uploadToTarget(uploadUrl: string, file: File): Promise<void> {
    const response = await fetch(uploadUrl, {
      method: "PUT",
      body: file,
      headers: { "Content-Type": file.type },
    });
    if (!response.ok) {
      throw new Error(`Upload failed: ${response.statusText}`);
    }
  },

  async remove(objectKey: string): Promise<void> {
    await client.delete("/storage/objects", { params: { key: objectKey } });
  },
};
