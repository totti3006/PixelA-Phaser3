import { DudeStateName } from '../../constants/StateName'
import { ISpriteConstructor } from '../../interfaces/sprite.interface'
import Bullet from './Bullet'
import DudeState from './DudeState'

class Dude extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  private currentScene: Phaser.Scene
  private acceleration: number
  private dudeState: DudeState
  private projectile: Phaser.GameObjects.Group

  private keys: Map<string, Phaser.Input.Keyboard.Key>

  public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
    return this.keys
  }

  public getAcceleration(): number {
    return this.acceleration
  }

  public getState(): DudeState {
    return this.dudeState
  }

  constructor(aParams: ISpriteConstructor, projectile: Phaser.GameObjects.Group) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

    this.currentScene = aParams.scene
    this.projectile = projectile
    this.initSprite()
    this.currentScene.add.existing(this)

    this.acceleration = 700

    this.dudeState = new DudeState(this)
  }

  private initSprite(): void {
    this.setOrigin(0, 0)

    if (this.x < this.currentScene.cameras.main.width) {
      this.setFlipX(true)
    } else {
      this.setFlipX(false)
    }

    this.keys = new Map([
      ['LEFT', this.addKey('LEFT')],
      ['RIGHT', this.addKey('RIGHT')],
      ['THROW', this.addKey('SPACE')],
      ['JUMP', this.addKey('UP')]
    ])

    this.currentScene.physics.world.enable(this)
    this.body.maxVelocity.x = 150
    // this.body.maxVelocity.y = 500
    this.body.setSize(this.width * 0.7, this.height * 0.95).setOffset(4, 2)
  }

  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.currentScene.input.keyboard.addKey(key)
  }

  update(): void {
    this.dudeState.currentState().onStateExecution()

    if (this.keys?.get('RIGHT')?.isDown && (this.body.onFloor() || this.body.blocked.down)) {
      this.dudeState.advance(DudeStateName.move, 'right')
    } else if (this.keys?.get('LEFT')?.isDown && (this.body.onFloor() || this.body.blocked.down)) {
      this.dudeState.advance(DudeStateName.move, 'left')
    } else if (this.body.onFloor() || this.body.blocked.down) {
      this.dudeState.advance(DudeStateName.idle)
    }

    if (this.keys?.get('JUMP')?.isDown && (this.body.onFloor() || this.body.touching.down || this.body.blocked.down)) {
      this.dudeState.advance(DudeStateName.jump)
    }

    if (Phaser.Input.Keyboard.JustDown(this.keys?.get('THROW')!)) this.throwDart()

    if (this.y > this.currentScene.sys.canvas.height + 50) {
      // this.currentScene.scene.stop('GameScene')
      // this.currentScene.scene.stop('HUDScene')
      // this.currentScene.scene.start('MenuScene')
      this.currentScene.scene.restart()
    }
  }

  throwDart(): void {
    let dart = new Bullet(this.currentScene, this.projectile, this)
  }

  bounceUpAfterHitTargetOnHead(): void {
    this.dudeState.advance(DudeStateName.jump)
  }

  gotHit(): void {
    this.dudeState.advance(DudeStateName.die)
  }
}

export default Dude
