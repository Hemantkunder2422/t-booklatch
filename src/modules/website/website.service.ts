import { ConflictException, Injectable } from '@nestjs/common';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class WebsiteService {
  constructor(private prisma: PrismaService) {}
  async createLead(createWebsiteDto: CreateWebsiteDto) {
    const existingLeads = await this.prisma.websiteLead.findUnique({
      where: {
        email: createWebsiteDto.email,
      },
    });
    if (existingLeads) {
      throw new ConflictException('lead already exists');
    }

    await this.prisma.websiteLead.create({
      data: {
        ...createWebsiteDto,
      },
    });

    return 'lead created successfully';
  }
}
