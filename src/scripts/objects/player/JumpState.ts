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
    this.player.body.setVelocityY(-350)
    this.player.anims.play('mask-jump-anims')
  }

  onStateExecution(param?: any): void {
    if (this.player.getKeys().get('RIGHT')?.isDown) {
      this.player.body.setAccelerationX(this.player.getAcceleration()).setOffset(6, 2)
      this.player.setFlipX(false)
    } else if (this.player.getKeys().get('LEFT')?.isDown) {
      this.player.body.setAccelerationX(-this.player.getAcceleration()).setOffset(4, 2)
      this.player.setFlipX(true)
    }

    if (this.player.body.velocity.y > 0) {
      this.player.getState().advance(DudeStateName.fall)
    }
  }

  onStateExit(param?: any): void {}
}

export default JumpState
