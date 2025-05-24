/*
  Warnings:

  - You are about to drop the column `isPublished` on the `DailyMenu` table. All the data in the column will be lost.
  - You are about to drop the column `isPublished` on the `MenuCalendar` table. All the data in the column will be lost.
  - You are about to drop the column `dayOfWeek` on the `MenuItem` table. All the data in the column will be lost.
  - You are about to drop the column `isAvailable` on the `MenuItem` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "DailyMenu" DROP COLUMN "isPublished";

-- AlterTable
ALTER TABLE "MenuCalendar" DROP COLUMN "isPublished";

-- AlterTable
ALTER TABLE "MenuItem" DROP COLUMN "dayOfWeek",
DROP COLUMN "isAvailable";
