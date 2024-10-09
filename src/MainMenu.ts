import { Input } from "@pixi/ui";
import { GameState, StateSystem } from "./util/StateSystem";
import { Container, Graphics, Sprite } from "pixi.js";
import { app } from ".";

export class MainMenu {

    static init() {
        var container: Container;

        StateSystem.onEnter(GameState.menu, (old_state) => {

            const container = new Container();
            app.stage.addChild(container);

            text_box = new Input({
                bg: new Graphics().rect(0, 0, 300, 30).fill(0xff0000),
                placeholder: 'hello world',
                padding: {
                 top: 10,
                 right: 10,
                 bottom: 10,
                 left: 10
                }
            });

            text_box2 = new Input({
                bg: new Graphics().rect(0, 0, 300, 30).fill(0xff0000),
                placeholder: 'hello world',
                padding: {
                 top: 10,
                 right: 10,
                 bottom: 10,
                 left: 10
                }
            });

            text_box.position._x = window.innerWidth / 2
            text_box.position._y = window.innerHeight / 2

            app.stage.addChild(text_box);
        })

        StateSystem.onExit(GameState.menu, (old_state) => {

        })
    }

}