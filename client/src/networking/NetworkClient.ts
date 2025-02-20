import Colyseus, { Client, Room,  } from "colyseus.js";
import { Networking } from "./Networking";
import * as NeworkEvents from "./NetworkEvents";
import { Schema } from '@colyseus/schema';
import {S2CPackets,C2SPacket} from "shared/src/networking/Packet"
import { createOtherPlayerEntity } from "../game/Entities/OtherPlayer";
import { Vector } from "excalibur";
import { engine } from "..";
import {State} from "server/src/State"

export class NetworkClient {

    public room:Colyseus.Room<State> | null = null;
    public clientId: string = "";

    onStateChange(state: any): void {
        //console.log("multiPlayerState Changed", state);

        Networking.events.emit("stateChanged", new NeworkEvents.StateChanged(state));
    }

    onLeave(code: number): void {
        console.log("left with code: " + code)
        Networking.events.emit("disconnected", new NeworkEvents.ServerDisconnected(code));
        this.room = null
    }


    onError(code: number, message?: string): void {
        console.error(arguments)
        Networking.events.emit("error", new NeworkEvents.Error(code, message));
    }

    onMessage(type: string | number | Schema, message: any){

    }

    onJoin(room: Room): void {
        this.room = room
        this.clientId = room.sessionId

        console.log("joined",room.id)
        
        Networking.events.emit("joined", new NeworkEvents.Joined(room));

        room.onStateChange(this.onStateChange);
        room.onLeave(this.onLeave);
        room.onError(this.onError);
    
        room.onMessage(S2CPackets.Pong,()=>{
            room.send(C2SPacket.Ping,{})
        })


        room.onMessage(S2CPackets.InitClient,()=>{
            engine.goToScene("startScreen");
        })

        room.onMessage(S2CPackets.StartGame,()=>{
            engine.goToScene("game");
        })

    }



} 