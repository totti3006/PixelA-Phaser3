import { IBulletConstructor } from '../../interfaces/bullet.interface'

class PlantBullet extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  private speed: number

  constructor(aParams: IBulletConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture)

    this.speed = aParams.bulletProperties.speed
    this.setFlipX(aParams.bulletProperties.flipX)

    this.scene.add.existing(this)
    this.initSprite()
  }

  private initSprite(): void {
    this.setOrigin(0, 0)
      .setScale(1)
      .setAlpha(1)
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

    this.body.setVelocityX(this.speed)
  }

  public getSpeed(): number {
    return this.body.velocity.x
  }

  public hitObstacle(): void {
    this.destroy()
  }
}

export default PlantBullet
