import { TargetManager } from "./target";

const targetManager = new TargetManager();

export class CharInfo {
    minHp: number;
    minMp: number;
    meleeSkill: number;
    magicSkill: number;
    healSkill: number;
    restingHealThreshold: number;
    meleeRange: number;

    constructor() {
        this.minHp = 240;
        this.minMp = 130;
        this.meleeSkill = 0
        this.magicSkill = 1;
        this.healSkill = 2;
        this.restingHealThreshold = this.minHp;
        this.meleeRange = 0.5;
    }

}

export class CombatManager {
    private charInfo: CharInfo
    public defenseMode = false
    public hasTarget = false

    constructor() {
        this.charInfo = new CharInfo()
    }

    public isInCombat() {
        return dw.c.combat == 1
    }

    private isReadyToFight() {
        return dw.c.hp >= dw.c.maxHp && dw.c.mp >= this.charInfo.minMp
    }

    private canAttack() {
        return dw.canUseSkillCd(this.charInfo.meleeSkill) || dw.canUseSkillCd(this.charInfo.magicSkill)
    }

    private needsRest() {
        return dw.c.hp <= this.charInfo.restingHealThreshold
    }

    private heal() {
        if (!dw.canUseSkillCd()) {
            return;
        }
        dw.useSkill(this.charInfo.healSkill, dw.c.id)
    }

    private handleCombat(target: any) {
        dw.setTarget(target.id)

        // Check if we need to heal. Heal if we're less than 1/3 hp.
        if (dw.c.hp < dw.c.maxHp-(dw.c.maxHp/3)) {
            this.heal()
        }

        // Check if we can attack. Attack if we can.
        if (this.canAttack()) {
            this.attemptAttack(target)
        }
    }

    private attemptAttack(target: any) {
        // Get distance to target.
        // let distanceToTarget = dw.distance(dw.c.x, dw.c.y, target.x, target.y);
        // dw.log(`distanceToTarget: ${JSON.stringify(distanceToTarget)}`);

        let skillToUse
        if (dw.canUseSkillRange(this.charInfo.magicSkill, target)) {
            skillToUse = this.charInfo.magicSkill
        } else if (dw.canUseSkillRange(this.charInfo.meleeSkill, target)) {
            skillToUse = this.charInfo.meleeSkill
        }

        if (skillToUse == undefined) {
            console.log("Not in range.")
            dw.move(target.x, target.y)
            return;
        }

        // If we can't use the skill, skip.
        if (!dw.canUseSkillCd(skillToUse)) {
          return
        }

        dw.useSkill(skillToUse, target.id)

        // // Should add case here for when we're in range to use magic.
        // if (dw.canUseSkillRange(this.charInfo.magicSkill, target)) {
        //     dw.useSkill(this.charInfo.magicSkill, target.id);
        //     didFire = true;
        // } else if (dw.canUseSkillRange(this.charInfo.meleeSkill, target.x, target.y) &&
        //     distanceToTarget <= this.charInfo.meleeRange) {
        //     dw.useSkill(this.charInfo.meleeSkill, target.id);
        //     didFire = true;
        // }

        // If we're in combat or fired, stop moving.
        // if (this.isInCombat() || didFire) {
        //     // dw.move(dw.c.x, dw.c.y)
        // } else {
        //     dw.move(target.x, target.y);
        // }
    }

    public combatLoop() {
        const target = targetManager.nextTarget();

        // Do nothing if we have no target. Should we begin to wonder?
        if (!target) {
            this.hasTarget = false
            return
        } else {
            this.hasTarget = true
        }

        // Check if we're in combat already & defend ourselves if so.
        if (this.isInCombat()) {
            this.handleCombat(target);
            return;
        }

        // If we're not in combat, check if we need to rest.
        if (this.needsRest()) {
            this.heal();
            return;
        }

        // If we're not in combat, check if we're ready to fight & not in defense mode.
        if (this.isReadyToFight() && !this.defenseMode) {
            // If we're ready to fight, attack the target.
            this.attemptAttack(target);
            return;
        }
    }
}
