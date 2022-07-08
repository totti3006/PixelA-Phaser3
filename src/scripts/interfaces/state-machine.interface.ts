import IState from './state.interface'

export default abstract class IStateMachine {
  abstract currentState(): IState
  abstract possibleTransitions(): string[]
  abstract advance(nextState: string): boolean
  abstract isComplete(): boolean
}
