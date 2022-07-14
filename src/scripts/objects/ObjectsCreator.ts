import PlayScene from '../scenes/PlayScene'
import Box from './Box'
import Mushroom from './enemies/Mushroom'
import Plant from './enemies/Plant'
import Rino from './enemies/Rino'
import Fruit from './Fruit'
import Landmark from './Landmark'
import Dude from './player/Dude'
import Spikes from './traps/Spikes'

class ObjectsCreator {
  private scene: PlayScene

  constructor(scene: PlayScene) {
    this.scene = scene
  }

  public createBox(x: number, y: number, content: string): Box {
    let box: Box = new Box({
      scene: this.scene,
      content: content,
      x: x,
      y: y,
      texture: 'box1-idle'
    })

    this.scene.boxes.add(box)

    return box
  }

  public createFruit(x: number, y: number, texture: string): Fruit {
    let fruit: Fruit = new Fruit({
      scene: this.scene,
      x: x,
      y: y,
      texture: texture,
      points: 100
    })

    this.scene.fruits.add(fruit)

    return fruit
  }

  public createSpikes(x: number, y: number, direction: string): Spikes {
    let spikes = new Spikes({
      scene: this.scene,
      x: x,
      y: y,
      texture: 'spikes'
    })

    if (direction === 'up') spikes.setUpDirection()
    else if (direction === 'down') spikes.setDownDirection()
    else if (direction === 'left') spikes.setLeftDirection()

    this.scene.traps.add(spikes)

    return spikes
  }

  public createPlayer(x: number, y: number): Dude {
    let player: Dude = new Dude(
      {
        scene: this.scene,
        x: x,
        y: y,
        texture: 'mask-idle'
      },
      this.scene.projectiles
    )

    return player
  }

  public createMushroom(x: number, y: number): Mushroom {
    let mushroom: Mushroom = new Mushroom({
      scene: this.scene,
      x: x,
      y: y,
      texture: 'mushroom-idle'
    })

    this.scene.mobs.add(mushroom)

    return mushroom
  }

  public createRino(x: number, y: number): Rino {
    let rino: Rino = new Rino(
      {
        scene: this.scene,
        x: x,
        y: y,
        texture: 'rino-idle'
      },
      this.scene.landmark,
      this.scene.player
    )

    this.scene.mobs.add(rino)

    return rino
  }

  public createPlant(x: number, y: number, direction: string): Plant {
    let plant: Plant = new Plant(
      {
        scene: this.scene,
        x: x,
        y: y,
        texture: 'plant-idle'
      },
      direction,
      this.scene.mobProjectiles
    )

    this.scene.mobs.add(plant)

    return plant
  }

  public createBar(x: number, y: number, texture: string): Phaser.GameObjects.GameObject {
    let bar = this.scene.physics.add.image(x, y, texture)
    bar.setOrigin(0, 0)
    bar.body.setAllowGravity(false)
    bar.body.setImmovable(true)
    bar.body.checkCollision.down = false
    bar.body.checkCollision.right = false
    bar.body.checkCollision.left = false

    this.scene.bars.add(bar)

    return bar
  }

  public createLandmark(x: number, y: number): Landmark {
    let landmark: Landmark = new Landmark({
      scene: this.scene,
      x: x,
      y: y,
      texture: 'checkpoint-noflag'
    })

    this.scene.landmark.add(landmark)

    return landmark
  }
}

export default ObjectsCreator
