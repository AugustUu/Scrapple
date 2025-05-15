import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { S2CPackets } from "shared/src/networking/Packet";
import { Player, UpgradeState } from "../State";
import { Upgrades } from "shared/src/game/UpgradeManager/UpgradeManager";
import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema";


export class EndGameCommand extends Command<GameRoom, {}> {

    execute({ } = this.payload) {
        this.state.game.inRound = false

        this.state.clients.get(this.state.players.values().next().value.id).wins += 1



        this.state.clients.forEach((client, id) => {
            client.randomizeUpgradeOptions(true, client.gunOptions.options[client.gunOptions.picked])
        })

        if(this.state.clients.get(this.state.players.values().next().value.id).wins == 8){
            this.state.game.gameEnded = true;
            setTimeout(() => {
                this.room.broadcast(S2CPackets.WinGame, {id: this.state.players.values().next().value.name})
            }),100

        }
        else{
            setTimeout(() => {
                let winner = ""
                if(Array.from(this.state.players.values())[0]){
                    winner = Array.from(this.state.players.values())[0].name
                }
                
                this.room.broadcast(S2CPackets.EndGame,{winner: winner})
                this.state.players = new MapSchema<Player>();
            }, 100)
        }



    }

}