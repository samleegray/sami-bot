import { Monster, Entity } from '../dw.d'
import { LOG } from './setup'

interface CombatDetails {
    id: number

    minHp: number
    minMp: number
    restingHealThreshold: number
    healInCombatThreshold: number
    moveToTargetThreshold: number
    meleeRange: number
    meleeSkill: number
    magicSkill: number
    healSkill: number
}

let combatDetails: CombatDetails = {
    id: dw.character.id,

    minHp: dw.character.hpMax,
    minMp: dw.character.mpMax,
    restingHealThreshold: dw.character.hpMax,
    healInCombatThreshold: 115,
    moveToTargetThreshold: 3,
    meleeRange: .5,
    meleeSkill: 0,
    magicSkill: 1,
    healSkill: 2,
};

export class CombatManager {
    // Get the closest enemy.
    getClosestEnemy(): Monster | null {
        return dw.findClosestMonster();
    }

    // Stop player from moving.
    stopPlayer(): void {
        dw.move(dw.c.x, dw.c.y);
    }

    // Determine if player is in combat.
    isInCombat(): boolean {
        return dw.c.combat == 1;
    }

    // Determine if the player is ready to fight.
    isReadyToFight(): boolean {
        return dw.c.hp >= combatDetails.minHp && dw.c.mp >= combatDetails.minMp;
    }

    // Determine if the player can attack.
    canAttack(): boolean {
        return dw.isSkillReady(combatDetails.meleeSkill) == true || dw.isSkillReady(combatDetails.magicSkill) == true;
    }

    // Determine if the player needs rest.
    needsRest(): boolean {
        return dw.c.hp <= combatDetails.restingHealThreshold;
    }

    // Perform resting actions.
    rest(): void {
        if (dw.c.hp < combatDetails.restingHealThreshold) {
            this.stopPlayer();
            this.heal();
        }
    }

    // Determine if the player needs to heal in combat.
    shouldHealInCombat(): boolean {
        return dw.c.hp <= combatDetails.healInCombatThreshold;
    }

    // Perform healing actions.
    heal(): void {
        dw.useSkill(combatDetails.healSkill, combatDetails.id);
    }

    // Get distance to target.
    getDistanceToTarget(target: Entity): number {
        return dw.distance(dw.c.x, dw.c.y, target.x, target.y);
    }

    // Determine if the player is in magic range.
    isInMagicRange(target: Entity, distance: number): boolean {
        return dw.isSkillInRange(combatDetails.magicSkill, target.x, target.y) &&
            distance <= combatDetails.moveToTargetThreshold;
    }

    // Determine if the player is in melee range.
    isInMeleeRange(target: Entity, distance: number): boolean {
        return dw.isSkillInRange(combatDetails.meleeSkill, target.x, target.y) &&
         distance <= combatDetails.meleeRange;
    }

    // Attack the target with magic.
    attackWithMagic(target: Entity): void {
        dw.useSkill(combatDetails.magicSkill, target.id);
    }

    // Attack the target with melee.
    attackWithMelee(target: Entity): void {
        dw.useSkill(combatDetails.meleeSkill, target.id);
    }

    // Perform core combat actions. Designed for main loop.
    combat(): void {
        const target = this.getClosestEnemy();
        if (!target) {
            return;
        }

        let inCombat = this.isInCombat();
        let readyToFight = this.isReadyToFight();

        // If we're in combat & should heal, do so.
        if (inCombat && this.shouldHealInCombat()) {
            this.heal();
        }

        // If we're in combat or ready to fight, set the target.
        if (inCombat || readyToFight) {
            dw.setTarget(target.id);
        } else {
            // If we're not in combat or ready to fight, rest.
            this.rest();
            return;
        }

        // Make sure we're able to attack.
        if (!this.canAttack()) {
            return;
        }

        // Get distance to target.
        let distance = this.getDistanceToTarget(target);
        LOG(`Distance to target: ${distance}`);

        // Determine if we should move to target.
        if (!this.isInMagicRange(target, distance)) {
            LOG(`Moving to target.`);
            dw.move(target.x, target.y);
            return;
        } else if (this.isInMeleeRange(target, distance)) {
            LOG(`Attacking target.`);
            this.attackWithMelee(target);
            return;
        } else {
            this.stopPlayer();
        }

        // Use magic on target.
        this.attackWithMagic(target);
    }
}