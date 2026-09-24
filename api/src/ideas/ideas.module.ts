import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IdeasService } from './ideas.service';
import { IdeasController, VotesController } from './ideas.controller';
import { Idea } from './idea.entity';
import { Vote } from '../votes/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Idea, Vote])],
  providers: [IdeasService],
  controllers: [IdeasController, VotesController],
})
export class IdeasModule {}
