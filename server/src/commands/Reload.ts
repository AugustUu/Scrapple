import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { S2CPackets } from "shared/src/networking/Packet";
import { PlayerClient } from "../State";
import { Guns } from "shared/src/game/GunManager/GunManager";



export class ReloadCommand extends Command<GameRoom, { client: Client}> {

    execute({ client } = this.payload) {

        if (this.state.players.has(client.sessionId)) {
            let player = this.state.players.get(client.sessionId)
            let gunInfo = Guns.get(player.gun.gunID)

            if ((player.gun.lastTimeReloaded + player.gun.reloadDelay) < Date.now()) {
                player.gun.lastTimeReloaded = Date.now();
                player.gun.ammo = gunInfo.magSize
            }
        }
        
    }

}