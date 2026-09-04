-- CreateEnum
CREATE TYPE "TypeResponse" AS ENUM ('TEXT', 'IMAGE', 'CODE', 'PDF');

-- CreateEnum
CREATE TYPE "ReactionTo" AS ENUM ('RESPONSE', 'COMMENT', 'TP', 'MIDTERM', 'LINK');

-- CreateTable
CREATE TABLE "Correlative" (
    "id_course" TEXT NOT NULL,
    "id_correlative" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Correlative_pkey" PRIMARY KEY ("id_course","id_correlative")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "name_normalized" TEXT NOT NULL,
    "cg" INTEGER,
    "hs" INTEGER,
    "optional" BOOLEAN NOT NULL DEFAULT false,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CourseDegree" (
    "id_course" TEXT NOT NULL,
    "id_degree" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseDegree_pkey" PRIMARY KEY ("id_course","id_degree")
);

-- CreateTable
CREATE TABLE "CourseYear" (
    "id_course" TEXT NOT NULL,
    "id_year" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CourseYear_pkey" PRIMARY KEY ("id_course","id_year")
);

-- CreateTable
CREATE TABLE "Degree" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Degree_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DegreePlan" (
    "id_degree" TEXT NOT NULL,
    "id_plan" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DegreePlan_pkey" PRIMARY KEY ("id_degree","id_plan")
);

-- CreateTable
CREATE TABLE "Link" (
    "id" TEXT NOT NULL,
    "id_course" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "link" TEXT NOT NULL,
    "official" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Link_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Midterm" (
    "id" TEXT NOT NULL,
    "id_course" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Midterm_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Comment" (
    "id" TEXT NOT NULL,
    "id_response" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_tp" TEXT,
    "id_midterm" TEXT,
    "number" INTEGER NOT NULL,
    "type" "TypeResponse" NOT NULL,
    "text" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tp" (
    "id" TEXT NOT NULL,
    "id_course" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER,
    "year" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tp_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Reaction" (
    "id" TEXT NOT NULL,
    "id_user" TEXT NOT NULL,
    "id_target" TEXT NOT NULL,
    "typeTarget" "ReactionTo" NOT NULL,
    "reaction" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Reaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "tier" INTEGER NOT NULL,
    "banned" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Year" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Year_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_name_key" ON "Course"("name");

-- CreateIndex
CREATE INDEX "Course_name_normalized_idx" ON "Course"("name_normalized");

-- CreateIndex
CREATE UNIQUE INDEX "Degree_name_key" ON "Degree"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_year_key" ON "Plan"("year");

-- CreateIndex
CREATE INDEX "Reaction_id_user_idx" ON "Reaction"("id_user");

-- CreateIndex
CREATE UNIQUE INDEX "Reaction_id_user_id_target_typeTarget_key" ON "Reaction"("id_user", "id_target", "typeTarget");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Year_name_key" ON "Year"("name");

-- AddForeignKey
ALTER TABLE "Correlative" ADD CONSTRAINT "Correlative_id_course_fkey" FOREIGN KEY ("id_course") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Correlative" ADD CONSTRAINT "Correlative_id_correlative_fkey" FOREIGN KEY ("id_correlative") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseDegree" ADD CONSTRAINT "CourseDegree_id_course_fkey" FOREIGN KEY ("id_course") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseDegree" ADD CONSTRAINT "CourseDegree_id_degree_fkey" FOREIGN KEY ("id_degree") REFERENCES "Degree"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseYear" ADD CONSTRAINT "CourseYear_id_course_fkey" FOREIGN KEY ("id_course") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "CourseYear" ADD CONSTRAINT "CourseYear_id_year_fkey" FOREIGN KEY ("id_year") REFERENCES "Year"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DegreePlan" ADD CONSTRAINT "DegreePlan_id_degree_fkey" FOREIGN KEY ("id_degree") REFERENCES "Degree"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "DegreePlan" ADD CONSTRAINT "DegreePlan_id_plan_fkey" FOREIGN KEY ("id_plan") REFERENCES "Plan"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_id_course_fkey" FOREIGN KEY ("id_course") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Link" ADD CONSTRAINT "Link_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Midterm" ADD CONSTRAINT "Midterm_id_course_fkey" FOREIGN KEY ("id_course") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Midterm" ADD CONSTRAINT "Midterm_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_id_response_fkey" FOREIGN KEY ("id_response") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_id_midterm_fkey" FOREIGN KEY ("id_midterm") REFERENCES "Midterm"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_id_tp_fkey" FOREIGN KEY ("id_tp") REFERENCES "Tp"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tp" ADD CONSTRAINT "Tp_id_course_fkey" FOREIGN KEY ("id_course") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Tp" ADD CONSTRAINT "Tp_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "Reaction" ADD CONSTRAINT "Reaction_id_user_fkey" FOREIGN KEY ("id_user") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
