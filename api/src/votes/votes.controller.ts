import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { VotesService } from './votes.service';

@Controller('ideas')
export class VotesController {
  constructor(private readonly votesService: VotesService) {}

  @Post(':id/vote')
  @UseGuards(JwtAuthGuard)
  toggleVote(@Param('id') id: string, @Request() req: any) {
    return this.votesService.toggleVote(id, req.user.userId);
  }
}
