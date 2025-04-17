import { PrismaClient } from "@prisma/client/edge";
import { withAccelerate } from "@prisma/extension-accelerate";
import { Hono } from "hono";
import { verify } from "hono/jwt";
import {
  createBlogSchema,
  updateBlogSchema,
  locationQuerySchema,
} from "@mrityunjay__jha117/reload_common";
/**
 * Create a new Hono router.
 * This router expects the following environment bindings:
 *  - DATABASE_URL: The URL for the PostgreSQL database.
 *  - JWT_SECRET: The secret string used to sign/verify JWT tokens.
 * It also has a route variable "authorId" that will be populated after JWT verification.
 */
export const blogRouter = new Hono<{
  Bindings: {
    DATABASE_URL: string;
    JWT_SECRET: string;
  };
  Variables: {
    authorId: string;
  };
}>();

// -----------------------------------------------------------------
// JWT Authorization Middleware
// -----------------------------------------------------------------
// This middleware is applied to all subsequent routes defined below.
// It does the following:
//   1. Extracts the "Authorization" header.
//   2. Removes the "Bearer " prefix if it exists.
//   3. Verifies the JWT token using the secret from the environment variables.
//   4. If verification is successful, it sets the "authorId" (from the token) into the context.
//   5. If any step fails, it returns a 403 error response.
blogRouter.use("/*", async (c, next) => {
  // Retrieve the Authorization header from the request.
  const authHeader = c.req.header("Authorization");
  if (!authHeader) {
    c.status(403);
    return c.json({ message: "Authorization header missing" });
  }

  // Extract the token by removing the "Bearer " prefix if present.
  const token = authHeader.startsWith("Bearer ")
    ? authHeader.slice(7)
    : authHeader;

  try {
    // Verify the JWT token using the secret from the environment variables.
    const author = await verify(token, c.env.JWT_SECRET);
    if (author && typeof author.id === "string") {
      // Set the authenticated author's id into context, making it available to subsequent handlers.
      c.set("authorId", author.id);
      return next();
    } else {
      c.status(403);
      return c.json({ message: "You are not logged in" });
    }
  } catch (err) {
    c.status(403);
    return c.json({ message: "Invalid token" });
  }
});

// -----------------------------------------------------------------
// Public Routes (with JWT Protection)
// -----------------------------------------------------------------
// All routes defined below require a valid JWT token.

// GET /bulk
// -----------------------------------------------------------------
// Returns all blog posts along with their associated author and location data.
blogRouter.get("/bulk", async (c) => {
  // Initialize a new PrismaClient instance with accelerated query extensions.
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Retrieve all blog posts from the database and include the related author and location data.
    const blogs = await prisma.blog.findMany({
      include: {
        author: true,
        location: true,
      },
    });
    return c.json({ blogs });
  } catch (error) {
    c.status(500);
    return c.json({ message: "Failed to fetch blogs", error: String(error) });
  }
});
blogRouter.get("/search/author", async (c) => {
  const name = c.req.query("name");

  if (!name) {
    return c.json({ message: "Missing 'name' query parameter" }, 400);
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.blog.findMany({
      where: {
        author: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
      },
      include: {
        author: true,
        location: true,
      },
    });

    return c.json({ blogs });
  } catch (error) {
    return c.json(
      { message: "Failed to search by author", error: String(error) },
      500
    );
  }
});

blogRouter.get("/search/title", async (c) => {
  const title = c.req.query("title"); // get ?title=something

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.blog.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
      },
      include: {
        author: true,
        location: true,
      },
    });

    return c.json({ blogs });
  } catch (error) {
    return c.json(
      { message: "Failed to search by title", error: String(error) },
      500
    );
  }
});

// GET /location
// -----------------------------------------------------------------
// Searches for blogs by location, based on query parameters "city" and/or "country".
// Example usage: /location?city=NewYork or /location?country=USA or both.
// Example usage: /search/location?city=York&country=us
blogRouter.get("/search/location", async (c) => {
  const { city, country } = c.req.query();

  // Validate the query parameters using Zod schema
  const parsedQuery = locationQuerySchema.safeParse({ city, country });
  if (!parsedQuery.success) {
    return c.json(
      { message: "Invalid query", errors: parsedQuery.error.errors },
      400
    );
  }

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    const blogs = await prisma.blog.findMany({
      where: {
        location: {
          ...(parsedQuery.data.city
            ? { city: { contains: parsedQuery.data.city, mode: "insensitive" } }
            : {}),
          ...(parsedQuery.data.country
            ? {
                country: {
                  contains: parsedQuery.data.country,
                  mode: "insensitive",
                },
              }
            : {}),
        },
      },
      include: {
        author: true,
        location: true,
      },
    });

    return c.json({ blogs });
  } catch (error) {
    c.status(500);
    return c.json({
      message: "Failed to search blogs by location",
      error: String(error),
    });
  }
});


// GET /stats
blogRouter.get("/stats", async (c) => {
  // Retrieve the authenticated author's id from the context.
  const authorId = c.get("authorId");
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  try {
    // Use Prisma’s aggregate function to sum up the likes and count the blogs.
    const stats = await prisma.blog.aggregate({
      where: { authorId },
      _sum: { likes: true },
      _count: { id: true },
    });

    const totalLikes = stats._sum.likes || 0;
    const blogCount = stats._count.id;

    return c.json({ totalLikes, blogCount });
  } catch (error) {
    c.status(500);
    return c.json({ message: "Error fetching stats", error: String(error) });
  }
});

