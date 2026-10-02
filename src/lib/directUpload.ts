import type { PostUploadTarget } from "@/dtos/hackathon";

function storageFailureMessage(status: number): string {
  if (status === 400 || status === 403 || status === 413) {
    return "Storage rejected the file. It may be too large or of the wrong type.";
  }
  return "The upload failed. Please try again.";
}

/**
 * Sends a file straight to object storage with a presigned POST. XMLHttpRequest is used
 * instead of fetch because only it reports upload progress. The storage policy requires
 * the signed fields first and the file last, and no extra headers.
 */
export function postToStorage(
  target: PostUploadTarget,
  file: File,
  onProgress: (fraction: number) => void
): Promise<void> {
  const form = new FormData();
  Object.entries(target.fields).forEach(([key, value]) => form.append(key, value));
  form.append("file", file);

  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("POST", target.url);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable) onProgress(event.loaded / event.total);
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) resolve();
      else reject(new Error(storageFailureMessage(xhr.status)));
    };
    xhr.onerror = () => reject(new Error("The upload failed. Check your connection and try again."));
    xhr.send(form);
  });
}
