import Entity = DeepestWorld.Entity;

const neighborDistance = 4

// Gets all the monsters in our Z access.
export function getMonsters() {
  return dw.findEntities(e => 'ai' in e && e.id != dw.c.id && e.z == dw.c.z)
}

// Get the first "safe" monster that has no close neighbors.
export function getNextSafeMonster(): Target {
  return targets.filter(targetItem => !targetItem.target.hasNeighbors())[0].target
}

// The Target class.
export class Target {
  // The entity of this target.
  entity: Entity
  // Any close by neighbors of the Entity.
  neighbors: Entity[]

  constructor(entity: Entity, neighbors: Entity[]) {
    this.entity = entity
    this.neighbors = neighbors
  }

  // Determine if we have any neighbors or not.
  hasNeighbors(): boolean {
    return this.neighbors.length != 0
  }
}

let targets: {id: number, target: Target}[] = []

// Gets or creates a new instance of Target based on the Entity.
function getTarget(entity: Entity) {
  let target = targets[entity.id]

  if (target === undefined) {
    let theTarget = new Target(entity, [])
    target = {id: entity.id, target: theTarget}
    targets.push(target)
  }

  return target.target
}

export function resetTargets() {
  targets = []
}

export function getMonsterBetweenDistances() {
  let monsters = getMonsters()
  let distanceMap = new Array<[DeepestWorld.Entity, DeepestWorld.Entity, number]>()

  // Handle only one monster with no neighbors.
  if (monsters.length == 1) {
    getTarget(monsters[0])
    return
  }

  // Iterate through each monster
  monsters.forEach(e1 => {
    // For each monster iterate through the monsters to get the distance between them.
    monsters.forEach(e2 => {
      // If the two monsters we're comparing are the same, don't do anything. The distance will always be 0 indicating
      // no neighbor.
      if (e1.id == e2.id) {
        return
      }

      // Get the distance and add it to our distance mapping.
      const distance = dw.distance(e1.x, e1.y, e2.x, e2.y)
      distanceMap.push([e1, e2, distance])

      // Get the target.
      let target = getTarget(e1)

      // If distance is less than neighborDistance consider it a neighbor of the target.
      if (distance <= neighborDistance) {
        target.neighbors.push(e2)
      } else {
        // Filter out the neighbor as it no longer is in distance.
        target.neighbors = target.neighbors.filter(neighbor => neighbor.id != e2.id)
      }
    })
  })

  // distanceMap.sort((entityDist1, entityDist2) => entityDist1[2] - entityDist2[2])
  //
  // const distances = distanceMap.map(entityDist => entityDist[2])//.sort((n1, n2) => n1-n2)
  // console.log(distances)

  return distanceMap
}
