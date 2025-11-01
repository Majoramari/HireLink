-- AlterTable
ALTER TABLE "User" ADD COLUMN     "companyName" TEXT,
ADD COLUMN     "description" TEXT,
ADD COLUMN     "establishedAt" TIMESTAMP(3),
ADD COLUMN     "industry" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "website" TEXT;
