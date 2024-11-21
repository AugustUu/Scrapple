type Packet = {
    name: String,
    args: {}
}

interface Ping extends Packet {
    name: "ping",
    args: {
        time: number
    }
}

interface Pong extends Packet {
    name: "ping",
    args: {
        time: number
    }
}