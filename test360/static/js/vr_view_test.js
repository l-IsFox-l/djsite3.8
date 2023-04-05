var renderer, scene, camera;
var texture;

function showBoxes() {
    // Load the image with boxes drawn on it
    texture = new THREE.TextureLoader().load('/media/assets/58688/proc_pn_58688.jpg');
    mesh.material.map = texture;
}

function hideBoxes() {
    // Load the image with boxes drawn on it
    texture = new THREE.TextureLoader().load('/media/pn_58688.jpg');
    mesh.material.map = texture;
}

function init() {
  container = document.getElementById('container');

  // Set initial values for yaw, pitch, and zoom from URL params
  var urlParams = new URLSearchParams(window.location.search);
  var yaw = parseFloat(urlParams.get('Yaw')) || 0;
  var pitch = parseFloat(urlParams.get('Pitch')) || 0;
  var zoom = parseFloat(urlParams.get('Zoom')) || 1;

  camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 1100);
  camera.target = new THREE.Vector3(0, 0, 0);

  // Apply initial values for yaw, pitch, and zoom to the camera
  camera.position.set(0, 0, 0);
  camera.rotation.order = 'YXZ';
  camera.rotation.y = -yaw;
  camera.rotation.x = pitch;
  camera.zoom = zoom;
  camera.updateProjectionMatrix();
  camera.maxZoom = 25;
  camera.minZoom = 1;
  scene = new THREE.Scene();

  // Load the image and create the texture
  texture = new THREE.TextureLoader().load('/media/pn_58688.jpg');

  texture.minFilter = texture.magFilter = THREE.LinearFilter;
  texture.mapping = THREE.EquirectangularReflectionMapping;

  var geometry = new THREE.SphereBufferGeometry(500, 60, 40);
  geometry.scale(-1, 1, 1);

  var material = new THREE.MeshBasicMaterial({
    map: texture
  });

  mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  // add mouse controls
  var controls = new THREE.OrbitControls(camera, container);
  controls.target.set(camera.position.x +0.1, camera.position.y, camera.position.z);
  controls.enableZoom = true;
  controls.update();

  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  container.appendChild(renderer.domElement);

  window.addEventListener('resize', onWindowResize, false);
}

// Debounce function to limit the frequency of URL updates
function debounce(func, delay) {
  let timer;
  return function() {
    const context = this;
    const args = arguments;
    clearTimeout(timer);
    timer = setTimeout(() => {
      func.apply(context, args);
    }, delay);
  };
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  requestAnimationFrame(animate);
  render();
}

// Debounced URL update function
const updateURL = debounce(() => {
  // Update URL params with current values for yaw, pitch, and zoom
  const yaw = (2 * Math.PI - camera.rotation.y) % (2 * Math.PI);
  let pitch = camera.rotation.x;
  if (pitch < -Math.PI / 2) {
    pitch = -Math.PI - pitch;
  } else if (pitch > Math.PI / 2) {
    pitch = Math.PI - pitch;
  }
  pitch = pitch + Math.PI / 2;
  const zoom = camera.zoom;
  window.history.replaceState(null, '', `?Yaw=${yaw.toFixed(2)}&Pitch=${pitch.toFixed(2)}&Zoom=${zoom.toFixed(2)}`);
}, 10);

function render() {
  updateURL();
  renderer.render(scene, camera);
}

window.onload = function() {
  init();
  animate();
}
