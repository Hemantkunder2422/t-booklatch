import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateVenueDto } from './dto/create-venue.dto';
import type { AuthUser } from 'src/types/auth-user.interface';
import { AddVenueSpace } from './dto/add-venue-space.dto';
import { UpdateVenueSpace } from './dto/update-venue.dto';

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

  async mySpaces(venueId:string){
    const spaces = await this.prisma.venueSpaces.findMany(
      {
        where:{
          venueId:venueId
        }
      }
    )
    if(!spaces) throw new NotFoundException("space not found")
    
      return spaces
  }

  async editSpace(dto:UpdateVenueSpace,spaceId:string,user:AuthUser){
    if(!spaceId) throw new NotFoundException("space not found")
    
      const existingSpace = await this.prisma.venueSpaces.findFirst({
        where:{
          id:spaceId,
          venueId:user.venueId
        }
      })

      if(!existingSpace){
        throw new NotFoundException("space not found or access denied")
      }

      const updatedSpace = await this.prisma.venueSpaces.update({
        where:{
          id:spaceId
        },
        data:{
          ...dto
        }
      })
      return updatedSpace
  }
}
