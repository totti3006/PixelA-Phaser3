import { ISpriteConstructor } from '../../interfaces/sprite.interface'
import Mob from './Mob'
import PlantBullet from './PlantBullet'

class Plant extends Mob {
  private states = {
    live: 'live',
    die: 'die'
  }

  private currentState: string

  private projectile: Phaser.GameObjects.Group
  private shootRate: number
  private countFrame: number

  constructor(aParams: ISpriteConstructor, direction: string, projectile: Phaser.GameObjects.Group) {
    super(aParams)
    this.score = 500

    this.projectile = projectile
    this.shootRate = 180
    this.countFrame = 0

    this.currentState = this.states.live

    this.body.setSize(this.width * 0.6, this.height * 0.8)

    if (direction === 'right') {
      this.setFlipX(true)
      this.body.setOffset(6, 8)
    } else {
      this.setFlipX(false)
      this.body.setOffset(12, 8)
    }

    this.anims.play('plant-idle-anims')
  }

  update(time: number, delta: number): void {
    if (!this.isDying) {
      this.countFrame += 1
      if (this.countFrame == this.shootRate) {
        this.countFrame = 0
        this.anims.play('plant-attack-anims')
        this.scene.time.delayedCall(90, this.shoot)
        this.anims.playAfterRepeat('plant-idle-anims')
      }
    } else {
      if (this.currentState != this.states.die) {
        this.body.checkCollision.none = true
        this.currentState = this.states.die
      }
    }
  }

  public shoot = (): void => {
    let bulletSpeed: number = 200
    let bullet = new PlantBullet(this.scene, this.x, this.y)

    this.projectile.add(bullet)

    if (!this.flipX) {
      bullet.body.velocity.x = -bulletSpeed
      bullet.setFlipX(false).setX(bullet.x + this.width * 0.5 + bullet.body.offset.x)
    } else {
      bullet.body.velocity.x = bulletSpeed
      bullet.setFlipX(true)
    }
  }

  public gotHitFromBullet(v: number): void {
    this.isDying = true
    this.anims.play('plant-hit-anims')
    this.showAndAddScore(500)
    this.body.setVelocityX(v)

    this.scene.add.tween({
      targets: this,
      props: { alpha: 0 },
      duration: 1000,
      ease: 'Power0',
      yoyo: false,
      onComplete: this.isDead
    })
  }

  public gotHitOnHead(): void {
    this.isDying = true

    this.anims.play('plant-hit-anims')
    this.showAndAddScore(0)

    this.scene.add.tween({
      targets: this,
      props: { alpha: 0 },
      duration: 1000,
      ease: 'Power0',
      yoyo: false,
      onComplete: this.isDead
    })
  }

  public isDead = (): void => {
    this.destroy()
  }
}

export default Plant
