import { TargetManager } from "./target";

const targetManager = new TargetManager();

export class CharInfo {
    minHp: number
    minMp: number
    meleeSkill: number
    magicSkill: number
    healSkill: number
    shieldSkill: number
    restingHealThreshold: number
    meleeRange: number

    constructor() {
        this.minHp = 240
        this.minMp = 130
        this.meleeSkill = 0
        this.magicSkill = 1
        this.healSkill = 2
        this.shieldSkill = 4
        this.restingHealThreshold = this.minHp
        this.meleeRange = 0.5
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

    // Sets target, decides if we should heal, determines if we can attack and then tries to.
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

    // Attempt attack.
    private attemptAttack(target: any) {
        // The skill to finally use.
        let skillToUse

        // Go with magic first, secondary melee if they're close.
        if (dw.isInRange(this.charInfo.magicSkill, target)) {
            skillToUse = this.charInfo.magicSkill
        } else if (dw.isInRange(this.charInfo.meleeSkill, target)) {
            skillToUse = this.charInfo.meleeSkill
        }

        // If we can't use the skill, skip.
        if (!dw.canUseRune(skillToUse, target.id) || skillToUse == undefined) {
          return
        }

        // Finally, use the skill to attack.
        dw.useRune(skillToUse, target.id)
    }

    // Main loop for combat.
    public combatLoop() {
        const target = targetManager.nextTarget()

        // Do nothing if we have no target. Should we begin to wonder?
        if (!target) {
            this.hasTarget = false
            return
        } else {
            this.hasTarget = true
        }

        // Check if we're in combat already & defend ourselves if so.
        if (this.isInCombat()) {
            this.handleCombat(target)
            return;
        }

        // If we're not in combat, check if we need to rest.
        if (this.needsRest()) {
            this.heal()
            return
        }

        // If we're not in combat, check if we're ready to fight & not in defense mode.
        if (this.isReadyToFight() && !this.defenseMode) {
            // If we're ready to fight, attack the target.
            this.attemptAttack(target)
            return
        }
    }
}
