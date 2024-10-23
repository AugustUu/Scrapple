import { Button, ButtonContainer, Input } from "@pixi/ui";
import { GameState, StateSystem } from "../util/StateSystem";
import { Container, Graphics, Sprite } from "pixi.js";
import { app } from "..";
import { MultiPlayerClient } from "../network/MultiPlayerClient";

export class MainMenu {

    static init() {
        var container: Container;

        StateSystem.onEnter(GameState.menu, (old_state) => {

            MultiPlayerClient.init();

            container = new Container();
            app.stage.addChild(container);

            let [serverId, joinButton] = this.setupButtons()
            container.addChild(serverId, joinButton);



            joinButton.on('pointerdown', text => {
                console.log("game")
                MultiPlayerClient.connect(serverId.value)
            })



        })

        StateSystem.onExit(GameState.menu, (old_state) => {
            container.destroy(true);
        })
    }

    private static setupButtons(): [Input, Graphics] {
        let joinId = new Input({
            bg: new Graphics().rect(0, 0, 500, 30).fill(0xff0000),
            padding: {
                top: 10,
                right: 10,
                bottom: 10,
                left: 10
            }
        });


        let joinButton = new Graphics()
            .rect(0, 0, 100, 100)
            .fill(0x0000ff);


        joinButton.position._x = window.innerWidth / 2
        joinButton.position._y = window.innerHeight / 2 - 100
        joinButton.eventMode = "static"


        joinId.position._x = window.innerWidth / 2
        joinId.position._y = window.innerHeight / 2 + 100


        return [joinId, joinButton]
    }

}