import { Module } from '@nestjs/common';
import { VenueController } from './venue.controller';
import { VenueService } from './venue.service';
import { StorageModule } from '../storage/storage.module';

@Module({
  controllers: [VenueController],
  providers: [VenueService],
  imports: [StorageModule],
})
export class VenueModule {}
