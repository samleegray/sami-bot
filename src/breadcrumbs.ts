import { PASSABLE_TERRAIN } from './consts'

export type Breadcrumb = {
    x: number
    y: number
    z: number
    value: number
    time: number
    walkable: boolean
}

let breadcrumbs: Breadcrumb[] = new Array<Breadcrumb>()
let range: number = 5

function getBreadcrumb(x: number, y: number, z: number): Breadcrumb | undefined {
    return breadcrumbs.find(
        (b: Breadcrumb) => b.x === x && b.y === y && b.z === z,
    )
}

export default function getBreadcrumbs(): Breadcrumb[] {
  const result = new Array<Breadcrumb>()

  for (let wy = Math.floor(dw.c.y - range); wy <= dw.c.y + range; wy++) {
    for (let wx = Math.floor(dw.c.x - range); wx <= dw.c.x + range; wx++) {
        const breadcrumb: Breadcrumb | undefined = getBreadcrumb(wx, wy, dw.c.z)
        if (breadcrumb) {
            result.push(breadcrumb)
        }
    }
  }

  return result
}

function isWalkable(x: number, y: number, z: number): boolean {
    let isWalkable: boolean
    const wall: number | undefined = dw.getTerrain(x, y, z)
    const floor: number | undefined = dw.getTerrain(x, y, z - 1)

    isWalkable = !(wall === undefined
        || floor === undefined
        || !PASSABLE_TERRAIN.includes(wall)
        || PASSABLE_TERRAIN.includes(floor));

    return isWalkable
}

function dropBreadcrumbs() {
    // Get character location.
    const cx: number = Math.floor(dw.c.x)
    const cy: number = Math.floor(dw.c.y)
    const cz: number = Math.floor(dw.c.z)

    // Lessen value of breadcrumbs over time. Causes circles to visually decrease in size.
    breadcrumbs.forEach((b: Breadcrumb) => b.value *= 0.9)

    // Iterate through X & Y in range.
    for (let ry: number = -range; ry <= range; ry++) {
        for (let rx: number = - range; rx <= range; rx++) {
            const cpX: number = cx + rx
            const cpY: number = cy + ry

            // Get breadcrumb representing current checkpoint.
            const breadcrumb: Breadcrumb | undefined = getBreadcrumb(cpX, cpY, cz)

            // Value of the current checkpoint in relation to the absolute value of current checkpoint range.
            const value: number = 1 / (1 + Math.abs(rx) + Math.abs(ry))

            // If we already have a breadcrumb for this checkpoint, update it and continue onto the next.
            if (breadcrumb) {
                breadcrumb.value = Math.max(breadcrumb.value, value)
                breadcrumb.time = Date.now()
                continue
            }

            // No breadcrumb for this checkpoint yet, create one.
            breadcrumbs.push({x: cpX, y: cpY, z: cz, value: value, time: Date.now(), walkable: isWalkable(cpX, cpY, cz)})
        }
    }
}

setInterval(dropBreadcrumbs, 500)
