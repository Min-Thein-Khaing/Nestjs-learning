import { CreateTagDto } from './../dtos/create.tag.dto';
import { Injectable } from '@nestjs/common';
import { Tag } from '../tags.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private readonly tagRepository: Repository<Tag>,
  ) {}

  async findAll(): Promise<Tag[]> {
    return await this.tagRepository.find();
  }

  async createTag(createTagDto: CreateTagDto) {
    const tag = this.tagRepository.create(createTagDto);
    return await this.tagRepository.save(tag);
  }
}
