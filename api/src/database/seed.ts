import { DataSource } from 'typeorm';
import * as dotenv from 'dotenv';
import { Profile } from '../profiles/profile.entity';
import { Problem } from '../problems/problem.entity';
import { Idea } from '../ideas/idea.entity';
import { Comment } from '../comments/comment.entity';
import { Vote } from '../votes/vote.entity';
import { Team } from '../teams/team.entity';
import { TeamMember } from '../teams/team-member.entity';

dotenv.config();

const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432', 10),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [Profile, Problem, Idea, Comment, Vote, Team, TeamMember],
  synchronize: true, // Only for seeding dev env!
  ssl: { rejectUnauthorized: false },
});

async function runSeed() {
  await AppDataSource.initialize();
  console.log('Database connected');

  // Insert Profiles
  const profileRepo = AppDataSource.getRepository(Profile);
  const ahmed = profileRepo.create({ id: '5a126e26-2720-4c2a-811b-76b7e57ef36e', email: 'ahmed@example.com', name: 'Ahmed Khan', initials: 'AK', role: 'Founder' });
  const mariam = profileRepo.create({ id: '5a126e26-2720-4c2a-811b-76b7e57ef36f', email: 'mariam@example.com', name: 'Mariam Ali', initials: 'MA', role: 'Engineer' });
  await profileRepo.save([ahmed, mariam]);
  console.log('Profiles seeded');

  // Insert Problems
  const problemRepo = AppDataSource.getRepository(Problem);
  const problem1 = problemRepo.create({
    author_id: ahmed.id,
    slug: 'farmers-soil-nutrients',
    title: 'Farmers cannot easily test soil nutrients',
    category: 'agriculture',
    description: "Small farmers often don't have affordable access to reliable soil testing.",
    stage: 'Discussion',
  });
  const problem2 = problemRepo.create({
    author_id: mariam.id,
    slug: 'quality-education',
    title: 'Lack of quality education',
    category: 'education',
    description: 'Schools lack basic resources.',
    stage: 'Research',
  });
  await problemRepo.save([problem1, problem2]);
  console.log('Problems seeded');

  // Insert Ideas
  const ideaRepo = AppDataSource.getRepository(Idea);
  const idea1 = ideaRepo.create({ problem_id: problem1.id, author_id: mariam.id, title: 'Low cost testing kit', description: 'Create a chemical based low cost kit.' });
  await ideaRepo.save([idea1]);
  console.log('Ideas seeded');

  await AppDataSource.destroy();
  console.log('Database seeding complete');
}

runSeed().catch(console.error);
