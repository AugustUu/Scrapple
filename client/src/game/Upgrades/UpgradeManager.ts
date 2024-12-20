const upgrades = {
    jump:{
        backwardsJump:{
            sidewardsjump:{}
        }
    },
    speed:{
        dash:{}
    }
} 

export class UpgradeManager{
    static upgrades: Map<string,number>

    static initUpgrades(){
       
    }

    static generateUpgradeOption(){
        let options: string[] = [];
        Object.entries(upgrades).forEach(([id,subUpgrades])=>{

            if(UpgradeManager.upgrades.has(id)){
                //subUpgrades
                UpgradeManager.generateUpgradeOption()
            }else{
                options.push(id)
            }
        })

        return options
    }



}


