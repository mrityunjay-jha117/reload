-- CreateTable
CREATE TABLE "Author" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT DEFAULT 'mrityunjay',
    "image" TEXT DEFAULT 'image.com',
    "password" TEXT NOT NULL,
    "about" TEXT DEFAULT 'lorem ipsum dolor',

    CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Location" (
    "id" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "country" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Blog" (
    "id" TEXT NOT NULL,
    "blogHead" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description1" TEXT NOT NULL,
    "description2" TEXT NOT NULL,
    "images" TEXT[],
    "likes" INTEGER NOT NULL DEFAULT 0,
    "footerImage" TEXT,
    "authorId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "Blog_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Author_email_key" ON "Author"("email");

-- CreateIndex
CREATE INDEX "Author_name_idx" ON "Author"("name");

-- CreateIndex
CREATE INDEX "Author_id_idx" ON "Author"("id");

-- CreateIndex
CREATE INDEX "Location_city_idx" ON "Location"("city");

-- CreateIndex
CREATE INDEX "Location_country_idx" ON "Location"("country");

-- CreateIndex
CREATE UNIQUE INDEX "Location_city_country_key" ON "Location"("city", "country");

-- CreateIndex
CREATE INDEX "Blog_title_idx" ON "Blog"("title");

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Blog" ADD CONSTRAINT "Blog_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
