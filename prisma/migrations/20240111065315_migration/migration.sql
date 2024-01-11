/*
  Warnings:

  - Added the required column `number` to the `pto_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pto_details` ADD COLUMN `number` INTEGER NOT NULL;
