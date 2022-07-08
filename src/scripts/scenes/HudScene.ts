class HubScene extends Phaser.Scene {
  private textElements: Map<string, Phaser.GameObjects.Text>

  constructor() {
    super({
      key: 'HUDScene'
    })
  }

  create(): void {
    this.textElements = new Map([
      ['LEVEL', this.addText(this.sys.canvas.width / 2 - 80, 4, `Room-${this.registry.get('room')[4]}`)],

      ['SCORE', this.addText(this.sys.canvas.width / 2, 4, `Score ${this.registry.get('score')}`)]
    ])

    const level = this.scene.get('PlayScene')
    level.events.on('scoreChanged', this.updateScore, this)
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
