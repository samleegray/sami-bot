import getBreadcrumbs from './breadcrumbs'
import { addMenuButton } from './ui-buttons'

let show = dw.get('showBreadcrumbs') ?? true

addMenuButton('🍞', 'Toggle Breadcrumbs', () => {
  show = !show
  dw.set('showBreadcrumbs', show)
})

dw.on('drawUnder', (ctx) => {
  if (!show) {
    return
  }

  ctx.lineWidth = 2

  getBreadcrumbs().forEach((breadcrumb) => {
    if (breadcrumb.value <= 0) {
      return
    }
      ctx.fillStyle = breadcrumb.walkable ? '#ffff0040' : '#e81a1340'

    const x = dw.toCanvasX(breadcrumb.x + 0.5)
    const y = dw.toCanvasY(breadcrumb.y + 0.5)

    ctx.beginPath()
    ctx.arc(x, y, breadcrumb.value * dw.constants.PX_PER_UNIT_ZOOMED / 2, 0, 2 * Math.PI)
    ctx.fill()
  })
})
