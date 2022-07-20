import * as setting from '../constants/Setting'
import Transition from '../helpers/Transition'

class HubScene extends Phaser.Scene {
  private textElements: Map<string, Phaser.GameObjects.Text>

  private restartButton: Phaser.GameObjects.Image
  private nextButton: Phaser.GameObjects.Image
  private prevButton: Phaser.GameObjects.Image

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

    this.restartButton = this.add.image(this.sys.canvas.width / 2 + 180, 24, 'button-restart')
    this.addTweenButton(this.restartButton, this.handleRestart)

    if (this.registry.get('room') !== setting.finalRoom) {
      this.nextButton = this.add.image(this.restartButton.x - 30, 24, 'button-next')
      this.addTweenButton(this.nextButton, this.handleNext)
    }
    if (this.registry.get('room') !== 'room1') {
      this.prevButton = this.add.image(this.restartButton.x - 50, 24, 'button-previous')
      this.addTweenButton(this.prevButton, this.handlePrev)
    }

    this.transition.transitionIn()

    const level = this.scene.get('PlayScene')
    level.events.on('scoreChanged', this.updateScore, this)
  }

  private addTweenButton(button: Phaser.GameObjects.Image, callback): void {
    let upTween: Phaser.Tweens.Tween
    let moveTween: Phaser.Tweens.Tween

    button
      .setInteractive()
      .on('pointerup', pointer => {
        moveTween.stop()
        upTween.play()
      })
      .on('pointermove', pointer => {
        if (!upTween.isPlaying()) moveTween.play()
      })

    upTween = this.add.tween({
      targets: button,
      y: { from: button.y, to: button.y + 2 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0,
      onComplete: callback
    })

    moveTween = this.add.tween({
      targets: button,
      y: { from: button.y, to: button.y + 1 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0
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
