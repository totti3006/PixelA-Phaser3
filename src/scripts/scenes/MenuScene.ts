import { TransitionIn, TransitionOut } from '../helpers/Transition'

class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key

  private playButton: Phaser.GameObjects.Image

  private scaleUp: Phaser.Tweens.Tween
  private scaleDown: Phaser.Tweens.Tween

  constructor() {
    super({
      key: 'MenuScene'
    })
  }

  init(): void {
    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.startKey.isDown = false
    this.initGlobalDataManager()
  }

  create(): void {
    this.add.image(0, 0, 'title').setOrigin(0, 0)

    this.addButtons()

    this.scaleUp = this.add.tween({
      targets: this.playButton,
      scale: 1.8,
      duration: 500,
      repeat: 0,
      paused: true,
      ease: 'Linear',
      onComplete: () => {
        this.scaleDown.play()
      }
    })

    this.scaleDown = this.add.tween({
      targets: this.playButton,
      scale: 1.5,
      duration: 500,
      repeat: 0,
      paused: true,
      ease: 'Linear',
      onComplete: () => {
        this.scaleUp.play()
      }
    })

    this.scaleUp.play()

    // this.add.text(this.sys.canvas.width / 2 - 70, 130, 'Press S to play')
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('HUDScene')
      this.scene.start('PlayScene')
      this.scene.bringToTop('HUDScene')
    }
  }

  private initGlobalDataManager(): void {
    this.registry.set('room', 'room1')
    this.registry.set('score', 0)
  }

  private addButtons(): void {
    let upTween: Phaser.Tweens.Tween
    let moveTween: Phaser.Tweens.Tween
    let scaleTween: Phaser.Tweens.Tween

    this.playButton = this.add
      .image(this.sys.canvas.width / 2, this.sys.canvas.height / 2 - 50, 'button-play')
      .setScale(1.5)
      .setInteractive()
      .once('pointerup', pointer => {
        moveTween.stop()
        upTween.play()
      })
      .on('pointermove', pointer => {
        this.scaleUp.stop()
        this.scaleDown.stop()
        this.playButton.setScale(1.5)
        if (!upTween.isPlaying()) moveTween.play()
      })
      .on('pointerout', pointer => {
        if (!upTween.isPlaying()) this.scaleUp.play()
      })

    upTween = this.add.tween({
      targets: this.playButton,
      y: { from: this.playButton.y, to: this.playButton.y + 3 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0,
      onComplete: () => {
        TransitionOut(this)
        this.time.delayedCall(750, () => {
          this.scene.start('HUDScene')
          this.scene.start('PlayScene')
          this.scene.bringToTop('HUDScene')
        })
      }
    })

    moveTween = this.add.tween({
      targets: this.playButton,
      y: { from: this.playButton.y, to: this.playButton.y + 2 },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0
    })
  }
}

export default MenuScene
