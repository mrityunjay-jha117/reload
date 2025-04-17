import { useState, useEffect } from "react";

interface CropperProps {
  src: string; // Image source
  heights: (number | string)[]; // Heights can be fractions (like "1/3") or fixed pixels
}

export default function ImageCropper({ src, heights }: CropperProps) {
  const [croppedBlobs, setCroppedBlobs] = useState<Blob[]>([]);

  useEffect(() => {
    const img = new Image();
    img.src = src;
    img.crossOrigin = "anonymous"; // Prevent CORS issues

    img.onload = () => {
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      let totalHeight = img.height;
      let computedHeights = heights.map((h) =>
        typeof h === "string" ? eval(h) * totalHeight : h
      );

      let startY = 0;
      const blobs: Blob[] = [];

      computedHeights.forEach(async (height, index) => {
        canvas.width = img.width;
        canvas.height = height;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, -startY, img.width, img.height);

        // Convert canvas to Blob
        canvas.toBlob((blob) => {
          if (blob) {
            blobs[index] = blob;
            setCroppedBlobs([...blobs]); // Update state
          }
        }, "image/png");

        startY += height;
      });
    };
  }, [src, heights]);

  return (
    <div className="flex flex-col gap-4">
      {croppedBlobs.map((blob, index) => (
        <div className="flex flex-row " key={index}>
          <img src={URL.createObjectURL(blob)} alt={`Cropped Part ${index + 1}`} />
          <a
            href={URL.createObjectURL(blob)}
            download={`cropped_part_${index + 1}.png`}
            className="bg-blue-500 text-white px-4 py-2 mt-2 inline-block rounded"
          >
            Download Part {index + 1}
          </a>
        </div>
      ))}
    </div>
  );
}
