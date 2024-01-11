/*
  Warnings:

  - A unique constraint covering the columns `[tenure]` on the table `pto_tenure_policies` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `pto_tenure_policies_tenure_key` ON `pto_tenure_policies`(`tenure`);
