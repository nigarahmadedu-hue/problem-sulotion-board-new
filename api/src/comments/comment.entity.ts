import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Profile } from '../profiles/profile.entity';
import { Problem } from '../problems/problem.entity';
import { Idea } from '../ideas/idea.entity';

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  author_id: string;

  @ManyToOne(() => Profile, profile => profile.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'author_id' })
  author: Profile;

  @Column({ type: 'uuid', nullable: true })
  problem_id: string;

  @ManyToOne(() => Problem, problem => problem.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'problem_id' })
  problem: Problem;

  @Column({ type: 'uuid', nullable: true })
  idea_id: string;

  @ManyToOne(() => Idea, idea => idea.comments, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'idea_id' })
  idea: Idea;

  @Column({ type: 'text' })
  content: string;

  @CreateDateColumn({ type: 'timestamptz', default: () => 'CURRENT_TIMESTAMP' })
  created_at: Date;
}
