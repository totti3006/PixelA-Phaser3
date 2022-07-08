class MenuScene extends Phaser.Scene {
  private startKey: Phaser.Input.Keyboard.Key

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
    this.add.image(0, 0, 'title').setOrigin(0, 0).setScale(0.27)

    // this.add.text(this.sys.canvas.width / 2 - 22, 105, 'START')
  }

  update(): void {
    if (this.startKey.isDown) {
      this.scene.start('HUDScene')
      this.scene.start('PlayScene')
      this.scene.bringToTop('HUDScene')
    }
  }

  private initGlobalDataManager(): void {
    this.registry.set('room', 'room2')
    this.registry.set('score', 0)
  }
}

export default MenuScene
