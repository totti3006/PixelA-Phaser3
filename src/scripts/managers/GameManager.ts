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
import PlayScene from '../scenes/PlayScene'

type GameObj = Phaser.Types.Physics.Arcade.GameObjectWithBody

class GameManager {
  private scene: PlayScene

  constructor(scene: PlayScene) {
    this.scene = scene

    // *****************************************************************
    // COLLIDERS
    // *****************************************************************

    this.scene.physics.add.collider(this.scene.player, this.scene.terrainLayer)
    this.scene.physics.add.overlap(this.scene.player.virtualPlayer, this.scene.terrainLayer, (a, b) => {
      if (b instanceof Phaser.Tilemaps.Tile && a instanceof Phaser.GameObjects.Image) {
        if (b.index >= 0) {
          this.scene.player.overlapRight = a.x < b.getCenterX() || this.scene.player.overlapRight
          this.scene.player.overlapLeft = a.x > b.getCenterX() || this.scene.player.overlapLeft
          return
        }
      }
    })

    this.scene.physics.add.overlap(this.scene.player.virtualPlayer, this.scene.boxes, (a, b) => {
      if (b instanceof Phaser.GameObjects.Sprite && a instanceof Phaser.GameObjects.Image) {
        this.scene.player.overlapRight = a.x < b.x || this.scene.player.overlapRight
        this.scene.player.overlapLeft = a.x > b.x || this.scene.player.overlapLeft
      }
    })

    this.scene.physics.add.collider(this.scene.player, this.scene.bars)
    this.scene.physics.add.overlap(this.scene.player, this.scene.landmark, this.handleLandmarkOverlap)
    this.scene.physics.add.collider(this.scene.landmark, this.scene.terrainLayer)
    this.scene.physics.add.collider(this.scene.player, this.scene.boxes, this.handlePlayerHitBox)
    this.scene.physics.add.overlap(this.scene.player, this.scene.traps, this.handlePlayerHitTrap)
    this.scene.physics.add.overlap(this.scene.player, this.scene.fruits, this.handleFruitOverlap)
    this.scene.physics.add.collider(this.scene.projectiles, this.scene.terrainLayer, this.handleProjectileCollide)
    this.scene.physics.add.collider(this.scene.projectiles, this.scene.boxes, this.handleProjectileCollide)
    this.scene.physics.add.collider(this.scene.mobs, this.scene.terrainLayer)
    this.scene.physics.add.overlap(this.scene.player, this.scene.mobs, this.handlePlayerMobsOverlap)
    this.scene.physics.add.overlap(this.scene.projectiles, this.scene.mobs, this.handleProjectileCollideMobs)
    this.scene.physics.add.overlap(this.scene.player, this.scene.mobProjectiles, this.handlePlayerHitProjectile)
    this.scene.physics.add.collider(this.scene.mobProjectiles, this.scene.terrainLayer, this.handleProjectileCollide)
  }

  private handlePlayerHitProjectile = (player: GameObj, projectile: GameObj): void => {
    if (!(player instanceof Dude) || !(projectile instanceof PlantBullet)) {
      return
    }

    player.gotHit(projectile.getSpeed())
    projectile.hitObstacle()
  }

  private handleLandmarkOverlap = (player: GameObj, landmark: GameObj): void => {
    if (!(player instanceof Dude) || !(landmark instanceof Landmark)) {
      return
    }

    landmark.checkIn()
  }

  private handleProjectileCollideMobs = (projectile: GameObj, mob: GameObj): void => {
    if (!(projectile instanceof Bullet) || !(mob instanceof Mob)) {
      return
    }

    if (mob.getVulnerable()) {
      mob.gotHitFromBullet(projectile.body.velocity.x)
    }
    projectile.hitObstacle()
  }

  private handlePlayerMobsOverlap = (player: GameObj, mob: GameObj): void => {
    if (!(player instanceof Dude) || !(mob instanceof Mob)) {
      return
    }

    if (player.body.touching.down && mob.body.touching.up) {
      // player hit enemy on top
      player.bounceUpAfterHitTargetOnHead()
      if (mob.getVulnerable()) {
        mob.gotHitOnHead()
      }
    } else {
      player.gotHit(mob.getSpeed())
    }
  }

  private handlePlayerHitTrap = (player: GameObj, trap: GameObj): void => {
    if (!(player instanceof Dude) || !(trap instanceof Spikes)) {
      return
    }

    player.gotHit(0)
  }

  private handlePlayerHitBox = (player: GameObj, box: GameObj): void => {
    if (!(player instanceof Dude) || !(box instanceof Box)) {
      return
    }

    if ((box.body.touching.down || box.body.touching.up) && box.active) {
      if (box.body.touching.up) player.bounceUpAfterHitTargetOnHead()
      this.scene.physics.world.disable(box)
      box.playHitAnims()
      this.scene.fruits.add(box.spawnBoxContent())
      box.popUpFruit(this.scene.terrainLayer)
    }
  }

  private handleFruitOverlap = (player: GameObj, fruit: GameObj): void => {
    if (!(player instanceof Dude) || !(fruit instanceof Fruit)) {
      return
    }

    fruit.collected()
  }

  private handleProjectileCollide = (projectile: GameObj, terrain): void => {
    let _projectile = projectile as Bullet | PlantBullet

    _projectile.hitObstacle()
  }
}

export default GameManager
