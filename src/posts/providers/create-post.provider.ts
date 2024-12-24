import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { CreatePostDto } from '../dtos/create-post.dto';
import { TagsService } from '../../tags/providers/tags.service';
import { UsersService } from '../../users/providers/users.service';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { IActiveUser } from '../../auth/interfaces/active-user.interface';
import { User } from '../../users/user.entity';
import { Tag } from '../../tags/tag.entity';

@Injectable()
export class CreatePostProvider {
  constructor(
    private readonly usersService: UsersService,
    private readonly tagsService: TagsService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  public async create(payload: CreatePostDto, user: IActiveUser) {
    let author: User;
    let tags: Tag[];

    try {
      author = await this.usersService.findOneById(user.sub);
      tags = await this.tagsService.findMultipleTags(payload.tags);
    } catch (error) {
      throw new ConflictException(error);
    }

    if (payload.tags.length !== tags.length) {
      throw new BadRequestException('Please check your tags');
    }

    const post = this.postsRepository.create({
      ...payload,
      author,
      tags,
    });

    try {
      return await this.postsRepository.save(post);
    } catch (error) {
      throw new ConflictException(error, {
        description: 'Ensure post slug is unique and not a duplicate',
      });
    }
  }
}
