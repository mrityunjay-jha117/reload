import { useState, useCallback } from "react";
import {
  createBlogSchema,
  CreateBlogInput,
} from "@mrityunjay__jha117/reload_common";
import { useNavigate } from "react-router-dom";
import { useDropzone } from "react-dropzone";

export default function Blog_creation() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<CreateBlogInput>({
    blogHead: "",
    title: "",
    description1: "",
    description2: "",
    images: [],
    footerImage: "",
    city: "",
    country: "",
  });

  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
      const { name, value } = e.target;
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    },
    []
  );

  const uploadImage = async (file: File) => {
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
  };

  const onDropBlogHead = useCallback(async (acceptedFiles: File[]) => {
    try {
      const url = await uploadImage(acceptedFiles[0]);
      setFormData((prev) => ({
        ...prev,
        blogHead: url,
      }));
    } catch (err) {
      alert("Blog head image upload failed");
    }
  }, []);

  const onDropImages = useCallback(async (acceptedFiles: File[]) => {
    try {
      const urls = await Promise.all(acceptedFiles.map(uploadImage));
      setFormData((prev) => ({
        ...prev,
        images: [...prev.images, ...urls],
      }));
    } catch (err) {
      alert("Image upload failed");
    }
  }, []);

  const onDropFooter = useCallback(async (acceptedFiles: File[]) => {
    try {
      const url = await uploadImage(acceptedFiles[0]);
      setFormData((prev) => ({
        ...prev,
        footerImage: url,
      }));
    } catch (err) {
      alert("Footer image upload failed");
    }
  }, []);

  const { getRootProps: getBlogHeadRoot, getInputProps: getBlogHeadInput } =
    useDropzone({ onDrop: onDropBlogHead, maxFiles: 1 });
  const { getRootProps: getImagesRoot, getInputProps: getImagesInput } =
    useDropzone({ onDrop: onDropImages });
  const { getRootProps: getFooterRoot, getInputProps: getFooterInput } =
    useDropzone({ onDrop: onDropFooter, maxFiles: 1 });

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();
      setLoading(true);

      const token = localStorage.getItem("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const parsed = createBlogSchema.safeParse(formData);
      if (!parsed.success) {
        setErrorMessage("Wrong inputs entered.");
        setLoading(false);
        return;
      }

      setErrorMessage(null);

      try {
        const res = await fetch(
          "https://my-app.mrityunjay-jha2005.workers.dev/api/v1/blog",
          {
            method: "POST",
            headers,
            body: JSON.stringify(parsed.data),
          }
        );

        if (res.ok) {
          alert("Blog created!");
          navigate("/user");
        } else {
          alert("Failed to create blog.");
        }
      } catch (err) {
        console.error(err);
        alert("Error submitting blog.");
      } finally {
        setLoading(false);
      }
    },
    [formData, navigate]
  );

  return (
    <div className="p-4 max-w-3xl mx-auto text-lg">
      <div className="p-4 max-w-3xl mx-auto text-lg">
        <div className="mx-auto w-full h-[60px] text-xl lg:text-3xl border-6 border-red-500 rounded-full overflow-hidden bg-red-500 text-white tracking-wide group transition-all duration-500 mb-2 relative flex items-center justify-center">
          <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
          <span className="relative group-hover:text-red-500 transition-colors duration-500">
            WRITE YOUR EXPERIENCE
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
          {errorMessage}
        </div>
      )}

      {loading && (
        <div className="flex justify-center items-center my-4">
          <div className="w-12 h-12 border-4 border-dashed border-red-500 rounded-full animate-spin"></div>
          <span className="ml-4 text-red-500 text-lg font-semibold">
            Creating Blog...
          </span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-xl"
      >
        <div
          className="border-2 border-dashed border-purple-500 p-4 rounded-xl text-center"
          {...getBlogHeadRoot()}
        >
          <input {...getBlogHeadInput()} />
          <p>Upload blog head image here</p>
          {formData.blogHead && (
            <img
              src={formData.blogHead}
              className="mt-2 w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>

        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="p-3 border border-gray-300 rounded-xl"
        />
        <textarea
          name="description1"
          value={formData.description1}
          onChange={handleChange}
          placeholder="Description 1"
          rows={4}
          className="p-3 border border-gray-300 rounded-xl"
        />
        <textarea
          name="description2"
          value={formData.description2}
          onChange={handleChange}
          placeholder="Description 2"
          rows={4}
          className="p-3 border border-gray-300 rounded-xl"
        />

        <div
          className="border-2 border-dashed border-blue-400 p-4 rounded-xl text-center"
          {...getImagesRoot()}
        >
          <input {...getImagesInput()} />
          <p>Drag & drop images here, or click to select</p>
          <div className="flex flex-wrap gap-2 mt-2">
            {formData.images.map((url, i) => (
              <img
                key={i}
                src={url}
                className="w-24 h-24 object-cover rounded-lg"
              />
            ))}
          </div>
        </div>

        <div
          className="border-2 border-dashed border-green-400 p-4 rounded-xl text-center"
          {...getFooterRoot()}
        >
          <input {...getFooterInput()} />
          <p>Drag & drop footer image here</p>
          {formData.footerImage && (
            <img
              src={formData.footerImage}
              className="mt-2 w-32 h-32 object-cover rounded-lg"
            />
          )}
        </div>

        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="p-3 border border-gray-300 rounded-xl"
        />
        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="p-3 border border-gray-300 rounded-xl"
        />

        <button
          className="mx-auto w-[300px] lg:w-[400px] lg:h-[60px] h-[60px] text-xl lg:text-3xl border-6 border-red-500 rounded-full overflow-hidden bg-red-500 text-white tracking-wide group transition-all duration-500 mb-2 relative disabled:opacity-50 disabled:cursor-not-allowed"
          type="submit"
          disabled={loading}
        >
          <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
          <span className="relative group-hover:text-red-500 transition-colors duration-500">
            CREATE
          </span>
        </button>
      </form>
    </div>
  );
}
