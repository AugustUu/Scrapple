import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { C2SPacket, S2CPackets } from "shared/src/networking/Packet";
import { Bullet, PlayerClient } from "../State";
import { Guns } from "shared/src/game/GunManager/GunManager";
import { randomBytes } from "crypto";
import { Networking } from "../../../client/src/networking/Networking";



export class ReloadCommand extends Command<GameRoom, { client: Client }> {

    execute({ client } = this.payload) {
        let clientInfo = this.state.clients.get(client.sessionId)

        if (this.state.players.has(client.sessionId)) {
            let player = this.state.players.get(client.sessionId)
            let gunInfo = Guns.get(player.gun.gunID)

            if ((player.gun.lastTimeReloaded + player.gun.reloadDelay) < Date.now()) {

                if (clientInfo.getUpgradeLevel("Reload Burst") != 0 && player.gun.ammo == 0) {
                    let burstBullets = 50 * clientInfo.getUpgradeLevel("Reload Burst")
                    for (let i = 0; i < burstBullets; i += 1) {
                        let angle = (2*Math.PI / burstBullets) * i + (getRandomNumber(player.gun.spread * -1, player.gun.spread + 1) * (Math.PI / 180))
                        let bullet = new Bullet(player.position.x, player.position.y, angle, player.gun.bulletSize, client.id, 3 * getRandomNumber(0.9, 1.1), 0, 0)
                        this.state.bullets.set(randomBytes(16).toString('hex'), bullet)
                    }
                }

                player.gun.lastTimeReloaded = Date.now();
                player.gun.ammo = player.gun.magSize
            }
        }

    }

}

const getRandomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min
}