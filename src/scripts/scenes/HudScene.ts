import * as setting from '../constants/Setting'
import Transition from '../animations/Transition'
import AnimatedButton from '../animations/AnimatedButton'

class HubScene extends Phaser.Scene {
  private textElements: Map<string, Phaser.GameObjects.Text>

  private restartButton: AnimatedButton
  private nextButton: AnimatedButton
  private prevButton: AnimatedButton

  private transition: Transition

  constructor() {
    super({
      key: 'HUDScene'
    })
  }

  init(): void {
    this.transition = new Transition(this)
  }

  create(): void {
    let hudBackground = this.add.image(this.sys.canvas.width / 2, 24, 'hud')

    this.textElements = new Map([
      ['LEVEL', this.addText(this.sys.canvas.width / 2 - 120, 16, `Room ${this.registry.get('room')[4]}`)],
      ['SCORE', this.addText(this.sys.canvas.width / 2 - 30, 16, `Score ${this.registry.get('score')}`)]
    ])

    this.createButtons()

    this.transition.transitionIn()

    const level = this.scene.get('PlayScene')
    level.events.on('scoreChanged', this.updateScore, this)
  }

  private createButtons(): void {
    this.createRestartButton()

    if (this.registry.get('room') !== setting.finalRoom) {
      this.createNextButton()
    }
    if (this.registry.get('room') !== 'room1') {
      this.createPreviousButton()
    }
  }

  private createRestartButton(): void {
    this.restartButton = new AnimatedButton(this, this.sys.canvas.width / 2 + 180, 24, 'button-restart')
    this.restartButton
      .setClickMovingRange(2)
      .setTouchMovingRange(1)
      .initButton(this.handleRestart)
      .setInteractive()
      .on('pointerup', pointer => {
        this.restartButton.playPointerUp()
      })
      .on('pointermove', pointer => {
        this.restartButton.playPointerMove()
      })
  }

  private createNextButton(): void {
    this.nextButton = new AnimatedButton(this, this.restartButton.x - 30, 24, 'button-next')
    this.nextButton
      .setClickMovingRange(2)
      .setTouchMovingRange(1)
      .initButton(this.handleNext)
      .setInteractive()
      .on('pointerup', pointer => {
        this.nextButton.playPointerUp()
      })
      .on('pointermove', pointer => {
        this.nextButton.playPointerMove()
      })
  }

  private createPreviousButton(): void {
    this.prevButton = new AnimatedButton(this, this.restartButton.x - 50, 24, 'button-previous')
    this.prevButton
      .setClickMovingRange(2)
      .setTouchMovingRange(1)
      .initButton(this.handlePrev)
      .setInteractive()
      .on('pointerup', pointer => {
        this.prevButton.playPointerUp()
      })
      .on('pointermove', pointer => {
        this.prevButton.playPointerMove()
      })
  }

  private handleRestart = (): void => {
    this.registry.values.score = 0
    this.events.emit('scoreChanged')
    this.transition.transitionOut()
    this.time.delayedCall(750, () => {
      this.scene.manager.getScene('PlayScene').scene.restart()
      this.scene.restart()
    })
  }

  private handleNext = (): void => {
    this.registry.values.score = 0
    this.registry.set('room', `room${this.registry.get('room').slice(4) * 1 + 1}`)
    this.events.emit('scoreChanged')
    this.transition.transitionOut()
    this.time.delayedCall(750, () => {
      this.scene.manager.getScene('PlayScene').scene.restart()
      this.scene.restart()
    })
  }

  private handlePrev = (): void => {
    this.registry.values.score = 0
    this.registry.set('room', `room${this.registry.get('room').slice(4) * 1 - 1}`)
    this.events.emit('scoreChanged')
    this.transition.transitionOut()
    this.time.delayedCall(750, () => {
      this.scene.manager.getScene('PlayScene').scene.restart()
      this.scene.restart()
    })
  }

  private addText(x: number, y: number, value: string): Phaser.GameObjects.Text {
    return this.add.text(x, y, value).setOrigin(0, 0)
  }

  private updateScore = (): void => {
    this.textElements
      .get('SCORE')
      ?.setText(`Score ${this.registry.get('score')}`)
      .setX(this.sys.canvas.width / 2 - 4 * (this.registry.get('score').toString().length - 1))
  }
}

export default HubScene
