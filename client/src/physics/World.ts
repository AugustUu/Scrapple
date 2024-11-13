import RAPIER from "@dimforge/rapier2d-compat";
import { app } from "..";

export class World {
    static gravity = { x: 0.0, y: -12.81 };
    static world: RAPIER.World;

    static init() {
        this.world = new RAPIER.World(this.gravity);

        app.ticker.add((delta) => {
            this.world.step();
        })
        this.world.lengthUnit = 10
    }
}