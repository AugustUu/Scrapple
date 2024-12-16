import { Gun } from "./Gun";

export class Rifle extends Gun {

    constructor(){
        super("rifle", 5, 20, 30, 5, 1, true)
    }
}