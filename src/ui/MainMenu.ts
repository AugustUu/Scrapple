import { Button, ButtonContainer, Input } from "@pixi/ui";
import { GameState, StateSystem } from "../util/StateSystem";
import { Container, Graphics, Sprite } from "pixi.js";
import { app } from "..";
import { Client } from "../network/client";

export class MainMenu {

    static init() {
        var container: Container;

        StateSystem.onEnter(GameState.menu, (old_state) => {

            container = new Container();
            app.stage.addChild(container);

            let JoinId = new Input({
                bg: new Graphics().rect(0, 0, 500, 30).fill(0xff0000),
                padding: {
                 top: 10,
                 right: 10,
                 bottom: 10,
                 left: 10
                }
            });

            let MyId = new Input({
                bg: new Graphics().rect(0, 0, 500, 30).fill(0xff0000),
                padding: {
                 top: 10,
                 right: 10,
                 bottom: 10,
                 left: 10
                }
            });

            let Join = new Graphics()
            .rect(0, 0, 100, 100)
            .fill(0x0000ff);


            Join.position._x = window.innerWidth / 2
            Join.position._y = window.innerHeight / 2 - 100

            JoinId.position._x = window.innerWidth / 2
            JoinId.position._y = window.innerHeight / 2 + 100

            MyId.position._x = window.innerWidth / 2
            MyId.position._y = window.innerHeight / 2;

            MyId.value = Client.me.id

            MyId.on('pointerdown',text => {
                alert(Client.me.id)
            });

            JoinId.on('pointerdown',text => {
                JoinId.value = prompt("player code","") as string
            })

            Join.on('pointerdown',text => {
                Client.connect(JoinId.value)
            })
            Join.eventMode = "static"


            container.addChild(MyId);
            container.addChild(JoinId);
            container.addChild(Join);
        })

        StateSystem.onExit(GameState.menu, (old_state) => {
            container.destroy(true);
        })
    }

}