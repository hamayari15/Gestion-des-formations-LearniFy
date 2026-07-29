console.log("Seed script is running...");

require("dotenv").config();

const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const Participant = require("../models/participant.model");
const Formation = require("../models/Formation.model");
const Inscription = require("../models/Inscription.model");

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    // Delete existing data
    await Participant.deleteMany({});
    await Formation.deleteMany({});
    await Inscription.deleteMany({});

    console.log("🗑 Old data deleted");

    const password = await bcrypt.hash("password123", 10);

    // Participants
    const participantsData = [
      { fullName: "John Smith", age: 28, gender: "Male", email: "john.smith@example.com", language: "en" },
      { fullName: "Emma Johnson", age: 25, gender: "Female", email: "emma.johnson@example.com", language: "en" },
      { fullName: "Michael Brown", age: 33, gender: "Male", email: "michael.brown@example.com", language: "fr" },
      { fullName: "Sophia Wilson", age: 29, gender: "Female", email: "sophia.wilson@example.com", language: "fr" },
      { fullName: "David Miller", age: 41, gender: "Male", email: "david.miller@example.com", language: "en" },
      { fullName: "Olivia Davis", age: 24, gender: "Female", email: "olivia.davis@example.com", language: "en" },
      { fullName: "James Taylor", age: 31, gender: "Male", email: "james.taylor@example.com", language: "fr" },
      { fullName: "Charlotte Moore", age: 27, gender: "Female", email: "charlotte.moore@example.com", language: "fr" },
      { fullName: "Daniel Anderson", age: 36, gender: "Male", email: "daniel.anderson@example.com", language: "en" },
      { fullName: "Mia Thomas", age: 26, gender: "Female", email: "mia.thomas@example.com", language: "fr" },
      { fullName: "William Martin", age: 38, gender: "Male", email: "william.martin@example.com", language: "en" },
      { fullName: "Emily White", age: 30, gender: "Female", email: "emily.white@example.com", language: "fr" },
      { fullName: "Lucas Harris", age: 22, gender: "Male", email: "lucas.harris@example.com", language: "en" },
      { fullName: "Amelia Walker", age: 35, gender: "Female", email: "amelia.walker@example.com", language: "fr" },
      { fullName: "Benjamin Hall", age: 42, gender: "Male", email: "benjamin.hall@example.com", language: "en" },
      { fullName: "Isabella Young", age: 23, gender: "Female", email: "isabella.young@example.com", language: "en" },
      { fullName: "Henry King", age: 34, gender: "Male", email: "henry.king@example.com", language: "fr" },
      { fullName: "Grace Scott", age: 28, gender: "Female", email: "grace.scott@example.com", language: "en" },
      { fullName: "Alexander Green", age: 39, gender: "Male", email: "alex.green@example.com", language: "fr" },
      { fullName: "Chloe Baker", age: 21, gender: "Female", email: "chloe.baker@example.com", language: "en" }
    ];

    const participants = await Participant.insertMany(
      participantsData.map((p) => ({
        ...p,
        password,
      }))
    );

    console.log(`👤 ${participants.length} participants created`);

    // Formations
    const formationsData = [
      {
        theme: "Angular Development",
        modeFormation: "En ligne",
        creditImpot: true,
        droitIndividuel: true,
        periodeDu: new Date("2026-08-01"),
        periodeA: new Date("2026-08-05"),
        horaireDu: "09:00",
        horaireA: "12:00",
      },
      {
        theme: "Node.js & Express",
        modeFormation: "Présentiel",
        numSalle: 201,
        creditImpot: true,
        droitCollectif: true,
        periodeDu: new Date("2026-08-10"),
        periodeA: new Date("2026-08-13"),
        horaireDu: "09:00",
        horaireA: "16:00",
      },
      {
        theme: "MongoDB",
        modeFormation: "Hybride",
        droitIndividuel: true,
        droitCollectif: true,
        periodeDu: new Date("2026-09-01"),
        periodeA: new Date("2026-09-03"),
        horaireDu: "10:00",
        horaireA: "15:00",
      },
      {
        theme: "React",
        modeFormation: "En ligne",
        creditImpot: true,
        periodeDu: new Date("2026-09-15"),
        periodeA: new Date("2026-09-18"),
        horaireDu: "08:30",
        horaireA: "12:30",
      },
      {
        theme: "Docker",
        modeFormation: "Présentiel",
        numSalle: 305,
        periodeDu: new Date("2026-10-01"),
        periodeA: new Date("2026-10-02"),
        horaireDu: "09:00",
        horaireA: "17:00",
      },
      {
        theme: "Spring Boot",
        modeFormation: "Hybride",
        creditImpot: true,
        droitIndividuel: true,
        droitCollectif: true,
        periodeDu: new Date("2026-10-10"),
        periodeA: new Date("2026-10-14"),
        horaireDu: "09:00",
        horaireA: "15:00",
      },
      {
        theme: "Python",
        modeFormation: "En ligne",
        periodeDu: new Date("2026-11-01"),
        periodeA: new Date("2026-11-05"),
        horaireDu: "09:00",
        horaireA: "12:00",
      },
      {
        theme: "Cybersecurity",
        modeFormation: "Présentiel",
        numSalle: 410,
        creditImpot: true,
        periodeDu: new Date("2026-11-15"),
        periodeA: new Date("2026-11-18"),
        horaireDu: "08:30",
        horaireA: "16:30",
      },
      {
        theme: "Artificial Intelligence",
        modeFormation: "Hybride",
        droitCollectif: true,
        periodeDu: new Date("2026-12-01"),
        periodeA: new Date("2026-12-05"),
        horaireDu: "09:00",
        horaireA: "14:00",
      },
      {
        theme: "DevOps",
        modeFormation: "En ligne",
        creditImpot: true,
        periodeDu: new Date("2026-12-15"),
        periodeA: new Date("2026-12-18"),
        horaireDu: "10:00",
        horaireA: "13:00",
      }
    ];

    const formations = await Formation.insertMany(formationsData);

    console.log(`📚 ${formations.length} formations created`);

    const companies = [
      "Tech Solutions",
      "Digital Corp",
      "Smart Systems",
      "NextGen",
      "InnovateX",
      "Global IT",
      "Vision Group"
    ];

    const services = [
      "IT",
      "HR",
      "Marketing",
      "Finance",
      "Sales",
      "Support",
      "Development"
    ];

    const statuses = ["Validée", "En Attente", "Refusée"];

    const inscriptions = [];

    for (let i = 0; i < 40; i++) {
      const participant = participants[Math.floor(Math.random() * participants.length)];
      const formation = formations[Math.floor(Math.random() * formations.length)];

      if (
        inscriptions.find(
          (x) =>
            x.participantId.toString() === participant._id.toString() &&
            x.formationId.toString() === formation._id.toString()
        )
      ) {
        continue;
      }

      inscriptions.push({
        fullName: participant.fullName,
        email: participant.email,
        entreprise: companies[Math.floor(Math.random() * companies.length)],
        service: services[Math.floor(Math.random() * services.length)],
        participantId: participant._id,
        formationId: formation._id,
        status: statuses[Math.floor(Math.random() * statuses.length)],
      });
    }

    await Inscription.insertMany(inscriptions);

    console.log(`📝 ${inscriptions.length} inscriptions created`);

    console.log("🎉 Database seeded successfully!");

    await mongoose.disconnect();

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();