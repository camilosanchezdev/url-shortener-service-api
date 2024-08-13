-- CreateTable
CREATE TABLE "urls" (
    "url_id" SERIAL NOT NULL,
    "original_url" TEXT NOT NULL,
    "short_dode" TEXT NOT NULL,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "user_id" INTEGER,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3),
    "expires_at" TIMESTAMP(3),
    "deleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "urls_pkey" PRIMARY KEY ("url_id")
);

-- CreateIndex
CREATE UNIQUE INDEX "urls_short_dode_key" ON "urls"("short_dode");

-- AddForeignKey
ALTER TABLE "urls" ADD CONSTRAINT "urls_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("user_id") ON DELETE SET NULL ON UPDATE CASCADE;
