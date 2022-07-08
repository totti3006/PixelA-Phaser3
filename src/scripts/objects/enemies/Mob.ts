import { ISpriteConstructor } from '../../interfaces/sprite.interface'

abstract class Mob extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  protected currentScene: Phaser.Scene
  protected isActivated: boolean
  protected isDying: boolean
  protected speed: number
  protected score: number

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

    this.currentScene = aParams.scene
    this.initSprite()
    this.currentScene.add.existing(this)
  }

  protected initSprite(): void {
    this.isActivated = false
    this.isDying = false

    this.setOrigin(0, 0).setFrame(0)

    this.currentScene.physics.world.enable(this)
  }

  abstract gotHitOnHead(): void
  abstract gotHitFromBullet(v: number): void
  abstract isDead(): void

  protected showAndAddScore(): void {
    this.currentScene.registry.values.score += this.score
    this.currentScene.events.emit('scoreChanged')

    let scoreText = this.currentScene.add.text(this.x, this.y - 20, this.score.toString()).setOrigin(0, 0)

    this.currentScene.add.tween({
      targets: scoreText,
      props: { y: scoreText.y - 25 },
      duration: 800,
      ease: 'Power0',
      yoyo: false,
      onComplete: function () {
        scoreText.destroy()
      }
    })
  }
}

export default Mob
