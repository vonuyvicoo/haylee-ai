import { InternalServerErrorException } from "@nestjs/common";
import { Injectable } from "@nestjs/common";
import { HayleeTool } from "../base";

@Injectable()
export class HayleeToolFactory {
    private tools: Record<string, HayleeTool> = {};

    constructor(){}

    register(name: string, tool: HayleeTool): void {
        this.tools[name] = tool;
    }

    getTools(){
        return this.tools;
    }

    create(name: string){
        if(this.tools[name]){
            return this.tools[name];
        }
        throw new InternalServerErrorException("Something went wrong.");
    }
}
