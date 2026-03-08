import { PrismaClient } from '../prismaClient/client'

export const correlativeSeed = async (db: PrismaClient) => {
  const courses = await db.course.findMany({
    select: { id: true, name: true },
  })

  const courseMap = new Map(courses.map((c) => [c.name, c.id]))

  const data = correlativesData.map((c) => ({
    idCourse: courseMap.get(c.course)!,
    idCorrelativeCourse: courseMap.get(c.required)!,
  }))

  await db.correlative.createMany({
    data,
    skipDuplicates: true,
  })
}

const correlativesData = [
  {
    course: 'Física A',
    required: 'Análisis Matemático I',
  },
  {
    course: 'Física A',
    required: 'Álgebra I-B',
  },
  {
    course: 'Física A',
    required: 'Álgebra I-A',
  },
  {
    course: 'Probabilidad y Estadística',
    required: 'Informática Básica',
  },
  {
    course: 'Probabilidad y Estadística',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Programación B',
    required: 'Programación A',
  },
  {
    course: 'Programación B',
    required: 'Introducción a la Matemática Discreta',
  },
  {
    course: 'Tecnologías Informáticas B',
    required: 'Tecnologías Informáticas A',
  },
  {
    course: 'Tecnologías Informáticas B',
    required: 'Programación A',
  },
  {
    course: 'Investigación de Operaciones',
    required: 'Probabilidad y Estadística',
  },
  {
    course: 'Estructura y Organización de Datos',
    required: 'Programación B',
  },
  {
    course: 'Estructura y Organización de Datos',
    required: 'Teorías de la Información y la Computación',
  },
  {
    course: 'Fundamentos de Sistemas Operativos',
    required: 'Fundamentos de la Arquitectura de Computadoras',
  },
  {
    course: 'Fundamentos de Sistemas Operativos',
    required: 'Programación C',
  },
  {
    course: 'Fundamentos de Lenguajes Formales',
    required: 'Programación B',
  },
  {
    course: 'Fundamentos de Lenguajes Formales',
    required: 'Fundamentos de la Arquitectura de Computadoras',
  },
  {
    course: 'Sistemas de Bases de Datos',
    required: 'Fundamentos de Sistemas Operativos',
  },
  {
    course: 'Sistemas de Bases de Datos',
    required: 'Programación C',
  },
  {
    course: 'Sistemas de Bases de Datos',
    required: 'Análisis y Diseño de Sistemas A',
  },
  {
    course: 'Sistemas de Bases de Datos',
    required: 'Sistemas Operativos',
  },
  {
    course: 'Sistemas de Bases de Datos',
    required: 'Ingeniería de Soluciones',
  },
  {
    course: 'Introducción a la Inteligencia Artificial',
    required: 'Programación C',
  },
  {
    course: 'Redes y Comunicación de Datos B',
    required: 'Redes y Computación de Datos A',
  },
  {
    course: 'Análisis y Diseño de Sistemas B',
    required: 'Administración Empresarial en la Economía del Conocimiento',
  },
  {
    course: 'Análisis y Diseño de Sistemas B',
    required: 'Análisis y Diseño de Sistemas A',
  },
  {
    course: 'Comportamiento Organizacional y Relaciones del Trabajo',
    required: 'Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional',
  },
  {
    course: 'Comportamiento Organizacional y Relaciones del Trabajo',
    required: 'Análisis y Diseño de Sistemas A',
  },
  {
    course: 'Comportamiento Organizacional y Relaciones del Trabajo',
    required: 'Planificación y Control de la Producción',
  },
  {
    course: 'Teoría de Modelos y Simulación',
    required: 'Probabilidad y Estadística',
  },
  {
    course: 'Teoría de Modelos y Simulación',
    required: 'Diseño e Implementación de Sistemas Distribuidos',
  },
  {
    course: 'Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional',
    required: 'Probabilidad y Estadística',
  },
  {
    course: 'Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional',
    required: 'Economía para Ingeniería',
  },
  {
    course: 'Ética, Legislación y Propiedad Intelectual en el Ejercicio Profesional',
    required: 'Administración estratégica',
  },
  {
    course: 'Auditoría y homologación',
    required: 'Calidad de Software A',
  },
  {
    course: 'Auditoría y homologación',
    required: 'Gestión de Proyectos Informáticos',
  },
  {
    course: 'Auditoría y homologación',
    required: 'Gestión de la Seguridad Informática',
  },
  {
    course: 'Análisis Matemático II',
    required: 'Análisis Matemático I',
  },
  {
    course: 'Álgebra II',
    required: 'Álgebra I-B',
  },
  {
    course: 'Álgebra II',
    required: 'Álgebra I-A',
  },
  {
    course: 'Programación A',
    required: 'Análisis Matemático I',
  },
  {
    course: 'Programación A',
    required: 'Álgebra I-B',
  },
  {
    course: 'Programación A',
    required: 'Informática Básica',
  },
  {
    course: 'Introducción a la Matemática Discreta',
    required: 'Álgebra I-B',
  },
  {
    course: 'Introducción a la Matemática Discreta',
    required: 'Informática Básica',
  },
  {
    course: 'Introducción a la Matemática Discreta',
    required: 'Álgebra I-A',
  },
  {
    course: 'Física B-II',
    required: 'Física A',
  },
  {
    course: 'Física B-II',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Física B-II',
    required: 'Álgebra II',
  },
  {
    course: 'Teorías de la Información y la Computación',
    required: 'Probabilidad y Estadística',
  },
  {
    course: 'Teorías de la Información y la Computación',
    required: 'Programación B',
  },
  {
    course: 'Fundamentos de la Arquitectura de Computadoras',
    required: 'Física A',
  },
  {
    course: 'Fundamentos de la Arquitectura de Computadoras',
    required: 'Programación B',
  },
  {
    course: 'Programación C',
    required: 'Programación B',
  },
  {
    course: 'Programación C',
    required: 'Tecnologías Informáticas B',
  },
  {
    course: 'Inglés II',
    required: 'Inglés I',
  },
  {
    course: 'Calidad de Software A',
    required: 'Programación C',
  },
  {
    course: 'Administración Empresarial en la Economía del Conocimiento',
    required: 'Investigación de Operaciones',
  },
  {
    course: 'Redes y Computación de Datos A',
    required: 'Fundamentos de Sistemas Operativos',
  },
  {
    course: 'Redes y Computación de Datos A',
    required: 'Física B-II',
  },
  {
    course: 'Análisis y Diseño de Sistemas A',
    required: 'Programación C',
  },
  {
    course: 'Calidad de Software B',
    required: 'Sistemas de Bases de Datos',
  },
  {
    course: 'Calidad de Software B',
    required: 'Redes y Comunicación de Datos B',
  },
  {
    course: 'Calidad de Software B',
    required: 'Calidad de Software A',
  },
  {
    course: 'Gestión de Proyectos Informáticos',
    required: 'Análisis y Diseño de Sistemas B',
  },
  {
    course: 'Gestión de la Seguridad Informática',
    required: 'Redes y Computación de Datos A',
  },
  {
    course: 'Diseño e Implementación de Sistemas Distribuidos',
    required: 'Redes y Comunicación de Datos B',
  },
  {
    course: 'Diseño e Implementación de Sistemas Distribuidos',
    required: 'Análisis y Diseño de Sistemas B',
  },
  {
    course: 'Seguridad y Salud Ocupacional',
    required: 'Probabilidad y Estadística',
  },
  {
    course: 'Seguridad y Salud Ocupacional',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Seguridad y Salud Ocupacional',
    required: 'Organización Empresarial e Industrial',
  },
  {
    course: 'Análisis Matemático III',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Análisis Matemático III',
    required: 'Álgebra II',
  },
  {
    course: 'Proyecto Transversal C II',
    required: 'Teoría de Circuitos',
  },
  {
    course: 'Proyecto Transversal C II',
    required: 'Proyecto Transversal C I',
  },
  {
    course: 'Teoría de Circuitos',
    required: 'Física B-I',
  },
  {
    course: 'Dispositivos y Circuitos Electrónicos',
    required: 'Teoría de Circuitos',
  },
  {
    course: 'Señales y Sistemas de Tiempo Discreto',
    required: 'Señales y Sistemas de Tiempo Continuo',
  },
  {
    course: 'Programación III',
    required: 'Programación II',
  },
  {
    course: 'Circuitos Digitales',
    required: 'Teoría de Circuitos',
  },
  {
    course: 'Sistemas Operativos',
    required: 'Arquitectura de Computadoras',
  },
  {
    course: 'Sistemas Operativos',
    required: 'Programación II',
  },
  {
    course: 'Sistemas Embebidos',
    required: 'Arquitectura de Computadoras',
  },
  {
    course: 'Ingeniería de Soluciones',
    required: 'Programación III',
  },
  {
    course: 'Organización Empresarial e Industrial',
    required: 'Inglés II',
  },
  {
    course: 'Organización Empresarial e Industrial',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Sistemas de Computación Distribuidos I',
    required: 'Programación III',
  },
  {
    course: 'Mecanismos de Seguridad en Redes',
    required: 'Principios de la Seguridad Informática',
  },
  {
    course: 'Mecanismos de Seguridad en Redes',
    required: 'Redes de Transmisión de Datos',
  },
  {
    course: 'Economía para Ingeniería',
    required: 'Seguridad y Salud Ocupacional',
  },
  {
    course: 'Economía para Ingeniería',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Diseño Digital Avanzado',
    required: 'Circuitos Digitales',
  },
  {
    course: 'Proyecto Transversal C I',
    required: 'Física B-I',
  },
  {
    course: 'Proyecto Transversal C I',
    required: 'Programación I',
  },
  {
    course: 'Fisica C-II',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Fisica C-II',
    required: 'Física B-II',
  },
  {
    course: 'Fisica C-II',
    required: 'Álgebra I-A',
  },
  {
    course: 'Fisica C-II',
    required: 'Física B-I',
  },
  {
    course: 'Señales y Sistemas de Tiempo Continuo',
    required: 'Probabilidad y Estadística',
  },
  {
    course: 'Señales y Sistemas de Tiempo Continuo',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Señales y Sistemas de Tiempo Continuo',
    required: 'Física B-I',
  },
  {
    course: 'Proyecto Transversal C III',
    required: 'Proyecto Transversal C II',
  },
  {
    course: 'Proyecto Transversal C III',
    required: 'Circuitos Digitales',
  },
  {
    course: 'Arquitectura de Computadoras',
    required: 'Dispositivos y Circuitos Electrónicos',
  },
  {
    course: 'Control Discreto',
    required: 'Dispositivos y Circuitos Electrónicos',
  },
  {
    course: 'Control Discreto',
    required: 'Señales y Sistemas de Tiempo Discreto',
  },
  {
    course: 'Principios de la Seguridad Informática',
    required: 'Programación III',
  },
  {
    course: 'Fundamentos de Comunicaciones Digitales',
    required: 'Señales y Sistemas de Tiempo Discreto',
  },
  {
    course: 'Redes de Transmisión de Datos',
    required: 'Fundamentos de Comunicaciones Digitales',
  },
  {
    course: 'Ética, Legislación y Ejercicio Profesional',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Inteligencia Computacional',
    required: 'Señales y Sistemas de Tiempo Discreto',
  },
  {
    course: 'Inteligencia Computacional',
    required: 'Programación III',
  },
  {
    course: 'Sistemas de Computación Distribuidos II',
    required: 'Sistemas Operativos',
  },
  {
    course: 'Sistemas de Computación Distribuidos II',
    required: 'Principios de la Seguridad Informática',
  },
  {
    course: 'Sistemas de Computación Distribuidos II',
    required: 'Redes de Transmisión de Datos',
  },
  {
    course: 'Balance de Masa y Energía',
    required: 'Física A',
  },
  {
    course: 'Balance de Masa y Energía',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Balance de Masa y Energía',
    required: 'Química General e Inorgánica',
  },
  {
    course: 'Fundamentos de la Programación',
    required: 'Análisis Matemático I',
  },
  {
    course: 'Fundamentos de la Programación',
    required: 'Álgebra I-B',
  },
  {
    course: 'Fundamentos de la Programación',
    required: 'Álgebra I-A',
  },
  {
    course: 'Métodos Numéricos para Ingeniería',
    required: 'Informática Básica',
  },
  {
    course: 'Métodos Numéricos para Ingeniería',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Métodos Numéricos para Ingeniería',
    required: 'Fundamentos de la Programación',
  },
  {
    course: 'Operaciones Unitarias I',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Operaciones Unitarias I',
    required: 'Operación de Plantas de Procesos',
  },
  {
    course: 'Termodinámica II',
    required: 'Termodinámica I',
  },
  {
    course: 'Ingeniería de Reacciones Químicas I',
    required: 'Fisicoquímica II',
  },
  {
    course: 'Ingeniería de Reacciones Químicas I',
    required: 'Operación de Plantas de Procesos',
  },
  {
    course: 'Fisicoquímica I',
    required: 'Química General e Inorgánica',
  },
  {
    course: 'Termodinámica I',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Termodinámica I',
    required: 'Balance de Masa y Energía',
  },
  {
    course: 'Química del Carbono',
    required: 'Fisicoquímica I',
  },
  {
    course: 'Fisicoquímica II',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Fisicoquímica II',
    required: 'Fisicoquímica I',
  },
  {
    course: 'Operación de Plantas de Procesos',
    required: 'Física B-II',
  },
  {
    course: 'Operación de Plantas de Procesos',
    required: 'Balance de Masa y Energía',
  },
  {
    course: 'Operación de Plantas de Procesos',
    required: 'Sistemas de Representación para Ingeniería',
  },
  {
    course: 'Operaciones Unitarias II',
    required: 'Operaciones Unitarias I',
  },
  {
    course: 'Operaciones Unitarias II',
    required: 'Termodinámica I',
  },
  {
    course: 'Operaciones Unitarias II',
    required: 'Termodinámica de Alimentos I',
  },
  {
    course: 'Ingeniería de Sistemas de Procesos',
    required: 'Métodos Numéricos para Ingeniería',
  },
  {
    course: 'Ingeniería de Sistemas de Procesos',
    required: 'Termodinámica I',
  },
  {
    course: 'Ingeniería de Sistemas de Procesos',
    required: 'Fisicoquímica II',
  },
  {
    course: 'Ingeniería de Reacciones Químicas II',
    required: 'Ingeniería de Reacciones Químicas I',
  },
  {
    course: 'Química Biológica y Microbiología',
    required: 'Química del Carbono',
  },
  {
    course: 'Sistemas de Gestión Integrados',
    required: 'Organización Empresarial e Industrial',
  },
  {
    course: 'Técnicas de Análisis Fisicoquímicos',
    required: 'Química del Carbono',
  },
  {
    course: 'Dinámica, Instrumentación y Control de Procesos',
    required: 'Ingeniería de Reacciones Químicas I',
  },
  {
    course: 'Dinámica, Instrumentación y Control de Procesos',
    required: 'Operaciones Unitarias II',
  },
  {
    course: 'Tecnología de los Materiales',
    required: 'Física B-II',
  },
  {
    course: 'Tecnología de los Materiales',
    required: 'Fisicoquímica I',
  },
  {
    course: 'Tecnología de los Materiales',
    required: 'Fundamentos de Química',
  },
  {
    course: 'Tecnología de los Materiales',
    required: 'Mecánica del Sólido',
  },
  {
    course: 'Ingeniería de los Procesos Biotecnológicos',
    required: 'Fisicoquímica II',
  },
  {
    course: 'Ingeniería de los Procesos Biotecnológicos',
    required: 'Química Biológica y Microbiología',
  },
  {
    course: 'Ingeniería de los Procesos Biotecnológicos',
    required: 'Química Biológica',
  },
  {
    course: 'Sistemas de Representación para Ingeniería',
    required: 'Álgebra II',
  },
  {
    course: 'Fundamentos de la Estática y Resistencia de Materiales',
    required: 'Física A',
  },
  {
    course: 'Fundamentos de la Estática y Resistencia de Materiales',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Fundamentos de la Estática y Resistencia de Materiales',
    required: 'Álgebra II',
  },
  {
    course: 'Electrotecnia B',
    required: 'Física C-I',
  },
  {
    course: 'Electrotecnia B',
    required: 'Electrotecnia A',
  },
  {
    course: 'Mediciones Eléctricas A',
    required: 'Probabilidad y Estadística',
  },
  {
    course: 'Mediciones Eléctricas A',
    required: 'Electrotecnia A',
  },
  {
    course: 'Automatización A',
    required: 'Electrotecnia A',
  },
  {
    course: 'Introducción a la Mecánica de los Fluidos',
    required: 'Estática II',
  },
  {
    course: 'Máquinas eléctricas B',
    required: 'Máquinas eléctricas A',
  },
  {
    course: 'Materiales Electrotécnicos',
    required: 'Fundamentos de Química',
  },
  {
    course: 'Materiales Electrotécnicos',
    required: 'Mediciones Eléctricas B',
  },
  {
    course: 'Formulación y Evaluación de Proyectos de Inversión',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Formulación y Evaluación de Proyectos de Inversión',
    required: 'Organización Empresarial e Industrial',
  },
  {
    course: 'Instalaciones Eléctricas A',
    required: 'Electrotecnia B',
  },
  {
    course: 'Instalaciones Eléctricas A',
    required: 'Estática II',
  },
  {
    course: 'Física C-I',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Física C-I',
    required: 'Física B-I',
  },
  {
    course: 'Electrotecnia A',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Electrotecnia A',
    required: 'Física B-I',
  },
  {
    course: 'Introducción a la Termodinámica y Máquinas Térmicas',
    required: 'Física A',
  },
  {
    course: 'Introducción a la Termodinámica y Máquinas Térmicas',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Introducción a la Termodinámica y Máquinas Térmicas',
    required: 'Fundamentos de Química',
  },
  {
    course: 'Mediciones Eléctricas B',
    required: 'Electrotecnia B',
  },
  {
    course: 'Mediciones Eléctricas B',
    required: 'Mediciones Eléctricas A',
  },
  {
    course: 'Mediciones Eléctricas B',
    required: 'Automatización A',
  },
  {
    course: 'Tecnología CAD Aplicada',
    required: 'Sistemas de Representación para Ingeniería',
  },
  {
    course: 'Principios de Electrónica',
    required: 'Automatización A',
  },
  {
    course: 'Electrotecnia C',
    required: 'Electrotecnia B',
  },
  {
    course: 'Sistemas de Transmisión de Energía Eléctrica',
    required: 'Máquinas eléctricas B',
  },
  {
    course: 'Sistemas de Transmisión de Energía Eléctrica',
    required: 'Materiales Electrotécnicos',
  },
  {
    course: 'Sistemas de Transmisión de Energía Eléctrica',
    required: 'Instalaciones Eléctricas A',
  },
  {
    course: 'Instalaciones Eléctricas B',
    required: 'Instalaciones Eléctricas A',
  },
  {
    course: 'Instalaciones Eléctricas B',
    required: 'Tecnología CAD Aplicada',
  },
  {
    course: 'Instalaciones Eléctricas B',
    required: 'Máquinas eléctricas A',
  },
  {
    course: 'Automatización B',
    required: 'Automatización A',
  },
  {
    course: 'Electrónica de Potencia I',
    required: 'Principios de Electrónica',
  },
  {
    course: 'Generación de Energía Eléctrica B',
    required: 'Generación de energía eléctrica A',
  },
  {
    course: 'Protección y Análisis de Sistemas de Potencia',
    required: 'Generación de energía eléctrica A',
  },
  {
    course: 'Redes Eléctricas Inteligentes',
    required: 'Sistemas de distribución de energía eléctrica',
  },
  {
    course: 'Estática I',
    required: 'Física A',
  },
  {
    course: 'Estática I',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Estática I',
    required: 'Álgebra II',
  },
  {
    course: 'Introducción a la Mecánica del Continuo',
    required: 'Estática II',
  },
  {
    course: 'Materiales Estructurales',
    required: 'Estática II',
  },
  {
    course: 'Mecánica de la Partícula y Cuerpo Rígido',
    required: 'Física A',
  },
  {
    course: 'Mecánica de la Partícula y Cuerpo Rígido',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Introducción a la Metrología y Fabricación',
    required: 'Sistemas de Representación para Ingeniería',
  },
  {
    course: 'Introducción a la Metrología y Fabricación',
    required: 'Mediciones Eléctricas A',
  },
  {
    course: 'Mantenimiento Industrial',
    required: 'Introducción a la Termodinámica y Máquinas Térmicas',
  },
  {
    course: 'Mantenimiento Industrial',
    required: 'Materiales Estructurales',
  },
  {
    course: 'Mantenimiento Industrial',
    required: 'Tribología, Fricción, Desgaste y Lubricación',
  },
  {
    course: 'Estática II',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Estática II',
    required: 'Estática I',
  },
  {
    course: 'Componentes de los Sistemas Eléctricos de Potencia',
    required: 'Máquinas eléctricas B',
  },
  {
    course: 'Componentes de los Sistemas Eléctricos de Potencia',
    required: 'Materiales Electrotécnicos',
  },
  {
    course: 'Componentes de los Sistemas Eléctricos de Potencia',
    required: 'Instalaciones Eléctricas A',
  },
  {
    course: 'Componentes de los Sistemas Eléctricos de Potencia',
    required: 'Introducción a la Termodinámica y Máquinas Térmicas',
  },
  {
    course: 'Transferencia y Tecnología del Calor',
    required: 'Introducción a la Termodinámica y Máquinas Térmicas',
  },
  {
    course: 'Transferencia y Tecnología del Calor',
    required: 'Fluidos y Máquinas Fluidodinámicas',
  },
  {
    course: 'Fluidos y Máquinas Fluidodinámicas',
    required: 'Introducción a la Termodinámica y Máquinas Térmicas',
  },
  {
    course: 'Fluidos y Máquinas Fluidodinámicas',
    required: 'Introducción a la Mecánica del Continuo',
  },
  {
    course: 'Fluidos y Máquinas Fluidodinámicas',
    required: 'Termodinámica para Ingeniería Mecánica',
  },
  {
    course: 'Proyecto Transversal II',
    required: 'Proyecto Transversal II',
  },
  {
    course: 'Física B-I',
    required: 'Física A',
  },
  {
    course: 'Física B-I',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Física B-I',
    required: 'Álgebra II',
  },
  {
    course: 'Proyecto Transversal III',
    required: 'Proyecto Transversal II',
  },
  {
    course: 'Programación I',
    required: 'Análisis Matemático I',
  },
  {
    course: 'Programación I',
    required: 'Informática Básica',
  },
  {
    course: 'Teoría de Señales y Sistemas',
    required: 'Física B-I',
  },
  {
    course: 'Análisis de Circuitos',
    required: 'Física B-I',
  },
  {
    course: 'Proyecto Transversal IV',
    required: 'Proyecto Transversal III',
  },
  {
    course: 'Filtros Analógicos',
    required: 'Teoría de Señales y Sistemas',
  },
  {
    course: 'Filtros Analógicos',
    required: 'Análisis de Circuitos',
  },
  {
    course: 'Probabilidad, Estadística y Procesos Estocásticos',
    required: 'Métodos Numéricos para Ingeniería',
  },
  {
    course: 'Probabilidad, Estadística y Procesos Estocásticos',
    required: 'Teoría de Señales y Sistemas',
  },
  {
    course: 'Dispositivos Semiconductores',
    required: 'Física C-I',
  },
  {
    course: 'Dispositivos Semiconductores',
    required: 'Teoría de Señales y Sistemas',
  },
  {
    course: 'Dispositivos Semiconductores',
    required: 'Análisis de Circuitos',
  },
  {
    course: 'Tecnología Electrónica',
    required: 'Análisis de Circuitos',
  },
  {
    course: 'Proyecto Transversal V',
    required: 'Proyecto Transversal IV',
  },
  {
    course: 'Técnicas y Dispositivos Digitales',
    required: 'Electrónica Digital',
  },
  {
    course: 'Sistemas y Circuitos Electrónicos',
    required: 'Filtros Analógicos',
  },
  {
    course: 'Sistemas y Circuitos Electrónicos',
    required: 'Electrónica Aplicada',
  },
  {
    course: 'Introducción al Tratamiento Digital de Señales',
    required: 'Teoría de Señales y Sistemas',
  },
  {
    course: 'Introducción al Tratamiento Digital de Señales',
    required: 'Filtros Analógicos',
  },
  {
    course: 'Líneas de Transmisión y Antenas',
    required: 'Física C-I',
  },
  {
    course: 'Electrónica Digital',
    required: 'Filtros Analógicos',
  },
  {
    course: 'Electrónica Digital',
    required: 'Dispositivos Semiconductores',
  },
  {
    course: 'Electrónica Aplicada',
    required: 'Dispositivos Semiconductores',
  },
  {
    course: 'Proyecto Transversal VI',
    required: 'Proyecto Transversal V',
  },
  {
    course: 'Instrumentación y Mediciones Electrónicas II',
    required: 'Sistemas y Circuitos Electrónicos',
  },
  {
    course: 'Instrumentación y Mediciones Electrónicas II',
    required: 'Instrumentación y mediciones electrónicas I',
  },
  {
    course: 'Redes de Datos',
    required: 'Sistemas de comunicaciones',
  },
  {
    course: 'Introducción a la Arquitectura de Computadoras',
    required: 'Técnicas y Dispositivos Digitales',
  },
  {
    course: 'Introducción a la Arquitectura de Computadoras',
    required: 'Sistemas y Circuitos Electrónicos',
  },
  {
    course: 'Control Automático',
    required: 'Introducción al Tratamiento Digital de Señales',
  },
  {
    course: 'Control Automático',
    required: 'Electrónica Aplicada',
  },
  {
    course: 'Introducción a la Ciencia de Materiales',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Introducción a la Ciencia de Materiales',
    required: 'Fundamentos de Química',
  },
  {
    course: 'Física Experimental A',
    required: 'Física B-II',
  },
  {
    course: 'Física Experimental A',
    required: 'Física B-I',
  },
  {
    course: 'Física Experimental A',
    required: 'Física C-II',
  },
  {
    course: 'Mecánica de Materiales y Componentes',
    required: 'Estática I',
  },
  {
    course: 'Química del Estado Sólido',
    required: 'Introducción a la Ciencia de Materiales',
  },
  {
    course: 'Química del Estado Sólido',
    required: 'Termodinámica de Materiales',
  },
  {
    course: 'Cerámica de Aplicación Industrial',
    required: 'Química del Estado Sólido',
  },
  {
    course: 'Transporte de Calor y Materia',
    required: 'Fluidodinámica',
  },
  {
    course: 'Modelado y Simulación de Materiales I',
    required: 'Mecánica de Materiales y Componentes',
  },
  {
    course: 'Modelado y Simulación de Materiales I',
    required: 'Transporte de Calor y Materia',
  },
  {
    course: 'Introducción a la Física del Estado Sólido',
    required: 'Física C-I',
  },
  {
    course: 'Introducción al Diseño 3D',
    required: 'Álgebra II',
  },
  {
    course: 'Termodinámica de Materiales',
    required: 'Física A',
  },
  {
    course: 'Termodinámica de Materiales',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Termodinámica de Materiales',
    required: 'Fundamentos de la Programación',
  },
  {
    course: 'Fluidodinámica',
    required: 'Métodos Numéricos para Ingeniería',
  },
  {
    course: 'Fluidodinámica',
    required: 'Introducción a la Ciencia de Materiales',
  },
  {
    course: 'Fluidodinámica',
    required: 'Introducción al Diseño 3D',
  },
  {
    course: 'Introducción a Polímeros',
    required: 'Introducción a la Ciencia de Materiales',
  },
  {
    course: 'Introducción a Polímeros',
    required: 'Termodinámica de Materiales',
  },
  {
    course: 'Propiedades Funcionales de Materiales',
    required: 'Introducción a la Física del Estado Sólido',
  },
  {
    course: 'Fundamentos de Metalurgia Física',
    required: 'Estática II',
  },
  {
    course: 'Fundamentos de Metalurgia Física',
    required: 'Química del Estado Sólido',
  },
  {
    course: 'Comportamiento Mecánico de Polímeros y Cerámicos',
    required: 'Introducción a Polímeros',
  },
  {
    course: 'Comportamiento Mecánico de Polímeros y Cerámicos',
    required: 'Propiedades Funcionales de Materiales',
  },
  {
    course: 'Modelado y Simulación de Materiales II',
    required: 'Modelado y Simulación de Materiales I',
  },
  {
    course: 'Procesamiento de Plásticos',
    required: 'Transporte de Calor y Materia',
  },
  {
    course: 'Procesamiento de Plásticos',
    required: 'Introducción a Polímeros',
  },
  {
    course: 'Corrosión de Metales y Aleaciones',
    required: 'Propiedades Funcionales de Materiales',
  },
  {
    course: 'Procesamiento de Compuestos',
    required: 'Transporte de Calor y Materia',
  },
  {
    course: 'Procesamiento de Compuestos',
    required: 'Procesamiento de Plásticos',
  },
  {
    course: 'Laboratorio de Transformación de Materiales',
    required: 'Cerámica de Aplicación Industrial',
  },
  {
    course: 'Laboratorio de Transformación de Materiales',
    required: 'Procesamiento de Compuestos',
  },
  {
    course: 'Laboratorio de Transformación de Materiales',
    required: 'Procesamiento de Metales',
  },
  {
    course: 'Selección de Materiales',
    required: 'Procesamiento de Metales',
  },
  {
    course: 'Adquisición y Análisis de la Información Experimental',
    required: 'Propiedades Estructurales de Metales',
  },
  {
    course: 'Procesamiento de Metales',
    required: 'Propiedades Estructurales de Metales',
  },
  {
    course: 'Propiedades Estructurales de Metales',
    required: 'Fundamentos de Metalurgia Física',
  },
  {
    course: 'Mecanismos y Elementos de la Mecánica',
    required: 'Introducción a la Ingenieria Mecánica',
  },
  {
    course: 'Termodinámica para Ingeniería Mecánica',
    required: 'Fundamentos de Química',
  },
  {
    course: 'Metrología e Introducción a la Fabricación',
    required: 'Física Experimental A',
  },
  {
    course: 'Vibraciones Mecánicas',
    required: 'Mecánica de la Partícula y del Cuerpo Rígido',
  },
  {
    course: 'Materiales II',
    required: 'Materiales I',
  },
  {
    course: 'Dibujo B',
    required: 'Dibujo A',
  },
  {
    course: 'Electrotecnia D',
    required: 'Física B-II',
  },
  {
    course: 'Aplicaciones de la Hidráulica y Neumática',
    required: 'Mecanismos y Elementos de la Mecánica',
  },
  {
    course: 'Introducción al Modelado Computacional',
    required: 'Fundamentos de la Programación',
  },
  {
    course: 'Seminario de Energías Renovables',
    required: 'Termodinámica para Ingeniería Mecánica',
  },
  {
    course: 'Materiales I',
    required: 'Introducción a la Mecánica del Continuo',
  },
  {
    course: 'Conversión Electromecánica de la Energía',
    required: 'Electrotecnia D',
  },
  {
    course: 'Tribología, Fricción, Desgaste y Lubricación',
    required: 'Materiales II',
  },
  {
    course: 'Sistemas Propulsivos I',
    required: 'Transferencia y Tecnología del Calor',
  },
  {
    course: 'Procesos de Fabricación I',
    required: 'Introducción a la Metrología y Fabricación',
  },
  {
    course: 'Procesos de Fabricación I',
    required: 'Metrología e Introducción a la Fabricación',
  },
  {
    course: 'Electrónica de Control y Automatización',
    required: 'Conversión Electromecánica de la Energía',
  },
  {
    course: 'Mecánica del Sólido',
    required: 'Física A',
  },
  {
    course: 'Proyecto de Ingeniería Industrial I',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Administración de Operaciones',
    required: 'Administración estratégica',
  },
  {
    course: 'Investigación Operativa A',
    required: 'Probabilidad y Estadística',
  },
  {
    course: 'Gestión de la Tecnología y la Innovación',
    required: 'Administración estratégica',
  },
  {
    course: 'Termodinámica Industrial',
    required: 'Física A',
  },
  {
    course: 'Termodinámica Industrial',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Termodinámica Industrial',
    required: 'Fundamentos de Química',
  },
  {
    course: 'Conceptos de Economía Industrial',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Máquinas y Equipos Industriales I',
    required: 'Física B-II',
  },
  {
    course: 'Máquinas y Equipos Industriales I',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Planificación y Control de la Producción',
    required: 'Investigación Operativa A',
  },
  {
    course: 'Planificación y Control de la Producción',
    required: 'Administración estratégica',
  },
  {
    course: 'Mecánica de Fluidos',
    required: 'Análisis Matemático II',
  },
  {
    course: 'Mecánica de Fluidos',
    required: 'Mecánica del Sólido',
  },
  {
    course: 'Gestión de la Logística Integral y Cadena de Suministros',
    required: 'Administración de Operaciones',
  },
  {
    course: 'Gestión de la Logística Integral y Cadena de Suministros',
    required: 'Investigación Operativa A',
  },
  {
    course: 'Formulación y Evaluación de Proyectos Productivos',
    required: 'Administración de Operaciones',
  },
  {
    course: 'Formulación y Evaluación de Proyectos Productivos',
    required: 'Investigación Operativa B',
  },
  {
    course: 'Gestión Comercial de las Organizaciones',
    required: 'Conceptos de Economía Industrial',
  },
  {
    course: 'Gestión Comercial de las Organizaciones',
    required: 'Planificación y Control de la Producción',
  },
  {
    course: 'Tecnología de Control',
    required: 'Sistemas de Representación para Ingeniería',
  },
  {
    course: 'Tecnología de Control',
    required: 'Diseño de Instalaciones y Procesos',
  },
  {
    course: 'Introducción a los Procesos de Fabricación',
    required: 'Tecnología de los Materiales',
  },
  {
    course: 'Introducción a los Procesos de Fabricación',
    required: 'Física Experimental A',
  },
  {
    course: 'Introducción a los Procesos de Fabricación',
    required: 'Mecánica del Sólido',
  },
  {
    course: 'Inglés Profesional A',
    required: 'Inglés II',
  },
  {
    course: 'Sustentabilidad, Higiene y Seguridad',
    required: 'Tecnología de Control',
  },
  {
    course: 'Sustentabilidad, Higiene y Seguridad',
    required: 'Diseño de Instalaciones y Procesos',
  },
  {
    course: 'Sustentabilidad, Higiene y Seguridad',
    required: 'Sistemas de Gestión y Mejora Continua',
  },
  {
    course: 'Desarrollo Económico y Comercio Internacional',
    required: 'Conceptos de Economía Industrial',
  },
  {
    course: 'Desarrollo Económico y Comercio Internacional',
    required: 'Gestión de la Logística Integral y Cadena de Suministros',
  },
  {
    course: 'Sistemas Informáticos de Gestión',
    required: 'Fundamentos de la Programación',
  },
  {
    course: 'Proyecto de Ingeniería Industrial IV',
    required: 'Formulación y Evaluación de Proyectos Productivos',
  },
  {
    course: 'Proyecto de Ingeniería Industrial IV',
    required: 'Sistemas de Gestión y Mejora Continua',
  },
  {
    course: 'Proyecto de Ingeniería Industrial IV',
    required: 'Proyecto de Ingeniería Industrial III',
  },
  {
    course: 'Proyecto de Ingeniería Industrial II',
    required: 'Proyecto de Ingeniería Industrial I',
  },
  {
    course: 'Proyecto de Ingeniería Industrial II',
    required: 'Administración estratégica',
  },
  {
    course: 'Diseño de Instalaciones y Procesos',
    required: 'Termodinámica Industrial',
  },
  {
    course: 'Diseño de Instalaciones y Procesos',
    required: 'Máquinas y Equipos Industriales I',
  },
  {
    course: 'Diseño de Instalaciones y Procesos',
    required: 'Mecánica de Fluidos',
  },
  {
    course: 'Sistemas de Gestión y Mejora Continua',
    required: 'Planificación y Control de la Producción',
  },
  {
    course: 'Álgebra II-B',
    required: 'Álgebra I-B',
  },
  {
    course: 'Termodinámica de Alimentos I',
    required: 'Análisis Matemático III',
  },
  {
    course: 'Termodinámica de Alimentos I',
    required: 'Balance de Masa y Energía',
  },
  {
    course: 'Química Biológica',
    required: 'Fisicoquímica I',
  },
  {
    course: 'Química Biológica',
    required: 'Química del Carbono',
  },
  {
    course: 'Bromatología y Calidad de Alimentos',
    required: 'Técnicas de Análisis Fisicoquímicos',
  },
  {
    course: 'Bromatología y Calidad de Alimentos',
    required: 'Bioquímica de Alimentos',
  },
  {
    course: 'Bioquímica de Alimentos',
    required: 'Química Biológica',
  },
  {
    course: 'Transformación y Preservación de Alimentos',
    required: 'Operaciones Unitarias II',
  },
  {
    course: 'Transformación y Preservación de Alimentos',
    required: 'Bioquímica de Alimentos',
  },
  {
    course: 'Transformación y Preservación de Alimentos',
    required: 'Microbiología',
  },
  {
    course: 'Industrialización de Alimentos I',
    required: 'Bromatología y Calidad de Alimentos',
  },
  {
    course: 'Industrialización de Alimentos I',
    required: 'Microbiología',
  },
  {
    course: 'Control de Procesos en Alimentos',
    required: 'Operaciones unitarias III',
  },
  {
    course: 'Industrialización de Alimentos II',
    required: 'Bromatología y Calidad de Alimentos',
  },
  {
    course: 'Industrialización de Alimentos II',
    required: 'Transformación y Preservación de Alimentos',
  },
  {
    course: 'Operaciones unitarias III',
    required: 'Termodinámica II',
  },
  {
    course: 'Operaciones unitarias III',
    required: 'Termodinámica de alimentos II',
  },
  {
    course: 'Programación II',
    required: 'Programación I',
  },
  {
    course: 'Administración estratégica',
    required: 'Probabilidad y Estadística',
  },
  {
    course: 'Proyecto de Ingeniería Industrial III',
    required: 'Planificación y Control de la Producción',
  },
  {
    course: 'Proyecto de Ingeniería Industrial III',
    required: 'Investigación Operativa B',
  },
  {
    course: 'Proyecto de Ingeniería Industrial III',
    required: 'Proyecto de Ingeniería Industrial II',
  },
  {
    course: 'Gestión integral del mantenimiento',
    required: 'Planificación y Control de la Producción',
  },
  {
    course: 'Gestión integral del mantenimiento',
    required: 'Introducción a los Procesos de Fabricación',
  },
  {
    course: 'Empresas y servicios basadas en el conocimiento',
    required: 'Comportamiento Organizacional y Relaciones del Trabajo',
  },
  {
    course: 'Empresas y servicios basadas en el conocimiento',
    required: 'Gestión de la Tecnología y la Innovación',
  },
  {
    course: 'Sistemas de representación en plantas de procesos',
    required: 'Química General e Inorgánica',
  },
  {
    course: 'Termodinámica de alimentos II',
    required: 'Fisicoquímica I',
  },
  {
    course: 'Termodinámica de alimentos II',
    required: 'Termodinámica de Alimentos I',
  },
  {
    course: 'Microbiología',
    required: 'Química Biológica',
  },
  {
    course: 'Sistemas de comunicaciones',
    required: 'Probabilidad, Estadística y Procesos Estocásticos',
  },
  {
    course: 'Sistemas de comunicaciones',
    required: 'Líneas de Transmisión y Antenas',
  },
  {
    course: 'Instrumentación y mediciones electrónicas I',
    required: 'Electrónica Digital',
  },
  {
    course: 'Instrumentación y mediciones electrónicas I',
    required: 'Electrónica Aplicada',
  },
  {
    course: 'Máquinas eléctricas A',
    required: 'Electrotecnia B',
  },
  {
    course: 'Máquinas eléctricas A',
    required: 'Mediciones Eléctricas A',
  },
  {
    course: 'Control I',
    required: 'Principios de Electrónica',
  },
  {
    course: 'Generación de energía eléctrica A',
    required: 'Introducción a la Termodinámica y Máquinas Térmicas',
  },
  {
    course: 'Generación de energía eléctrica A',
    required: 'Sistemas de Transmisión de Energía Eléctrica',
  },
  {
    course: 'Sistemas de distribución de energía eléctrica',
    required: 'Sistemas de Transmisión de Energía Eléctrica',
  },
  {
    course: 'Accionamientos con Motor eléctrico',
    required: 'Instalaciones Eléctricas A',
  },
  {
    course: 'Accionamientos con Motor eléctrico',
    required: 'Máquinas eléctricas A',
  },
  {
    course: 'Ingeniería de Procesos Biotecnológicos',
    required: 'Fisicoquímica II',
  },
  {
    course: 'Ingeniería de Procesos Biotecnológicos',
    required: 'Química Biológica',
  },
  {
    course: 'Ingeniería de Procesos Biotecnológicos',
    required: 'Microbiología',
  },
]
