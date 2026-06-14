import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import type { AuthUser } from 'src/types/auth-user.interface';
import { AddVenueSpace } from './dto/add-venue-space.dto';

@Injectable()
export class VenueService {
  constructor(private prisma: PrismaService) {}

   async createVenue(dto: CreateVenueDto, user: AuthUser) {
    return this.prisma.$transaction(async (tx) => {
      const venue = await tx.venue.create({
        data: {
          ...dto,

          createdBy: {
            connect: { id: user.userId },
          },

          owner: {
            connect: { id: user.userId },
          },
        },
      });

      await tx.user.update({
        where: { id: user.userId },
        data: {
          venue: {
            connect: { id: venue.id },
          },
        },
      });

      return venue;
    },{
      maxWait:10000,
      timeout:30000
    });
  }

  async addVenueSpace(dto:AddVenueSpace, user:AuthUser){
      const venue = await this.prisma.venue.findFirst({
        where:{
          id:dto.venueId,
          ownerId:user.userId
        }
      })

      const existingVenueSpace = await this.prisma.venueSpaces.findFirst({
        where:{
          name:dto.name
        }
      })

      if(existingVenueSpace) throw new ConflictException(`Space with ${existingVenueSpace.name} already exists`)

      if(!venue){
        throw new ConflictException("Venue not found")
      }
      await this.prisma.venueSpaces.create({
        data:{
          name:dto.name,
          description:dto.description,
          pax:dto.pax,
          venue:{
            connect:{
              id:dto.venueId
            }
          }
        }
      })
      return {
        message:"space added"
      } 

  }

  async removeSpace(spaceId:string,user:AuthUser){
    const venueSpace = await this.prisma.venueSpaces.findUnique({
      where:{
        id:spaceId,
        venueId:user.venueId
      }
    })

    if(!venueSpace) throw new ConflictException("space not found")
  
    await this.prisma.venueSpaces.delete({
      where:{
        id:spaceId,
      }
    })
    return {
      message:`${venueSpace.name} removed`
    }  
  }
}
