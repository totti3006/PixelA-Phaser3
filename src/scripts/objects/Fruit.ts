import { IFruitConstructor } from '../interfaces/fruit.interface'

class Fruit extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  private points: number
  private kind: string

  constructor(aParms: IFruitConstructor) {
    super(aParms.scene, aParms.x, aParms.y, aParms.texture, aParms.frame)

    this.points = aParms.points
    this.kind = aParms.texture
    this.initSprite()
    this.scene.add.existing(this)
  }

  private initSprite(): void {
    this.setOrigin(0, 0).setFrame(0)

    this.anims.play(`${this.kind}-anims`)

    this.scene.physics.world.enable(this)
    this.body.setSize(this.width * 0.5, this.height * 0.5).setAllowGravity(false)
  }

  update(): void {}

  public collected(): void {
    this.body.checkCollision.none = true
    this.scene.physics.world.disable(this)
    this.anims.play('collected-anims')
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy()
    })

    // add point
    this.showAndAddScore()

    this.scene.events.emit('scoreChanged')
  }

  private showAndAddScore(): void {
    this.scene.registry.values.score += this.points
    this.scene.events.emit('scoreChanged')

    let scoreText = this.scene.add.text(this.x, this.y - 20, this.points.toString()).setOrigin(0, 0)

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
}

export default Fruit
