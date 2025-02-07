import { Room, Client } from "@colyseus/core";
//import { Schema, MapSchema, type, ArraySchema } from "@colyseus/schema";
import { S2CPackets, C2SPacket } from "shared/src/networking/Packet"
import { randomBytes } from "crypto"
import { State, Bullet, Player, GunState, CircleCollider, RectangleCollider } from "../State"
import { Guns, idList } from "shared/src/game/GunManager/GunManager";

const getRandomNumber = (min: number, max: number) => {
    return Math.random() * (max - min) + min
}


export class GameRoom extends Room<State> {
    maxClients = 8;


    onCreate(options: any) {
        this.setState(new State());
        this.setPatchRate(15.625)

        this.state.colliders.push(new RectangleCollider(0, 500, 50, 5))
        this.state.colliders.push(new RectangleCollider(700, 100, 20, 5))
        this.state.colliders.push(new RectangleCollider(-700, 100, 20, 5))
        this.state.colliders.push(new CircleCollider(-200, -300, 5))
        this.state.colliders.push(new CircleCollider(200, -300, 5))

        this.onMessage(C2SPacket.Ping, (client, message) => {
            client.send(S2CPackets.Pong, {})
        })

        this.onMessage(C2SPacket.Move, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            player.position.x = message.x
            player.position.y = message.y
        })

        this.onMessage(C2SPacket.Shoot, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            let gunInfo = Guns.get(player.gun.gunID)
            //console.log(JSON.stringify(player.gun))

            if ((player.gun.lastTimeShot + player.gun.fireDelay) < Date.now() && (player.gun.lastTimeReloaded + player.gun.reloadDelay) < Date.now()) {
                if (player.gun.ammo > 0) {
                    player.gun.ammo -= 1;

                    for (let i = 0; i < player.gun.bulletsPerShot; i++) {

                        let angle = message.angle + (getRandomNumber(gunInfo.spread * -1, gunInfo.spread + 1) * (Math.PI / 180))
                        this.state.bullets.set(randomBytes(16).toString('hex'), new Bullet(player.position.x, player.position.y, angle, client.id, gunInfo.bulletSpeedMultiplier * getRandomNumber(0.9, 1.1)))
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
        })

        this.onMessage(C2SPacket.Reload, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            let gunInfo = Guns.get(player.gun.gunID)

            if ((player.gun.lastTimeReloaded + player.gun.reloadDelay) < Date.now()) {
                player.gun.lastTimeReloaded = Date.now();
                player.gun.ammo = gunInfo.magSize
            }
        })

        this.onMessage(C2SPacket.Grapple, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            player.grappling = true;
            player.grappleX = message.x
            player.grappleY = message.y
            //this.broadcast(S2CPackets.BulletSpawn, { angle: message.angle, position: { x: player.x, y: player.y } })
        })

        this.onMessage(C2SPacket.EndGrapple, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            if (player.grappling) {
                player.grappling = false
            }
        })

        this.onMessage(C2SPacket.SwapGun, (client, message) => {
            let player = this.state.players.get(client.sessionId)
            if (Guns.has(message.id)) {
                player.gun = new GunState(message.id);
                console.log(client.id, message.id, JSON.stringify(player.gun))
            }
        })


    }

    onBeforePatch() {
        this.state.bullets.forEach((bullet,bkey) => {
            if(this.state.players.has(bullet.shotById)){
                let gunInfo = Guns.get(this.state.players.get(bullet.shotById).gun.gunID)
                // homing test
                /*let otherPlayers = new Map(this.state.players)
                otherPlayers.delete(bullet.shotById)
                let homingPos:{x:number, y:number}
                for(var player of otherPlayers.values()){
                    if(homingPos == undefined){
                        homingPos = player.position
                    }
                    else{
                        if((player.position.x ^ 2 + player.position.y ^ 2) < (homingPos.x ^ 2 + homingPos.y ^ 2)){ // SO inefficient but idk how else to do it lol
                            homingPos = player.position
                        }
                    }
                }
                let homingAngle = Math.atan2(Math.abs(homingPos.y - bullet.position.y), Math.abs(homingPos.x - bullet.position.x)) - bullet.angle
                homingAngle = homingAngle / 1.2 */
                let homingAngle = 0
                bullet.position.x += Math.cos(bullet.angle + homingAngle) * bullet.speed
                bullet.position.y += Math.sin(bullet.angle + homingAngle) * bullet.speed
            }

            this.state.colliders.forEach((collider, key) => {
                if (collider instanceof RectangleCollider) {
                    if (this.intersectsRect(bullet, collider)){
                        this.state.bullets.delete(bkey);
                    }
                }

                if (collider instanceof CircleCollider) {
                    if (Math.hypot(collider.position.x - bullet.position.x, collider.position.y - bullet.position.y) <= (bullet.radius + collider.radius * 10)) {
                        //console.log("HIT CIRCLE")
                        this.state.bullets.delete(bkey);
                    }
                }
            })
        })


        this.state.players.forEach((player) => {
            this.state.bullets.forEach((bullet, key) => {
                if (bullet.shotById != player.id) {
                    if (Math.hypot(player.position.x - bullet.position.x, player.position.y - bullet.position.y) <= (bullet.radius + player.radius)) {
                        player.health -= Guns.get(this.state.players.get(bullet.shotById).gun.gunID).damage
                        this.state.bullets.delete(key);
                        console.log("player health is " + player.health)
                    }
                }
            })
        })

    }


    onJoin(client: Client, options: any) {
        console.log(client.sessionId, "joined!", options);
        if (options && options.name) {
            this.state.players.set(client.sessionId, new Player(options.name, client.id, idList[0]));
        }
    }

    onLeave(client: Client, consented: boolean) {
        console.log(client.sessionId, "left!");
        this.state.players.delete(client.sessionId);
    }

    onDispose() {
        console.log("room", this.roomId, "disposing...");
    }

    intersectsRect(bullet: Bullet, rect: RectangleCollider) {
        let circleDistance = { x: Math.abs(bullet.position.x - rect.position.x), y: Math.abs(bullet.position.y - rect.position.y) }
        let scaledRect = {width:rect.width * 10, height:rect.height * 10}

        if (circleDistance.x > (scaledRect.width + bullet.radius) || circleDistance.y > (scaledRect.height + bullet.radius)) { return false; } // definitely not touching
        if (circleDistance.x <= (scaledRect.width) || circleDistance.y <= (scaledRect.height)) { return true; } // definitely touching

        let cornerDistance = (circleDistance.x - scaledRect.width) ^ 2 + (circleDistance.y - scaledRect.height) ^ 2; // lowkey idk how thismath works but it saves a sqrt so whatever
        
        return (cornerDistance <= (bullet.radius ^ 2));
    }

}
