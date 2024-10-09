export class Vector2{
    x: number;
    y: number;
    constructor(x: number, y: number){
        this.x = x;
        this.y = y;
        
    }

    public magnitude(){
        return(Math.sqrt(Math.pow(this.x, 2) + Math.pow(this.y, 2)));
    }

    public normalized(){
        var magnitude = this.magnitude();
        return(new Vector2(this.x / magnitude, this.y / magnitude));
    }

    public mul(multiplicand: number){
        return(new Vector2(this.x * multiplicand, this.y * multiplicand))
    }
}