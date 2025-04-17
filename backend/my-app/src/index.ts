// src/index.ts

import { Hono } from "hono";
import userRouter from "./routes/author";
import blogRouter from "./routes/blog";
import imageRouter from "./routes/image"; 
import { cors } from "hono/cors";

const app = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
    CLOUDINARY_CLOUD_NAME: string;
    CLOUDINARY_API_KEY: string;
    CLOUDINARY_API_SECRET: string;
  };
}>();

app.use(
  "/api/*",
  cors({
    origin: "*",
  })
);

app.route("/api/v1/user", userRouter);
app.route("/api/v1/blog", blogRouter);
app.route("/api/v1/image", imageRouter); // ✅ Attach image router

export default app;
