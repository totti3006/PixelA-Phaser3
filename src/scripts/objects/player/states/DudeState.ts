import IState from '../../../interfaces/state.interface'
import Dude from '../Dude'

abstract class DudeState extends IState {
  protected player: Dude

  protected isRightKeyDown(): boolean {
    return this.player.getKeys()!.get('RIGHT')!.isDown
  }

  protected isRightKeyUp(): boolean {
    return this.player.getKeys().get('RIGHT')!.isUp
  }

  protected isLeftKeyDown(): boolean {
    return this.player.getKeys().get('LEFT')!.isDown
  }

  protected isLeftKeyUp(): boolean {
    return this.player.getKeys()!.get('LEFT')!.isUp
  }

  protected isJumpKeyDown(): boolean {
    return this.player.getKeys()!.get('JUMP')!.isDown
  }

  protected isJumpKeyUp(): boolean {
    return this.player.getKeys()!.get('JUMP')!.isUp
  }
}

export default DudeState
