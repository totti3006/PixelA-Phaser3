import { DudeStateName } from '../../../constants/StateName'
import IState from '../../../interfaces/state.interface'
import Dude from '../Dude'
import DudeState from './DudeState'

class IdleState extends DudeState {
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
    if (this.isJumpKeyUp()) {
      this.allowJump = true
    }

    if (this.isJumpKeyDown() && this.allowJump) {
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
    } else if (this.isMovingToMoveStateRight()) {
      /*
       *  Moving to Move State Right
       */
      this.player.getState().advance(DudeStateName.move, 'right')
    } else if (this.isMovingToMoveStateLeft()) {
      /*
       *  Moving to Move State Left
       */
      this.player.getState().advance(DudeStateName.move, 'left')
    }
  }

  onStateExit(param?: any): void {
    this.allowJump = false
  }

  private isMovingToMoveStateRight(): boolean {
    return this.isRightKeyDown() && this.isLeftKeyUp()
  }

  private isMovingToMoveStateLeft(): boolean {
    return this.isLeftKeyDown() && this.isRightKeyUp()
  }
}

export default IdleState
