/*
  Warnings:

  - You are about to alter the column `name` on the `pto_types` table. The data in that column could be lost. The data in that column will be cast from `VarChar(191)` to `VarChar(30)`.
  - You are about to drop the `pto_tenure_results` table. If the table is not empty, all the data it contains will be lost.

*/
-- AlterTable
ALTER TABLE `pto_types` MODIFY `name` VARCHAR(30) NOT NULL;

-- DropTable
DROP TABLE `pto_tenure_results`;
