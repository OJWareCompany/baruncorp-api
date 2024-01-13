/*
  Warnings:

  - You are about to drop the column `number` on the `pto_details` table. All the data in the column will be lost.
  - Added the required column `days` to the `pto_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pto_details` DROP COLUMN `number`,
    ADD COLUMN `days` INTEGER NOT NULL;
