import { Body, Controller, Post } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { CreatePostMetaOptionsDto } from './dtos/create-post-meta-options.dto';
import { MetaOptionsService } from './providers/meta-options.service';

@ApiTags('meta-options')
@Controller('meta-options')
export class MetaOptionsController {
  constructor(private readonly metaOptionsService: MetaOptionsService) {}

  @ApiOperation({
    summary: 'Creates a new meta option',
  })
  @ApiResponse({
    status: 201,
    description:
      'You get a 201 response if your meta option is created successfully',
  })
  @Post()
  public createMetaOption(@Body() payload: CreatePostMetaOptionsDto) {
    return this.metaOptionsService.create(payload);
  }
}
