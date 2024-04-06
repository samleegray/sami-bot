import getBreadcrumbs from '../breadcrumbs'
import { hasLineOfSight }  from "../hasLineOfSight";
import { Breadcrumb } from "../breadcrumbs";
import { TargetManager } from "./target";

const targetManager = new TargetManager();

type Location = {
    x: number
    y: number
    z: number
}

export function traversalLoop()  {
    // Get next target.
    // let target = targetManager.nextTarget()
    // if (target !== undefined) {
    //     if (dw.md.entities[target.md].isMonster && dw.distance(target.x, target.y, dw.c.x, dw.c.y) < 3.75) {
    //         return
    //     }
    //     let closest = getClosestBreadcrumb(target.x, target.y, target.z)
    //     dw.move(closest.x, closest.y)
    //     return
    // }

    let losBreadcrumbs = getBreadcrumbsInLineOfSight()
    let losBreadcrumb = losBreadcrumbs[0]

    // dw.move(losBreadcrumb.x, losBreadcrumb.y)
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
