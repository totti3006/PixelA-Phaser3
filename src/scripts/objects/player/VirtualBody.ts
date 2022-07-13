import Dude from './Dude'

class VirtualBody extends Phaser.GameObjects.Rectangle {
  body: Phaser.Physics.Arcade.Body

  constructor(scene: Phaser.Scene, player: Dude, x: number, y: number, w: number, h: number, color: number) {
    super(scene, x, y, w, h)

    this.setOrigin(0, 0)

    this.scene.add.existing(this)

    this.scene.physics.add.existing(this)

    this.body.setAllowGravity(false)

    if (player.flipX) {
    } else {
    }
    this.body.setOffset(0, this.body.offset.y)

    this.body.checkCollision.down = false
    this.body.checkCollision.up = false
  }

  update(): void {
    console.log('hi')
  }
}

export default VirtualBody
