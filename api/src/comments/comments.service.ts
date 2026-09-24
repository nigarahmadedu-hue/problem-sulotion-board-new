import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './comment.entity';
import { CreateCommentDto } from './dto/create-comment.dto';

const ANONYMOUS_AUTHOR_ID = '5a126e26-2720-4c2a-811b-76b7e57ef36e';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment) private commentsRepository: Repository<Comment>,
  ) {}

  async findByProblem(problemId: string) {
    return this.commentsRepository.find({
      where: { problem_id: problemId },
      relations: { author: true },
      order: { created_at: 'DESC' },
    });
  }

  async createOnProblem(problemId: string, dto: CreateCommentDto, authorId?: string) {
    const comment = this.commentsRepository.create({
      content: dto.content,
      problem_id: problemId,
      author_id: authorId ?? ANONYMOUS_AUTHOR_ID,
    });
    return this.commentsRepository.save(comment);
  }
}
