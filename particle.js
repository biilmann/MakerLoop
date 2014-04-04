var scene = new THREE.Scene();
var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(new THREE.Color(0, 1));
renderer.setSize( window.innerWidth, window.innerHeight );
document.getElementById("bg").appendChild( renderer.domElement );

// var geometry = new THREE.CubeGeometry(1,1,1);
// var material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );

camera.position.z = 300;

var particleCount = 1800,
    particles     = new THREE.Geometry(),
    pMaterial     = new THREE.ParticleBasicMaterial({
      color: 0xFFFFFF,
      size: 7,
      opacity: 0.5,
      map: THREE.ImageUtils.loadTexture(
        "particle.png"
      ),
      blending: THREE.AdditiveBlending,
      transparent: true
    });

var TAU = Math.PI * 2,
    R   = 200,
    A   = 1.2,
    B   = 0.6;

var position = function(p) {
  var t = p * TAU,
      modifier = (0.1 * p);
  x = 1.2 * R * Math.cos(t) * modifier;
  y = 0.6 *R * Math.sin(t);
  return {x: x, y: y};
}

// now create the individual particles
for(var p = 0; p < particleCount; p++) {
  var t = p / particleCount,
      point = position(t),
      z = Math.random() * 50,
      particle = new THREE.Vertex(
        new THREE.Vector3(point.x, point.y, z)
      );

  // // create a velocity vector
  particle.velocity = new THREE.Vector3(
    0,				// x
    0,	// y
    Math.random() * 2 - 1 //z
  );

  particle.t = t;

  if (Math.abs(particle.velocity.z) < 0.1 ) {
    particle.velocity.z = 0.1;
  }
  //particle.velocity.z += Math.random();

  // add it to the geometry
  particles.vertices.push(particle);
}

console.log("Done building circle");

// create the particle system
var particleSystem = new THREE.ParticleSystem(
  particles,
  pMaterial);

particleSystem.sortParticles = true;

// add it to the scene
scene.add(particleSystem);

var time = new Date().getTime(), newTime, diff, pCount;

function render() {
  requestAnimationFrame(render);

  // add some rotation to the system
  //particleSystem.rotation.z += 0.001;

  pCount  = particleCount;
  newTime = new Date().getTime();
  diff    = (newTime - time);
  time    = newTime

  while(pCount--) {
    // get the particle
    var particle = particles.vertices[pCount];

    particle.t += diff * Math.random() * 0.0001;

    var point = position(particle.t);

    particle.x = point.x;
    particle.y = point.y;

    if (particle.z > 100) {
      particle.velocity.z = Math.random() - 1.1;
    }
    if (particle.z < 0) {
      particle.velocity.z = Math.random() + 0.1;
    }
    //
    // // check if we need to reset
    // if(particle.z > 500) {
    //   particle.z = -500;
    //   particle.velocity.z = 0;
    // }
    //
    // // update the velocity
    // particle.velocity.z += Math.random() * .1;

    // and the position
    particle.add(
      particle.velocity);
  }

  // flag to the particle system that we've
  // changed its vertices. This is the
  // dirty little secret.
  particleSystem.geometry.__dirtyVertices = true;

  renderer.render(scene, camera);
}
render();
