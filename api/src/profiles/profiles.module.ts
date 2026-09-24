import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProfilesService } from './profiles.service';
import { ProfilesController } from './profiles.controller';
import { Profile } from './profile.entity';
import { Problem } from '../problems/problem.entity';
import { Idea } from '../ideas/idea.entity';
import { TeamMember } from '../teams/team-member.entity';
import { Vote } from '../votes/vote.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Profile, Problem, Idea, TeamMember, Vote])],
  providers: [ProfilesService],
  controllers: [ProfilesController],
  exports: [ProfilesService],
})
export class ProfilesModule {}
