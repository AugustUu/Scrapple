import { Packet } from "./packet"

interface Ping extends Packet {
    name: "ping",
    args: {
        time: number
    }
}



