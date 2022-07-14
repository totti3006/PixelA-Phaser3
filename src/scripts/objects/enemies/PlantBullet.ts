import Plant from './Plant'

class PlantBullet extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'plant-bullet')

    scene.add.existing(this)

    this.initSprite()
  }

  private initSprite(): void {
    this.setOrigin(0, 0)
      .setScale(1)
      .setAlpha(0)

      .setY(this.y + 8)

    this.scene.tweens.add({
      targets: this,
      props: {
        alpha: 1
      },
      duration: 200,
      repeat: false
    })

    this.scene.physics.world.enableBody(this)

    this.body
      .setAllowGravity(false)
      .setCircle(this.width / 4)
      .setOffset(4, 4)
  }

  public getSpeed(): number {
    return this.body.velocity.x
  }

  public hitObstacle(): void {
    this.destroy()
  }
}

export default PlantBullet
