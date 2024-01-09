/*
  Warnings:

  - You are about to drop the column `total_pto` on the `pto_tenure_policies` table. All the data in the column will be lost.
  - Added the required column `total` to the `pto_tenure_policies` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `pto_tenure_policies` DROP COLUMN `total_pto`,
    ADD COLUMN `total` FLOAT NOT NULL;
