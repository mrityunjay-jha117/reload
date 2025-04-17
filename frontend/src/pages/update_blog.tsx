import { useState, useCallback, useEffect } from "react";
import {
  updateBlogSchema,
  UpdateBlogInput,
} from "@mrityunjay__jha117/reload_common";
import { useNavigate, useParams } from "react-router-dom";

export default function BlogUpdate() {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const [formData, setFormData] = useState<UpdateBlogInput>({
    title: "",
    description1: "",
    description2: "",
    city: "",
    country: "",
  });
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Fetch existing blog data
  useEffect(() => {
    if (!id) return;
    const token = localStorage.getItem("jwt");
    const headers = {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    };

    setLoading(true);
    fetch(`https://my-app.mrityunjay-jha2005.workers.dev/api/v1/blog/${id}`, {
      method: "GET",
      headers,
    })
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to fetch blog: ${res.statusText}`);
        }
        return res.json();
      })
      .then((data) => {
        const blog = data.blog || data;
        setFormData({
          title: blog.title || "",
          description1: blog.description1 || "",
          description2: blog.description2 || "",
          city: blog.location?.city || "",
          country: blog.location?.country || "",
        });
      })
      .catch((err) => {
        console.error("Error fetching blog data:", err);
        setErrorMessage("Error fetching blog data.");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

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

  const handleSubmit = useCallback(
    async (e: React.FormEvent<HTMLFormElement>) => {
      e.preventDefault();

      const token = localStorage.getItem("jwt");
      const headers = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      };

      const cleanedData: UpdateBlogInput = {
        title: formData.title?.trim() || undefined,
        description1: formData.description1?.trim() || undefined,
        description2: formData.description2?.trim() || undefined,
        city: formData.city?.trim() || undefined,
        country: formData.country?.trim() || undefined,
      };

      const parsed = updateBlogSchema.safeParse(cleanedData);
      if (!parsed.success) {
        console.error("Validation error:", parsed.error.errors);
        setErrorMessage("Wrong inputs entered.");
        return;
      }
      setErrorMessage(null);
      setIsSubmitting(true);

      try {
        const res = await fetch(
          `https://my-app.mrityunjay-jha2005.workers.dev/api/v1/blog/${id}`,
          {
            method: "PUT",
            headers,
            body: JSON.stringify(parsed.data),
          }
        );

        if (res.ok) {
          alert("Blog updated successfully!");
          navigate("/user");
        } else {
          const errorData = await res.json();
          alert(
            `Failed to update blog. Error: ${
              errorData.message || "Unknown error"
            }`
          );
        }
      } catch (err) {
        console.error("Error updating blog:", err);
        alert("Error updating blog.");
      } finally {
        setIsSubmitting(false);
      }
    },
    [formData, id, navigate]
  );

  if (loading) {
    return (
      <div className="w-full h-[80vh] flex items-center justify-center text-xl">
        <span className="animate-spin border-4 border-red-500 border-t-transparent rounded-full w-12 h-12"></span>
      </div>
    );
  }

  return (
    <div className="p-4 max-w-3xl mx-auto text-lg">
      <div className="p-4 max-w-3xl mx-auto text-lg">
        <div className="mx-auto w-full h-[60px] text-xl lg:text-3xl border-6 border-red-500 rounded-full overflow-hidden bg-red-500 text-white tracking-wide group transition-all duration-500 mb-2 relative flex items-center justify-center">
          <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
          <span className="relative group-hover:text-red-500 transition-colors duration-500">
            EDIT YOUR BLOG
          </span>
        </div>
      </div>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-100 text-red-600 rounded-lg">
          {errorMessage}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow-xl"
      >
        <input
          name="title"
          value={formData.title}
          onChange={handleChange}
          placeholder="Title"
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
        <textarea
          name="description1"
          value={formData.description1}
          onChange={handleChange}
          placeholder="Description 1"
          rows={4}
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
        <textarea
          name="description2"
          value={formData.description2}
          onChange={handleChange}
          placeholder="Description 2"
          rows={4}
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
        <input
          name="city"
          value={formData.city}
          onChange={handleChange}
          placeholder="City"
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
        <input
          name="country"
          value={formData.country}
          onChange={handleChange}
          placeholder="Country"
          className="p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
        />
        <button
          type="submit"
          disabled={isSubmitting}
          className="relative mx-auto w-[300px] lg:w-[400px] lg:h-[60px] h-[60px] text-xl lg:text-3xl border-6 border-red-500 rounded-full overflow-hidden bg-red-500 text-white tracking-wide group transition-all duration-500 mb-2"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center space-x-2">
              <span className="w-5 h-5 border-4 border-white border-t-transparent rounded-full animate-spin"></span>
              <span>UPDATING...</span>
            </span>
          ) : (
            <>
              <span className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></span>
              <span className="relative group-hover:text-red-500 transition-colors duration-500">
                UPDATE
              </span>
            </>
          )}
        </button>
      </form>
    </div>
  );
}
