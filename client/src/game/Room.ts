import { Graphics } from "pixi.js";
import { KinematicPhysicsObject, KinPosPhysicsObject, StaticPhysicsObject } from "../physics/PhysicsObject";
import { World } from "../physics/World";
import { GameState, StateSystem } from "../util/StateSystem";
import { player } from "./Player";


export class Room {

    static init() {
        StateSystem.onEnter(GameState.inRoom, () => {

            let circoid = new KinematicPhysicsObject(0.0, 10.0, 1.0, World, new Graphics().circle(0, 0, 10).fill(0xf998fa));
            let ground = new StaticPhysicsObject(0.0, -10.0, 100.0, 2.0, World, new Graphics().rect(0, 0, 2000, 40).fill(0xffffff));
            //cursor_point = new KinPosPhysicsObject(0.0, 0.0, 1.0, 1.0, World, new Graphics().rect(0, 0, 20, 20).fill(0xffffff)); // debug



            new player(0, 20);
        });
    }


}