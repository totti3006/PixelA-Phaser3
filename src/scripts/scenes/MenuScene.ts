import AnimatedButton from '../animations/AnimatedButton'
import Transition from '../animations/Transition'

class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key

  private playButton: AnimatedButton

  private transition: Transition

  constructor() {
    super({
      key: 'MenuScene'
    })

    // console.log('MenuScene constructor')
  }

  init(): void {
    // console.log('MenuScene init')

    this.startKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S)
    this.startKey.isDown = false
    this.transition = new Transition(this)
    this.initGlobalDataManager()
  }

  preload() {
    // console.log('MenuScene preload')
  }

  create(): void {
    // console.log('MenuScene create')

    this.add.image(0, 0, 'title').setOrigin(0, 0)

    this.playButton = new AnimatedButton(
      this,
      this.sys.canvas.width / 2,
      this.sys.canvas.height / 2 - 50,
      'button-play'
    )
    this.playButton
      .setScale(1.5)
      .setScaleRatio(1.8)
      .initButton(this.handleClickPlayButton)
      .setInteractive()
      .playScale()
      .on('pointerup', pointer => {
        this.playButton.playPointerUp().stopScale()
      })
      .on('pointermove', pointer => {
        this.playButton.playPointerMove()
      })
  }

  update(): void {
    // console.log('MenuScene update')

    if (this.startKey.isDown) {
      this.scene.start('HUDScene')
      this.scene.start('PlayScene')
      this.scene.bringToTop('HUDScene')
    }
  }

  private initGlobalDataManager(): void {
    this.registry.set('room', 'room1')
    this.registry.set('score', 0)
    this.registry.set('mapHeight', 0)
  }

  private handleClickPlayButton = (): void => {
    this.transition.transitionOut()
    this.time.delayedCall(750, () => {
      this.scene.start('HUDScene')
      this.scene.start('PlayScene')
      this.scene.bringToTop('HUDScene')
    })
  }
}

export default MenuScene
