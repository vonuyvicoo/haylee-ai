import { Injectable, InternalServerErrorException, NotFoundException } from "@nestjs/common";
import { UpdateUserDto } from "./dto";
import { PrismaService } from "@core/prisma/prisma.service";

@Injectable()
export class UserService {
    constructor(private readonly prisma: PrismaService){}

    async update(id: string, payload: UpdateUserDto){
        const updated = await this.prisma.user.update({
            where: {
                id
            }, data: {
                name: payload.name,
                role: payload.role
            }
        });

        return updated;
    }

    async getAll(){
        const data = await this.prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true,
                role: true,
                plans: {
                    include: {
                        cycles: true
                    }
                }
            },
        });
        
        return data;
    }

    async deleteOne(id: string){
        try {
            await this.prisma.user.delete({
                where: {
                    id
                }
            });

            return {
                message: "Successfully deleted."
            }
        } catch {
            throw new InternalServerErrorException("Something went wrong.");
        }
    }

}
