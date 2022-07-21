import { DudeStateName } from '../../constants/StateName'
import DustAnimation from '../../animations/DustAnimation'
import { ISpriteConstructor } from '../../interfaces/sprite.interface'
import DudeState from './states/DudeState'
import Dart from './Dart'

class Dude extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  private acceleration: number
  private dudeState: DudeState
  private projectile: Phaser.GameObjects.Group

  private keys: Map<string, Phaser.Input.Keyboard.Key>

  private onCollideWall: boolean
  public virtualPlayer: Phaser.Physics.Arcade.Image
  public overlapLeft: boolean
  public overlapRight: boolean

  public dustAnimation: DustAnimation

  public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
    return this.keys
  }

  public getAcceleration(): number {
    return this.acceleration
  }

  public getState(): DudeState {
    return this.dudeState
  }

  public isCollideWall(): boolean {
    return this.onCollideWall
  }

  public setCollideWall(v: boolean): void {
    this.onCollideWall = v
  }

  constructor(aParams: ISpriteConstructor, projectile: Phaser.GameObjects.Group) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

    this.projectile = projectile
    this.initSprite()
    this.scene.add.existing(this)

    this.acceleration = 700

    this.onCollideWall = false

    this.dudeState = new DudeState(this)

    this.dustAnimation = new DustAnimation(this)

    this.create2ndBody()
  }

  private create2ndBody(): void {
    // @ts-ignore
    const virtualPlayer = this.scene.physics.add.image()
    virtualPlayer.body.setSize(this.width * 0.7, this.height * 0.8)
    virtualPlayer.body.setAllowGravity(false)
    virtualPlayer.setDebugBodyColor(0xffff00)
    this.virtualPlayer = virtualPlayer
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
  }

  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.scene.input.keyboard.addKey(key)
  }

  update(): void {
    this.dudeState.currentState().onStateExecution()

    if (Phaser.Input.Keyboard.JustDown(this.keys?.get('THROW')!)) this.throwDart()

    if (this.y > this.scene.registry.get('mapHeight') + 50) {
      this.scene.scene.restart()
      this.scene.registry.values.score = 0
      this.scene.events.emit('scoreChanged')
    }

    this.virtualPlayer.setVelocity(0, 0)
    this.virtualPlayer.body.position.set(this.body.x - 1.5, this.body.y + 3)
    this.virtualPlayer.body.updateCenter()

    this.overlapRight = false
    this.overlapLeft = false
  }

  throwDart(): void {
    let dart = new Dart({
      scene: this.scene,
      x: this.x,
      y: this.y,
      bulletProperties: {
        speed: 450 * (this.flipX ? -1 : 1),
        flipX: !this.flipX
      },
      texture: 'darts'
    })

    this.projectile.add(dart)
  }

  bounceUpAfterHitTargetOnHead(): void {
    this.dudeState.advance(DudeStateName.jump)
  }

  gotHit(velocity: number): void {
    this.dudeState.advance(DudeStateName.die, velocity)
  }
}

export default Dude
