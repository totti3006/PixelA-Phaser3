import { DudeStateName } from '../../constants/StateName'
import IState from '../../interfaces/state.interface'
import Dude from './Dude'

class MoveState extends IState {
  private player: Dude

  constructor(player: Dude) {
    super()

    this.player = player
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
      this.player.body.setAccelerationX(-this.player.getAcceleration()).setOffset(4, 2)
      this.player.setFlipX(true)
    } else if (param === 'right') {
      this.player.body.setAccelerationX(this.player.getAcceleration()).setOffset(6, 2)
      this.player.setFlipX(false)
    }

    this.player.anims.play('mask-run-anims', true)
  }

  onStateExecution(param?: any): void {
    if (this.player.body.velocity.y > 0) {
      this.player.getState().advance(DudeStateName.fall)
    }
  }

  onStateExit(param?: any): void {}
}

export default MoveState
