/*
  Warnings:

  - You are about to drop the column `pto_id` on the `pto_available_values` table. All the data in the column will be lost.
  - You are about to drop the column `pto_id` on the `pto_tenure_results` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `ptos` table. All the data in the column will be lost.
  - You are about to drop the `pto_records` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `is_paid` to the `pto_tenure_results` table without a default value. This is not possible if the table is not empty.
  - Added the required column `is_paid` to the `ptos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `tenure` to the `ptos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `total` to the `ptos` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user_id` to the `ptos` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX `invitation_emails_organization_id_fkey` ON `invitation_emails`;

-- DropIndex
DROP INDEX `invitation_emails_role_fkey` ON `invitation_emails`;

-- DropIndex
DROP INDEX `ptos_name_key` ON `ptos`;

-- AlterTable
ALTER TABLE `pto_available_values` DROP COLUMN `pto_id`;

-- AlterTable
ALTER TABLE `pto_tenure_results` DROP COLUMN `pto_id`,
    ADD COLUMN `is_paid` BOOLEAN NOT NULL;

-- AlterTable
ALTER TABLE `ptos` DROP COLUMN `name`,
    ADD COLUMN `is_paid` BOOLEAN NOT NULL,
    ADD COLUMN `tenure` INTEGER NOT NULL,
    ADD COLUMN `total` FLOAT NOT NULL,
    ADD COLUMN `user_id` VARCHAR(255) NOT NULL;

-- DropTable
DROP TABLE `pto_records`;

-- CreateTable
CREATE TABLE `pto_types` (
    `id` VARCHAR(255) NOT NULL,
    `name` VARCHAR(191) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    UNIQUE INDEX `pto_types_name_key`(`name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `pto_details` (
    `id` VARCHAR(255) NOT NULL,
    `pto_id` VARCHAR(255) NOT NULL,
    `pto_type_id` VARCHAR(255) NOT NULL,
    `value` FLOAT NOT NULL,
    `started_at` DATETIME(0) NOT NULL,
    `ended_at` DATETIME(0) NOT NULL,
    `created_at` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `updated_at` DATETIME(0) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `_PtoAvailableValuesToPtoTypes` (
    `A` VARCHAR(255) NOT NULL,
    `B` VARCHAR(255) NOT NULL,

    UNIQUE INDEX `_PtoAvailableValuesToPtoTypes_AB_unique`(`A`, `B`),
    INDEX `_PtoAvailableValuesToPtoTypes_B_index`(`B`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
