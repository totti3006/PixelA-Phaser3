import * as setting from '../constants/Setting'

class HubScene extends Phaser.Scene {
  private textElements: Map<string, Phaser.GameObjects.Text>

  private restartButton: Phaser.GameObjects.Image
  private nextButton: Phaser.GameObjects.Image
  private prevButton: Phaser.GameObjects.Image

  constructor() {
    super({
      key: 'HUDScene'
    })
  }

  create(): void {
    let hudBackground = this.add.image(this.sys.canvas.width / 2, 24, 'hud')

    this.textElements = new Map([
      ['LEVEL', this.addText(this.sys.canvas.width / 2 - 120, 16, `Room ${this.registry.get('room')[4]}`)],

      ['SCORE', this.addText(this.sys.canvas.width / 2 - 30, 16, `Score ${this.registry.get('score')}`)]
    ])

    this.addRestartButton()
    if (this.registry.get('room') !== setting.finalRoom) this.addNextButton()
    if (this.registry.get('room') !== 'room1') this.addPrevButton()

    const level = this.scene.get('PlayScene')
    level.events.on('scoreChanged', this.updateScore, this)
  }

  private addRestartButton(): void {
    let upTween: Phaser.Tweens.Tween
    let moveTween: Phaser.Tweens.Tween

    this.restartButton = this.add
      .image(this.sys.canvas.width / 2 + 180, 24, 'button-restart')
      .setInteractive()
      .on('pointerup', pointer => {
        moveTween.stop()
        upTween.play()
      })
      .on('pointermove', pointer => {
        if (!upTween.isPlaying()) moveTween.play()
      })

    upTween = this.add.tween({
      targets: this.restartButton,
      y: { from: this.restartButton.y, to: this.restartButton.y + 2 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0,
      onComplete: () => {
        this.registry.values.score = 0
        this.events.emit('scoreChanged')
        this.scene.manager.getScene('PlayScene').scene.restart()
        this.scene.restart()
      }
    })

    moveTween = this.add.tween({
      targets: this.restartButton,
      y: { from: this.restartButton.y, to: this.restartButton.y + 1 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0
    })
  }

  private addNextButton(): void {
    let upTween: Phaser.Tweens.Tween
    let moveTween: Phaser.Tweens.Tween

    this.nextButton = this.add
      .image(this.restartButton.x - 30, 24, 'button-next')
      .setInteractive()
      .on('pointerup', pointer => {
        moveTween.stop()
        upTween.play()
      })
      .on('pointermove', pointer => {
        if (!upTween.isPlaying()) moveTween.play()
      })

    upTween = this.add.tween({
      targets: this.nextButton,
      y: { from: this.nextButton.y, to: this.nextButton.y + 2 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0,
      onComplete: () => {
        this.registry.values.score = 0
        this.registry.set('room', `room${this.registry.get('room').slice(4) * 1 + 1}`)
        this.events.emit('scoreChanged')
        this.scene.manager.getScene('PlayScene').scene.restart()
        this.scene.restart()
      }
    })

    moveTween = this.add.tween({
      targets: this.nextButton,
      y: { from: this.nextButton.y, to: this.nextButton.y + 1 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0
    })
  }

  private addPrevButton(): void {
    let upTween: Phaser.Tweens.Tween
    let moveTween: Phaser.Tweens.Tween

    this.prevButton = this.add
      .image(this.restartButton.x - 50, 24, 'button-previous')
      .setInteractive()
      .on('pointerup', pointer => {
        moveTween.stop()
        upTween.play()
      })
      .on('pointermove', pointer => {
        if (!upTween.isPlaying()) moveTween.play()
      })

    upTween = this.add.tween({
      targets: this.prevButton,
      y: { from: this.prevButton.y, to: this.prevButton.y + 2 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0,
      onComplete: () => {
        this.registry.values.score = 0
        this.registry.set('room', `room${this.registry.get('room').slice(4) * 1 - 1}`)
        this.events.emit('scoreChanged')
        this.scene.manager.getScene('PlayScene').scene.restart()
        this.scene.restart()
      }
    })

    moveTween = this.add.tween({
      targets: this.prevButton,
      y: { from: this.prevButton.y, to: this.prevButton.y + 1 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0
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
