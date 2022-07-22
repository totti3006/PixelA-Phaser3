import { DudeStateName } from '../../../constants/StateName'
import IState from '../../../interfaces/state.interface'
import Dude from '../Dude'
import DudeState from './DudeState'

class MoveState extends DudeState {
  private allowJump: boolean

  constructor(player: Dude) {
    super()

    this.player = player
    this.allowJump = false
  }

  getName(): string {
    return DudeStateName.move
  }

  getNeighbors(): IState[] {
    return this.neighbors
  }

  addNeighbors(state: IState): void {
    this.neighbors.push(state)
  }

  onStateEnter(param?: any): void {
    if (param === 'left') {
      this.player.body.setAccelerationX(-this.player.getAcceleration()).setOffset(6, 2)
      this.player.setFlipX(true)
    } else if (param === 'right') {
      this.player.body.setAccelerationX(this.player.getAcceleration()).setOffset(8, 2)
      this.player.setFlipX(false)
    }

    this.player.anims.play('mask-run-anims', true)
  }

  onStateExecution(param?: any): void {
    this.player.dustAnimation.playMove()

    if (this.isJumpKeyUp()) {
      this.allowJump = true
    }

    if (this.isJumpKeyDown() && this.allowJump) {
      /*
       * Moving to Jump State
       */
      this.player.getState().advance(DudeStateName.jump)
    }

    /*
     * Moving to Fall State
     */
    if (this.player.body.velocity.y > 0) {
      this.player.getState().advance(DudeStateName.fall)
    } else if (
      /*
       * Moving to Idle State
       */
      this.isMovingToIdleState()
    ) {
      this.player.getState().advance(DudeStateName.idle)
    } else if (this.isMovingToMoveStateRight()) {
      /*
       * Moving to Move State right
       */
      this.player.getState().advance(DudeStateName.move, 'right')
    } else if (this.isMovingtoMoveStateLeft()) {
      /*
       * Moving to Move State left
       */
      this.player.getState().advance(DudeStateName.move, 'left')
    }
  }

  onStateExit(param?: any): void {
    this.player.dustAnimation.resetCountFrame()
    this.allowJump = false
  }

  private isMovingToIdleState(): boolean {
    return (this.isRightKeyDown() && this.isLeftKeyDown()) || (this.isRightKeyUp() && this.isLeftKeyUp())
  }

  private isMovingToMoveStateRight(): boolean {
    return this.isRightKeyDown() && this.isLeftKeyUp() && this.player.flipX
  }

  private isMovingtoMoveStateLeft(): boolean {
    return this.isRightKeyUp() && this.isLeftKeyDown() && !this.player.flipX
  }
}

export default MoveState
