import { DudeStateName } from '../../../constants/StateName'
import IState from '../../../interfaces/state.interface'
import Dude from '../Dude'
import DudeState from './DudeState'

class JumpState extends DudeState {
  private dJump: boolean
  private allowDoubleJump: boolean
  private moveTimer: Phaser.Time.TimerEvent

  constructor(player: Dude) {
    super()

    this.player = player
    this.dJump = false
    this.allowDoubleJump = false
  }

  getName(): string {
    return DudeStateName.jump
  }

  getNeighbors(): IState[] {
    return this.neighbors
  }

  addNeighbors(state: IState): void {
    this.neighbors.push(state)
  }

  onStateEnter(param?: any): void {
    this.player.body.setVelocityY(-400)
    this.player.anims.play('mask-jump-anims')
    this.player.dustAnimation.playJump()
  }

  onStateExecution(param?: any): void {
    if (this.isJumpKeyUp()) {
      this.allowDoubleJump = true
    }

    if (this.isJumpKeyDown() && this.allowDoubleJump) {
      if (!this.dJump) {
        this.player.dustAnimation.playJump()
        this.dJump = true
        this.player.body.setVelocityY(-350)
        this.player.anims.play('mask-djump-anims')
      }
    }

    if (this.isRightKeyDown() && this.isLeftKeyUp()) {
      this.player.body.setAccelerationX(this.player.getAcceleration()).setOffset(8, 2)
      this.player.setFlipX(false)
    } else if (this.isLeftKeyDown() && this.isRightKeyUp()) {
      this.player.body.setAccelerationX(-this.player.getAcceleration()).setOffset(6, 2)
      this.player.setFlipX(true)
    } else if (this.isRightKeyUp() && this.isLeftKeyUp()) {
      if (!this.moveTimer || this.moveTimer.hasDispatched) {
        this.moveTimer = this.player.scene.time.delayedCall(50, () => {
          this.player.body.setVelocityX(0)
          this.player.body.setAccelerationX(0)
        })
      }
    }

    /*
     * Moving to Idle State
     */
    if (this.player.body.onFloor()) {
      this.player.getState().advance(DudeStateName.idle)
    }

    /*
     * Moving to Fall State
     */
    if (this.player.body.velocity.y > 0) {
      this.player.getState().advance(DudeStateName.fall, this.dJump)
    }
  }

  onStateExit(param?: any): void {
    this.allowDoubleJump = false
    this.dJump = false
  }
}

export default JumpState
