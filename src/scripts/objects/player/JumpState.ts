import { DudeStateName } from '../../constants/StateName'
import IState from '../../interfaces/state.interface'
import Dude from './Dude'

class JumpState extends IState {
  private player: Dude
  private dJump: boolean
  private allowDoubleJump: boolean

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
  }

  private moveTimer: Phaser.Time.TimerEvent
  onStateExecution(param?: any): void {
    if (this.player.getKeys()?.get('JUMP')?.isUp) {
      this.allowDoubleJump = true
    }

    if (this.player.getKeys()?.get('JUMP')?.isDown && this.allowDoubleJump) {
      if (!this.dJump) {
        this.dJump = true
        this.player.body.setVelocityY(-350)
        this.player.anims.play('mask-djump-anims')
      }
    }

    // if (this.player.getKeys()?.get('JUMP')?.isDown && this.allowDoubleJump) {
    //   this.dJump = true
    // }

    if (this.player.getKeys().get('RIGHT')?.isDown && this.player.getKeys().get('LEFT')?.isUp) {
      this.player.body.setAccelerationX(this.player.getAcceleration()).setOffset(8, 2)

      this.player.setFlipX(false)
    } else if (this.player.getKeys().get('LEFT')?.isDown && this.player.getKeys().get('RIGHT')?.isUp) {
      this.player.body.setAccelerationX(-this.player.getAcceleration()).setOffset(6, 2)

      this.player.setFlipX(true)
    } else if (this.player.getKeys().get('RIGHT')?.isUp && this.player.getKeys().get('LEFT')?.isUp) {
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
      // if (
      //   this.player.body.blocked.left ||
      //   this.player.body.blocked.right ||
      //   this.player.body.touching.right ||
      //   this.player.body.touching.left
      // ) {
      //   this.player.getState().advance(DudeStateName.wjump)
      // } else {
      this.player.getState().advance(DudeStateName.fall, this.dJump)
      // }
    }
  }

  onStateExit(param?: any): void {
    this.allowDoubleJump = false
    this.dJump = false
  }
}

export default JumpState
