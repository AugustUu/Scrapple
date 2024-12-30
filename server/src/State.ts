import { Schema, MapSchema, type } from "@colyseus/schema";


export class Position extends Schema {
    @type("number") x: number;
    @type("number") y: number;

    constructor(x: number, y: number) {
        super();
        this.x = x;
        this.y = y;
    }
}

export class Player extends Schema {
    @type("string") name: string;

    @type(Position) position: Position;

    @type("boolean") grappling: boolean;
    @type("number") grappleX: number;
    @type("number") grappleY: number;

    constructor(name: string) {
        super();
        this.name = name
        this.position = new Position(0, 0)
    }
}

export class Bullet extends Schema {
    @type(Position) position: Position;
    @type("number") angle: number;

    constructor(x: number, y: number, angle: number) {
        super()
        this.position = new Position(x, y)
        this.angle = angle;

    }
}

export class State extends Schema {
    @type({ map: Player }) players = new MapSchema<Player>();
    @type({ map: Bullet }) bullets = new MapSchema<Bullet>();
}
