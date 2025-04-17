import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";

// Define the image types you are handling
type ImageType = "blogHead";

// Props for the dropdown uploader component
interface ImageDropdownUploadProps {
  onImageUpload: (imageType: ImageType, uploaded: string | string[]) => void;
}

// Upload function that sends a File to your backend
async function uploadImage(file: File): Promise<string> {
  const body = new FormData();
  body.append("file", file);

  const res = await fetch(
    "https://my-app.mrityunjay-jha2005.workers.dev/api/v1/image/upload",
    {
      method: "POST",
      body,
    }
  );
  const data = await res.json();
  if (res.ok && data.url) {
    return data.url;
  } else {
    throw new Error("Image upload failed");
  }
}

export function ImageDropdownUpload({ onImageUpload }: ImageDropdownUploadProps) {
  const [selectedType, setSelectedType] = useState<ImageType | "">("");

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      if (!selectedType) return;
      try {
        // Since only blogHead is available, only one file is accepted
        const url = await uploadImage(acceptedFiles[0]);
        onImageUpload(selectedType, url);
      } catch (error) {
        alert("Image upload failed");
      }
    },
    [selectedType, onImageUpload]
  );

  // Always limit to one file, as there's only one image type
  const { getRootProps, getInputProps } = useDropzone({ onDrop, maxFiles: 1 });

  return (
    <div className="space-y-4">
      <select
        value={selectedType}
        onChange={(e) => setSelectedType(e.target.value as ImageType)}
        className="p-2 border border-gray-300 rounded"
      >
        <option value="">Select Image Type</option>
        <option value="blogHead">Blog Head</option>
      </select>

      {selectedType && (
        <div
          {...getRootProps()}
          className="border-2 border-dashed p-4 rounded-xl text-center cursor-pointer"
        >
          <input {...getInputProps()} />
          <p>Drag &amp; drop an image here, or click to select</p>
        </div>
      )}
    </div>
  );
}
