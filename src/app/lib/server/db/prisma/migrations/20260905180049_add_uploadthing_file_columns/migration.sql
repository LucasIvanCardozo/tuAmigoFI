-- AlterTable
ALTER TABLE "Midterm" ADD COLUMN     "file_key" TEXT,
ADD COLUMN     "file_url" TEXT;

-- AlterTable
ALTER TABLE "Response" ADD COLUMN     "file_key" TEXT,
ADD COLUMN     "file_url" TEXT;

-- AlterTable
ALTER TABLE "Tp" ADD COLUMN     "file_key" TEXT,
ADD COLUMN     "file_url" TEXT;
