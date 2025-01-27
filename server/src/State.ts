import { Schema, MapSchema, type } from "@colyseus/schema";
import { Guns } from "shared/src/game/GunManager/GunManager";


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
    


    constructor(gunID: string) {
        super();

        this.gunID = gunID
        let gunInfo = Guns.get(gunID)
        
        this.ammo = gunInfo.magSize
        this.lastTimeReloaded = 0;
        this.lastTimeShot = 0;
        this.fireDelay = gunInfo.fireRate * 1000;
        this.reloadDelay = gunInfo.timeToReload * 1000;
        this.bulletsPerShot = gunInfo.bulletsPerShot;
    }
}

export class Player extends Schema {
    @type("string") name: string;
    @type("string") id: string;
    @type("number") health: number = 100;
    @type(Position) position: Position;

    @type(GunState) gun: GunState;

    @type("boolean") grappling: boolean;
    @type("number") grappleX: number;
    @type("number") grappleY: number;

    @type("number") radius: number = 20;

    constructor(name: string, id: string, gunID: string) {
        super();
        this.name = name
        this.id = id;
        this.gun = new GunState(gunID);
        this.position = new Position(0, 0)
    }
}

export class Bullet extends Schema {
    @type(Position) position: Position;
    @type("number") angle: number;
    @type("number") radius: number = 4;
    @type("string") shotById: string;

    constructor(x: number, y: number, angle: number, shotById: string) {
        super()
        this.position = new Position(x, y)
        this.angle = angle;
        this.shotById = shotById;
    }
}

export class State extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
    @type({ map: Bullet }) bullets = new MapSchema<Bullet>();
}
