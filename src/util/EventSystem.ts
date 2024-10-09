export class EventSystem {
    private static listeners: Map<String, Array<(args: Object) => void>> = new Map();;

    public static on(event: String, func: (args: Object) => void): void {
        if (!this.listeners.get(event)) {
            this.listeners.set(event, [])
        }

        this.listeners.get(event)?.push(func)
    }

    public static emit(event: String, args: Object): void {
        this.listeners.get(event)?.forEach(listener => {
            listener(args);
        })
    }

}
/*
example:

    EventSystem.on("GameStarted",(test) => { 
        console.log(test)
    })

    EventSystem.emit("GameStarted",{a:1});
*/
