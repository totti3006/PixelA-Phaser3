import { IBoxConstructor } from '../interfaces/box.interface'
import Fruit from './Fruit'

class Box extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  private currentScene: Phaser.Scene
  private boxContent: string
  private content: Fruit | null
  private hitBoxTimeline: Phaser.Tweens.Timeline

  public getContent(): Phaser.GameObjects.Sprite {
    return this.content!
  }

  public getBoxContentString(): string {
    return this.boxContent
  }

  constructor(aParams: IBoxConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

    this.currentScene = aParams.scene
    this.boxContent = aParams.content

    this.initSprite()
    this.currentScene.add.existing(this)
  }

  private initSprite(): void {
    this.content = null
    this.hitBoxTimeline = this.currentScene.tweens.createTimeline({})

    this.setOrigin(0, 0).setFrame(0)

    this.currentScene.physics.world.enable(this)
    this.body
      .setAllowGravity(false)
      .setImmovable(true)
      .setSize(this.width * 0.7, this.height * 0.8)
  }

  update(): void {}

  public playHitAnims(): void {
    this.anims.play('box1-hit-anims')
    this.on(Phaser.Animations.Events.ANIMATION_COMPLETE, () => {
      this.destroy()
    })
  }

  public spawnBoxContent(): Fruit {
    this.content = new Fruit({
      scene: this.currentScene,
      x: this.x,
      y: this.y,
      texture: this.boxContent,
      points: 1000
    })
    return this.content
  }

  public tweenBoxContent(props: {}, duration: number, complete: () => void): void {
    this.hitBoxTimeline.add({
      targets: this.content,
      props: props,
      delay: 0,
      duration: duration,
      ease: 'Power0',
      onComplete: complete
    })
  }

  public popUpFruit(terrainLayer: Phaser.Tilemaps.TilemapLayer): void {
    let direction: number = [-1, 1][Phaser.Math.Between(0, 1)]
    this.content?.body.setVelocity(80 * direction, -100)
    // this.content?.body.setAccelerationX(-100)

    this.content?.body.setAllowGravity(true).setSize(1, 1)

    this.currentScene.physics.add.collider(this.content!, terrainLayer)

    this.content?.setAlpha(0.5)
    this.currentScene.tweens.add({
      targets: this.content,
      props: {
        alpha: 1
      },
      duration: 150,
      repeat: false,
      onComplete: () => {
        this.content?.body?.setSize(this.content.width * 0.5, this.content.height * 0.5)
      }
    })
    // this.content?.body.setGravityY(-300)
  }

  public addScore(score: number): void {
    // this.currentScene.registry.values.score += score
    this.currentScene.events.emit('scoreChanged')
  }
}

export default Box
