import { Controller, Get, Post, Body } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { CreateWebsiteDto } from './dto/create-website.dto';
import { Throttle } from '@nestjs/throttler';

@Controller('contact')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}
  @Throttle({ default: { limit: 2, ttl: 60000 } })
  @Post('form')
  create(@Body() createWebsiteDto: CreateWebsiteDto) {
    return this.websiteService.createLead(createWebsiteDto);
  }
}
