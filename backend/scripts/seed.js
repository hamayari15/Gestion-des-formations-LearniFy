console.log("Formation seed script is running...");

require("dotenv").config();

const mongoose = require("mongoose");
const Formation = require("../models/Formation.model");

const formationsData = [
  {
    theme: "Angular Development",
    modeFormation: "En ligne",
    creditImpot: true,
    droitIndividuel: true,
    periodeDu: new Date("2026-08-05"),
    periodeA: new Date("2026-08-09"),
    horaireDu: "09:00",
    horaireA: "12:00",
    isArchived: false,
  },
  {
    theme: "React & Next.js",
    modeFormation: "En ligne",
    creditImpot: true,
    periodeDu: new Date("2026-09-15"),
    periodeA: new Date("2026-09-18"),
    horaireDu: "08:30",
    horaireA: "12:30",
    isArchived: false,
  },
  {
    theme: "Python for Data Science",
    modeFormation: "En ligne",
    droitCollectif: true,
    periodeDu: new Date("2026-11-01"),
    periodeA: new Date("2026-11-05"),
    horaireDu: "09:00",
    horaireA: "12:00",
    isArchived: false,
  },
  {
    theme: "DevOps Fundamentals",
    modeFormation: "En ligne",
    creditImpot: true,
    periodeDu: new Date("2026-12-15"),
    periodeA: new Date("2026-12-18"),
    horaireDu: "10:00",
    horaireA: "13:00",
    isArchived: false,
  },
  {
    theme: "SQL & Database Design",
    modeFormation: "En ligne",
    droitIndividuel: true,
    periodeDu: new Date("2026-05-05"),
    periodeA: new Date("2026-05-08"),
    horaireDu: "09:00",
    horaireA: "12:00",
    isArchived: true,
  },
  {
    theme: "Git & Version Control",
    modeFormation: "En ligne",
    periodeDu: new Date("2026-06-10"),
    periodeA: new Date("2026-06-11"),
    horaireDu: "14:00",
    horaireA: "17:00",
    isArchived: true,
  },

  {
    theme: "Node.js & Express",
    modeFormation: "Présentiel",
    numSalle: 21,
    creditImpot: true,
    droitCollectif: true,
    periodeDu: new Date("2026-08-10"),
    periodeA: new Date("2026-08-13"),
    horaireDu: "09:00",
    horaireA: "16:00",
    isArchived: false,
  },
  {
    theme: "Docker & Kubernetes",
    modeFormation: "Présentiel",
    numSalle: 35,
    periodeDu: new Date("2026-10-01"),
    periodeA: new Date("2026-10-02"),
    horaireDu: "09:00",
    horaireA: "17:00",
    isArchived: false,
  },
  {
    theme: "Cybersecurity Essentials",
    modeFormation: "Présentiel",
    numSalle: 41,
    creditImpot: true,
    periodeDu: new Date("2026-11-15"),
    periodeA: new Date("2026-11-18"),
    horaireDu: "08:30",
    horaireA: "16:30",
    isArchived: false,
  },
  {
    theme: "Project Management (PMP)",
    modeFormation: "Présentiel",
    numSalle: 12,
    droitIndividuel: true,
    droitCollectif: true,
    periodeDu: new Date("2027-01-10"),
    periodeA: new Date("2027-01-14"),
    horaireDu: "09:00",
    horaireA: "17:00",
    isArchived: false,
  },
  {
    theme: "Excel Advanced",
    modeFormation: "Présentiel",
    numSalle: 8,
    periodeDu: new Date("2026-04-12"),
    periodeA: new Date("2026-04-13"),
    horaireDu: "09:00",
    horaireA: "12:00",
    isArchived: true,
  },
  {
    theme: "Leadership & Communication",
    modeFormation: "Présentiel",
    numSalle: 55,
    creditImpot: true,
    periodeDu: new Date("2026-03-02"),
    periodeA: new Date("2026-03-04"),
    horaireDu: "09:00",
    horaireA: "15:00",
    isArchived: true,
  },

  {
    theme: "MongoDB & NoSQL",
    modeFormation: "Hybride",
    droitIndividuel: true,
    droitCollectif: true,
    periodeDu: new Date("2026-09-01"),
    periodeA: new Date("2026-09-03"),
    horaireDu: "10:00",
    horaireA: "15:00",
    isArchived: false,
  },
  {
    theme: "Spring Boot & Microservices",
    modeFormation: "Hybride",
    creditImpot: true,
    droitIndividuel: true,
    droitCollectif: true,
    periodeDu: new Date("2026-10-10"),
    periodeA: new Date("2026-10-14"),
    horaireDu: "09:00",
    horaireA: "15:00",
    isArchived: false,
  },
  {
    theme: "Artificial Intelligence & ML",
    modeFormation: "Hybride",
    droitCollectif: true,
    periodeDu: new Date("2026-12-01"),
    periodeA: new Date("2026-12-05"),
    horaireDu: "09:00",
    horaireA: "14:00",
    isArchived: false,
  },
  {
    theme: "UX/UI Design Principles",
    modeFormation: "Hybride",
    creditImpot: true,
    periodeDu: new Date("2027-02-08"),
    periodeA: new Date("2027-02-11"),
    horaireDu: "09:30",
    horaireA: "13:30",
    isArchived: false,
  },
  {
    theme: "Agile & Scrum Mastery",
    modeFormation: "Hybride",
    droitIndividuel: true,
    periodeDu: new Date("2026-02-15"),
    periodeA: new Date("2026-02-17"),
    horaireDu: "09:00",
    horaireA: "16:00",
    isArchived: true,
  },
  {
    theme: "Digital Marketing Fundamentals",
    modeFormation: "Hybride",
    creditImpot: true,
    droitCollectif: true,
    periodeDu: new Date("2026-01-20"),
    periodeA: new Date("2026-01-23"),
    horaireDu: "10:00",
    horaireA: "14:00",
    isArchived: true,
  },
];

async function seedFormations() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected");

    await Formation.deleteMany({});

    const formations = await Formation.insertMany(formationsData);
    console.log(`📚 ${formations.length} formations created`);

    const archivedCount = formations.filter((f) => f.isArchived).length;
    console.log(`   - ${formations.length - archivedCount} active, ${archivedCount} archived`);
    console.log(`   - ${formations.filter((f) => f.modeFormation === "En ligne").length} En ligne`);
    console.log(`   - ${formations.filter((f) => f.modeFormation === "Présentiel").length} Présentiel`);
    console.log(`   - ${formations.filter((f) => f.modeFormation === "Hybride").length} Hybride`);

    console.log("🎉 Formations seeded successfully!");

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seedFormations();