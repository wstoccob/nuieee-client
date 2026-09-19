import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import type { PendingPhoto } from "@/hooks/usePhotoUploads";

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

  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === "dragenter" || e.type === "dragover");
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    onAdd(e.dataTransfer.files);
  };

  return (
    <div>
      <label className="block text-white text-xl font-inter font-semibold mb-2">
        Photos ({photos.length}/{maxPhotos})
      </label>

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`border-2 border-dashed rounded-lg p-8 mb-6 text-center transition-all cursor-pointer ${
          dragActive
            ? "border-ieee-blue bg-ieee-blue/10"
            : "border-[#555] bg-black/30 hover:border-ieee-blue"
        }`}
      >
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
        <div className="space-y-2">
          <p className="text-white text-lg font-semibold">
            Drag &amp; drop photos here
          </p>
          <p className="text-white/60 text-sm">or click to browse</p>
        </div>
      </div>

      {photos.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {photos.map((photo) => (
            <div
              key={photo.id}
              className="border-2 border-[#555] rounded-md overflow-hidden bg-black"
            >
              <img
                src={photo.preview}
                alt={photo.altText || photo.file.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4 space-y-3">
                <input
                  type="text"
                  value={photo.altText}
                  onChange={(e) => onAltTextChange(photo.id, e.target.value)}
                  placeholder="Alt text (for accessibility)"
                  className="w-full rounded-md border border-[#555] hover:border-ieee-blue bg-black text-white px-3 py-2 text-sm placeholder-white/40 transition-colors"
                />
                <Button
                  type="button"
                  onClick={() => onRemove(photo.id)}
                  disabled={disabled}
                  className="w-full bg-red-600 hover:bg-red-700 text-white text-sm uppercase"
                >
                  Remove
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
