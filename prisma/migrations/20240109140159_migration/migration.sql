/*
  Warnings:

  - You are about to drop the column `email` on the `organizations` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `organizations` DROP COLUMN `email`;

-- AlterTable
ALTER TABLE `users` ADD COLUMN `date_of_joining` DATETIME(0) NULL;
