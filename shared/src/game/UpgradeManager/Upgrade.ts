
export class Upgrade{
    name: string;
    level: number
    max: number

    constructor(name?: string, max?: number){
        this.name = name
        this.level = 0
        this.max = max
    }
}