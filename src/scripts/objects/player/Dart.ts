import { IBulletConstructor } from '../../interfaces/bullet.interface'

class Dart extends Phaser.GameObjects.Sprite {
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
    this.setOrigin(0, 0).setScale(0.5).setAlpha(1)

    this.scene.physics.world.enableBody(this)
    this.body.setAllowGravity(false).setCircle(this.width / 2)
    this.body.setVelocityX(this.speed)

    this.play('dart-anims')
  }

  public hitObstacle(): void {
    this.anims.stop()
    this.body.checkCollision.none = true
    this.body.setAllowGravity(true)
    this.scene.tweens.add({
      targets: this,
      props: {
        alpha: 0
      },
      duration: 800,
      repeat: false,
      onComplete: () => {
        this.destroy()
      }
    })
  }
}

export default Dart
