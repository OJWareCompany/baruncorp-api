/*
  Warnings:

  - Added the required column `user_id` to the `pto_details` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pto_details` ADD COLUMN `user_id` VARCHAR(255) NOT NULL;
