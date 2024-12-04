import Colyseus, { Client, Room,  } from "colyseus.js";
import { Networking } from "./Networking";
import * as NeworkEvents from "./NetworkEvents";
import { Schema } from '@colyseus/schema';
import {S2CPackets,C2SPacket} from "shared/src/networking/Packet"

export class NetworkClient {

    public room:Colyseus.Room<any> | null = null;
    public state: any = null;
    public clientId = "";

    onStateChange(state: any): void {
        console.log("multiPlayerState Changed", state);
        this.state = state;

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
        this.room == room

        Networking.events.emit("joined", new NeworkEvents.Joined(room));

        room.onStateChange(this.onStateChange);
        room.onLeave(this.onLeave);
        room.onError(this.onError);
        //room.onMessage("*",this.onMessage);

        room.onMessage(S2CPackets.InitClient,(id)=>{
            this.clientId = id
        })

        room.onMessage(S2CPackets.Pong,()=>{
            room.send(C2SPacket.Ping,{})
        })


        room.send(C2SPacket.Connect,{name:"jorbis"});

    }



} 