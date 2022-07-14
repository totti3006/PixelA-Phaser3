const TransitionIn = (scene: Phaser.Scene): void => {
  // @ts-ignore
  let blocks: Phaser.GameObjects.Group = scene.add.group({ key: 'transition', repeat: 312 }) // 24 13

  Phaser.Actions.GridAlign(blocks.getChildren(), {
    x: 0,
    y: 0,
    width: 24,
    cellWidth: 22,
    cellHeight: 22
  })

  let i: number = 0

  blocks.children.iterate(child => {
    scene.tweens.add({
      targets: child,
      scaleX: 0,
      scaleY: 0,
      ease: 'Power3',
      duration: 200,
      delay: 30 + i * 30
    })

    i++

    if (i % 24 === 0) i = 0
  })
}

const TransitionOut = (scene: Phaser.Scene): void => {
  // @ts-ignore
  let blocks: Phaser.GameObjects.Group = scene.add.group({ key: 'transition', repeat: 312, setScale: { x: 0, y: 0 } }) // 24 13

  Phaser.Actions.GridAlign(blocks.getChildren(), {
    x: 0,
    y: 0,
    width: 24,
    cellWidth: 22,
    cellHeight: 22
  })

  let i: number = 0

  blocks.children.iterate(child => {
    scene.tweens.add({
      targets: child,
      scaleX: 1,
      scaleY: 1,
      ease: 'Power3',
      duration: 200,
      delay: 30 + i * 30
    })

    i++

    if (i % 24 === 0) i = 0
  })
}

export { TransitionIn, TransitionOut }
