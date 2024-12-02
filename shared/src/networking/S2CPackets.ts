import { Packet } from "./packet"

interface Pong extends Packet {
    name: "pong",
    args: {
        time: number
    }
}