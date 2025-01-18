-- AlterTable
ALTER TABLE "floors" ALTER COLUMN "status" SET DEFAULT 'actif';

-- AlterTable
ALTER TABLE "room_types" ADD COLUMN     "description" TEXT;
