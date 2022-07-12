import { DudeStateName } from '../../constants/StateName'
import { ISpriteConstructor } from '../../interfaces/sprite.interface'
import Bullet from './Bullet'
import DudeState from './DudeState'
import VirtualBody from './VirtualBody'

class Dude extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  private acceleration: number
  private dudeState: DudeState
  private projectile: Phaser.GameObjects.Group
  private mapHeight: number

  private keys: Map<string, Phaser.Input.Keyboard.Key>

  private rect: Phaser.GameObjects.Rectangle

  public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
    return this.keys
  }

  public getAcceleration(): number {
    return this.acceleration
  }

  public getState(): DudeState {
    return this.dudeState
  }

  constructor(aParams: ISpriteConstructor, projectile: Phaser.GameObjects.Group, mapHeight: number) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

    this.projectile = projectile
    this.initSprite()
    this.scene.add.existing(this)

    this.acceleration = 700
    this.mapHeight = mapHeight

    this.dudeState = new DudeState(this)
  }

  private initSprite(): void {
    this.setOrigin(0, 0).setDepth(5)

    if (this.x < this.scene.cameras.main.width) {
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

    this.scene.physics.world.enable(this)
    this.body.maxVelocity.x = 150
    // this.body.maxVelocity.y = 500
    this.body.setSize(this.width * 0.6, this.height * 0.95).setOffset(6, 2)

    this.rect = new VirtualBody(this.scene, this, this.x, this.y + 5, this.width * 0.9, this.height * 0.8, 0xff0000)
  }

  public getVirtualBody(): Phaser.GameObjects.Rectangle {
    return this.rect
  }

  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.scene.input.keyboard.addKey(key)
  }

  update(): void {
    this.rect.setPosition(this.x, this.y + 5)

    console.log(this.dudeState.currentState().getName())
    this.dudeState.currentState().onStateExecution()

    if (Phaser.Input.Keyboard.JustDown(this.keys?.get('THROW')!)) this.throwDart()

    if (this.y > this.mapHeight + 50) {
      this.scene.scene.restart()
      this.scene.registry.values.score = 0
      this.scene.events.emit('scoreChanged')
    }
  }

  throwDart(): void {
    let dart = new Bullet(this.scene, this.projectile, this)
  }

  bounceUpAfterHitTargetOnHead(): void {
    this.dudeState.advance(DudeStateName.jump)
  }

  gotHit(velocity: number): void {
    this.dudeState.advance(DudeStateName.die, velocity)
  }
}

export default Dude
