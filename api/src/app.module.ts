import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Profile } from './profiles/profile.entity';
import { Problem } from './problems/problem.entity';
import { Idea } from './ideas/idea.entity';
import { Comment } from './comments/comment.entity';
import { Vote } from './votes/vote.entity';
import { Team } from './teams/team.entity';
import { TeamMember } from './teams/team-member.entity';
import { AuthModule } from './auth/auth.module';
import { ProblemsModule } from './problems/problems.module';
import { IdeasModule } from './ideas/ideas.module';
import { CommentsModule } from './comments/comments.module';
import { ProfilesModule } from './profiles/profiles.module';
import { VotesModule } from './votes/votes.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASS'),
        database: configService.get<string>('DB_NAME'),
        entities: [Profile, Problem, Idea, Comment, Vote, Team, TeamMember],
        synchronize: false,
        ssl: {
          rejectUnauthorized: false,
          // SNI needed when connecting via raw IP instead of hostname
          servername: 'aws-0-ap-northeast-2.pooler.supabase.com',
        },
        extra: {
          connectionTimeoutMillis: 10000,
        },
      }),
    }),
    AuthModule,
    ProblemsModule,
    IdeasModule,
    CommentsModule,
    ProfilesModule,
    VotesModule,
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', '..', 'uploads'),
      serveRoot: '/uploads/',
    }),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
