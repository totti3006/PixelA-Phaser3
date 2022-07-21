class AnimatedButton extends Phaser.GameObjects.Image {
  private upTween: Phaser.Tweens.Tween
  private moveTween: Phaser.Tweens.Tween
  private scaleUp: Phaser.Tweens.Tween

  private clickMovingRange: number
  private touchMovingRange: number
  private scaleRatio: number

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, frame?: string) {
    super(scene, x, y, texture, frame)

    this.scene.add.existing(this)

    this.clickMovingRange = 7
    this.touchMovingRange = 5
    this.scaleRatio = 1.2
  }

  public initButton(callback): AnimatedButton {
    this.upTween = this.scene.add.tween({
      targets: this,
      y: { from: this.y, to: this.y + this.clickMovingRange },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0,
      onComplete: callback
    })

    this.moveTween = this.scene.add.tween({
      targets: this,
      y: { from: this.y, to: this.y + this.touchMovingRange },
      duration: 100,
      paused: true,
      yoyo: true,
      repeat: 0
    })

    this.scaleUp = this.scene.add.tween({
      targets: this,
      scale: this.scaleRatio,
      duration: 500,
      repeat: -1,
      yoyo: true,
      ease: 'Sine.easeInOut',
      paused: true
    })

    return this
  }

  public setClickMovingRange(range: number): AnimatedButton {
    this.clickMovingRange = range
    return this
  }

  public setTouchMovingRange(range: number): AnimatedButton {
    this.touchMovingRange = range
    return this
  }

  public setScaleRatio(ratio: number): AnimatedButton {
    this.scaleRatio = ratio
    return this
  }

  public playPointerUp(): AnimatedButton {
    this.moveTween.stop()
    this.upTween.play()
    return this
  }

  public playPointerMove(): AnimatedButton {
    if (!this.upTween.isPlaying()) this.moveTween.play()
    return this
  }

  public playScale(): AnimatedButton {
    this.scaleUp.play()
    return this
  }

  public stopScale(): AnimatedButton {
    this.scaleUp.stop()
    return this
  }
}

export default AnimatedButton
