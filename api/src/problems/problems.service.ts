import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Problem } from './problem.entity';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';

// Placeholder anonymous author ID matching the one seeded in schema.sql
const ANONYMOUS_AUTHOR_ID = '5a126e26-2720-4c2a-811b-76b7e57ef36e';

@Injectable()
export class ProblemsService {
  constructor(
    @InjectRepository(Problem)
    private problemsRepository: Repository<Problem>,
  ) {}

  async findAll(query: {
    category?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const page = Math.max(1, Number(query.page) || 1);
    const limit = Math.max(1, Number(query.limit) || 10);
    const { category, search } = query;
    const where: any = {};

    if (category) where.category = category;
    if (search) where.title = ILike(`%${search}%`);

    const [problems, total] = await this.problemsRepository.findAndCount({
      where,
      relations: { author: true },
      order: { created_at: 'DESC' },
      skip: (page - 1) * limit,
      take: limit,
    });

    return {
      data: problems,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async getStats() {
    const totalProblems = await this.problemsRepository.count();
    const totalIdeasRes = await this.problemsRepository.query('SELECT COUNT(*) FROM ideas');
    const totalBuildersRes = await this.problemsRepository.query('SELECT COUNT(*) FROM profiles');
    const categoryCounts = await this.problemsRepository.createQueryBuilder('p')
      .select('p.category', 'category')
      .addSelect('COUNT(p.id)', 'count')
      .groupBy('p.category')
      .getRawMany();

    return {
      totalProblems,
      totalIdeas: parseInt(totalIdeasRes[0].count, 10),
      totalBuilders: parseInt(totalBuildersRes[0].count, 10),
      categoryCounts: categoryCounts.map(c => ({
        category: c.category,
        count: parseInt(c.count, 10),
      })),
    };
  }

  async findOne(id: string) {
    const problem = await this.problemsRepository.findOne({
      where: { id },
      relations: { author: true, ideas: { author: true }, comments: { author: true } },
    });
    if (!problem) throw new NotFoundException(`Problem ${id} not found`);
    return problem;
  }

  async create(dto: CreateProblemDto, authorId?: string) {
    const problem = this.problemsRepository.create({
      ...dto,
      author_id: authorId ?? ANONYMOUS_AUTHOR_ID,
    });
    return this.problemsRepository.save(problem);
  }

  async update(id: string, dto: UpdateProblemDto, requesterId?: string) {
    const problem = await this.findOne(id);

    // Owner check — skip if no requesterId (public mode)
    if (requesterId && problem.author_id !== requesterId) {
      throw new ForbiddenException('You do not own this problem');
    }

    Object.assign(problem, dto);
    return this.problemsRepository.save(problem);
  }

  async remove(id: string, requesterId?: string) {
    const problem = await this.findOne(id);

    if (requesterId && problem.author_id !== requesterId) {
      throw new ForbiddenException('You do not own this problem');
    }

    await this.problemsRepository.remove(problem);
    return { message: 'Problem deleted successfully' };
  }

  async vote(id: string) {
    const problem = await this.findOne(id);
    problem.votes_count += 1;
    await this.problemsRepository.save(problem);
    return { voted: true, message: 'Vote added', votes_count: problem.votes_count };
  }

  async addEvidenceImage(id: string, fileUrl: string) {
    const problem = await this.findOne(id);
    
    // Ensure the array exists
    if (!Array.isArray(problem.evidence_image_urls)) {
      problem.evidence_image_urls = [];
    }

    problem.evidence_image_urls.push(fileUrl);
    problem.evidence_images += 1; // update the counter
    
    await this.problemsRepository.save(problem);
    return { message: 'Image uploaded successfully', url: fileUrl };
  }
}
