import { app } from "..";

export class InputSystem {
    static keyState: { [key: string]: boolean } = {};
    static position = { x: 0, y: 0 }
    static mouseButton = -1; // -1 = no button, 0 = left, 2 = right

    static init() {
        window.addEventListener('keyup', (e) => InputSystem.keyState[e.key] = false);
        window.addEventListener('keydown', (e) => InputSystem.keyState[e.key] = true);
        window.addEventListener("mousemove", (event) => {
            InputSystem.position.x = event.clientX
            InputSystem.position.y = event.clientY
        });
        window.addEventListener("mousedown", (event) => {
            InputSystem.mouseButton = event.button
        });
        addEventListener("mouseup", (event) => {
            InputSystem.mouseButton = -1
        });

        console.log(InputSystem.keyState)
    }

    static isKeyDown(key: string) {
        return InputSystem.keyState[key]
    }

    static getMousePos() {
        return { x: this.position.x - app.stage.position.x, y: this.position.y - app.stage.position.y };
    }

    static isMouseDown(key: number) {
        return InputSystem.mouseButton == key
    }
}