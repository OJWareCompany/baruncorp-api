/*
  Warnings:

  - A unique constraint covering the columns `[user_id,tenure]` on the table `ptos` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `ptos_user_id_tenure_key` ON `ptos`(`user_id`, `tenure`);
