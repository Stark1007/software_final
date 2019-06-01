var createGame = require('voxel-engine');
var terrain = require('voxel-perlin-terrain');
var createReach = require('voxel-reach');
var chunkSize = 32;
var generateChunk = terrain('foo', 0, 5, 20);
var createTree = require('voxel-forest');

var game = createGame({
  materials: [
    'obsidian',
    ['grass', 'dirt', 'grass_dirt'],
    'whitewool',
    'plank',
    'grass_top', 
    ['tree', 'tree', 'tree_side'], 
    ['leave_side', 'leave_side', 'leave1']
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
    setTimeout(function(){createTree(game, {position:{x:0, y:0, z:0}, leaves:7, bark:6})}, 500)

})

var container = document.body;
game.appendTo(container);
//player
var createPlayer = require('voxel-player')(game);
var dude = createPlayer('dude.png');
dude.possess();
dude.yaw.position.set(0, 7, 0);

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
  high: 12,
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
//control
// var controlplayer = require('voxel-control');
// window.addEventListener('keydown', function (ev) {
//   // if (ev.keyCode === 'J'.charCodeAt(0)&&dude.velocity.y <= 0.5) {
//   // console.log('j');;
//   // };
//   if(ev.code === 'Space'){
//     console.log('space');
//     controlplayer(state.jump = true,);
//   }
// });