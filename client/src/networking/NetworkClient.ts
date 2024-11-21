import Colyseus, { Client, Room,  } from "colyseus.js";
import { Networking } from "./Networking";
import * as NeworkEvents from "./NeworkEvents";
import { Schema } from '@colyseus/schema';

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

    onMessage(type: string | number | Schema, message: any){

    }

    onJoin(room: Room): void {
        console.log(room.sessionId, "joined", room.id);
        Networking.events.emit("joined", new NeworkEvents.Joined(room));


        room.onStateChange(this.onStateChange);
        room.onLeave(this.onLeave);
        room.onError(this.onError);
        room.onMessage("*",this.onMessage);

    }



} 