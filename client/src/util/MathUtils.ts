export class Vector2 {
    x: number;
    y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;

    }

    public magnitude() {
        return (Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)));
    }

    public normalized() {
        var magnitude = this.magnitude();
        return (new Vector2(this.x / magnitude, this.y / magnitude));
    }

    public mul(multiplicand: number) {
        return (new Vector2(this.x * multiplicand, this.y * multiplicand))
    }

    public rotate(radians: number) {
        let angle = Math.atan2(this.y, this.x)
        angle += radians
        let rot_angle = new Vector2(Math.cos(angle), Math.sin(angle))
        return rot_angle.mul(this.magnitude())
    }
}

export class MathUtils {
    static screenToRapier(pos: {x: number, y: number}){
        return new Vector2((pos.x - window.innerWidth / 2) / 10, -(pos.y - window.innerHeight / 2) / 10)
    }

    static rapierToScreen(pos: {x: number, y: number}){
        return new Vector2(pos.x * 10 + window.innerWidth / 2, pos.y * -10 + window.innerHeight / 2)
    }
}