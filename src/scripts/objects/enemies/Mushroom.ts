import { ISpriteConstructor } from '../../interfaces/sprite.interface'
import Mob from './Mob'

class Mushroom extends Mob {
  private states = {
    idle: 'idle',
    activated: 'activated',
    die: 'die'
  }

  private currentState: string

  constructor(aParams: ISpriteConstructor) {
    super(aParams)
    this.speed = 40
    this.score = 500

    this.currentState = this.states.idle
    this.body.setSize(this.width * 0.8, this.height * 0.6).setOffset(4, 12)
    this.anims.play('mushroom-idle-anims')
  }

  update(): void {
    if (!this.isDying) {
      if (this.isActivated) {
        if (this.body.blocked.right || this.body.blocked.left) {
          this.speed = -this.speed
          this.body.velocity.x = this.speed

          if (this.speed > 0) this.setFlipX(true)
          else this.setFlipX(false)
        }

        if (this.currentState != this.states.activated) {
          this.currentState = this.states.activated
          this.body.setVelocityX(-this.speed)
          this.anims.play('mushroom-run-anims', true)
        }
      } else {
        if (Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), this.currentScene.cameras.main.worldView)) {
          this.isActivated = true
        }
      }
    } else {
      if (this.currentState != this.states.die) {
        // this.body.setVelocity(0, 0)
        this.body.checkCollision.none = true
        this.currentState = this.states.die
      }
    }
  }

  public gotHitOnHead(): void {
    this.isDying = true

    this.anims.play('mushroom-hit-anims')
    this.showAndAddScore()
  }

  public gotHitFromBullet(v: number): void {
    this.isDying = true
    this.anims.play('mushroom-hit-anims')
    this.showAndAddScore()
    this.body.setVelocityX(v)
  }

  public isDead(): void {
    this.destroy()
  }
}

export default Mushroom