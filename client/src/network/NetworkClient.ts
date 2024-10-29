import Colyseus, { Client, Room } from "colyseus.js";
import { GameState, StateSystem } from "../util/StateSystem";
import { Network } from "./Network";
import { publicDecrypt } from "crypto";
import { error } from "console";

 export class NetworkClient {

a = 1;
    // FIX THIS BEING BROKEN ????????

    onStateChange(state: any): void{
        console.log("multiPlayerState Changed", state);
        Network.state = state;
    }

    onLeave(code:number): void{
        console.log("left with code: " + code)
        StateSystem.changeSate(GameState.menu);
    }


    onError(code: number, message?: string): void{
        console.error(arguments)
    }

    onJoin(room: Room): void{
        console.log(room.sessionId, "joined", room.id);
        StateSystem.changeSate(GameState.inRoom);

        room.onStateChange(this.onStateChange);
        room.onLeave(this.onLeave)
        room.onError(this.onError);

    }



} 