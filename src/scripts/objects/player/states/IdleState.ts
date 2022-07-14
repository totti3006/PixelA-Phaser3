import { DudeStateName } from '../../../constants/StateName'
import IState from '../../../interfaces/state.interface'
import Dude from '../Dude'

class IdleState extends IState {
  private player: Dude
  private allowJump: boolean
  private wallJump: string

  constructor(player: Dude) {
    super()

    this.player = player
    this.allowJump = false
  }

  getName(): string {
    return DudeStateName.idle
  }

  getNeighbors(): IState[] {
    return this.neighbors
  }

  addNeighbors(state: IState): void {
    this.neighbors.push(state)
  }

  onStateEnter(param?: any): void {
    this.player.body.setVelocityX(0)
    this.player.body.setAccelerationX(0)
    this.player.anims.play('mask-idle-anims')

    if (param) {
      this.wallJump = param
    }
  }

  onStateExecution(param?: any): void {
    if (this.player.getKeys().get('JUMP')?.isUp) {
      this.allowJump = true
    }

    if (this.player.getKeys().get('JUMP')?.isDown && this.allowJump) {
      /*
       * Moving to Jump State
       */
      this.player.getState().advance(DudeStateName.jump)
      this.allowJump = false
    }

    if (this.player.body.velocity.y > 0) {
      /*
       *  Moving to Fall State
       */
      this.player.getState().advance(DudeStateName.fall)
    } else if (this.player.getKeys().get('RIGHT')?.isDown && this.player.getKeys().get('LEFT')?.isUp) {
      /*
       *  Moving to Move State
       */
      this.player.getState().advance(DudeStateName.move, 'right')

      if (this.wallJump === 'wj-left') {
        this.player.setCollideWall(false)
      }
    } else if (this.player.getKeys().get('LEFT')?.isDown && this.player.getKeys().get('RIGHT')?.isUp) {
      this.player.getState().advance(DudeStateName.move, 'left')

      if (this.wallJump === 'wj-right') {
        this.player.setCollideWall(false)
      }
    }
  }

  onStateExit(param?: any): void {
    this.allowJump = false
  }
}

export default IdleState
