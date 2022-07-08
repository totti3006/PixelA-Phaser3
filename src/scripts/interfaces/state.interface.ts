export default abstract class IState {
  protected neighbors: IState[] = []
  abstract getName(): string
  abstract getNeighbors(): IState[]
  abstract addNeighbors(state: IState): void
  abstract onStateEnter(param?: any): void
  abstract onStateExecution(param?: any): void
  abstract onStateExit(param?: any): void
}
