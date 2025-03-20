import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { S2CPackets } from "shared/src/networking/Packet";
import { Bullet, PlayerClient } from "../State";
import { Guns } from "shared/src/game/GunManager/GunManager";
import { randomBytes } from "crypto";



export class ReloadCommand extends Command<GameRoom, { client: Client }> {

    execute({ client } = this.payload) {
        let clientInfo = this.state.clients.get(client.sessionId)

        if (this.state.players.has(client.sessionId)) {
            let player = this.state.players.get(client.sessionId)
            let gunInfo = Guns.get(player.gun.gunID)

            if ((player.gun.lastTimeReloaded + player.gun.reloadDelay) < Date.now()) {

                if (clientInfo.getUpgradeLevel("ReloadBurst") != 0) {
                    let burstBullets = 50
                    for (let i = 0; i < burstBullets; i += 1) {
                        this.state.bullets.set(randomBytes(16).toString('hex'), new Bullet(player.position.x, player.position.y, (2*Math.PI / burstBullets) * i, player.gun.bulletSize, client.id, 2, 0))
                    }
                }

                player.gun.lastTimeReloaded = Date.now();
                player.gun.ammo = player.gun.magSize
            }
        }

    }

}