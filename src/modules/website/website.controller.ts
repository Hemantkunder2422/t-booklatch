import { Controller, Get, Post, Body } from '@nestjs/common';
import { WebsiteService } from './website.service';
import { CreateWebsiteDto } from './dto/create-website.dto';

@Controller('contact')
export class WebsiteController {
  constructor(private readonly websiteService: WebsiteService) {}

  @Post('form')
  create(@Body() createWebsiteDto: CreateWebsiteDto) {
    return this.websiteService.createLead(createWebsiteDto);
  }
}
