import { Controller, Get, Post, Body, Param, ParseUUIDPipe, UseGuards, Request } from '@nestjs/common';
import { IdeasService } from './ideas.service';
import { CreateIdeaDto } from './dto/create-idea.dto';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

const ANONYMOUS_AUTHOR_ID = '5a126e26-2720-4c2a-811b-76b7e57ef36e';

@Controller('problems/:problemId/ideas')
export class IdeasController {
  constructor(private readonly ideasService: IdeasService) {}

  @Get()
  findAll(@Param('problemId', ParseUUIDPipe) problemId: string) {
    return this.ideasService.findByProblem(problemId);
  }

  /** POST /problems/:problemId/ideas — saves under authenticated user if logged in */
  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(
    @Request() req: any,
    @Param('problemId', ParseUUIDPipe) problemId: string,
    @Body() dto: CreateIdeaDto,
  ) {
    return this.ideasService.create(problemId, dto, req.user?.userId);
  }
}

@Controller('ideas')
export class VotesController {
  constructor(private readonly ideasService: IdeasService) {}

  /** POST /ideas/:id/vote — uses authenticated user if logged in, else anonymous */
  @UseGuards(OptionalJwtAuthGuard)
  @Post(':id/vote')
  vote(@Request() req: any, @Param('id', ParseUUIDPipe) ideaId: string) {
    const userId = req.user?.userId ?? ANONYMOUS_AUTHOR_ID;
    return this.ideasService.toggleVote(ideaId, userId);
  }
}
