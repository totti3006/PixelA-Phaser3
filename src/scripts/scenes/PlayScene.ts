import DebugGraphics from '../helpers/DebugGraphics'
import GameManager from '../managers/GameManager'
import ObjectsCreator from '../objects/ObjectsCreator'
import Dude from '../objects/player/Dude'

type GameObj = Phaser.Types.Physics.Arcade.GameObjectWithBody

class PlayScene extends Phaser.Scene {
  // tilemap
  private map: Phaser.Tilemaps.Tilemap
  private terrainTile: Phaser.Tilemaps.Tileset
  private backgroundTile: Phaser.Tilemaps.Tileset
  private backgroundLayer: Phaser.Tilemaps.TilemapLayer
  public terrainLayer: Phaser.Tilemaps.TilemapLayer

  // game objects
  public player: Dude
  public boxes: Phaser.GameObjects.Group
  public fruits: Phaser.GameObjects.Group
  public traps: Phaser.GameObjects.Group
  public projectiles: Phaser.GameObjects.Group
  public mobs: Phaser.GameObjects.Group
  public bars: Phaser.GameObjects.Group
  public landmark: Phaser.GameObjects.Group
  public mobProjectiles: Phaser.GameObjects.Group

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

    this.registry.set('mapHeight', this.map.heightInPixels)

    // DebugGraphics(this)

    // *************
    // GAME OBJECTS
    // *************
    this.initObjectsGroup()
    this.loadObjectsFromTilemap()

    // *************
    // GAME MANAGER
    // *************
    this.gameManager = new GameManager(this)

    // *****************************************************************
    // CAMERA
    // *****************************************************************
    this.cameras.main.startFollow(this.player)
    this.cameras.main.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels)
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
    const creator = new ObjectsCreator(this)

    objects.forEach(object => {
      if (object.name === 'box') {
        creator.createBox(object.x, object.y, object.properties[0].value)
      }

      if (object.name === 'fruit') {
        creator.createFruit(object.x, object.y, object.properties[0].value)
      }

      if (object.name === 'trap') {
        if (object.properties[1].value === 'spikes') {
          creator.createSpikes(object.x, object.y, object.properties[0].value)
        }
      }

      if (object.name === 'player') {
        this.player = creator.createPlayer(object.x, object.y)
      }

      if (object.name === 'mob') {
        if (object.properties[0].value === 'mushroom') {
          creator.createMushroom(object.x, object.y)
        } else if (object.properties[0].value === 'rino') {
          creator.createRino(object.x, object.y)
        } else if (object.properties[1].value === 'plant') {
          creator.createPlant(object.x, object.y, object.properties[0].value)
        }
      }

      if (object.name === 'bar') {
        creator.createBar(object.x, object.y, `bar-${object.properties[0].value}-${object.width}`)
      }

      if (object.name === 'checkpoint') {
        creator.createLandmark(object.x, object.y)
      }
    })
  }

  update() {
    this.player.update()
  }
}

export default PlayScene
