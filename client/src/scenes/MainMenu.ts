import { Actor, Color, Scene, SceneActivationContext, Vector } from "excalibur";
import { engine } from "..";
import { Game } from "./Game";
import { Networking } from "../networking/Networking";


export class MainMenu extends Scene {

    private rootElement!: HTMLElement;
    private inputElement!: HTMLInputElement;
    private joinButton!: HTMLElement;
    private createButton!: HTMLElement;
    private quickPlay: HTMLElement;
    private nameInput: HTMLInputElement;
    private colorInput: HTMLInputElement;
    private credits: HTMLElement;
    private serverList: HTMLElement;

    public onInitialize() {
        this.rootElement = document.getElementById('menu')!;
        this.inputElement = document.getElementById('serverInput')! as HTMLInputElement;
        this.joinButton = document.getElementById('joinButton')!;
        this.createButton = document.getElementById('createButton');
        this.quickPlay = document.getElementById('quickplay')!;
        this.credits = document.getElementById('creditsButton')!;
        this.serverList = document.getElementById('serverList')!;

        this.nameInput = document.getElementById('nameInput')! as HTMLInputElement;
        
        this.nameInput.value = "jorbis" + Math.random()

        this.colorInput = (document.getElementById('colorpicker') as HTMLInputElement)

        
        this.quickPlay.addEventListener("click",()=>{
            Networking.quickPlay(this.nameInput.value,this.colorInput.value)
        })

        let self = this
        setInterval(function() {
            if(self.rootElement.style.display != "none"){
                fetch("http://10.176.42.115:2567/lobbies",{ mode: 'cors',}).then((resp) => {
                    if(resp.ok){
                        resp.json().then((servers) => {
                            self.serverList.innerHTML = ""
                            servers.forEach((element: any) => {
                                let item = document.createElement("li");
                                item.innerHTML += `
                                <li class="serverItem">
                                    <div class="serverName">Server: ${element.roomId}</div>
                                    <div class="serverDetails">
                                        <span>Players: ${element.clients}/${element.maxClients} <span>
                                    </div>
                                </li>
                                `
                                item.addEventListener("click",(ev: MouseEvent)=>{
                                    Networking.connect(element.roomId,self.nameInput.value,self.colorInput.value)

                                })

                                self.serverList.appendChild(item)
                            });
                        })
                    }
                })
            }
    },1000)

        this.joinButton.addEventListener("click",()=>{
            if(this.inputElement.value != ""){
                Networking.connect(this.inputElement.value,this.nameInput.value,this.colorInput.value) 
            }
        })

        this.createButton.addEventListener("click",()=>{
            Networking.create(this.nameInput.value,this.colorInput.value)
        })

        this.credits.addEventListener("click",()=>{
            engine.goToScene("credits")
        })

        

    }

    public onActivate(context: SceneActivationContext<unknown>): void {
        this.rootElement.style.display = "block";
    }

    public onDeactivate(context: SceneActivationContext): void {
        this.rootElement.style.display = "none";
    }

}