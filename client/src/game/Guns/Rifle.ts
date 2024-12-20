import { Gun } from "./Gun";

export class Rifle extends Gun {

    constructor(){
        super("rifle", 5, 0.2, 3, 15, 3, 1, true)
    }
}