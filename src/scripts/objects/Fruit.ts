import { IFruitConstructor } from '../interfaces/fruit.interface'

class Fruit extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  private currentScene: Phaser.Scene
  private points: number
  private kind: string

  constructor(aParms: IFruitConstructor) {
    super(aParms.scene, aParms.x, aParms.y, aParms.texture, aParms.frame)

    this.currentScene = aParms.scene
    this.points = aParms.points
    this.kind = aParms.texture
    this.initSprite()
    this.currentScene.add.existing(this)
  }

  private initSprite(): void {
    this.setOrigin(0, 0).setFrame(0)

    this.anims.play(`${this.kind}-anims`)

    this.currentScene.physics.world.enable(this)
    this.body.setSize(this.width * 0.5, this.height * 0.5).setAllowGravity(false)
  }

  update(): void {}

  public collected(): void {
    this.currentScene.physics.world.disable(this)
    this.anims.play('collected-anims')
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy()
    })

    // add point
    this.showAndAddScore()

    this.currentScene.events.emit('scoreChanged')
  }

  private showAndAddScore(): void {
    this.currentScene.registry.values.score += this.points
    this.currentScene.events.emit('scoreChanged')

    let scoreText = this.currentScene.add.text(this.x, this.y - 20, this.points.toString()).setOrigin(0, 0)

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

export default Fruit
