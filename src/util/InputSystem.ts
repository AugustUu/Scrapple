export class InputSystem {
    static key_state: { [key: string]: boolean } = {};
    static position = { x: 0, y: 0 }
    static mouse_button = -1; // -1 = no button, 0 = left, 2 = right

    static init() {
        window.addEventListener('keyup', (e) => InputSystem.key_state[e.key] = false);
        window.addEventListener('keydown', (e) => InputSystem.key_state[e.key] = true);
        window.addEventListener("mousemove", (event) => {
            InputSystem.position.x = event.clientX
            InputSystem.position.y = event.clientY
        });
        window.addEventListener("mousedown", (event) => {
            console.log(event.button)
            InputSystem.mouse_button = event.button
        });
        addEventListener("mouseup", (event) => {
            InputSystem.mouse_button = -1
        });

        console.log(InputSystem.key_state)
    }

    static isKeyDown(key: string) {
        return InputSystem.key_state[key]
    }

    static getMousePos() {
        return this.position;
    }

    static isMouseDown(key: number) {
        return InputSystem.mouse_button == key
    }
}