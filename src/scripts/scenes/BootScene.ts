import AnimationHelper from '../helpers/AnimationHelper'

class BootScene extends Phaser.Scene {
  private animationHelperInstance: AnimationHelper

  constructor() {
    super({ key: 'BootScene' })
  }

  preload() {
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
    this.scene.start('MenuScene')
  }
}

export default BootScene
