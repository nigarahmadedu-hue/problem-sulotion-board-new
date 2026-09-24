import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Profile } from './profile.entity';
import { Problem } from '../problems/problem.entity';
import { Idea } from '../ideas/idea.entity';
import { TeamMember } from '../teams/team-member.entity';
import { Vote } from '../votes/vote.entity';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class ProfilesService {
  constructor(
    @InjectRepository(Profile) private profilesRepository: Repository<Profile>,
    @InjectRepository(Problem) private problemsRepository: Repository<Problem>,
    @InjectRepository(Idea) private ideasRepository: Repository<Idea>,
    @InjectRepository(TeamMember) private teamMemberRepository: Repository<TeamMember>,
    @InjectRepository(Vote) private votesRepository: Repository<Vote>,
  ) {}

  findAll() {
    return this.profilesRepository.find({ order: { created_at: 'DESC' } });
  }

  async findOne(id: string) {
    const profile = await this.profilesRepository.findOne({ where: { id } });
    if (!profile) throw new NotFoundException(`Profile ${id} not found`);
    return profile;
  }

  async updateMe(requesterId: string, dto: UpdateProfileDto) {
    const profile = await this.findOne(requesterId);
    Object.assign(profile, dto);
    return this.profilesRepository.save(profile);
  }

  async getDashboard(userId: string) {
    const profile = await this.findOne(userId);

    // Problems authored by this user
    const problems = await this.problemsRepository.find({
      where: { author_id: userId },
      order: { created_at: 'DESC' },
      take: 10,
    });

    // Ideas proposed by this user (include the parent problem title)
    const ideas = await this.ideasRepository.find({
      where: { author_id: userId },
      relations: { problem: true, votes: true },
      order: { created_at: 'DESC' },
      take: 10,
    });

    // Teams this user is part of
    const memberships = await this.teamMemberRepository.find({
      where: { user_id: userId },
      relations: { team: true },
      take: 10,
    });

    // Total votes received on all ideas this user has proposed
    const totalVotesReceived = ideas.reduce(
      (sum, idea) => sum + (idea.votes?.length || 0),
      0,
    );

    return {
      profile: {
        id: profile.id,
        name: profile.name,
        initials: profile.initials,
        email: profile.email,
        role: profile.role,
        bio: profile.bio,
        location: profile.location,
      },
      stats: {
        problemsSubmitted: problems.length,
        ideasProposed: ideas.length,
        votesReceived: totalVotesReceived,
        collaborations: memberships.length,
      },
      problems: problems.map((p) => ({
        id: p.id,
        title: p.title,
        category: p.category,
        stage: p.stage,
        created_at: p.created_at,
      })),
      ideas: ideas.map((idea) => ({
        id: idea.id,
        title: idea.title,
        problemTitle: idea.problem?.title || 'Unknown problem',
        problemId: idea.problem_id,
        votes: idea.votes?.length || 0,
        created_at: idea.created_at,
      })),
      teams: memberships.map((m) => ({
        id: m.team?.id,
        name: m.team?.name,
        initials: (m.team?.name || 'T').slice(0, 2).toUpperCase(),
      })),
    };
  }
}
