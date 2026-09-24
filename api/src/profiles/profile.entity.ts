import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { Problem } from '../problems/problem.entity';
import { Idea } from '../ideas/idea.entity';
import { Comment } from '../comments/comment.entity';
import { Vote } from '../votes/vote.entity';
import { TeamMember } from '../teams/team-member.entity';

@Entity('profiles')
export class Profile {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'text', nullable: true, unique: true })
  email: string;

  @Column({ type: 'text', nullable: true })
  password_hash: string;

  @Column({ type: 'text' })
  name: string;

  @Column({ type: 'text' })
  initials: string;

  @Column({ type: 'text', nullable: true })
  role: string;

  @Column({ type: 'text', nullable: true })
  role_category: string;

  @Column({ type: 'text', nullable: true })
  bio: string;

  @Column({ type: 'jsonb', default: [] })
  skills: any;

  @Column({ type: 'text', nullable: true })
  location: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;

  @OneToMany(() => Problem, problem => problem.author)
  problems: Problem[];

  @OneToMany(() => Idea, idea => idea.author)
  ideas: Idea[];

  @OneToMany(() => Comment, comment => comment.author)
  comments: Comment[];

  @OneToMany(() => Vote, vote => vote.user)
  votes: Vote[];

  @OneToMany(() => TeamMember, teamMember => teamMember.user)
  team_memberships: TeamMember[];
}