// GET /:id
// -----------------------------------------------------------------
// Retrieves a specific blog post by its unique identifier.
// The blog post details, including associated location, are returned.
blogRouter.get("/:id", async (c) => {
  // Extract the blog post ID from the URL parameters.
  const { id } = c.req.param();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // Fetch the blog post and include its related location data.
  const blog = await prisma.blog.findUnique({
    where: { id },
    include: { location: true, author: true },
  });

  // If the blog post is not found, return a 404 error.
  if (!blog) {
    c.status(404);
    return c.json({ message: "Blog not found" });
  }

  // Optionally, enforce that only the owner can view the blog post.
  // Uncomment the following block if needed:
  // if (blog.authorId !== authorId) {
  //   c.status(403);
  //   return c.json({ message: "Access denied" });
  // }

  return c.json({ blog });
});

// PUT /:id
// -----------------------------------------------------------------
// Updates an existing blog post identified by its unique identifier.
// The request body may include any fields to be updated, including optional location fields.
// If new location fields (city and country) are provided, the location is upserted.
blogRouter.put("/:id", async (c) => {
  const { id } = c.req.param();
  const body = await c.req.json();

  // Validate the request body using Zod schema
  const parsedBody = updateBlogSchema.safeParse(body);
  if (!parsedBody.success) {
    return c.json(
      { message: "Invalid data", errors: parsedBody.error.errors },
      400
    );
  }

  const authorId = c.get("authorId");

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  const existingBlog = await prisma.blog.findUnique({
    where: { id },
  });
  if (!existingBlog) {
    c.status(404);
    return c.json({ message: "Blog not found" });
  }

  if (existingBlog.authorId !== authorId) {
    c.status(403);
    return c.json({ message: "Access denied" });
  }

  let locationId = existingBlog.locationId;
  if (parsedBody.data.city && parsedBody.data.country) {
    const location = await prisma.location.upsert({
      where: {
        city_country: {
          city: parsedBody.data.city,
          country: parsedBody.data.country,
        },
      },
      update: {},
      create: {
        city: parsedBody.data.city,
        country: parsedBody.data.country,
      },
    });
    locationId = location.id;
  }

  const updatedBlog = await prisma.blog.update({
    where: { id },
    data: {
      blogHead: parsedBody.data.blogHead ?? existingBlog.blogHead,
      title: parsedBody.data.title ?? existingBlog.title,
      description1: parsedBody.data.description1 ?? existingBlog.description1,
      description2: parsedBody.data.description2 ?? existingBlog.description2,
      images: parsedBody.data.images ?? existingBlog.images,
      likes: parsedBody.data.likes ?? existingBlog.likes,
      footerImage: parsedBody.data.footerImage ?? existingBlog.footerImage,
      locationId,
    },
  });

  return c.json({ blog: updatedBlog });
});

// DELETE /:id
// -----------------------------------------------------------------
// Deletes a blog post by its unique identifier.
// Only the owner of the blog post (as identified by the JWT) can perform this action.
blogRouter.delete("/:id", async (c) => {
  // Retrieve the authenticated author's id.
  const authorId = c.get("authorId");
  // Extract the blog post ID from the URL parameters.
  const { id } = c.req.param();

  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // Find the blog post to ensure it exists.
  const blog = await prisma.blog.findUnique({
    where: { id },
  });
  if (!blog) {
    c.status(404);
    return c.json({ message: "Blog not found" });
  }
  // Ensure that the requester is the owner of the blog post.
  if (blog.authorId !== authorId) {
    c.status(403);
    return c.json({ message: "Access denied" });
  }

  // Delete the blog post.
  await prisma.blog.delete({
    where: { id },
  });

  return c.json({ message: "Blog deleted successfully" });
});

// POST /
// -----------------------------------------------------------------
// Creates a new blog post. Expects a JSON request body that includes the following fields:
//   - blogHead, title, description1, description2, images (an array of URLs)
//   - Optional: likes, footerImage
//   - Location fields: city and country
// The created blog is associated with the authenticated author (retrieved from the JWT).
blogRouter.post("/", async (c) => {
  // Get the authenticated author's ID from the context.
  const authorId = c.get("authorId");

  // Initialize PrismaClient.
  const prisma = new PrismaClient({
    datasourceUrl: c.env.DATABASE_URL,
  }).$extends(withAccelerate());

  // Parse the JSON request body.
  const body = await c.req.json();

  const parsedBody = createBlogSchema.safeParse(body);
  if (!parsedBody.success) {
    return c.json(
      { message: "Invalid data", errors: parsedBody.error.errors },
      400
    );
  }
  // Ensure that the provided location exists; if not, create it.
  const location = await prisma.location.upsert({
    where: {
      // Use the unique constraint on (city, country).
      city_country: {
        city: body.city,
        country: body.country,
      },
    },
    update: {}, // No update is needed if the location exists.
    create: {
      city: body.city,
      country: body.country,
    },
  });

  // Create the blog post, associating it with the authenticated author and the location.
  const post = await prisma.blog.create({
    data: {
      blogHead: body.blogHead,
      title: body.title,
      description1: body.description1,
      description2: body.description2,
      images: body.images,
      likes: body.likes || 0,
      footerImage: body.footerImage,
      authorId: authorId,
      locationId: location.id,
    },
  });

  return c.json({ id: post.id });
});

// Export the router so it can be attached to your application.
export default blogRouter;
