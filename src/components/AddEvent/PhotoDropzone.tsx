import { useRef, useState } from "react";
import type { PendingPhoto } from "@/hooks/usePhotoUploads";
import { cn } from "@/lib/utils";
import { Button } from "@/components/hackathon/ui/Button";
import { Input } from "@/components/hackathon/ui/form";
import { PlusIcon, TrashIcon } from "@/components/hackathon/ui/icons";
import { focusRing } from "@/components/hackathon/ui/styles";

interface Props {
  photos: PendingPhoto[];
  maxPhotos: number;
  disabled?: boolean;
  onAdd: (files: FileList | null) => void;
  onRemove: (id: string) => void;
  onAltTextChange: (id: string, text: string) => void;
}

export const PhotoDropzone = ({
  photos,
  maxPhotos,
  disabled,
  onAdd,
  onRemove,
  onAltTextChange,
}: Props) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    onAdd(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-baseline justify-between gap-2 text-sm font-medium text-zinc-200">
        <span>Photos</span>
        <span className="text-xs font-normal text-zinc-500 tabular-nums">
          {photos.length} of {maxPhotos}
        </span>
      </div>

      <input
        ref={inputRef}
        type="file"
        multiple
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          onAdd(e.target.files);
          e.target.value = "";
        }}
      />
      <button
        type="button"
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "flex w-full cursor-pointer flex-col items-center rounded-2xl border border-dashed px-6 py-8 text-center transition-colors",
          dragActive ? "border-hk-accent-fg bg-hk-accent/10" : "border-white/15 hover:border-hk-accent-fg/60",
          focusRing
        )}
      >
        <span className="grid size-11 place-items-center rounded-full bg-white/[0.05] text-zinc-400">
          <PlusIcon className="size-5" />
        </span>
        <span className="mt-3 text-base font-semibold text-white">Drag and drop photos here</span>
        <span className="mt-1 text-sm text-zinc-400">or click to browse</span>
      </button>

      {photos.length > 0 && (
        <ul className="grid gap-4 sm:grid-cols-2">
          {photos.map((photo) => (
            <li key={photo.id} className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
              <img
                src={photo.preview}
                alt={photo.altText || photo.file.name}
                className="aspect-[16/10] w-full object-cover"
              />
              <div className="space-y-2 p-3">
                <Input
                  type="text"
                  value={photo.altText}
                  aria-label={`Alt text for ${photo.file.name}`}
                  placeholder="Alt text (for accessibility)"
                  onChange={(e) => onAltTextChange(photo.id, e.target.value)}
                />
                <Button
                  variant="dangerGhost"
                  size="sm"
                  className="w-full"
                  onClick={() => onRemove(photo.id)}
                  disabled={disabled}
                >
                  <TrashIcon />
                  Remove
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
