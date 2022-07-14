import { ISpriteConstructor } from '../../interfaces/sprite.interface'

class Spikes extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

    this.initSprite()
    this.scene.add.existing(this)
  }

  private initSprite(): void {
    this.setOrigin(0, 0).setFrame(0)

    this.scene.physics.world.enable(this)

    this.body.setAllowGravity(false).setImmovable(true)
  }

  public setUpDirection(): void {
    this.body.setSize(this.width * 0.7, this.height * 0.5).setOffset(2, 8)
  }

  public setDownDirection(): void {
    this.setFlipY(true)
    this.body.setSize(this.width * 0.7, this.height * 0.5).setOffset(2, 0)
  }

  public setLeftDirection(): void {
    this.setAngle(-90).setPosition(this.x, this.y + this.width)
    this.body.setSize(this.height * 0.5, this.width * 0.7).setOffset(this.width * 0.5, -14)
  }
}

export default Spikes
