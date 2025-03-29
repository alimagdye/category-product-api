/*
  Warnings:

  - You are about to drop the column `desription` on the `product` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "product" DROP COLUMN "desription",
ADD COLUMN     "description" TEXT DEFAULT 'description';
