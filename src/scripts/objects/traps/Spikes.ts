import { ISpriteConstructor } from '../../interfaces/sprite.interface'

class Spikes extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  private currentScene: Phaser.Scene
  private direction: string

  constructor(aParams: ISpriteConstructor, direction: string) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

    this.currentScene = aParams.scene
    this.direction = direction
    this.initSprite()
    this.currentScene.add.existing(this)
  }

  private initSprite(): void {
    this.setOrigin(0, 0).setFrame(0)

    this.currentScene.physics.world.enable(this)

    this.body.setAllowGravity(false).setImmovable(true)

    if (this.direction == 'down') {
      this.setFlipY(true)
      this.body.setSize(this.width * 0.7, this.height * 0.5).setOffset(2, 0)
    } else if (this.direction == 'up') {
      this.body.setSize(this.width * 0.7, this.height * 0.5).setOffset(2, 8)
    } else if (this.direction == 'left') {
      this.setAngle(-90).setPosition(this.x, this.y + this.width)
      this.body.setSize(this.height * 0.5, this.width * 0.7).setOffset(this.width * 0.5, -14)
    }
  }
}

export default Spikes
