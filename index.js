var createGame = require('voxel-engine');
var terrain = require('voxel-perlin-terrain');
var createReach = require('voxel-reach');
var chunkSize = 32;
var generateChunk = terrain('foo', 0, 5, 20);
var game = createGame({
  materials: [
    'obsidian',
    ['grass', 'dirt', 'grass_dirt'],
    'whitewool',
    'plank',
  ],
  texturePath: 'textures/',
  generateChunks: false,
  controls: { discreteFire: true }
});

game.voxels.on('missingChunk', function(p) {
    var voxels = generateChunk(p, chunkSize)
    var chunk = {
      position: p,
      dims: [chunkSize, chunkSize, chunkSize],
      voxels: voxels,
      value: 2
    }
    game.showChunk(chunk)
})

var container = document.body;
game.appendTo(container);
//player
var createPlayer = require('voxel-player')(game);
var dude = createPlayer('dude.png');
dude.possess();
dude.yaw.position.set(0, 7, 0);
// var controlplayer = require('voxel-control')(state, opts);
// controlplayer.target(dude);
window.addEventListener('keydown', function (ev) {

  if (ev.keyCode === 'J'.charCodeAt(0)&&dude.velocity.y <= 0.5) {
    console.log('j');
    dude.move(0, 3, 0);
  }
});
//change element
reach = createReach(game, {reachDistance: 8});

reach.on('use', function(target) { 
  if (target)
    game.createBlock(target.adjacent, 2);
});

reach.on('mining', function(target) { 
  if (target&&game.getBlock(target.voxel)!=1){
    game.setBlock(target.voxel, 0);
  }
  });
//cloud
var clouds = require('voxel-clouds')({
  game: game,
  high: 10,
  distance: 300,
  many: 100,
  speed: 0.01,
  // material of the clouds
  material: new game.THREE.MeshBasicMaterial({
    emissive: 0xffffff,
    shading: game.THREE.FlatShading,
    fog: false,
    transparent: true,
    opacity: 0.5,
  }),
});
game.on('tick', clouds.tick.bind(clouds));
//forest
// var createTree = require('voxel-forest');
// createTree(game);