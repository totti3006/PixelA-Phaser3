import { DudeStateName } from '../../constants/StateName'
import IState from '../../interfaces/state.interface'
import Dude from './Dude'

class IdleState extends IState {
  private player: Dude

  constructor(player: Dude) {
    super()

    this.player = player
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
  }

  onStateExecution(param?: any): void {
    if (this.player.body.velocity.y > 0) {
      this.player.getState().advance(DudeStateName.fall)
    }
  }

  onStateExit(param?: any): void {}
}

export default IdleState
