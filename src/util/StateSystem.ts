export enum State {
    a,
    b,
    c
}

export class StateSystem {
    private static state: State = State.a;
    private static on_change_listeners: Function[]= [];

    public static changeSate(new_state: State) {
        StateSystem.state = new_state;

        this.on_change_listeners.forEach(element => {
            element(new_state);
        });


    }

    public static onStateChange(func: Function) {
        this.on_change_listeners.push(func);
    }
}