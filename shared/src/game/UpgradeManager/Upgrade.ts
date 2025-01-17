import { Gun } from "../GunManager/Gun";

export class Upgrade {
    name: string;
    level: number
    max: number
    upgradeDep?: { upgrade: string, level: number }
    gunDep?: Gun

    constructor(name?: string, max?: number, upgradeDep?: { upgrade: string, level: number }, gunDep?: Gun) {
        this.name = name
        this.level = 0
        this.max = max
        this.upgradeDep = upgradeDep
        this.gunDep = gunDep
    }
}