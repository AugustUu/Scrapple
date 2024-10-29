import { Button, ButtonContainer, Input, } from "@pixi/ui";
import { GameState, StateSystem } from "../util/StateSystem";
import { Container, Graphics, Sprite,Text } from "pixi.js";
import { app } from "..";
import { Network } from "../network/Network";
import { join } from "path";

export class MainMenu {

    static init() {
        var container: Container;

        StateSystem.onEnter(GameState.menu, (old_state) => {


            container = new Container();
            app.stage.addChild(container);

            let [serverId, joinButton, createButton] = this.setupButtons()
            container.addChild(serverId, joinButton, createButton);



            joinButton.on('pointerdown', text => {
                Network.connect(serverId.value)
            })
            createButton.on('pointerdown', text => {
                console.log("yo")
                Network.create()
            })



        })

        StateSystem.onExit(GameState.menu, (old_state) => {
            container.destroy(true);
        })
    }

    private static setupButtons(): [Input, Graphics, Graphics] {
        let joinId = new Input({
            bg: new Graphics().rect(0, 0, 500, 30).fill(0x999999),
        });


        let joinButton = new Graphics()
            .rect(0, 0, 50, 30)
            .fill(0x888877)
        
        let createButton = new Graphics()
            .rect(0, 0, 80, 30)
            .fill(0x888877)
            
        
        joinButton.addChild(new Text({ text: 'Join' }))
        createButton.addChild(new Text({ text: 'Create' }))




        joinId.position._x = window.innerWidth / 2
        joinId.position._y = window.innerHeight / 2 + 100

        joinButton.position._x = joinId.position._x + joinId.width
        joinButton.position._y = joinId.position._y 
        joinButton.eventMode = "static"

        createButton.position._x = joinId.position._x + joinId.width
        createButton.position._y = joinId.position._y + joinId.height
        createButton.eventMode = "static"
        


        return [joinId, joinButton, createButton]
    }

}