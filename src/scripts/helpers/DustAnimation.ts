class DustAnimation {
  private scene: Phaser.Scene
  private source: Phaser.GameObjects.Sprite
  private jumpEmitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager
  private hitGroundEmitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager
  private moveEmitterManager: Phaser.GameObjects.Particles.ParticleEmitterManager

  private moveLeftEmitter: Phaser.GameObjects.Particles.ParticleEmitter
  private moveRightEmitter: Phaser.GameObjects.Particles.ParticleEmitter

  private wallJumpEmitter: Phaser.GameObjects.Particles.ParticleEmitter

  private countFrame: number

  constructor(source: Phaser.GameObjects.Sprite) {
    this.source = source
    this.scene = source.scene

    this.countFrame = 11

    this.initEmitter()

    this.createHitGroundEmitter()
    this.createJumpEmitter()
    this.createMoveEmitter()
    this.createWallJumpEmitter()
  }

  private initEmitter(): void {
    this.jumpEmitterManager = this.scene.add.particles('dust')
    this.hitGroundEmitterManager = this.scene.add.particles('dust')
    this.moveEmitterManager = this.scene.add.particles('dust')
  }

  private createJumpEmitter(): void {
    this.jumpEmitterManager.createEmitter({
      speed: { min: -100, max: 100 },
      angle: { min: 0, max: 180, steps: 3 },
      alpha: { start: 1, end: 0.5 },
      lifespan: 200,
      blendMode: 'SCREEN',
      scale: { start: 1, end: 0 },
      quantity: 3,
      on: false
    })
  }

  private createHitGroundEmitter(): void {
    this.hitGroundEmitterManager.createEmitter({
      speed: 100,
      angle: { min: -10, max: 10, steps: 2 },
      alpha: { start: 1, end: 0 },
      scale: { start: 0.2, end: 1 },
      lifespan: 200,
      blendMode: 'SCREEN',
      quantity: 2,
      on: false
    })

    this.hitGroundEmitterManager.createEmitter({
      speed: -100,
      angle: { min: 170, max: 190, steps: 2 },
      alpha: { start: 1, end: 0 },
      scale: { start: 0.2, end: 1 },
      lifespan: 200,
      blendMode: 'SCREEN',
      quantity: 2,
      on: false
    })
  }

  private createMoveEmitter(): void {
    this.moveLeftEmitter = this.moveEmitterManager.createEmitter({
      speed: 100,
      angle: { min: -10, max: 0, steps: 2 },
      alpha: { start: 1, end: 0 },
      scale: { start: 0.2, end: 1 },
      lifespan: 200,
      blendMode: 'SCREEN',
      quantity: 2,
      on: false
    })

    this.moveRightEmitter = this.moveEmitterManager.createEmitter({
      speed: -100,
      angle: { min: 180, max: 190, steps: 2 },
      alpha: { start: 1, end: 0 },
      scale: { start: 0.2, end: 1 },
      lifespan: 200,
      blendMode: 'SCREEN',
      quantity: 2,
      on: false
    })
  }

  private createWallJumpEmitter(): void {
    this.wallJumpEmitter = this.jumpEmitterManager.createEmitter({
      speed: 100,
      angle: 90,
      alpha: { start: 1, end: 0 },
      scale: { start: 0.2, end: 1 },
      lifespan: 200,
      blendMode: 'SCREEN',
      quantity: 2,
      on: false
    })
  }

  public resetCountFrame(): void {
    this.countFrame = 11
  }

  public playJump(): void {
    let x: number = this.source.x + this.source.width * 0.5
    let y: number = this.source.y

    this.jumpEmitterManager.emitParticleAt(x, y)
  }

  public playMove(): void {
    let x: number = this.source.x + this.source.width * 0.5
    let y: number = this.source.y + this.source.height

    this.countFrame += 1
    if (this.countFrame > 10) {
      this.countFrame = 0
      if (this.source.flipX) {
        this.moveLeftEmitter.emitParticleAt(x, y)
      } else {
        this.moveRightEmitter.emitParticleAt(x, y)
      }
    }
  }

  public playHitGround(): void {
    let x: number = this.source.x + this.source.width * 0.5
    let y: number = this.source.y + this.source.height

    this.hitGroundEmitterManager.emitParticleAt(x, y)
  }

  public playWallJump(): void {
    let x: number = this.source.x
    let y: number = this.source.y + this.source.height

    if (this.source.flipX) {
      this.wallJumpEmitter.emitParticleAt(x + 4, y)
    } else {
      this.wallJumpEmitter.emitParticleAt(x + this.source.width - 4, y)
    }
  }
}

export default DustAnimation
