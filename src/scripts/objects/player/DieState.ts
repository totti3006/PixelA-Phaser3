import { DudeStateName } from '../../constants/StateName'
import IState from '../../interfaces/state.interface'
import Dude from './Dude'

class DieState extends IState {
  private player: Dude

  constructor(player: Dude) {
    super()

    this.player = player
  }

  getName(): string {
    return DudeStateName.die
  }

  getNeighbors(): IState[] {
    return this.neighbors
  }

  addNeighbors(state: IState): void {
    this.neighbors.push(state)
  }

  onStateEnter(param?: any): void {
    let v: number = -(this.player.body.velocity.x - param)

    this.player.body.stop()
    this.player.anims.play('mask-hit-anims')

    this.player.body.setVelocityY(-300)
    this.player.body.setVelocityX(v)

    this.player.body.checkCollision.up = false
    this.player.body.checkCollision.down = false
    this.player.body.checkCollision.left = false
    this.player.body.checkCollision.right = false
  }

  onStateExecution(param?: any): void {
    if (this.player.flipX) this.player.angle += 1
    else this.player.angle -= 1
  }

  onStateExit(param?: any): void {}
}

export default DieState
