import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Request,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import { extname } from 'path';
import { ProblemsService } from './problems.service';
import { CreateProblemDto } from './dto/create-problem.dto';
import { UpdateProblemDto } from './dto/update-problem.dto';
import { OptionalJwtAuthGuard } from '../auth/optional-jwt-auth.guard';

// NOTE (Phase 0 decision): Write routes are public for now.
// JWT guards will be added in a later phase once the API is stable.
@Controller('problems')
export class ProblemsController {
  constructor(private readonly problemsService: ProblemsService) {}

  /** GET /problems/stats — global stats for landing page */
  @Get('stats')
  getStats() {
    return this.problemsService.getStats();
  }

  /** GET /problems?category=&search=&page=&limit= */
  @Get()
  findAll(
    @Query('category') category?: string,
    @Query('search') search?: string,
    @Query('page') page?: number,
    @Query('limit') limit?: number,
  ) {
    return this.problemsService.findAll({ category, search, page, limit });
  }

  /** GET /problems/:id — includes related ideas + comments */
  @Get(':id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.problemsService.findOne(id);
  }

  /** POST /problems — saves under authenticated user's ID if logged in, else anonymous */
  @UseGuards(OptionalJwtAuthGuard)
  @Post()
  create(@Request() req: any, @Body() dto: CreateProblemDto) {
    return this.problemsService.create(dto, req.user?.userId);
  }

  /** PATCH /problems/:id — public for now (owner check skipped) */
  @Patch(':id')
  update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() dto: UpdateProblemDto,
  ) {
    return this.problemsService.update(id, dto);
  }
  /** POST /problems/:id/evidence-image — Upload an evidence image */
  @UseGuards(OptionalJwtAuthGuard)
  @Post(':id/evidence-image')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv4() + extname(file.originalname);
          cb(null, `${uniqueSuffix}`);
        },
      }),
    }),
  )
  uploadEvidenceImage(
    @Param('id', ParseUUIDPipe) id: string,
    @UploadedFile() file: Express.Multer.File,
  ) {
    const fileUrl = `/uploads/${file.filename}`;
    return this.problemsService.addEvidenceImage(id, fileUrl);
  }

  /** DELETE /problems/:id — public for now (owner check skipped) */
  @Delete(':id')
  remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.problemsService.remove(id);
  }

  /** POST /problems/:id/vote — public anonymous voting for problems */
  @Post(':id/vote')
  vote(@Param('id', ParseUUIDPipe) id: string) {
    return this.problemsService.vote(id);
  }
}
