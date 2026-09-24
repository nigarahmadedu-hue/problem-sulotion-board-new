import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Vote } from './vote.entity';

@Injectable()
export class VotesService {
  constructor(
    @InjectRepository(Vote)
    private readonly voteRepo: Repository<Vote>,
  ) {}

  async toggleVote(ideaId: string, userId: string) {
    const existing = await this.voteRepo.findOne({
      where: { idea_id: ideaId, user_id: userId },
    });

    if (existing) {
      await this.voteRepo.remove(existing);
      return { voted: false };
    } else {
      const vote = this.voteRepo.create({
        idea_id: ideaId,
        user_id: userId,
      });
      await this.voteRepo.save(vote);
      return { voted: true };
    }
  }
}
