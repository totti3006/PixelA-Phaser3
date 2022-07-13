import { DudeStateName } from '../../constants/StateName'
import IState from '../../interfaces/state.interface'
import Dude from './Dude'

class WallJump extends IState {
  private player: Dude
  private prevOffset: number
  private prePos: number
  private allowJump: boolean

  constructor(player: Dude) {
    super()

    this.player = player
    this.prevOffset = 0
    this.allowJump = false
  }

  getName(): string {
    return DudeStateName.wjump
  }

  getNeighbors(): IState[] {
    return this.neighbors
  }

  addNeighbors(state: IState): void {
    this.neighbors.push(state)
  }

  onStateEnter(param?: any): void {
    this.player.anims.play('mask-walljump-anims')
    this.prevOffset = this.player.body.offset.x
    this.prePos = this.player.x
    if (this.player.flipX) {
      this.player.body.setOffset(this.prevOffset + 2, this.player.body.offset.y)
      this.player.setPosition(this.player.x - 2, this.player.y)
    } else {
      this.player.body.setOffset(this.prevOffset - 2, this.player.body.offset.y)
      this.player.setPosition(this.player.x + 2, this.player.y)
    }
  }

  onStateExecution(param?: any): void {
    this.player.body.setVelocityY(30)

    if (this.player.getKeys()?.get('JUMP')?.isUp) {
      this.allowJump = true
    }

    if (this.player.getKeys()?.get('JUMP')?.isDown && this.allowJump) {
      this.player.getState().advance(DudeStateName.jump)
      if (this.player.flipX) {
        this.player.setFlipX(false)
        this.player.body.setVelocityX(300)
      } else {
        this.player.setFlipX(true)
        this.player.body.setVelocityX(-300)
      }
      this.player.setCollideWall(false)
      return
    }
    if (
      !(this.player.overlapLeft || this.player.overlapRight) ||
      (this.player.getKeys()?.get('RIGHT')?.isDown && this.player.flipX) ||
      (this.player.getKeys()?.get('LEFT')?.isDown && !this.player.flipX)
    ) {
      this.player.getState().advance(DudeStateName.fall)
    } 

    if (this.player.body.onFloor()) {
      if (this.player.flipX) {
        this.player.getState().advance(DudeStateName.idle, 'wj-left')
      } else {
        this.player.getState().advance(DudeStateName.idle, 'wj-right')
      }
    }
  }

  onStateExit(param?: any): void {
    this.player.body.setOffset(this.prevOffset, this.player.body.offset.y)
    this.player.setPosition(this.prePos, this.player.y)
    this.allowJump = false
  }
}

export default WallJump
