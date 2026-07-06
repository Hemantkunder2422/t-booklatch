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
      throw new ConflictException('We have already received your inquiry.');
    }

    await this.prisma.websiteLead.create({
      data: {
        ...createWebsiteDto,
      },
    });

    return `Thank you ${createWebsiteDto.name} for contacting Booklatch. We have received your inquiry successfully, and our team will reach out to you shortly to understand your requirements and discuss how Booklatch can help streamline your venue operations and bookings.`;
  }
}
