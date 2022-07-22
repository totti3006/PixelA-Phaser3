import { DudeStateName } from '../../../constants/StateName'
import IState from '../../../interfaces/state.interface'
import Dude from '../Dude'
import DudeState from './DudeState'

class FallState extends DudeState {
  private isDoubleJump: boolean

  private allowDoubleJump: boolean

  constructor(player: Dude) {
    super()

    this.player = player
    this.isDoubleJump = false
    this.allowDoubleJump = false
  }

  getName(): string {
    return DudeStateName.fall
  }

  getNeighbors(): IState[] {
    return this.neighbors
  }

  addNeighbors(state: IState): void {
    this.neighbors.push(state)
  }

  onStateEnter(param?: any): void {
    this.isDoubleJump = param
    this.player.anims.play('mask-fall-anims')
  }

  onStateExecution(param?: any): void {
    if (this.isJumpKeyUp()) {
      this.allowDoubleJump = true
    }

    if (this.isJumpKeyDown() && this.allowDoubleJump) {
      if (!this.isDoubleJump) {
        this.player.dustAnimation.playJump()
        this.isDoubleJump = true
        this.player.body.setVelocityY(-350)
        this.player.anims.play('mask-djump-anims')
        this.player.anims.playAfterRepeat('mask-fall-anims')
      }
    }

    if (this.isRightKeyDown() && this.isLeftKeyUp()) {
      this.player.body.setAccelerationX(this.player.getAcceleration()).setOffset(8, 2)
      this.player.setFlipX(false)
    } else if (this.isLeftKeyDown() && this.isRightKeyUp()) {
      this.player.body.setAccelerationX(-this.player.getAcceleration()).setOffset(6, 2)
      this.player.setFlipX(true)
    } else if ((this.isRightKeyUp() && this.isLeftKeyUp()) || (this.isRightKeyDown() && this.isLeftKeyDown())) {
      this.player.body.setVelocityX(0)
      this.player.body.setAccelerationX(0)
    }

    if (this.player.body.onFloor()) {
      this.player.dustAnimation.playHitGround()
      if (this.isMovingToMoveStateRight()) {
        /*
         * Moving to Move State right
         */
        this.player.getState().advance(DudeStateName.move, 'right')
      } else if (this.isMovingToMoveStateLeft()) {
        /*
         * Moving to Move State left
         */
        this.player.getState().advance(DudeStateName.move, 'left')
      } else {
        /*
         * Moving to Idle State
         */
        this.player.getState().advance(DudeStateName.idle)
      }
    }

    /*
     * Moving to Wall Jump State
     */
    if (this.isMovingToWallJumpState()) {
      this.player.getState().advance(DudeStateName.wjump)
    }
  }

  onStateExit(param?: any): void {
    this.isDoubleJump = false
    this.allowDoubleJump = false
  }

  private isMovingToMoveStateRight(): boolean {
    return this.isRightKeyDown() && this.isLeftKeyUp()
  }

  private isMovingToMoveStateLeft(): boolean {
    return this.isLeftKeyDown() && this.isRightKeyUp()
  }

  private isMovingToWallJumpState(): boolean {
    return (
      (this.player.overlapLeft && this.player.flipX && !(this.isRightKeyDown() && this.isLeftKeyDown())) ||
      (this.player.overlapRight && !this.player.flipX && !(this.isRightKeyDown() && this.isLeftKeyDown()))
    )
  }
}

export default FallState
