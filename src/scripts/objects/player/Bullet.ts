import Dude from './Dude'

class Bullet extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  private player: Dude
  private speed: number

  constructor(scene: Phaser.Scene, projectile: Phaser.GameObjects.Group, player: Dude) {
    super(scene, player.x, player.y, 'darts')

    this.scene = scene
    this.player = player
    this.speed = 450

    projectile.add(this)
    scene.add.existing(this)

    this.initSprite()
  }

  private initSprite(): void {
    this.setOrigin(0, 0).setScale(0.5).setAlpha(1)

    // this.scene.tweens.add({
    //   targets: this,
    //   props: {
    //     alpha: 1
    //   },
    //   duration: 300,
    //   repeat: false
    // })

    this.scene.physics.world.enableBody(this)
    this.body.setAllowGravity(false).setCircle(this.width / 2)

    if (this.player.flipX) {
      this.body.setVelocityX(-this.speed)
      this.setFlipX(false)
    } else {
      this.body.setVelocityX(this.speed)
      this.setFlipX(true)
    }

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

  // public bounceFromMob(v: number): void {
  //   this.body.setBounce(1, 1)
  //   this.hitObstacle()
  // }
}

export default Bullet
