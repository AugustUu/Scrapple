import Colyseus, { Client, Room } from "colyseus.js";
import { Networking } from "./Networking";
import * as NeworkEvents from "./NeworkEvents";

export class NetworkClient {


    onStateChange(state: any): void {
        console.log("multiPlayerState Changed", state);
        Networking.state = state;

        Networking.events.emit("stateChanged", new NeworkEvents.StateChanged(state));
    }

    onLeave(code: number): void {
        console.log("left with code: " + code)
        Networking.events.emit("disconnected", new NeworkEvents.ServerDisconnected(code));
    }


    onError(code: number, message?: string): void {
        console.error(arguments)
        Networking.events.emit("error", new NeworkEvents.Error(code, message));
    }

    onJoin(room: Room): void {
        console.log(room.sessionId, "joined", room.id);
        //StateSystem.changeState(GameState.inRoom);
        Networking.events.emit("joined", new NeworkEvents.Joined(room));

        room.onStateChange(this.onStateChange);
        room.onLeave(this.onLeave)
        room.onError(this.onError);

    }



} 