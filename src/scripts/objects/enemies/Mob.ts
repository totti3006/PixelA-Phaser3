import { ISpriteConstructor } from '../../interfaces/sprite.interface'

abstract class Mob extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  protected isActivated: boolean
  protected isDying: boolean
  protected isVulnerable: boolean
  protected speed: number
  protected score: number

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

    this.initSprite()
    this.scene.add.existing(this)
  }

  protected initSprite(): void {
    this.isActivated = false
    this.isDying = false
    this.isVulnerable = true

    this.setOrigin(0, 0).setFrame(0)

    this.scene.physics.world.enable(this)
  }

  abstract gotHitOnHead(): void
  abstract gotHitFromBullet(v: number): void
  abstract isDead(): void

  protected showAndAddScore(penalty: number): void {
    let finalScore = this.score - penalty
    this.scene.registry.values.score += finalScore
    this.scene.events.emit('scoreChanged')

    let scoreText = this.scene.add.text(this.x, this.y - 20, finalScore.toString()).setOrigin(0, 0)

    this.scene.add.tween({
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

  public getSpeed(): number {
    return this.body.velocity.x
  }

  public getVulnerable(): boolean {
    return this.isVulnerable
  }
}

export default Mob
