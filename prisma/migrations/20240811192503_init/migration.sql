-- CreateTable
CREATE TABLE "carreras" (
    "id_carreras" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "carreras_pkey" PRIMARY KEY ("id_carreras")
);

-- CreateTable
CREATE TABLE "materia_correlativa" (
    "id_materias" INTEGER NOT NULL,
    "id_correlativa" INTEGER NOT NULL,

    CONSTRAINT "materia_correlativa_pkey" PRIMARY KEY ("id_materias","id_correlativa")
);

-- CreateTable
CREATE TABLE "materias" (
    "id_materias" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "name_normalized" TEXT NOT NULL,
    "cg" INTEGER,
    "hs" INTEGER,
    "plan" TEXT NOT NULL,

    CONSTRAINT "materias_pkey" PRIMARY KEY ("id_materias")
);

-- CreateTable
CREATE TABLE "problemas" (
    "id_problemas" SERIAL NOT NULL,
    "text" TEXT NOT NULL,
    "response" TEXT NOT NULL,
    "text_normalized" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "response_plus" TEXT,
    "type_plus" TEXT,

    CONSTRAINT "problemas_pkey" PRIMARY KEY ("id_problemas")
);

-- CreateTable
CREATE TABLE "tps" (
    "id_tps" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "number" INTEGER NOT NULL,
    "year" INTEGER NOT NULL,

    CONSTRAINT "tps_pkey" PRIMARY KEY ("id_tps")
);

-- CreateTable
CREATE TABLE "tps_materias" (
    "id_tps" INTEGER NOT NULL,
    "id_materias" INTEGER NOT NULL,

    CONSTRAINT "tps_materias_pkey" PRIMARY KEY ("id_tps","id_materias")
);

-- CreateTable
CREATE TABLE "anios" (
    "id_anios" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "anios_pkey" PRIMARY KEY ("id_anios")
);

-- CreateTable
CREATE TABLE "carreras_materias_anios" (
    "id_carreras" INTEGER NOT NULL,
    "id_materias" INTEGER NOT NULL,
    "id_anios" INTEGER NOT NULL,

    CONSTRAINT "carreras_materias_anios_pkey" PRIMARY KEY ("id_carreras","id_materias","id_anios")
);

-- CreateTable
CREATE TABLE "tps_problemas" (
    "id_tps" INTEGER NOT NULL,
    "id_problemas" INTEGER NOT NULL,

    CONSTRAINT "tps_problemas_pkey" PRIMARY KEY ("id_tps","id_problemas")
);

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_carreras_1" ON "carreras"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_materias_1" ON "materias"("name");

-- CreateIndex
CREATE UNIQUE INDEX "sqlite_autoindex_materias_2" ON "materias"("name_normalized");

-- AddForeignKey
ALTER TABLE "materia_correlativa" ADD CONSTRAINT "materia_correlativa_id_materias_fkey" FOREIGN KEY ("id_materias") REFERENCES "materias"("id_materias") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "materia_correlativa" ADD CONSTRAINT "materia_correlativa_id_correlativa_fkey" FOREIGN KEY ("id_correlativa") REFERENCES "materias"("id_materias") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tps_materias" ADD CONSTRAINT "tps_materias_id_tps_fkey" FOREIGN KEY ("id_tps") REFERENCES "tps"("id_tps") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tps_materias" ADD CONSTRAINT "tps_materias_id_materias_fkey" FOREIGN KEY ("id_materias") REFERENCES "materias"("id_materias") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carreras_materias_anios" ADD CONSTRAINT "carreras_materias_anios_id_materias_fkey" FOREIGN KEY ("id_materias") REFERENCES "materias"("id_materias") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "carreras_materias_anios" ADD CONSTRAINT "carreras_materias_anios_id_carreras_fkey" FOREIGN KEY ("id_carreras") REFERENCES "carreras"("id_carreras") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tps_problemas" ADD CONSTRAINT "tps_problemas_id_tps_fkey" FOREIGN KEY ("id_tps") REFERENCES "tps"("id_tps") ON DELETE NO ACTION ON UPDATE NO ACTION;

-- AddForeignKey
ALTER TABLE "tps_problemas" ADD CONSTRAINT "tps_problemas_id_problemas_fkey" FOREIGN KEY ("id_problemas") REFERENCES "problemas"("id_problemas") ON DELETE NO ACTION ON UPDATE NO ACTION;
