/*
  Warnings:

  - A unique constraint covering the columns `[password]` on the table `AuthModule` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `password` to the `AuthModule` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuthModule" ADD COLUMN     "password" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "AuthModule_password_key" ON "AuthModule"("password");
