/*
  Warnings:

  - You are about to drop the `events` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `group_members` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `groups` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `profiles` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "availability" DROP CONSTRAINT "availability_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "events" DROP CONSTRAINT "events_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_members" DROP CONSTRAINT "group_members_group_id_fkey";

-- DropForeignKey
ALTER TABLE "group_members" DROP CONSTRAINT "group_members_profile_id_fkey";

-- DropForeignKey
ALTER TABLE "groups" DROP CONSTRAINT "groups_owner_id_fkey";

-- DropTable
DROP TABLE "events";

-- DropTable
DROP TABLE "group_members";

-- DropTable
DROP TABLE "groups";

-- DropTable
DROP TABLE "profiles";

-- CreateTable
CREATE TABLE "profile" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT,
    "timezone" TEXT NOT NULL DEFAULT 'UTC',
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "profile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "code" TEXT NOT NULL,
    "owner_id" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_member" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "profile_id" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'MEMBER',
    "joined_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "group_member_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event" (
    "id" TEXT NOT NULL,
    "group_id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "start_time" TIMESTAMP(3) NOT NULL,
    "end_time" TIMESTAMP(3) NOT NULL,
    "location" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "event_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "profile_user_id_key" ON "profile"("user_id");

-- CreateIndex
CREATE UNIQUE INDEX "profile_email_key" ON "profile"("email");

-- CreateIndex
CREATE UNIQUE INDEX "group_code_key" ON "group"("code");

-- CreateIndex
CREATE UNIQUE INDEX "group_member_group_id_profile_id_key" ON "group_member"("group_id", "profile_id");

-- AddForeignKey
ALTER TABLE "group" ADD CONSTRAINT "group_owner_id_fkey" FOREIGN KEY ("owner_id") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_member" ADD CONSTRAINT "group_member_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "availability" ADD CONSTRAINT "availability_profile_id_fkey" FOREIGN KEY ("profile_id") REFERENCES "profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event" ADD CONSTRAINT "event_group_id_fkey" FOREIGN KEY ("group_id") REFERENCES "group"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
