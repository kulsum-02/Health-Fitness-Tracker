import { connectDatabase, disconnectDatabase } from '../src/config/database.js';
import { User } from '../src/models/User.js';
import { Goal } from '../src/models/Goal.js';
import { Health } from '../src/models/Health.js';
import { initialUser, initialGoal, generateSeedHealthRecords } from '../src/utils/seedData.js';

export const runSeed = async () => {
  console.log('[Seed] Starting database seeding...');
  await connectDatabase();

  // Clear existing collections for demo user
  await User.deleteMany({ userId: initialUser.userId });
  await Goal.deleteMany({ userId: initialUser.userId });
  await Health.deleteMany({ userId: initialUser.userId });

  // 1. Create User
  const user = await User.create(initialUser);
  console.log(`[Seed] User seeded: ${user.name} (${user.userId})`);

  // 2. Create Active Goal
  const goal = await Goal.create(initialGoal);
  console.log(`[Seed] Goal seeded: ${goal.stepGoal} steps, ${goal.weightGoal} kg target`);

  // 3. Create 14-day Health History
  const records = generateSeedHealthRecords(initialUser.userId, initialUser.height);
  await Health.insertMany(records);
  console.log(`[Seed] ${records.length} daily health records seeded successfully.`);

  console.log('[Seed] Database initialization complete!');
};

// If run directly via node scripts/seed.js
if (process.argv[1].endsWith('seed.js')) {
  runSeed()
    .then(() => disconnectDatabase())
    .catch((err) => {
      console.error('[Seed Error]:', err);
      process.exit(1);
    });
}