import { useCallback, useState } from "react";
import axios from "axios";
import { errorMessage } from "@/api/client";
import { postToStorage } from "@/lib/directUpload";
import { validateFile } from "@/lib/files";
import type { PostUploadTarget } from "@/dtos/hackathon";

export type UploadPhase = "idle" | "preparing" | "uploading" | "finishing" | "error";

interface UploadState {
  phase: UploadPhase;
  progress: number;
  fileName: string | null;
  error: string | null;
}

interface Options<T> {
  extensions: string[];
  maxBytes?: number;
  requestTarget: (file: File) => Promise<PostUploadTarget>;
  confirm: (target: PostUploadTarget, file: File) => Promise<T>;
  onSuccess?: (result: T) => void;
}

const IDLE: UploadState = { phase: "idle", progress: 0, fileName: null, error: null };

function uploadErrorMessage(error: unknown): string {
  const fallback = "The upload failed. Please try again.";
  if (axios.isAxiosError(error)) return errorMessage(error, fallback);
  return error instanceof Error ? error.message : fallback;
}

/**
 * Runs the presigned-upload flow: validate locally, ask the API for a target, send the
 * file straight to storage with progress, then confirm with the API. Resolves to whether
 * the upload went through; failures are reported through `error`, never thrown.
 */
export function useDirectUpload<T>(options: Options<T>) {
  const [state, setState] = useState<UploadState>(IDLE);
  const { extensions, maxBytes, requestTarget, confirm, onSuccess } = options;

  const upload = useCallback(
    async (file: File): Promise<boolean> => {
      const fail = (error: string) => {
        setState({ phase: "error", progress: 0, fileName: file.name, error });
        return false;
      };

      const invalid = validateFile(file, extensions, maxBytes);
      if (invalid) return fail(invalid);

      setState({ phase: "preparing", progress: 0, fileName: file.name, error: null });
      try {
        const target = await requestTarget(file);
        const tooLarge = validateFile(file, extensions, target.maxBytes);
        if (tooLarge) return fail(tooLarge);

        setState((s) => ({ ...s, phase: "uploading" }));
        await postToStorage(target, file, (progress) => setState((s) => ({ ...s, progress })));

        setState((s) => ({ ...s, phase: "finishing", progress: 1 }));
        const result = await confirm(target, file);
        setState(IDLE);
        onSuccess?.(result);
        return true;
      } catch (error) {
        return fail(uploadErrorMessage(error));
      }
    },
    [extensions, maxBytes, requestTarget, confirm, onSuccess]
  );

  const reset = useCallback(() => setState(IDLE), []);
  const busy = state.phase === "preparing" || state.phase === "uploading" || state.phase === "finishing";

  return { ...state, busy, upload, reset };
}
