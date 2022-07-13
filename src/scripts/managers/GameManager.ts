import { DudeStateName } from '../constants/StateName'
import Box from '../objects/Box'
import Mob from '../objects/enemies/Mob'
import PlantBullet from '../objects/enemies/PlantBullet'
import Rino from '../objects/enemies/Rino'
import Fruit from '../objects/Fruit'
import Landmark from '../objects/Landmark'
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
  private bars: Phaser.GameObjects.Group
  private landmark: Phaser.GameObjects.Group
  private mobProjectiles: Phaser.GameObjects.Group

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
    this.bars = obj.bars
    this.landmark = obj.landmark
    this.mobProjectiles = obj.mobProjectiles

    // console.log(this.player.getVirtualBody())
    // console.log(this.player)

    // *****************************************************************
    // COLLIDERS
    // *****************************************************************
    // let collideTiles: Phaser.GameObjects.Group
    let collideTiles: Phaser.Tilemaps.Tile
    this.terrainLayer.forEachTile(tile => {
      // collideTiles.add(tile)
      collideTiles = tile
    })

    this.currentScene.physics.add.collider(this.player, this.terrainLayer)
    this.currentScene.physics.add.overlap(this.player.virtualPlayer, this.terrainLayer, (a, b) => {
      if (b instanceof Phaser.Tilemaps.Tile && a instanceof Phaser.GameObjects.Image) {
        if (b.index >= 0) {
          this.player.overlapRight = a.x < b.getCenterX() || this.player.overlapRight
          this.player.overlapLeft = a.x > b.getCenterX() || this.player.overlapLeft
          return
        }
      }
      
    })

    this.currentScene.physics.add.overlap(this.player.virtualPlayer, this.boxes, (a, b) => {
      if (b instanceof Phaser.GameObjects.Sprite && a instanceof Phaser.GameObjects.Image) {
        this.player.overlapRight = a.x < b.x || this.player.overlapRight
        this.player.overlapLeft = a.x > b.x || this.player.overlapLeft
      }
    })

    // this.currentScene.physics.add.collider(this.player.getVirtualBody(), this.terrainLayer, () => {
    //   // console.log('overlap')
    //   this.player.setCollideWall(true)
    // })
    this.currentScene.physics.add.collider(this.player, this.bars)
    this.currentScene.physics.add.overlap(
      this.player,
      this.landmark,
      this.handleLandmarkOverlap,
      undefined,
      this.currentScene
    )
    this.currentScene.physics.add.collider(this.landmark, this.terrainLayer)
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
    this.currentScene.physics.add.overlap(
      this.player,
      this.mobProjectiles,
      this.handlePlayerHitProjectile,
      undefined,
      this.currentScene
    )
    this.currentScene.physics.add.collider(
      this.mobProjectiles,
      this.terrainLayer,
      this.handleProjectileCollide,
      undefined,
      this.currentScene
    )
  }

  private handlePlayerHitProjectile = (player: GameObj, projectile: GameObj): void => {
    let _player = player as Dude
    let _projectile = projectile as PlantBullet

    _player.gotHit(_projectile.getSpeed())
    _projectile.hitObstacle()
  }

  private handleLandmarkOverlap = (player: GameObj, landmark: GameObj): void => {
    let _player = player as Dude
    let _landmark = landmark as Landmark

    _landmark.checkIn()
  }

  private handleProjectileCollideMobs = (projectile: GameObj, mob: GameObj): void => {
    let _projectile = projectile as Bullet
    let _mob = mob as Mob

    if (_mob.getVulnerable()) {
      _mob.gotHitFromBullet(_projectile.body.velocity.x)
    }
    _projectile.hitObstacle()
  }

  private handlePlayerMobsOverlap = (player: GameObj, mob: GameObj): void => {
    let _player = player as Dude
    let _mob = mob as Mob

    if (_player.body.touching.down && _mob.body.touching.up) {
      // player hit enemy on top
      _player.bounceUpAfterHitTargetOnHead()
      if (_mob.getVulnerable()) {
        _mob.gotHitOnHead()
      }
    } else {
      _player.gotHit(_mob.getSpeed())
    }
  }

  private handlePlayerHitTrap = (player: GameObj, trap: GameObj): void => {
    let _player = player as Dude
    let _trap = trap as Spikes

    _player.gotHit(0)
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
    let _projectile = projectile as Bullet | PlantBullet

    _projectile.hitObstacle()
  }
}

export default GameManager
