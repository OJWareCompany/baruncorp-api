/*
  Warnings:

  - Added the required column `ended_at` to the `ptos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `started_at` to the `ptos` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ptos` ADD COLUMN `ended_at` DATETIME(0) NOT NULL,
    ADD COLUMN `started_at` DATETIME(0) NOT NULL;
