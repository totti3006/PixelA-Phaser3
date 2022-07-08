import { DudeStateName } from '../../constants/StateName'
import IState from '../../interfaces/state.interface'
import Dude from './Dude'

class FallState extends IState {
  private player: Dude
  private isDoubleJump: boolean

  constructor(player: Dude) {
    super()

    this.player = player
    this.isDoubleJump = false
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
    this.player.anims.play('mask-fall-anims')
  }

  onStateExecution(param?: any): void {
    if (this.player.getKeys().get('RIGHT')?.isDown) {
      this.player.body.setAccelerationX(this.player.getAcceleration()).setOffset(6, 2)
      this.player.setFlipX(false)
    } else if (this.player.getKeys().get('LEFT')?.isDown) {
      this.player.body.setAccelerationX(-this.player.getAcceleration()).setOffset(4, 2)
      this.player.setFlipX(true)
    }

    if (this.player.getKeys()?.get('JUMP')?.isDown) {
      if (!this.isDoubleJump) {
        this.isDoubleJump = true
        this.player.body.setVelocityY(-350)
        this.player.anims.play('mask-djump-anims')
        this.player.anims.playAfterRepeat('mask-fall-anims')
      }
    }
  }

  onStateExit(param?: any): void {
    this.isDoubleJump = false
  }
}

export default FallState
