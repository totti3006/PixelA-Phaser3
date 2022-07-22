import AnimationHelper from '../helpers/AnimationHelper'

class BootScene extends Phaser.Scene {
  private animationHelperInstance: AnimationHelper

  constructor() {
    super({ key: 'BootScene' })

    // console.log('BootScene constructor')
  }

  init() {
    // console.log('BootScene init')
  }

  preload() {
    // console.log('BootScene preload')

    this.load.on('progress', () => {}, this)

    this.load.on(
      'complete',
      () => {
        this.animationHelperInstance = new AnimationHelper(this, this.cache.json.get('animationJSON'))
      },
      this
    )

    this.load.pack('preload', './assets/pack.json', 'preload')
  }

  create() {
    // console.log('BootScene create')
    this.scene.start('MenuScene')
  }
}

export default BootScene
