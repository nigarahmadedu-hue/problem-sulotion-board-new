import { Controller, Get, Post, Body, Param, ParseUUIDPipe } from '@nestjs/common';
import { CommentsService } from './comments.service';
import { CreateCommentDto } from './dto/create-comment.dto';

@Controller('problems/:problemId/comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Get()
  findAll(@Param('problemId', ParseUUIDPipe) problemId: string) {
    return this.commentsService.findByProblem(problemId);
  }

  @Post()
  create(
    @Param('problemId', ParseUUIDPipe) problemId: string,
    @Body() dto: CreateCommentDto,
  ) {
    return this.commentsService.createOnProblem(problemId, dto);
  }
}
