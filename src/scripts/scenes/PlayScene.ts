import DebugGraphics from '../helpers/DebugGraphics'
import GameManager from '../managers/GameManager'
import Box from '../objects/Box'
import Mushroom from '../objects/enemies/Mushroom'
import Plant from '../objects/enemies/Plant'
import Rino from '../objects/enemies/Rino'
import Fruit from '../objects/Fruit'
import Landmark from '../objects/Landmark'
import Bullet from '../objects/player/Bullet'
import Dude from '../objects/player/Dude'
import Spikes from '../objects/traps/Spikes'

type GameObj = Phaser.Types.Physics.Arcade.GameObjectWithBody

class PlayScene extends Phaser.Scene {
  // tilemap
  private map: Phaser.Tilemaps.Tilemap
  private terrainTile: Phaser.Tilemaps.Tileset
  private backgroundTile: Phaser.Tilemaps.Tileset
  private backgroundLayer: Phaser.Tilemaps.TilemapLayer
  public terrainLayer: Phaser.Tilemaps.TilemapLayer

  // game objects
  private player: Dude
  private boxes: Phaser.GameObjects.Group
  private fruits: Phaser.GameObjects.Group
  private traps: Phaser.GameObjects.Group
  private projectiles: Phaser.GameObjects.Group
  private mobs: Phaser.GameObjects.Group
  private bars: Phaser.GameObjects.Group
  private landmark: Phaser.GameObjects.Group
  private mobProjectiles: Phaser.GameObjects.Group

  // manager
  private gameManager: GameManager

  constructor() {
    super({ key: 'PlayScene' })
  }

  create() {
    this.map = this.make.tilemap({ key: this.registry.get('room') })
    this.terrainTile = this.map.addTilesetImage('terrain', 'terrain')

    let background: string = ''
    this.map.tilesets.forEach(obj => {
      if (obj.name.search('background') != -1) background = obj.name
    })
    this.backgroundTile = this.map.addTilesetImage(background, background)

    this.backgroundLayer = this.map.createLayer('backgroundLayer', this.backgroundTile)
    this.terrainLayer = this.map.createLayer('terrainLayer', this.terrainTile)

    this.terrainLayer.setName('terrainLayer')
    this.terrainLayer.setCollisionByProperty({ collide: true })

    // DebugGraphics(this)

    // *************
    // GAME OBJECTS
    // *************
    this.initObjectsGroup()
    this.loadObjectsFromTilemap()

    // *************
    // GAME MANAGER
    // *************
    this.gameManager = new GameManager(this, {
      terrainLayer: this.terrainLayer,
      player: this.player,
      boxes: this.boxes,
      fruits: this.fruits,
      traps: this.traps,
      projectiles: this.projectiles,
      mobs: this.mobs,
      bars: this.bars,
      landmark: this.landmark,
      mobProjectiles: this.mobProjectiles
    })

    // *****************************************************************
    // CAMERA
    // *****************************************************************
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)

    this.cameras.main.fadeIn(500, 0, 0, 0)
  }

  private initObjectsGroup(): void {
    this.boxes = this.add.group({
      runChildUpdate: true
    })

    this.fruits = this.add.group({
      runChildUpdate: true
    })

    this.traps = this.add.group({
      runChildUpdate: true
    })

    this.projectiles = this.add.group({
      runChildUpdate: true
    })

    this.mobs = this.add.group({
      runChildUpdate: true
    })

    this.bars = this.add.group({
      runChildUpdate: true
    })

    this.mobProjectiles = this.add.group({
      runChildUpdate: true
    })

    this.landmark = this.add.group({
      runChildUpdate: true
    })
  }

  private loadObjectsFromTilemap(): void {
    const objects = this.map.getObjectLayer('objects').objects as any[]

    objects.forEach(object => {
      if (object.name === 'box') {
        this.boxes.add(
          new Box({
            scene: this,
            content: object.properties[0].value,
            x: object.x,
            y: object.y,
            texture: 'box1-idle'
          })
        )
      }

      if (object.name === 'fruit') {
        this.fruits.add(
          new Fruit({
            scene: this,
            x: object.x,
            y: object.y,
            texture: object.properties[0].value,
            points: 100
          })
        )
      }

      if (object.name === 'trap') {
        if (object.properties[1].value === 'spikes') {
          this.traps.add(
            new Spikes(
              {
                scene: this,
                x: object.x,
                y: object.y,
                texture: object.properties[1].value
              },
              object.properties[0].value
            )
          )
        }
      }

      if (object.name === 'player') {
        this.player = new Dude(
          {
            scene: this,
            x: object.x,
            y: object.y,
            texture: 'mask-idle'
          },
          this.projectiles,
          this.map.heightInPixels
        )
      }

      if (object.name === 'mob') {
        if (object.properties[0].value === 'mushroom') {
          this.mobs.add(
            new Mushroom({
              scene: this,
              x: object.x,
              y: object.y,
              texture: 'mushroom-idle'
            })
          )
        } else if (object.properties[0].value === 'rino') {
          this.mobs.add(
            new Rino(
              {
                scene: this,
                x: object.x,
                y: object.y,
                texture: 'rino-idle'
              },
              this.landmark,
              this.player
            )
          )
        } else if (object.properties[1].value === 'plant') {
          this.mobs.add(
            new Plant(
              {
                scene: this,
                x: object.x,
                y: object.y,
                texture: 'plant-idle'
              },
              object.properties[0].value,
              this.mobProjectiles
            )
          )
        }
      }

      if (object.name === 'bar') {
        let bar = this.physics.add.image(object.x, object.y, `bar-${object.properties[0].value}-${object.width}`)
        bar.setOrigin(0, 0)
        bar.body.setAllowGravity(false)
        bar.body.setImmovable(true)
        bar.body.checkCollision.down = false
        bar.body.checkCollision.right = false
        bar.body.checkCollision.left = false

        this.bars.add(bar)
      }

      if (object.name === 'checkpoint') {
        this.landmark.add(
          new Landmark({
            scene: this,
            x: object.x,
            y: object.y,
            texture: 'checkpoint-noflag'
          })
        )
      }
    })
  }

  update() {
    this.player.update()
  }
}

export default PlayScene
