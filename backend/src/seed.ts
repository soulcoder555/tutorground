import bcrypt from "bcrypt";
import { getPrisma } from "./prisma";

async function main() {
  const prisma = getPrisma();
  const passwordHash = await bcrypt.hash("TutorGround1", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@tutorground.local" },
    update: {},
    create: {
      name: "TutorGround Admin",
      email: "admin@tutorground.local",
      phone: "9999999999",
      passwordHash,
      role: "ADMIN",
      isVerified: true
    }
  });

  const tutorUser = await prisma.user.upsert({
    where: { email: "anika.math@tutorground.local" },
    update: {},
    create: {
      name: "Anika Sharma",
      email: "anika.math@tutorground.local",
      phone: "9876543210",
      passwordHash,
      role: "TUTOR",
      avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200",
      isVerified: true
    }
  });

  await prisma.tutorProfile.upsert({
    where: { userId: tutorUser.id },
    update: {},
    create: {
      userId: tutorUser.id,
      bio: "Patient mathematics tutor focused on board exam clarity, daily practice, and parent-visible accountability.",
      subjects: ["Math", "Physics"],
      classesTeaching: ["9", "10", "11", "12", "JEE"],
      hourlyRate: 650,
      teachingMode: "BOTH",
      experienceYears: 8,
      qualifications: ["MSc Mathematics", "BEd"],
      verificationLevel: 3,
      ratingAvg: 4.9,
      totalReviews: 32,
      studentCount: 84,
      totalSessions: 620,
      profileUrl: "anika-sharma-math",
      latitude: 32.7266,
      longitude: 74.857,
      address: "Gandhi Nagar",
      city: "Jammu",
      state: "Jammu and Kashmir",
      punctualityScore: 98,
      responseRate: 94,
      consistencyScore: 96,
      teachingStyle: "Concept-first teaching with weekly topic recaps."
    }
  });

  console.log(`Seed complete. Admin id: ${admin.id}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await getPrisma().$disconnect();
  });

