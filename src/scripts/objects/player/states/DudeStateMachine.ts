import IStateMachine from '../../../interfaces/state-machine.interface'
import IState from '../../../interfaces/state.interface'
import Dude from '../Dude'
import IdleState from './IdleState'
import JumpState from './JumpState'
import FallState from './FallState'
import MoveState from './MoveState'
import DieState from './DieState'
import WallJump from './WallJump'

class DudeStateMachine extends IStateMachine {
  private stateList: IState[]
  private current: IState
  private exitState: IState

  constructor(player: Dude) {
    super()

    let idlestate = new IdleState(player)
    let jumpstate = new JumpState(player)
    let walljumpstate = new WallJump(player)
    let fallstate = new FallState(player)
    let movestate = new MoveState(player)
    let diestate = new DieState(player)

    this.stateList = [idlestate, jumpstate, walljumpstate, movestate, diestate]

    idlestate.addNeighbors(jumpstate)
    idlestate.addNeighbors(movestate)
    idlestate.addNeighbors(diestate)
    idlestate.addNeighbors(fallstate)

    jumpstate.addNeighbors(idlestate)
    jumpstate.addNeighbors(diestate)
    jumpstate.addNeighbors(movestate)
    jumpstate.addNeighbors(fallstate)
    jumpstate.addNeighbors(walljumpstate)

    walljumpstate.addNeighbors(jumpstate)
    walljumpstate.addNeighbors(idlestate)
    walljumpstate.addNeighbors(movestate)
    walljumpstate.addNeighbors(fallstate)
    walljumpstate.addNeighbors(diestate)

    movestate.addNeighbors(jumpstate)
    movestate.addNeighbors(diestate)
    movestate.addNeighbors(idlestate)
    movestate.addNeighbors(movestate)
    movestate.addNeighbors(fallstate)

    fallstate.addNeighbors(idlestate)
    fallstate.addNeighbors(jumpstate)
    fallstate.addNeighbors(movestate)
    fallstate.addNeighbors(diestate)
    fallstate.addNeighbors(walljumpstate)

    this.current = idlestate
    this.exitState = diestate

    this.current.onStateEnter()
  }

  /**
   * return current state
   *
   * @returns IState
   */
  public currentState(): IState {
    return this.current
  }

  /**
   * return all possible transition state at current state
   *
   * @returns string[]
   */
  public possibleTransitions(): string[] {
    let result: string[] = []

    this.current.getNeighbors().forEach(state => {
      result.push(state.getName())
    })

    return result
  }

  /**
   * advance to nextState, return true if success, otherwise return false
   *
   * @param nextState
   * @returns boolean
   */
  public advance(nextState: string, param?: any): boolean {
    // console.log(nextState)
    this.current.getNeighbors().forEach(state => {
      if (state.getName() == nextState) {
        this.current.onStateExit(param)
        this.current = state
        this.current.onStateEnter(param)
        return true
      }
    })

    return false
  }

  /**
   * return true if current state is final, otherwise return false
   *
   * @returns boolean
   */
  public isComplete(): boolean {
    return this.current == this.exitState
  }
}

export default DudeStateMachine
