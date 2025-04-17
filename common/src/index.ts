import { z } from "zod";

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  image: z.string().url(),
  about: z.string().optional(),
});

export const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const createBlogSchema = z.object({
  blogHead: z.string().min(1),
  title: z.string().min(1),
  description1: z.string().min(1),
  description2: z.string().optional(),
  images: z.array(z.string().url()),
  likes: z.number().optional(),
  footerImage: z.string().url().optional(),
  city: z.string().min(1),
  country: z.string().min(1),
});

export const updateBlogSchema = z.object({
  blogHead: z.string().optional(),
  title: z.string().optional(),
  description1: z.string().optional(),
  description2: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  likes: z.number().optional(),
  footerImage: z.string().url().optional(),
  city: z.string().optional(),
  country: z.string().optional(),
});

export const locationQuerySchema = z.object({
  city: z.string().optional(),
  country: z.string().optional(),
});

export type CreateBlogInput = z.infer<typeof createBlogSchema>;
export type UpdateBlogInput = z.infer<typeof updateBlogSchema>;
export type LocationQueryInput = z.infer<typeof locationQuerySchema>;
export type SignupInput = z.infer<typeof signupSchema>;
export type SigninInput = z.infer<typeof signinSchema>;
