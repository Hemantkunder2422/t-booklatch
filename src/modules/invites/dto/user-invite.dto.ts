import { IsEmail } from "class-validator";

export class UserInviteDto {
    @IsEmail()
    email!:string
}