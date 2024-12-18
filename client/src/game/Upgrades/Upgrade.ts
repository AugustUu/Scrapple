export class Upgrade{
    static bonusJump = 0
    static bonusSpeed = 0

    static initUpgrades(upgrades: Upgrades[]){
        for(var upgrade of upgrades){
            Upgrade.processUpgrade(upgrade)
        }
    }

    static processUpgrade(upgrade: Upgrades){
        switch(upgrade){
            case Upgrades.jump1:
                Upgrade.bonusJump = 10
                break;
            case Upgrades.jump2:
                Upgrade.bonusJump = 20
                break;
            case Upgrades.jump3:
                Upgrade.bonusJump = 30
                break;
        }
    }
}

enum Upgrades{
    jump1,
    jump2,
    jump3,
    speed1,
    speed2,
    speed3
}