import { Bullet, GunState, Player, State } from "server/src/State"
import { LocalPlayer } from "client/src/game/LocalPlayer"
import { GameRoom } from "server/src/rooms/GameRoom"

export class Upgrade {
    name: string;
    max: number
    upgradeDep?: { upgrade: string, level: number }
    gunDep?: string
    description?: string

    constructor(name?: string, max?: number, upgradeDep?: { upgrade: string, level: number }, gunDep?: string, description?: string) {
        this.name = name
        this.max = max
        this.upgradeDep = upgradeDep
        this.gunDep = gunDep
        this.description = description;
    }

    serverOnPlayerConstructed(level: number, player: Player) {

    }

    serverOnGunConstructed(level: number, gun: GunState) {

    }

    serverOnServerTick(level: number, state: State, player: Player) {
        
    }

    serverOnShoot(level: number, bullet: Bullet, state: State, player: Player) {
        
    }

    serverOnPlayerHit(level: number, state: State, player: Player, otherPlayer: Player) {
        
    }

    clientOnPlayerConstructed(level: number, player: LocalPlayer){

    }
}