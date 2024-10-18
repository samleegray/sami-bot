import {getMonsterBetweenDistances} from "./sami/monsters";

dw.on('drawUnder', (ctx, cx, cy) => {
  // if (!show) {
  //   return
  // }

  const { width, height } = ctx.canvas
  const mx = width / 2
  const my = height / 2

  const transpose = (wx: number, wy: number) => [
    mx + Math.floor((wx - cx) * dw.constants.PIXELS_PER_UNIT),
    my + Math.floor((wy - cy) * dw.constants.PIXELS_PER_UNIT),
  ]

  ctx.lineWidth = 4

  let monsters = getMonsterBetweenDistances()

  monsters.forEach((entityDistance) => {
    const entity1 = entityDistance[0]
    const entity2 = entityDistance[1]
    const [x1, y1] = transpose(entity1.x, entity1.y)
    const [x2, y2] = transpose(entity2.x, entity2.y)

    ctx.strokeStyle = 'rgb(3,56,117)'
    ctx.beginPath()
    ctx.moveTo(x1, y1)
    ctx.lineTo(x2, y2)
    ctx.stroke()
    })
})
