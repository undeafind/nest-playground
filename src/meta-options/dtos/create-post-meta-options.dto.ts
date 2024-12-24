import { IsJSON, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreatePostMetaOptionsDto {
  @ApiProperty({
    example: '{\"sidebarEnabled\": true, \"footerActive\": true}',
    description: 'This is a meta option',
  })
  @IsNotEmpty()
  @IsJSON()
  metaValue: string;
}
