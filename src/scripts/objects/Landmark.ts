import { ISpriteConstructor } from '../interfaces/sprite.interface'
import * as setting from '../constants/Setting'

class Landmark extends Phaser.GameObjects.Sprite {
  body: Phaser.Physics.Arcade.Body

  constructor(aParams: ISpriteConstructor) {
    super(aParams.scene, aParams.x, aParams.y, aParams.texture, aParams.frame)

    this.scene.add.existing(this)
    this.setOrigin(0, 0)

    this.scene.physics.world.enable(this)
    this.body.setImmovable(true)
  }

  public checkIn(): void {
    this.scene.physics.world.disable(this)
    this.anims.play('checkpoint-flagout-anims')
    this.anims.playAfterRepeat('checkpoint-flagidle-anims')

    this.scene.time.delayedCall(2000, () => {
      this.moveToNextRoom()
    })
  }

  private moveToNextRoom(): void {
    if (this.scene.registry.get('room') !== setting.finalRoom) {
      this.scene.cameras.main.fadeOut(500, 0, 0, 0)
      this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (camera, effect) => {
        this.scene.registry.set('room', `room${this.scene.registry.get('room').slice(4) * 1 + 1}`)
        this.scene.scene.manager.getScene('HUDScene').scene.restart()
        this.scene.scene.restart()
      })
    } else {
      this.scene.cameras.main.fadeOut(500, 0, 0, 0)
      this.scene.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, (camera, effect) => {
        this.scene.scene.stop('GameScene')
        this.scene.scene.stop('HUDScene')
        this.scene.scene.start('MenuScene')
      })
    }
  }
}

export default Landmark
