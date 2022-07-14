import { DudeStateName } from '../../../constants/StateName'
import IState from '../../../interfaces/state.interface'
import Dude from '../Dude'

class FallState extends IState {
  private player: Dude
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
    if (this.player.getKeys()?.get('JUMP')?.isUp) {
      this.allowDoubleJump = true
    }

    if (this.player.getKeys()?.get('JUMP')?.isDown && this.allowDoubleJump) {
      if (!this.isDoubleJump) {
        this.isDoubleJump = true
        this.player.body.setVelocityY(-350)
        this.player.anims.play('mask-djump-anims')
        this.player.anims.playAfterRepeat('mask-fall-anims')
      }
    }

    if (this.player.getKeys().get('RIGHT')?.isDown && this.player.getKeys().get('LEFT')?.isUp) {
      this.player.body.setAccelerationX(this.player.getAcceleration()).setOffset(8, 2)
      this.player.setFlipX(false)
    } else if (this.player.getKeys().get('LEFT')?.isDown && this.player.getKeys().get('RIGHT')?.isUp) {
      this.player.body.setAccelerationX(-this.player.getAcceleration()).setOffset(6, 2)
      this.player.setFlipX(true)
    } else if (this.player.getKeys().get('RIGHT')?.isUp && this.player.getKeys().get('LEFT')?.isUp) {
      this.player.body.setVelocityX(0)
      this.player.body.setAccelerationX(0)
    }

    // if (this.player.isCollideWall()) {
    //   this.player.getState().advance(DudeStateName.wjump)
    // }

    if (this.player.body.onFloor()) {
      if (this.player.getKeys().get('RIGHT')?.isDown && this.player.getKeys().get('LEFT')?.isUp) {
        /*
         * Moving to Move State right
         */
        this.player.getState().advance(DudeStateName.move, 'right')
      } else if (this.player.getKeys().get('LEFT')?.isDown && this.player.getKeys().get('RIGHT')?.isUp) {
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

    if ((this.player.overlapLeft && this.player.flipX) || (this.player.overlapRight && !this.player.flipX)) {
      this.player.getState().advance(DudeStateName.wjump)
    }
  }

  onStateExit(param?: any): void {
    this.isDoubleJump = false
    this.allowDoubleJump = false
  }
}

export default FallState
