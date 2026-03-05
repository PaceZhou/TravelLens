import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './tag.entity';

@Injectable()
export class TagsService {
  constructor(
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  async findAll() {
    return this.tagsRepository.find({ order: { count: 'DESC' } });
  }

  async incrementCount(tagName: string) {
    let tag = await this.tagsRepository.findOne({ where: { name: tagName } });
    if (!tag) {
      tag = this.tagsRepository.create({ name: tagName, count: 1 });
    } else {
      tag.count += 1;
    }
    return this.tagsRepository.save(tag);
  }

  async decrementCount(tagName: string) {
    const tag = await this.tagsRepository.findOne({ where: { name: tagName } });
    if (tag && tag.count > 0) {
      tag.count -= 1;
      await this.tagsRepository.save(tag);
    }
  }
}
