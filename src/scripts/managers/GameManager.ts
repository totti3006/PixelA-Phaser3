import Box from '../objects/Box'
import Mob from '../objects/enemies/Mob'
import Fruit from '../objects/Fruit'
import Bullet from '../objects/player/Bullet'
import Dude from '../objects/player/Dude'
import Spikes from '../objects/traps/Spikes'

type GameObj = Phaser.Types.Physics.Arcade.GameObjectWithBody

class GameManager {
  private currentScene: Phaser.Scene
  private obj: {}

  public terrainLayer: Phaser.Tilemaps.TilemapLayer
  private player: Dude
  private boxes: Phaser.GameObjects.Group
  private fruits: Phaser.GameObjects.Group
  private traps: Phaser.GameObjects.Group
  private projectiles: Phaser.GameObjects.Group
  private mobs: Phaser.GameObjects.Group

  constructor(scene: Phaser.Scene, obj: any) {
    this.currentScene = scene
    this.obj = obj

    this.terrainLayer = obj.terrainLayer
    this.player = obj.player
    this.boxes = obj.boxes
    this.fruits = obj.fruits
    this.traps = obj.traps
    this.projectiles = obj.projectiles
    this.mobs = obj.mobs

    // *****************************************************************
    // COLLIDERS
    // *****************************************************************
    this.currentScene.physics.add.collider(this.player, this.terrainLayer)
    this.currentScene.physics.add.collider(
      this.player,
      this.boxes,
      this.handlePlayerHitBox,
      undefined,
      this.currentScene
    )
    this.currentScene.physics.add.overlap(
      this.player,
      this.traps,
      this.handlePlayerHitTrap,
      undefined,
      this.currentScene
    )
    this.currentScene.physics.add.overlap(
      this.player,
      this.fruits,
      this.handleFruitOverlap,
      undefined,
      this.currentScene
    )
    this.currentScene.physics.add.collider(
      this.projectiles,
      this.terrainLayer,
      this.handleProjectileCollide,
      undefined,
      this.currentScene
    )
    this.currentScene.physics.add.collider(
      this.projectiles,
      this.boxes,
      this.handleProjectileCollide,
      undefined,
      this.currentScene
    )
    this.currentScene.physics.add.collider(this.mobs, this.terrainLayer)
    this.currentScene.physics.add.overlap(
      this.player,
      this.mobs,
      this.handlePlayerMobsOverlap,
      undefined,
      this.currentScene
    )
    this.currentScene.physics.add.overlap(
      this.projectiles,
      this.mobs,
      this.handleProjectileCollideMobs,
      undefined,
      this.currentScene
    )
  }

  private handleProjectileCollideMobs = (projectile: GameObj, mob: GameObj): void => {
    let _projectile = projectile as Bullet
    let _mob = mob as Mob

    _mob.gotHitFromBullet(_projectile.body.velocity.x)
    // _projectile.hitObstacle()
  }

  private handlePlayerMobsOverlap = (player: GameObj, mob: GameObj): void => {
    let _player = player as Dude
    let _mob = mob as Mob

    if (_player.body.touching.down && _mob.body.touching.up) {
      // player hit enemy on top
      _player.bounceUpAfterHitTargetOnHead()
      _mob.gotHitOnHead()
      this.currentScene.add.tween({
        targets: _mob,
        props: { alpha: 0 },
        duration: 1000,
        ease: 'Power0',
        yoyo: false,
        onComplete: function () {
          _mob.isDead()
        }
      })
    } else {
      _player.gotHit()
    }
  }

  private handlePlayerHitTrap = (player: GameObj, trap: GameObj): void => {
    let _player = player as Dude
    let _trap = trap as Spikes

    _player.gotHit()
  }

  private handlePlayerHitBox = (player: GameObj, box: GameObj): void => {
    let _player = player as Dude
    let _box = box as Box

    if ((_box.body.touching.down || _box.body.touching.up) && _box.active) {
      if (_box.body.touching.up) _player.bounceUpAfterHitTargetOnHead()
      this.currentScene.physics.world.disable(_box)
      _box.playHitAnims()
      this.fruits.add(_box.spawnBoxContent())
      _box.popUpFruit(this.terrainLayer)
    }
  }

  private handleFruitOverlap = (player: GameObj, fruit: GameObj): void => {
    let _player = player as Dude
    let _fruit = fruit as Fruit

    _fruit.collected()
  }

  private handleProjectileCollide = (projectile: GameObj, terrain): void => {
    let _projectile = projectile as Bullet

    _projectile.hitObstacle()
  }
}

export default GameManager
