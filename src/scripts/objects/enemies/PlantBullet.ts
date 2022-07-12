import Plant from './Plant'

class PlantBullet extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  private player: Plant
  private speed: number

  constructor(scene: Phaser.Scene, projectile: Phaser.GameObjects.Group, player: Plant) {
    super(scene, player.x, player.y, 'plant-bullet')

    this.player = player
    this.speed = 200

    projectile.add(this)
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

    if (!this.player.flipX) {
      this.body.velocity.x = -this.speed
      this.setFlipX(false).setX(this.x + this.player.width * 0.5 + this.body.offset.x)
    } else {
      this.body.velocity.x = this.speed
      this.setFlipX(true)
    }
  }

  public getSpeed(): number {
    return this.body.velocity.x
  }

  public hitObstacle(): void {
    this.destroy()
  }
}

export default PlantBullet
