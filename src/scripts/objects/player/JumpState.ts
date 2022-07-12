import { DudeStateName } from '../../constants/StateName'
import IState from '../../interfaces/state.interface'
import Dude from './Dude'

class JumpState extends IState {
  private player: Dude

  constructor(player: Dude) {
    super()

    this.player = player
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

  onStateExecution(param?: any): void {
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
      this.player.getState().advance(DudeStateName.fall)
      // }
    }
  }

  onStateExit(param?: any): void {}
}

export default JumpState
