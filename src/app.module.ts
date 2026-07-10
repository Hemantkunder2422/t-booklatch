import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { UserModule } from './modules/user/user.module';
import { PrismaModule } from './modules/prisma/prisma.module';
import { AuthModule } from './modules/auth/auth.module';
import { InvitesModule } from './modules/invites/invites.module';
import { VenueModule } from './modules/venue/venue.module';
import { VendorModule } from './modules/vendor/vendor.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { WebsiteModule } from './modules/website/website.module';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { EnquiryModule } from './modules/enquiry/enquiry.module';
import { ContractsModule } from './modules/contracts/contracts.module';
import { ContactsModule } from './modules/contacts/contacts.module';
import { CustomerModule } from './modules/customer/customer.module';
import { CalendarModule } from './modules/calendar/calendar.module';
import { QuotesModule } from './modules/quotes/quotes.module';
import { StaffModule } from './modules/staff/staff.module';
import { PackagesModule } from './modules/packages/packages.module';
import { InvoiceModule } from './modules/invoice/invoice.module';
import { MailModule } from './modules/mail/mail.module';
import { StorageModule } from './modules/storage/storage.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ThrottlerModule.forRoot([
      {
        ttl: 60000,
        limit: 100,
      },
    ]),
    AuthModule,
    UserModule,
    PrismaModule,
    InvitesModule,
    VenueModule,
    VendorModule,
    BookingsModule,
    WebsiteModule,
    EnquiryModule,
    ContractsModule,
    ContactsModule,
    CustomerModule,
    CalendarModule,
    QuotesModule,
    StaffModule,
    PackagesModule,
    InvoiceModule,
    MailModule,
    StorageModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
