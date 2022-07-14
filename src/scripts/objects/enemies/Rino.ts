import { ISpriteConstructor } from '../../interfaces/sprite.interface'
import Landmark from '../Landmark'
import Dude from '../player/Dude'
import Mob from './Mob'

class Rino extends Mob {
  private states = {
    idle: 'idle',
    activating: 'activating',
    activated: 'activated',
    die: 'die'
  }

  private currentState: string
  private baseHealth: number = 20
  private health: number
  private healthBar: Phaser.GameObjects.Graphics
  private remainHealthBar: Phaser.GameObjects.Graphics
  private title: Phaser.GameObjects.Text
  private landmark: Phaser.GameObjects.Group
  private target: Dude

  constructor(aParams: ISpriteConstructor, landmark: Phaser.GameObjects.Group, target: Dude) {
    super(aParams)
    this.speed = 150
    this.score = 5000
    this.health = this.baseHealth
    this.landmark = landmark
    this.isVulnerable = false
    this.target = target

    this.title = this.scene.add
      .text(this.x + 10, this.y + this.height + 15, 'Louis de Rino')
      .setOrigin(0, 0)
      .setFontFamily('Arial')
      .setFontSize(10)
      .setColor('#ffff00')

    this.createHealthBar()

    this.currentState = this.states.idle

    this.setScale(1.5)

    this.body.setSize(this.width * 0.8, this.height * 0.8).setOffset(this.body.offset.x, 6)

    this.anims.play('rino-idle-anims')
  }

  update(): void {
    if (!this.isDying) {
      this.title.setPosition(this.x + 10, this.y + this.height + 15)
      this.healthBar.destroy()
      this.remainHealthBar.destroy()
      this.createHealthBar()

      if (this.isActivated) {
        if (this.body.blocked.right || this.body.blocked.left) {
          this.anims.play('rino-hitwall-anims')
          this.anims.playAfterRepeat('rino-idle-anims')

          this.scene.time.delayedCall(1000, () => {
            this.anims.play('rino-run-anims')
            this.speed = -this.speed
            this.body.velocity.x = this.speed

            if (!this.isVulnerable) {
              this.isVulnerable = true
            }

            if (this.speed > 0) this.setFlipX(true)
            else this.setFlipX(false)
          })
        }

        if (this.currentState != this.states.activated) {
          this.currentState = this.states.activated
          this.body.setVelocityX(-this.speed)
          this.anims.play('rino-run-anims')
        }
      } else {
        if (
          Phaser.Geom.Intersects.RectangleToRectangle(this.getBounds(), this.scene.cameras.main.worldView) &&
          this.currentState != this.states.activating
        ) {
          this.currentState = this.states.activating
          this.scene.time.delayedCall(500, () => {
            if (this.x < this.target.x) {
              this.setFlipX(true)
              this.speed = -this.speed
            } else {
              this.setFlipX(false)
            }
            this.isActivated = true
          })
        }
      }
    } else {
      if (this.currentState != this.states.die) {
        this.title.setPosition(this.x + 10, this.y + this.height + 15)
        this.healthBar.destroy()
        this.remainHealthBar.destroy()
        this.createHealthBar()

        this.currentState = this.states.die

        this.body.checkCollision.none = true
        this.body.setAllowGravity(false)
      }

      this.body.velocity.x = 0
      this.anims.stop()
    }
  }

  private createHealthBar(): void {
    this.healthBar = this.scene.add.graphics()
    this.healthBar.fillStyle(0xffffff, 1)
    this.healthBar.fillRect(this.x + 15, this.y + this.height + 30, this.width, 8)

    this.remainHealthBar = this.scene.add.graphics()
    this.remainHealthBar.fillStyle(0x88e453, 1)
    this.remainHealthBar.fillRect(
      this.x + 15,
      this.y + this.height + 30,
      this.width * (this.health / this.baseHealth),
      8
    )
  }

  public gotHitFromBullet(v: number): void {
    this.health -= 1
    this.score = 0
    this.anims.play('rino-hit-anims')

    if (this.health <= 0) {
      this.isDying = true
      this.showAndAddScore(0)

      this.scene.add.tween({
        targets: this,
        props: { alpha: 0 },
        duration: 1000,
        ease: 'Power0',
        onComplete: () => {
          this.landmark.add(
            new Landmark({ scene: this.scene, x: this.x, y: this.y - 20, texture: 'checkpoint-noflag' })
          )
          this.isDead()
        }
      })
    } else {
      if (this.body.velocity.x != 0) {
        this.body.setVelocityX(0)
        this.scene.time.delayedCall(500, () => {
          this.anims.play('rino-run-anims')
          this.body.setVelocityX(this.speed)
        })
      } else {
        this.anims.playAfterRepeat('rino-idle-anims')
      }
    }
  }

  public gotHitOnHead(): void {
    this.health -= 1
    this.anims.play('rino-hit-anims')

    if (this.health <= 0) {
      this.isDying = true
      this.showAndAddScore(0)

      this.scene.add.tween({
        targets: this,
        props: { alpha: 0 },
        duration: 1000,
        ease: 'Power0',
        yoyo: false,
        onComplete: () => {
          this.landmark.add(
            new Landmark({ scene: this.scene, x: this.x, y: this.y - 50, texture: 'checkpoint-noflag' })
          )
          this.isDead()
        }
      })
    } else {
      if (this.body.velocity.x != 0) {
        this.body.setVelocityX(0)
        this.scene.time.delayedCall(500, () => {
          this.anims.play('rino-run-anims')
          this.body.setVelocityX(this.speed)
        })
      } else {
        this.anims.playAfterRepeat('rino-idle-anims')
      }
    }
  }

  public isDead = (): void => {
    this.destroy()
  }
}

export default Rino
