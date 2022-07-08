import Dude from './Dude'

class Bullet extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  private currentScene: Phaser.Scene
  private player: Dude
  private speed: number

  constructor(scene: Phaser.Scene, projectile: Phaser.GameObjects.Group, player: Dude) {
    super(scene, player.x, player.y, 'darts')

    this.currentScene = scene
    this.player = player
    this.speed = 300

    projectile.add(this)
    scene.add.existing(this)

    this.initSprite()
  }

  private initSprite(): void {
    this.setOrigin(0, 0).setScale(0.5, 0.5).setAlpha(0)

    this.currentScene.tweens.add({
      targets: this,
      props: {
        alpha: 1
      },
      duration: 300,
      repeat: false
    })

    this.currentScene.physics.world.enableBody(this)
    this.body.setAllowGravity(false).setCircle(this.width / 2)

    if (this.player.flipX) {
      this.body.velocity.x = -this.speed
      this.setFlipX(false)
    } else {
      this.body.velocity.x = this.speed
      this.setFlipX(true)
    }

    this.play('dart-anims')
  }

  public hitObstacle(): void {
    this.anims.stop()
    this.currentScene.tweens.add({
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

export default Bullet
