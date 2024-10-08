export enum GameState {
    loading,
    menu,
    playing
}

export class StateSystem {
    private static state: GameState = GameState.loading; // state a is the default state
    private static listeners_enter: { [T in GameState]?: Array<(event: GameState) => void> } = {};
    private static listeners_exit: { [T in GameState]?: Array<(event: GameState) => void> } = {};


    public static changeSate(new_state: GameState) {
       
        this.listeners_exit[StateSystem.state]?.forEach(listener => {
            listener(new_state);
        });

        
        this.listeners_enter[new_state]?.forEach(listener => {
            listener(StateSystem.state);
        });

        StateSystem.state = new_state;

    }

    public static onEnter(event: GameState, func: (oldState: GameState) => void) {
        if(this.listeners_enter[event] == undefined){
            this.listeners_enter[event] = []
        }

        this.listeners_enter[event]?.push(func)
    }

    public static onExit(event: GameState, func: (oldState: GameState) => void) {
        if(this.listeners_exit[event] == undefined){
            this.listeners_exit[event] = []
        }

        this.listeners_exit[event]?.push(func)
    }
}
/*
example:

    StateSystem.onEnter(GameState.a,(oldState: GameState) => { 
        console.log("Entered gamestate a", oldState)
    })
    StateSystem.onEnter(GameState.b,(oldState: GameState) => { 
        console.log("Entered gamestate b", oldState)
    })


    StateSystem.onExit(GameState.a,(oldState: GameState) => { 
        console.log("Exit gamestate a", oldState)
    })
    StateSystem.onExit(GameState.b,(oldState: GameState) => { 
        console.log("Exit gamestate b", oldState)
    })


    StateSystem.changeSate(GameState.b);
    StateSystem.changeSate(GameState.a);
    StateSystem.changeSate(GameState.b);
    StateSystem.changeSate(GameState.b);
*/