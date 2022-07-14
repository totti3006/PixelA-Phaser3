import { ISpriteConstructor } from '../interfaces/sprite.interface'
import * as setting from '../constants/Setting'
import { TransitionIn, TransitionOut } from '../helpers/Transition'

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
      TransitionOut(this.scene)
      this.scene.time.delayedCall(750, () => {
        this.scene.registry.set('room', `room${this.scene.registry.get('room').slice(4) * 1 + 1}`)
        this.scene.scene.manager.getScene('HUDScene').scene.restart()
        this.scene.scene.restart()
      })
    } else {
      TransitionOut(this.scene)
      this.scene.time.delayedCall(750, () => {
        this.scene.scene.stop('GameScene')
        this.scene.scene.stop('HUDScene')
        this.scene.scene.start('MenuScene')
      })
    }
  }
}

export default Landmark
