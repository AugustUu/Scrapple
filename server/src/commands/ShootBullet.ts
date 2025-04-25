import { Command } from "@colyseus/command";
import { GameRoom } from "../rooms/GameRoom";
import { Client } from "colyseus";
import { Bullet } from "../State";
import { Guns } from "shared/src/game/GunManager/GunManager";
import { randomBytes } from "crypto"
import { Upgrades } from "shared/src/game/UpgradeManager/UpgradeManager";


export class ShootCommand extends Command<GameRoom, { client: Client, message: any }> {

    execute({ client, message } = this.payload) {

        if((this.state.game.roundStartTime + 1000) > Date.now()){
            return;
        }

        if (this.state.players.has(client.sessionId)) {
            let player = this.state.players.get(client.sessionId)
            let clientInfo = this.state.clients.get(client.sessionId)


            if ((player.gun.lastTimeShot + player.gun.fireDelay) < Date.now() && (player.gun.lastTimeReloaded + player.gun.reloadDelay) < Date.now()) {
                if (player.gun.ammo > 0) {
                    player.gun.ammo -= 1;

                    for (let i = 0; i < player.gun.bulletsPerShot; i++) {
                        let angle = message.angle + (getRandomNumber(player.gun.spread * -1, player.gun.spread + 1) * (Math.PI / 180))
                        let bullet = new Bullet(player.position.x, player.position.y, angle, player.gun.bulletSize, client.id, player.gun.bulletSpeedMultiplier * getRandomNumber(0.9, 1.1), message.homeRadius, message.homeStrength)
                        this.state.bullets.set(randomBytes(16).toString('hex'), bullet)

                        this.state.clients.get(client.id).upgrades.forEach((upgrade) => {
                            Upgrades.get(upgrade.upgradeID).serverOnShoot(upgrade.level, bullet, this.state, player)
                        })
                    }

                    player.gun.lastTimeShot = Date.now()
                }
                else {
                    if ((player.gun.lastTimeReloaded + player.gun.reloadDelay) < Date.now()) {
                        player.gun.lastTimeReloaded = Date.now();
                        player.gun.ammo = player.gun.magSize
                    }
                }

            }
        }



    }

}

const getRandomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min
}