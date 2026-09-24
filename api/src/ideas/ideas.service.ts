import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Idea } from './idea.entity';
import { Vote } from '../votes/vote.entity';
import { CreateIdeaDto } from './dto/create-idea.dto';

const ANONYMOUS_AUTHOR_ID = '5a126e26-2720-4c2a-811b-76b7e57ef36e';

@Injectable()
export class IdeasService {
  constructor(
    @InjectRepository(Idea) private ideasRepository: Repository<Idea>,
    @InjectRepository(Vote) private votesRepository: Repository<Vote>,
  ) {}

  async findByProblem(problemId: string) {
    return this.ideasRepository.find({
      where: { problem_id: problemId },
      relations: { author: true, votes: true },
      order: { created_at: 'DESC' },
    });
  }

  async create(problemId: string, dto: CreateIdeaDto, authorId?: string) {
    const idea = this.ideasRepository.create({
      ...dto,
      problem_id: problemId,
      author_id: authorId ?? ANONYMOUS_AUTHOR_ID,
    });
    return this.ideasRepository.save(idea);
  }

  async toggleVote(ideaId: string, userId: string) {
    const idea = await this.ideasRepository.findOne({ where: { id: ideaId } });
    if (!idea) throw new NotFoundException(`Idea ${ideaId} not found`);

    const existing = await this.votesRepository.findOne({
      where: { idea_id: ideaId, user_id: userId },
    });

    if (existing) {
      // Un-vote
      await this.votesRepository.remove(existing);
      return { voted: false, message: 'Vote removed' };
    } else {
      // Vote
      const vote = this.votesRepository.create({ idea_id: ideaId, user_id: userId });
      await this.votesRepository.save(vote);
      return { voted: true, message: 'Vote added' };
    }
  }
}
