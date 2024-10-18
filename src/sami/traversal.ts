import getBreadcrumbs from '../breadcrumbs'
import { hasLineOfSight }  from "../hasLineOfSight";
import { Breadcrumb } from "../breadcrumbs";
import { TargetManager } from "./target";
import {getNextSafeMonster, resetTargets, Target} from "./monsters";

const targetManager = new TargetManager();

type Location = {
    x: number
    y: number
    z: number
}

let hadTarget = false
let lastTarget: Target | undefined
export function traversalLoop()  {
    // Get next target.
  let target = getNextSafeMonster()

  // if (target.entity.hp <= 0 || !dw.c.combat) {
  //   hadTarget = false
  // }
  // does the target entity still exist?
  if (dw.c.combat) {
    dw.move()
    return
  }

  if (target !== undefined && target != null) {
    if (lastTarget !== undefined && target.entity.id != lastTarget.entity.id && dw.entities.filter(e => e.id == lastTarget.entity.id).length > 0) {
      lastTarget = target
    }

    if (dw.entities.filter(e => e.id == target.entity.id).length == 0) {
      hadTarget = false
      lastTarget = undefined
      resetTargets()
    }

    lastTarget = target
    console.log("target: x:" + target.entity.x + ' ' + "y: " + target.entity.y + ' ' + "c.x: " + dw.c.x + ' ' + "c.y: " + dw.c.y + ' ' + "hadTarget: " + hadTarget)
    dw.setTarget(target.entity.id)
    const distanceToTarget = dw.distance(dw.c.x, dw.c.y, target.entity.x, target.entity.y)
    if (hadTarget && !(distanceToTarget > 3)) {
      return
    }
    let closest = getClosestBreadcrumb(target.entity.x, target.entity.y)
    dw.move(closest.x, closest.y)
    hadTarget = true
    return
  } else {
    hadTarget = false
  }

  console.log("Moving to breadcrumb.")
    let losBreadcrumbs = getBreadcrumbsInLineOfSight()
    let losBreadcrumb = losBreadcrumbs[0]

    dw.move(losBreadcrumb.x, losBreadcrumb.y)
}

// Function to get breadcrumbs within line of site of the character. Sorted by distance from character.
export function getBreadcrumbsInLineOfSight() : Breadcrumb[] {
    const cx = dw.c.x
    const cy = dw.c.y

    return getBreadcrumbs().filter(
        (b) => hasLineOfSight({x: b.x+0.5, y: b.y+0.5, z: dw.c.z}, cx, cy)
    )//.sort()
        // .sort((a, b) => dw.distance(a.x, a.y, cx, cy) - dw.distance(b.x, b.y, cx, cy))
}

// Function to get next location from the character location to the target location.
export function getNextStep(target: { x: number, y: number, z: number, id?: number }) : Location {
    const cx = dw.c.x
    const cy = dw.c.y
    const cz = dw.c.z

    const tx = target.x
    const ty = target.y
    const tz = target.z

    let closestBreadToPlayer = getClosestBreadcrumb(cx, cy, cz)
    let closestBreadToTarget = getClosestBreadcrumb(tx, ty, tz)

    if (closestBreadToPlayer === undefined || closestBreadToTarget === undefined) {
        if (closestBreadToPlayer === undefined && closestBreadToTarget !== undefined) {
            return {x: closestBreadToTarget.x, y: closestBreadToTarget.y, z: tz}
        } else if (closestBreadToPlayer !== undefined && closestBreadToTarget === undefined) {
            return {x: closestBreadToPlayer.x, y: closestBreadToPlayer.y, z: cz}
        }
    }

    return {x: closestBreadToPlayer.x, y: closestBreadToPlayer.y, z: cz}
}

// Function to fetch the farthest breadcrumb given a position.
export function getFarthestBreadcrumb(x: number, y: number) : Breadcrumb {
    const cx = dw.c.x
    const cy = dw.c.y

    return getBreadcrumbs().filter(
        (b) => hasLineOfSight({x: b.x+0.5, y: b.y+0.5, z: dw.c.z}, cx, cy)
    ).sort((a, b) => {
            const distA = Math.abs(a.x - x-2) + Math.abs(a.y - y-2)
            const distB = Math.abs(b.x - x+2) + Math.abs(b.y - y+2)
            return distA - distB
        })[0]
}

// Function to fetch the closest breadcrumb given a position.
export function getClosestBreadcrumb(x: number, y: number) : Breadcrumb {
    const cx = dw.c.x
    const cy = dw.c.y

    return getBreadcrumbs().filter(
        (b) => hasLineOfSight({x: b.x+0.5, y: b.y+0.5, z: dw.c.z}, cx, cy)
    ).sort((a, b) => {
            const distA = Math.abs(a.x - x+2) + Math.abs(a.y - y+2)
            const distB = Math.abs(b.x - x-2) + Math.abs(b.y - y-2)
            return distA - distB
        })[0]
}

// Function to fetch the next breadcrumb closest to given x, y, z while also being on the way to the next x, y, z.
export function getNextBreadcrumb(x: number, y: number, z: number, tx: number, ty: number, tz: number) : Breadcrumb {
    const closest = getClosestBreadcrumb(x, y, z)
    const next = getClosestBreadcrumb(tx, ty, tz)

    if (closest === undefined || next === undefined) {
        if (closest === undefined && next !== undefined) {
            return next
        } else if (closest !== undefined && next === undefined) {
            return closest
        }
    }

    if (closest.value < next.value) {
        return closest
    } else {
        return next
    }
}
