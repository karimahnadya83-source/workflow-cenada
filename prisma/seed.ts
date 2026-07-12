import "dotenv/config";
import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("🌱 Mulai seeding data...");

  // 1. Bersihkan data lama (urutan penting: hapus dari tabel "anak" dulu)
  await prisma.testResult.deleteMany();
  await prisma.schedule.deleteMany();
  await prisma.activity.deleteMany();
  await prisma.task.deleteMany();
  await prisma.contact.deleteMany();
  await prisma.waTemplate.deleteMany();
  await prisma.user.deleteMany();

  // 2. Buat User (Sales Admin)
  const hashedPassword = await bcrypt.hash("password123", 10);

  const admin = await prisma.user.create({
    data: {
      name: "Nadya",
      email: "nadya@goldenenglish.com",
      password: hashedPassword,
      role: "ADMIN",
    },
  });

  console.log("✅ User admin dibuat:", admin.email);

  // 3. Buat beberapa Contact dengan stage berbeda-beda
  const contact1 = await prisma.contact.create({
    data: {
      fullName: "Budi Santoso",
      phone: "081234567890",
      email: "budi@example.com",
      address: "Bekasi Timur",
      stage: "NEW_LEAD",
      source: "INSTAGRAM",
      assignedToId: admin.id,
    },
  });

  const contact2 = await prisma.contact.create({
    data: {
      fullName: "Siti Aminah",
      phone: "081298765432",
      email: "siti@example.com",
      address: "Bekasi Barat",
      stage: "TRIAL_SCHEDULED",
      source: "WHATSAPP",
      assignedToId: admin.id,
    },
  });

  const contact3 = await prisma.contact.create({
    data: {
      fullName: "Andi Wijaya",
      phone: "081211112222",
      email: "andi@example.com",
      address: "Bekasi Utara",
      stage: "CLOSED_WON",
      source: "REFERRAL",
      englishLevel: "Intermediate",
      assignedToId: admin.id,
    },
  });

  console.log("✅ 3 contact dibuat");

  // 4. Buat Activity (Timeline) untuk masing-masing contact
  await prisma.activity.create({
    data: {
      type: "WHATSAPP",
      description: "Menghubungi lead via WhatsApp, menjelaskan program kursus.",
      contactId: contact1.id,
      createdById: admin.id,
    },
  });

  await prisma.activity.create({
    data: {
      type: "STAGE_CHANGE",
      description: "Stage diubah dari CONTACTED ke TRIAL_SCHEDULED.",
      contactId: contact2.id,
      createdById: admin.id,
    },
  });

  await prisma.activity.create({
    data: {
      type: "NOTE",
      description: "Customer sudah closing paket 3 bulan, kelas dimulai minggu depan.",
      contactId: contact3.id,
      createdById: admin.id,
    },
  });

  console.log("✅ Activity dibuat");

  // 5. Buat Task
  await prisma.task.create({
    data: {
      title: "Follow up Budi soal jadwal trial",
      description: "Tanyakan ketersediaan hari Sabtu atau Minggu.",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 24),
      priority: "HIGH",
      contactId: contact1.id,
      assignedToId: admin.id,
    },
  });

  await prisma.task.create({
    data: {
      title: "Siapkan materi trial class untuk Siti",
      dueDate: new Date(Date.now() + 1000 * 60 * 60 * 48),
      priority: "MEDIUM",
      contactId: contact2.id,
      assignedToId: admin.id,
    },
  });

  console.log("✅ Task dibuat");

  // 6. Buat Schedule + TestResult
  const trialSchedule = await prisma.schedule.create({
    data: {
      type: "TRIAL_CLASS",
      status: "SCHEDULED",
      scheduledAt: new Date(Date.now() + 1000 * 60 * 60 * 24 * 3),
      contactId: contact2.id,
    },
  });

  const placementSchedule = await prisma.schedule.create({
    data: {
      type: "PLACEMENT_TEST",
      status: "DONE",
      scheduledAt: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2),
      contactId: contact3.id,
    },
  });

  await prisma.testResult.createMany({
    data: [
      { skillName: "Reading", score: 85, scheduleId: placementSchedule.id },
      { skillName: "Listening", score: 78, scheduleId: placementSchedule.id },
      { skillName: "Grammar", score: 90, scheduleId: placementSchedule.id },
    ],
  });

  console.log("✅ Schedule & TestResult dibuat");

  // 7. Buat WA Template
  await prisma.waTemplate.create({
    data: {
      title: "Reminder Trial Class H-1",
      category: "TRIAL_REMINDER",
      content:
        "Halo {{nama}}, ini pengingat untuk trial class besok pukul {{jadwal}}. Sampai jumpa! 😊",
    },
  });

  await prisma.waTemplate.create({
    data: {
      title: "Follow Up Lead Baru",
      category: "FOLLOW_UP",
      content:
        "Halo {{nama}}, terima kasih sudah tertarik dengan program kursus kami. Boleh kami bantu jadwalkan trial class gratis?",
    },
  });

  console.log("✅ WA Template dibuat");
  console.log("🎉 Seeding selesai!");
}

main()
  .catch((e) => {
    console.error("❌ Error saat seeding:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });