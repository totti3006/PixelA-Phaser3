class Transition {
  private scene: Phaser.Scene

  private blocks: Phaser.GameObjects.Group
  private scaleX: number
  private scaleY: number

  constructor(scene: Phaser.Scene) {
    this.scene = scene
    this.scaleX = 0
    this.scaleY = 0
  }

  private alignBlocks(blocks: Phaser.GameObjects.Group): void {
    Phaser.Actions.GridAlign(blocks.getChildren(), {
      x: this.scene.cameras.main.worldView.x,
      y: this.scene.cameras.main.worldView.y,
      width: 24,
      cellWidth: 22,
      cellHeight: 23
    })
  }

  private playAnimation(blocks: Phaser.GameObjects.Group): void {
    let i: number = 0

    blocks.children.iterate(child => {
      this.scene.tweens.add({
        targets: child,
        scaleX: this.scaleX,
        scaleY: this.scaleY,
        ease: 'Power3',
        duration: 200,
        delay: 30 + i * 30
      })

      i++

      if (i % 24 === 0) i = 0
    })
  }

  public transitionIn(): void {
    // @ts-ignore
    this.blocks = this.scene.add.group({ key: 'transition', repeat: 312 }) // 24 13
    this.scaleX = 0
    this.scaleY = 0

    this.alignBlocks(this.blocks)
    this.playAnimation(this.blocks)
  }

  public transitionOut(): void {
    // @ts-ignore
    this.blocks = this.scene.add.group({ key: 'transition', repeat: 312, setScale: { x: 0, y: 0 } }) // 24 13
    this.scaleX = 1
    this.scaleY = 1

    this.alignBlocks(this.blocks)
    this.playAnimation(this.blocks)
  }
}

export default Transition
