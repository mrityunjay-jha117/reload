import { Hono } from "hono";
import { Buffer } from "buffer";
import { createHash } from "crypto";

const imageRouter = new Hono<{
  Bindings: {
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
}>();

imageRouter.post("/upload", async (c) => {
  const env = c.env;

  const form = await c.req.formData();
  const fileField = form.get("file");

  if (!fileField || !(fileField instanceof File)) {
    return c.json({ error: "No valid file uploaded. Use `file` field." }, 400);
  }

  const arrayBuffer = await fileField.arrayBuffer();
  const base64 = Buffer.from(arrayBuffer).toString("base64");

  const folder = "my_uploads";
  const transformation = "q_auto,f_auto,w_1000"; // optimize image
  const timestamp = Math.floor(Date.now() / 1000);

  // ✅ Include all upload params in signature, sorted alphabetically
  const signatureBase = `folder=${folder}&timestamp=${timestamp}&transformation=${transformation}${env.CLOUDINARY_API_SECRET}`;
  const signature = createHash("sha1").update(signatureBase).digest("hex");

  const cloudForm = new FormData();
  cloudForm.append("file", `data:${fileField.type};base64,${base64}`);
  cloudForm.append("api_key", env.CLOUDINARY_API_KEY);
  cloudForm.append("timestamp", timestamp.toString());
  cloudForm.append("folder", folder);
  cloudForm.append("signature", signature);
  cloudForm.append("transformation", transformation);

  try {
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${env.CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: "POST",
        body: cloudForm,
      }
    );

    const data = (await res.json()) as { secure_url?: string; error?: any };

    if (!res.ok || !data.secure_url) {
      return c.json({ error: "Upload failed", details: data }, 500);
    }

    return c.json({
      url: data.secure_url,
    });
  } catch (err: any) {
    return c.json(
      {
        error: "Upload failed",
        details: err?.message || err,
      },
      500
    );
  }
});

export default imageRouter;
