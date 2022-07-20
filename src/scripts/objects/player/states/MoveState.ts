import { DudeStateName } from '../../../constants/StateName'
import IState from '../../../interfaces/state.interface'
import Dude from '../Dude'

class MoveState extends IState {
  private player: Dude
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

    if (this.player.getKeys().get('JUMP')?.isUp) {
      this.allowJump = true
    }

    if (this.player.getKeys().get('JUMP')?.isDown && this.allowJump) {
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
      (this.player.getKeys().get('RIGHT')?.isDown && this.player.getKeys().get('LEFT')?.isDown) ||
      (this.player.getKeys().get('RIGHT')?.isUp && this.player.getKeys().get('LEFT')?.isUp)
    ) {
      this.player.getState().advance(DudeStateName.idle)
    } else if (
      this.player.getKeys().get('RIGHT')?.isDown &&
      this.player.getKeys().get('LEFT')?.isUp &&
      this.player.flipX
    ) {
      /*
       * Moving to Move State right
       */
      this.player.getState().advance(DudeStateName.move, 'right')
    } else if (
      this.player.getKeys().get('RIGHT')?.isUp &&
      this.player.getKeys().get('LEFT')?.isDown &&
      !this.player.flipX
    ) {
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
}

export default MoveState
