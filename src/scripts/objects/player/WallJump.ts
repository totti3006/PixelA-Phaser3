import { DudeStateName } from '../../constants/StateName'
import IState from '../../interfaces/state.interface'
import Dude from './Dude'

class WallJump extends IState {
  private player: Dude
  private prevOffset: number

  constructor(player: Dude) {
    super()

    this.player = player
    this.prevOffset = 0
  }

  getName(): string {
    return DudeStateName.wjump
  }

  getNeighbors(): IState[] {
    return this.neighbors
  }

  addNeighbors(state: IState): void {
    this.neighbors.push(state)
  }

  onStateEnter(param?: any): void {
    this.player.anims.play('mask-walljump-anims')
    this.prevOffset = this.player.body.offset.x
    if (this.player.flipX) {
      this.player.body.setOffset(this.prevOffset + 2, this.player.body.offset.y)
    } else {
      this.player.body.setOffset(this.prevOffset - 2, this.player.body.offset.y)
    }
  }

  onStateExecution(param?: any): void {
    this.player.body.setVelocityY(40)

    if (this.player.getKeys()?.get('JUMP')?.isDown) {
      this.player.getState().advance(DudeStateName.jump)
    }

    // if (
    //   !(
    //     this.player.body.blocked.left ||
    //     this.player.body.blocked.right ||
    //     this.player.body.touching.right ||
    //     this.player.body.touching.left
    //   )
    // ) {
    //   this.player.getState().advance(DudeStateName.fall)
    // }
  }

  onStateExit(param?: any): void {
    this.player.body.setOffset(this.prevOffset, this.player.body.offset.y)
  }
}

export default WallJump
