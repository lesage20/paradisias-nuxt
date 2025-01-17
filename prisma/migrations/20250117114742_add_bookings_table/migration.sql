/*
  Warnings:

  - You are about to drop the column `adults` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `checkIn` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `checkOut` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `children` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `payment` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `recorded_by_id` on the `bookings` table. All the data in the column will be lost.
  - You are about to drop the column `totalPrice` on the `bookings` table. All the data in the column will be lost.
  - Added the required column `check_in` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `check_out` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total_amount` to the `bookings` table without a default value. This is not possible if the table is not empty.
  - Made the column `reference` on table `bookings` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX `bookings_recorded_by_id_idx` ON `bookings`;

-- AlterTable
ALTER TABLE `bookings` DROP COLUMN `adults`,
    DROP COLUMN `checkIn`,
    DROP COLUMN `checkOut`,
    DROP COLUMN `children`,
    DROP COLUMN `payment`,
    DROP COLUMN `recorded_by_id`,
    DROP COLUMN `totalPrice`,
    ADD COLUMN `check_in` DATETIME(3) NOT NULL,
    ADD COLUMN `check_out` DATETIME(3) NOT NULL,
    ADD COLUMN `notes` TEXT NULL,
    ADD COLUMN `total_amount` DOUBLE NOT NULL,
    MODIFY `reference` VARCHAR(10) NOT NULL,
    MODIFY `status` VARCHAR(20) NOT NULL DEFAULT 'pending';
