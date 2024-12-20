export class Vector2 {
    x: number;
    y: number;
    constructor(values: {x: number, y: number}) {
        this.x = values.x;
        this.y = values.y;

    }

    public magnitude() {
        return (Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)));
    }

    public normalized() {
        var magnitude = this.magnitude();
        return (new Vector2({x:this.x / magnitude, y:this.y / magnitude}));
    }

    public add(adding: {x: number, y: number}){
        return (new Vector2({x:this.x + adding.x, y:this.y + adding.y}))
    }

    public sub(subtracting: {x: number, y: number}){
        return (new Vector2({x:this.x - subtracting.x, y:this.y - subtracting.y}))
    }

    public scale(multiplicand: number) {
        return (new Vector2({x:this.x * multiplicand, y:this.y * multiplicand}))
    }

    
    public rotate(radians: number) {
        let angle = Math.atan2(this.y, this.x)
        angle += radians
        let rot_angle = new Vector2({x:Math.cos(angle), y:Math.sin(angle)})
        return rot_angle.scale(this.magnitude())
    }
}

export class MathUtils {
    static screenToRapier(pos: {x: number, y: number}){
        return new Vector2({x:(pos.x - window.innerWidth / 2) / 10, y:-(pos.y - window.innerHeight / 2) / 10})
    }

    static rapierToScreen(pos: {x: number, y: number}){
        return new Vector2({x:pos.x * 10 + window.innerWidth / 2, y:pos.y * -10 + window.innerHeight / 2})
    }
}