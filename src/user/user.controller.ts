import { Get, Controller, Patch, Param, ForbiddenException, Body, Delete } from "@nestjs/common";
import { Session, type UserSession } from "@thallesp/nestjs-better-auth";
import { UserService } from "./user.service";
import { UpdateUserDto } from "./dto";
@Controller('users')
export class UserController {
    constructor(private readonly userService: UserService){}

    @Get('me')
    async getProfile(@Session() session: UserSession){
        return {
            data: { user: session.user, session: session.session }
        }
    }
    
    @Patch(':id')
    async updateProfile(
        @Session() session: UserSession,
        @Param('id') id: string,
        @Body() payload: UpdateUserDto
    ){
        if (session.user.role !== "admin") throw new ForbiddenException("Not allowed.");

        const data = await this.userService.update(id, payload);
        return {
            data
        };
    }

    @Get()
    async getAll(
        @Session() session: UserSession,
    ){
        if (session.user.role !== "admin") throw new ForbiddenException("Not allowed.");

        const data = await this.userService.getAll();
        return {
            data
        };
    }
    
    @Delete(':id')
    async delete(
        @Session() session: UserSession,
        @Param('id') id: string,
    ){
        if (session.user.role !== "admin") throw new ForbiddenException("Not allowed.");

        const data = await this.userService.deleteOne(id);
        return {
            data
        };
    }

}

