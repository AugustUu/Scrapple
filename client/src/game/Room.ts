import { Graphics } from "pixi.js";
import { KinematicPhysicsObject, KinPosPhysicsObject, StaticPhysicsObject } from "../physics/PhysicsObject";
import { World } from "../physics/World";
import { GameState, StateSystem } from "../util/StateSystem";
import { player } from "./Player";
import { bullet } from "./Bullet";


export class Room {

    static init() {
        StateSystem.onEnter(GameState.inRoom, () => {

            let circoid = new KinematicPhysicsObject(0.0, 10.0, 1.5, World, new Graphics().circle(0, 0, 15).fill(0xf998fa));
            let ground = new StaticPhysicsObject(0.0, -10.0, 100.0, 2.0, World, new Graphics().rect(0, 0, 2000, 40).fill(0xffffff));
            let wall = new StaticPhysicsObject(20.0, 5.0, 10.0, 100.0, World, new Graphics().rect(0, 0, 200, 2000).fill(0xffffff));
            let box = new StaticPhysicsObject(-40, 20.0, 10.0, 10.0, World, new Graphics().rect(0, 0, 200, 200).fill(0xffffff));
            //cursor_point = new KinPosPhysicsObject(0.0, 0.0, 1.0, 1.0, World, new Graphics().rect(0, 0, 20, 20).fill(0xffffff)); // debug



            new player(0, 20);
            new bullet({x: -10, y: 0}, {x:0, y:0}, 4)
        });
    }


}