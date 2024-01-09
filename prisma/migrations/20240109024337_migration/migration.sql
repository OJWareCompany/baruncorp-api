/*
  Warnings:

  - Added the required column `abbreviation` to the `pto_types` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pto_types` ADD COLUMN `abbreviation` VARCHAR(5) NOT NULL;

-- CreateTable
CREATE TABLE `pto_tenure_policies` (
    `id` VARCHAR(255) NOT NULL,
    `tenure` TINYINT NOT NULL,
    `total_pto` FLOAT NOT NULL,
    `annual_increase` INTEGER NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
