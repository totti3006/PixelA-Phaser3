import 'phaser'
import BootScene from './scenes/BootScene'
import HubScene from './scenes/HudScene'
import MenuScene from './scenes/MenuScene'
import PlayScene from './scenes/PlayScene'

const DEFAULT_WIDTH = 512
const DEFAULT_HEIGHT = 288

const config = {
  type: Phaser.AUTO,
  backgroundColor: '#ffffff',
  scale: {
    parent: 'phaser-game',
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    width: DEFAULT_WIDTH,
    height: DEFAULT_HEIGHT
  },
  scene: [BootScene, MenuScene, PlayScene, HubScene],
  physics: {
    default: 'arcade',
    arcade: {
      debug: false,
      gravity: { y: 1200 }
    }
  },
  render: { pixelArt: true }
}

window.addEventListener('load', () => {
  const game = new Phaser.Game(config)
})
