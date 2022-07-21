export interface IBulletConstructor {
  scene: Phaser.Scene
  bulletProperties: { speed: number; flipX: boolean }
  x: number
  y: number
  texture: string
  frame?: string | number
}
