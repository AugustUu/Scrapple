import { GameEvent } from "excalibur";
import Colyseus from "colyseus.js";

export type Events = {
    connected: ServerConnected
    disconnected: ServerDisconnected
    stateChanged: StateChanged
    error: Error
    joined: Joined
}

export class ServerConnected extends GameEvent<Colyseus.Room<unknown>> {
    constructor(public target: Colyseus.Room<unknown>) {
        super();
    }
}

export class ServerDisconnected extends GameEvent<number> {
    constructor(public code: number) {
        super();
    }
}

export class Error extends GameEvent<number, string | undefined> {
    constructor(public code: number, public message?: String) {
        super();
    }
}


export class StateChanged extends GameEvent<any> {
    constructor(public newState: any) {
        super();
    }
}


export class Joined extends GameEvent<Colyseus.Room<unknown>> {
    constructor(public room: Colyseus.Room<unknown>) {
        super();
    }
}