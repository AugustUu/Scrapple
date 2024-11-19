import Colyseus, { Client, Room } from "colyseus.js";
import { Networking } from "./Networking";
import { publicDecrypt } from "crypto";
import { error } from "console";

export class NetworkClient {

    // FIX THIS BEING BROKEN ????????

    onStateChange(state: any): void {
        console.log("multiPlayerState Changed", state);
        Networking.state = state;
    }

    onLeave(code: number): void {
        console.log("left with code: " + code)
        //  StateSystem.changeState(GameState.menu);
    }


    onError(code: number, message?: string): void {
        console.error(arguments)
    }

    onJoin(room: Room): void {
        console.log(room.sessionId, "joined", room.id);
        //StateSystem.changeState(GameState.inRoom);

        room.onStateChange(this.onStateChange);
        room.onLeave(this.onLeave)
        room.onError(this.onError);

    }



} 