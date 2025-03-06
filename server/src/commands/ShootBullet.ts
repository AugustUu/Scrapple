import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { Bullet  } from "../State";
import { Guns } from "shared/src/game/GunManager/GunManager";
import { randomBytes } from "crypto"


export class ShootCommand extends Command<GameRoom, { client: Client, message: any }> {

    execute({ client, message } = this.payload) {

        if (this.state.players.has(client.sessionId)) {
            let player = this.state.players.get(client.sessionId)
            let clientInfo = this.state.clients.get(client.sessionId)
            let gunInfo = Guns.get(player.gun.gunID)


            if ((player.gun.lastTimeShot + player.gun.fireDelay) < Date.now() && (player.gun.lastTimeReloaded + player.gun.reloadDelay) < Date.now()) {
                if (player.gun.ammo > 0) {
                    player.gun.ammo -= 1;

                    for (let i = 0; i < player.gun.bulletsPerShot; i++) {
                        let angle = message.angle + (getRandomNumber(gunInfo.spread * -1, gunInfo.spread + 1) * (Math.PI / 180))
                        this.state.bullets.set(randomBytes(16).toString('hex'), new Bullet(player.position.x, player.position.y, angle, gunInfo.bulletSize, client.id, gunInfo.bulletSpeedMultiplier * getRandomNumber(0.9, 1.1) + (clientInfo.getUpgradeLevel("ShootSpeed")*10) ))
                    }

                    player.gun.lastTimeShot = Date.now()
                }
                else {
                    if ((player.gun.lastTimeReloaded + player.gun.reloadDelay) < Date.now()) {
                        player.gun.lastTimeReloaded = Date.now();
                        player.gun.ammo = gunInfo.magSize
                    }
                }

            }
        }



    }

}

const getRandomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min
}