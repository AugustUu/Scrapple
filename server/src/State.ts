import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema";
import exp from "constants";
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
    @type("number") radius: number;
    @type("string") shotById: string;
    @type("number") speed: number;

    constructor(x: number, y: number, angle: number, radius: number, shotById: string, speed: number) {
        super()
        this.position = new Position(x, y)
        this.angle = angle;
        this.shotById = shotById;
        this.radius = radius;
        this.speed = speed;
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

export class PlayerClient extends Schema {
    @type("string") name: string;
    @type("string") id: string;
    @type("boolean") host: boolean;

    constructor(name: string, id: string, host: boolean) {
        super();
        this.name = name
        this.id = id;
        this.host = host
    }
}

export class Game extends Schema {
    @type("boolean") inRound: boolean;
    
}



export class State extends Schema {
    @type({ map: PlayerClient }) clients = new MapSchema<PlayerClient>();
    
    @type({ map: Player }) players = new MapSchema<Player>();
    @type({ map: Bullet }) bullets = new MapSchema<Bullet>();
    @type({ array: Collider }) colliders = new ArraySchema<Collider>();

    @type(Game) game = new Game()

}
