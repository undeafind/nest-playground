import { Injectable } from '@nestjs/common';
import { CreateTagDto } from '../dtos/create-tag.dto';
import { Tag } from '../tag.entity';
import { In, Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
  ) {}

  public async create(payload: CreateTagDto) {
    const tag = this.tagsRepository.create(payload);
    return await this.tagsRepository.save(tag);
  }

  public async findMultipleTags(tags: number[]) {
    return await this.tagsRepository.find({
      where: {
        id: In(tags),
      },
    });
  }

  public async delete(id: number) {
    await this.tagsRepository.delete(id);
    return {
      deleted: true,
      id,
    };
  }

  public async softDelete(id: number) {
    await this.tagsRepository.softDelete(id);
    return {
      deleted: true,
      id,
    };
  }
}
