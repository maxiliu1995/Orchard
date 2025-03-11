-- DropIndex
DROP INDEX "PasswordReset_userId_idx";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "resetPasswordExpires" TIMESTAMP(3),
ADD COLUMN     "resetPasswordId" TEXT,
ADD COLUMN     "resetPasswordToken" TEXT;
