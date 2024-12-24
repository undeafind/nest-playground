import {
  BadRequestException,
  Body,
  Injectable,
  RequestTimeoutException,
} from '@nestjs/common';
import { UsersService } from '../../users/providers/users.service';
import { CreatePostDto } from '../dtos/create-post.dto';
import { Repository } from 'typeorm';
import { Post } from '../post.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { MetaOption } from '../../meta-options/meta-option.entity';
import { TagsService } from '../../tags/providers/tags.service';
import { PatchPostDto } from '../dtos/patch-post.dto';
import { Tag } from '../../tags/tag.entity';
import { GetPostsDto } from '../dtos/get-posts.dto';
import { PaginationProvider } from '../../common/pagination/providers/pagination.provider';
import { Paginated } from '../../common/pagination/interfaces/paginated.interface';
import { CreatePostProvider } from './create-post.provider';
import { IActiveUser } from '../../auth/interfaces/active-user.interface';

@Injectable()
export class PostsService {
  constructor(
    private readonly usersService: UsersService,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
    @InjectRepository(MetaOption)
    private readonly metaOptionsRepository: Repository<MetaOption>,
    private readonly tagsService: TagsService,
    private readonly paginationProvider: PaginationProvider,
    private readonly createPostProvider: CreatePostProvider,
  ) {}

  public async create(@Body() payload: CreatePostDto, user: IActiveUser) {
    return await this.createPostProvider.create(payload, user);
  }

  public async findAll(
    query: GetPostsDto,
    userId: string,
  ): Promise<Paginated<Post>> {
    return await this.paginationProvider.paginateQuery(
      {
        limit: query.limit,
        page: query.page,
      },
      this.postsRepository,
    );
  }

  public async update(payload: PatchPostDto) {
    let tags: Tag[];
    let post: Post;

    try {
      tags = await this.tagsService.findMultipleTags(payload.tags);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!tags || tags.length !== payload.tags.length) {
      throw new BadRequestException(
        'Please check your tag list and ensure they are correct',
      );
    }

    try {
      post = await this.postsRepository.findOneBy({ id: payload.id });
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    if (!post) {
      throw new BadRequestException('Post not found');
    }

    post.title = payload.title ?? post.title;
    post.content = payload.content ?? post.content;
    post.status = payload.status ?? post.status;
    post.postType = payload.postType ?? post.postType;
    post.slug = payload.slug ?? post.slug;
    post.featuredImage = payload.featuredImageUrl ?? post.featuredImage;
    post.publishedOn = payload.publishOn ?? post.publishedOn;

    post.tags = tags;

    let createdPost: Post;

    try {
      createdPost = await this.postsRepository.save(post);
    } catch {
      throw new RequestTimeoutException(
        'Unable to process your request at the moment please try later',
        {
          description: 'Error connecting to the database',
        },
      );
    }

    return createdPost;
  }

  public async delete(id: number) {
    await this.postsRepository.delete(id);

    return { deleted: true, id: id };
  }
}
