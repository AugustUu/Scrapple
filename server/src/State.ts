import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema";
import { Gun } from "shared/src/game/GunManager/Gun";
import { Guns } from "shared/src/game/GunManager/GunManager";
import { Upgrades } from "shared/src/game/UpgradeManager/UpgradeManager";


export class Position extends Schema {
    @type("number") x: number;
    @type("number") y: number;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }
}

export class GunState extends Schema {
    @type("string") gunID: string;

    @type("number") ammo: number;
    @type("number") lastTimeReloaded: number;
    @type("number") reloadDelay: number;
    @type("number") lastTimeShot: number;
    @type("number") fireDelay: number;
    @type("number") bulletsPerShot: number;
    @type("number") spread: number;



    constructor(gunID: string, client: PlayerClient) {
        super();

        this.gunID = gunID
        let gunInfo = Guns.get(gunID)

        this.ammo = gunInfo.magSize
        this.lastTimeReloaded = 0;
        this.lastTimeShot = 0;
        this.fireDelay = gunInfo.fireRate * 1000 - (client.getUpgradeLevel("SprayAndPray") * 100);

        this.reloadDelay = gunInfo.timeToReload * 1000 - (client.getUpgradeLevel("ReloadSpeed") * 500);
        this.bulletsPerShot = gunInfo.bulletsPerShot;

        this.spread = gunInfo.spread + (client.getUpgradeLevel("SprayAndPray") * 8);
    }
}

export class UpgradeState extends Schema {
    @type("string") upgradeID: string;
    @type("number") level: number;

    constructor(upgradeID: string) {
        super();
        this.upgradeID = upgradeID
        this.level = 1
    }
}

export class Player extends Schema {
    @type("string") name: string;
    @type("string") id: string;
    @type("number") health: number;
    @type("number") maxHealth: number;
    @type(Position) position: Position;

    @type(GunState) gun: GunState;

    @type("boolean") grappling: boolean;
    @type("number") grappleX: number;
    @type("number") grappleY: number;

    @type("number") radius: number = 20;

    constructor(name: string, id: string, client: PlayerClient) {
        super();
        this.name = name
        this.id = id;
        this.gun = new GunState(client.gunOptions.options[client.gunOptions.picked], client);
        this.position = new Position(0, 0)
        this.health = 100 + (30 * client.getUpgradeLevel("Tank")) // 30 health per upgrade
        this.maxHealth = this.health
        console.log(client.getUpgradeLevel("Tank"))
    }
}

export class Bullet extends Schema {
    @type(Position) position: Position;
    @type("number") angle: number;
    @type("number") radius: number;
    @type("string") shotById: string;
    @type("number") speed: number;
    @type("number") timeCreated: number;

    constructor(x: number, y: number, angle: number, radius: number, shotById: string, speed: number) {
        super()
        this.position = new Position(x, y)
        this.angle = angle;
        this.shotById = shotById;
        this.radius = radius;
        this.speed = speed;
        this.timeCreated = Date.now()
    }
}

export class Collider extends Schema {
    @type(Position) position: Position;
    @type("string") type: string = "none";

    constructor(x: number, y: number, type: string) {
        super()
        this.type = type
        this.position = new Position(x, y)
    }
}

export class CircleCollider extends Collider {
    @type("number") radius: number;

    constructor(x: number, y: number, radius: number) {
        super(x, y, "Circle")
        this.radius = radius
    }
}
export class RectangleCollider extends Collider {
    @type("number") width: number;
    @type("number") height: number;

    constructor(x: number, y: number, width: number, height: number) {
        super(x, y, "Rectangle")
        this.width = width
        this.height = height
    }
}

class Option extends Schema {
    @type(["string"]) options = new ArraySchema<string>();
    @type("number") picked: number;

    constructor(args: string[]) {
        super()
        this.options = new ArraySchema<string>(...args);
        this.picked = 0;
    }
}

export class PlayerClient extends Schema {
    @type("string") name: string;
    @type("string") id: string;
    @type("boolean") host: boolean;
    @type("number") wins: number;
    @type("string") color: string = "ff3300";


    @type({ map: UpgradeState }) upgrades: MapSchema<UpgradeState>;

    @type(Option) gunOptions: Option;
    @type(Option) upgradeOptions: Option;

    constructor(name: string, id: string, host: boolean, color: string) {
        super();

        this.upgrades = new MapSchema();

        this.randomizeGunOptions()
        this.randomizeUpgradeOptions()

        this.name = name
        this.id = id;
        this.host = host
        this.wins = 0;
        this.color = color
    }

    getUpgradeLevel(upgrade: string) {
        if (this.upgrades.has(upgrade)) {
            return this.upgrades.get(upgrade).level
        } else {
            return 0
        }
    }

    randomizeGunOptions() {
        let gunArray = Array.from(Guns.keys())
        let options = [];
        for (let i = 0; i < 3; i++) {
            let gunNum = Math.floor(Math.random() * gunArray.length)
            options.push(gunArray[gunNum])
            gunArray.splice(gunNum, 1)
        }

        this.gunOptions = new Option(options)
    }

    randomizeUpgradeOptions(heldGunId?: string) {
        let upgradeMap = new Map(Upgrades)

        for (let upgrade of upgradeMap.entries()) {

            if (upgrade[1].level >= upgradeMap.get(upgrade[0]).max) {
                upgradeMap.delete(upgrade[0])
                continue
            }
            

            if (upgradeMap.get(upgrade[0]).upgradeDep != undefined) {
                let dep = upgradeMap.get(upgrade[0]).upgradeDep
                if (this.upgrades.get(dep.upgrade).level < dep.level) {
                    upgradeMap.delete(upgrade[0])
                    continue
                }
            }
            if (upgradeMap.get(upgrade[0]).gunDep != undefined) {
                if(!heldGunId){
                    upgradeMap.delete(upgrade[0])
                    continue
                }
                else{
                    let dep = upgradeMap.get(upgrade[0]).gunDep
                    if(heldGunId != dep){
                        upgradeMap.delete(upgrade[0])
                        continue
                    }
                }
            }
        }

        let options = [];
        let upgradeKeys = Array.from(upgradeMap.keys())
        for (let i = 0; i < 3; i++) {
            if (upgradeKeys.length == 0) {
                break
            }

            let upgradeNum = Math.floor(Math.random() * upgradeKeys.length)
            options.push(upgradeMap.get(upgradeKeys[upgradeNum]).name)
            upgradeKeys.splice(upgradeNum, 1)
        }

        this.upgradeOptions = new Option(options)
    }
}

export class Game extends Schema {
    @type("boolean") inRound: boolean;
    @type("number") roundsPlayed: number;


}



export class State extends Schema {
    @type({ map: PlayerClient }) clients = new MapSchema<PlayerClient>();

    @type({ map: Player }) players = new MapSchema<Player>();
    @type({ map: Bullet }) bullets = new MapSchema<Bullet>();
    @type({ array: Collider }) colliders = new ArraySchema<Collider>();

    @type(Game) game = new Game()

}
