import { DudeStateName } from '../../constants/StateName'
import { ISpriteConstructor } from '../../interfaces/sprite.interface'
import Bullet from './Bullet'
import DudeState from './DudeState'
import VirtualBody from './VirtualBody'

type GameObj = Phaser.Types.Physics.Arcade.GameObjectWithBody

class Dude extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  private acceleration: number
  private dudeState: DudeState
  private projectile: Phaser.GameObjects.Group
  private terrainLayer: Phaser.Tilemaps.TilemapLayer
  private mapHeight: number

  private keys: Map<string, Phaser.Input.Keyboard.Key>

  private rect: GameObj

  private onCollideWall: boolean

  public getKeys(): Map<string, Phaser.Input.Keyboard.Key> {
    return this.keys
  }

  public getAcceleration(): number {
    return this.acceleration
  }

  public getState(): DudeState {
    return this.dudeState
  }

  public getVirtualBody(): GameObj {
    return this.rect
  }

  public isCollideWall(): boolean {
    return this.onCollideWall
  }

  public setCollideWall(v: boolean): void {
    this.onCollideWall = v
  }

  constructor(
    aParams: ISpriteConstructor,
    projectile: Phaser.GameObjects.Group,
    terrainLayer: Phaser.Tilemaps.TilemapLayer,
    mapHeight: number
  ) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

    this.projectile = projectile
    this.initSprite()
    this.scene.add.existing(this)

    this.acceleration = 700
    this.mapHeight = mapHeight
    this.onCollideWall = false
    this.terrainLayer = terrainLayer

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

    this.rect = new VirtualBody(this.scene, this, this.x, this.y + 5, this.width * 0.65, this.height * 0.8, 0xff0000)
  }

  private addKey(key: string): Phaser.Input.Keyboard.Key {
    return this.scene.input.keyboard.addKey(key)
  }

  update(): void {
    this.updateVirtualBody()

    // console.log(this.dudeState.currentState().getName())

    // this.scene.physics.collide(this, this.terrainLayer, (dude, terrain) => {
    //   if (dude.body.blocked.down) {
    //     console.log('hit ground')
    //   }

    //   if (dude.body.blocked.right) {
    //     console.log('hit right')
    //   }
    // })

    this.dudeState.currentState().onStateExecution()

    if (Phaser.Input.Keyboard.JustDown(this.keys?.get('THROW')!)) this.throwDart()

    if (this.y > this.mapHeight + 50) {
      this.scene.scene.restart()
      this.scene.registry.values.score = 0
      this.scene.events.emit('scoreChanged')
    }
  }

  updateVirtualBody(): void {
    this.centerBodyOnBody(this.rect.body as Phaser.Physics.Arcade.Body, this.body)
    this.rect.body.velocity.copy(this.body.velocity)

    let collideTerrain = this.scene.physics.add.collider(this.rect, this.terrainLayer, (rect, terrain) => {
      // console.log('collide')
      if (rect.body.blocked.right) {
        rect.body.velocity.x = 10
        console.log('hit right')
      }

      if (rect.body.blocked.left) {
        rect.body.velocity.x = -20
        console.log('hit left')
      }
    })

    this.scene.time.delayedCall(100, () => {
      collideTerrain.destroy()
    })
  }

  centerBodyOnBody(a: Phaser.Physics.Arcade.Body, b: Phaser.Physics.Arcade.Body): void {
    a.position.set(b.x + b.halfWidth - a.halfWidth, b.y + b.halfHeight - a.halfHeight)
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
