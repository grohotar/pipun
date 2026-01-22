import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

// Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  function removeActiveClasses() {
    accordionItems.forEach((item) => {
      item.classList.remove('active');
    });
  }

  accordionItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (item.classList.contains('active')) {
        removeActiveClasses();
      } else {
        removeActiveClasses();
        item.classList.add('active');
      }
    });
  });

  // Mobile menu toggle
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
      });
    });
  }

  // Grid overlay toggle
  let gridOverlay = null;
  
  document.addEventListener('keydown', function(e) {
    if (e.key === 'g' || e.key === 'G' || e.key === 'п' || e.key === 'П') {
      if (!gridOverlay) {
        createGridOverlay();
      } else {
        removeGridOverlay();
      }
    }
  });

  function createGridOverlay() {
    gridOverlay = document.createElement('div');
    gridOverlay.className = 'grid-overlay';
    
    const container = document.createElement('div');
    container.className = 'grid-overlay-container';
    
    for (let i = 0; i < 12; i++) {
      const column = document.createElement('div');
      column.className = 'grid-overlay-column';
      container.appendChild(column);
    }
    
    gridOverlay.appendChild(container);
    document.body.appendChild(gridOverlay);
  }

  function removeGridOverlay() {
    if (gridOverlay) {
      gridOverlay.remove();
      gridOverlay = null;
    }
  }

  // Initialize Earth
  const globeContainer = document.getElementById('globeViz');
  if (globeContainer) {
    initEarth(globeContainer);
  }
});

async function initEarth(container) {
  // Scene
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 0, 2.6);
  
  // Renderer
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true,
    powerPreference: 'high-performance'
  });
  renderer.setSize(660, 660);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio * 1.5, 3));
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  
  const sunLight = new THREE.DirectionalLight(0xffffff, 2);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);
  
  // Textures
  const textureLoader = new THREE.TextureLoader();
  const earthTexture = textureLoader.load('/8k_earth_daymap.jpg');
  earthTexture.colorSpace = THREE.SRGBColorSpace;
  earthTexture.anisotropy = renderer.capabilities.getMaxAnisotropy();
  earthTexture.minFilter = THREE.LinearMipMapLinearFilter;
  earthTexture.magFilter = THREE.LinearFilter;
  earthTexture.generateMipmaps = true;
  
  // Earth geometry
  const earthGeometry = new THREE.SphereGeometry(0.85, 128, 128);
  
  // Earth material with custom shader
  const earthMaterial = new THREE.ShaderMaterial({
    uniforms: {
      dayTexture: { value: earthTexture },
      sunDirection: { value: new THREE.Vector3(5, 3, 5).normalize() }
    },
    vertexShader: `
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D dayTexture;
      uniform vec3 sunDirection;
      
      varying vec2 vUv;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vec3 dayColor = texture2D(dayTexture, vUv).rgb;
        
        // Lighting
        float sunDot = dot(vNormal, sunDirection);
        float dayMix = smoothstep(-0.1, 0.3, sunDot);
        
        // Darken night side
        vec3 color = dayColor * (0.2 + 0.8 * dayMix);
        
        // Atmosphere glow
        vec3 viewDirection = normalize(-vPosition);
        float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 2.5);
        float atmosphereStrength = smoothstep(-0.5, 1.0, sunDot);
        vec3 atmosphereColor = vec3(0.3, 0.6, 1.0);
        color = mix(color, atmosphereColor, fresnel * atmosphereStrength * 0.3);
        
        gl_FragColor = vec4(color, 1.0);
      }
    `
  });
  
  const earth = new THREE.Mesh(earthGeometry, earthMaterial);
  earth.rotation.z = (23.5 * Math.PI) / 180;
  earth.rotation.x = (40 * Math.PI) / 180;
  earth.rotation.y = -(220 * Math.PI) / 180;
  scene.add(earth);
  
  // Atmosphere
  const atmosphereGeometry = new THREE.SphereGeometry(0.87, 64, 64);
  const atmosphereMaterial = new THREE.ShaderMaterial({
    uniforms: {
      sunDirection: { value: new THREE.Vector3(5, 3, 5).normalize() }
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vNormal = normalize(normalMatrix * normal);
        vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform vec3 sunDirection;
      varying vec3 vNormal;
      varying vec3 vPosition;
      
      void main() {
        vec3 viewDirection = normalize(-vPosition);
        float fresnel = pow(1.0 - abs(dot(viewDirection, vNormal)), 3.0);
        
        float sunDot = dot(vNormal, sunDirection);
        float atmosphereStrength = smoothstep(-0.5, 1.0, sunDot);
        
        // Day/twilight colors
        vec3 atmosphereDay = vec3(0.3, 0.6, 1.0);
        vec3 atmosphereTwilight = vec3(0.95, 0.4, 0.1);
        vec3 atmosphereColor = mix(atmosphereTwilight, atmosphereDay, smoothstep(-0.3, 0.7, sunDot));
        
        float alpha = fresnel * atmosphereStrength;
        alpha = smoothstep(0.0, 1.0, alpha);
        
        gl_FragColor = vec4(atmosphereColor, alpha * 0.8);
      }
    `,
    side: THREE.BackSide,
    transparent: true,
    blending: THREE.AdditiveBlending
  });
  
  const atmosphere = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
  atmosphere.rotation.z = (23.5 * Math.PI) / 180;
  atmosphere.rotation.x = (40 * Math.PI) / 180;
  atmosphere.rotation.y = -(220 * Math.PI) / 180;
  scene.add(atmosphere);

  // Array to store labels for visibility updates
  const labels = [];

  // Load countries data and add borders + labels
  try {
    console.log('Loading country data...');
    const response = await fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson');
    const data = await response.json();
    console.log('Country data loaded:', data.features.length, 'countries');
    
    // Add country borders and labels
    let labelCount = 0;
    data.features.forEach(feature => {
      const props = feature.properties;
      const name = props.NAME || props.ADMIN || props.name;
      
      // Add borders
      addCountryBorders(earth, feature);
      
      // Calculate centroid for label
      let labelLat, labelLng;
      const coords = feature.geometry.coordinates;
      
      if (feature.geometry.type === 'Polygon' && coords[0]) {
        const points = coords[0];
        labelLng = points.reduce((sum, p) => sum + p[0], 0) / points.length;
        labelLat = points.reduce((sum, p) => sum + p[1], 0) / points.length;
      } else if (feature.geometry.type === 'MultiPolygon' && coords[0] && coords[0][0]) {
        const points = coords[0][0];
        labelLng = points.reduce((sum, p) => sum + p[0], 0) / points.length;
        labelLat = points.reduce((sum, p) => sum + p[1], 0) / points.length;
      }
      
      if (name && labelLat !== undefined && labelLng !== undefined) {
        const label = addLabel(scene, name, labelLat, labelLng, earth);
        if (label) {
          labels.push(label);
          labelCount++;
        }
      }
    });
    console.log('Added', labelCount, 'labels');
  } catch (error) {
    console.error('Failed to load country data:', error);
  }
  
  // Controls
  const controls = new OrbitControls(camera, renderer.domElement);
  controls.enableDamping = true;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.autoRotate = false;
  
  // Animation
  const clock = new THREE.Clock();
  let rotationSpeed = 0.06;
  
  function animate() {
    requestAnimationFrame(animate);
    
    const delta = clock.getDelta();
    earth.rotation.y += delta * rotationSpeed;
    atmosphere.rotation.y += delta * rotationSpeed;
    
    // Update label visibility based on camera position
    updateLabelVisibility(labels, camera);
    
    controls.update();
    renderer.render(scene, camera);
  }
  
  animate();
}

function addCountryBorders(earth, feature) {
  const coords = feature.geometry.coordinates;
  const radius = 0.851; // Slightly above earth surface
  
  function processPolygon(polygon) {
    const points = [];
    polygon.forEach(point => {
      const [lng, lat] = point;
      const phi = (90 - lat) * (Math.PI / 180);
      const theta = (lng + 180) * (Math.PI / 180);
      
      const x = -(radius * Math.sin(phi) * Math.cos(theta));
      const y = radius * Math.cos(phi);
      const z = radius * Math.sin(phi) * Math.sin(theta);
      
      points.push(new THREE.Vector3(x, y, z));
    });
    
    if (points.length > 1) {
      const geometry = new THREE.BufferGeometry().setFromPoints(points);
      const material = new THREE.LineBasicMaterial({ 
        color: 0xffffff, 
        opacity: 0.4, 
        transparent: true,
        linewidth: 1
      });
      const line = new THREE.Line(geometry, material);
      earth.add(line);
    }
  }
  
  if (feature.geometry.type === 'Polygon') {
    coords.forEach(ring => processPolygon(ring));
  } else if (feature.geometry.type === 'MultiPolygon') {
    coords.forEach(polygon => {
      polygon.forEach(ring => processPolygon(ring));
    });
  }
}

function addLabel(scene, text, lat, lng, earth) {
  // Create canvas for text
  const canvas = document.createElement('canvas');
  const context = canvas.getContext('2d');
  canvas.width = 256;
  canvas.height = 64;
  
  // Draw text
  context.fillStyle = 'rgba(255, 255, 255, 0.9)';
  context.font = 'Bold 24px Arial';
  context.textAlign = 'center';
  context.textBaseline = 'middle';
  context.fillText(text, 128, 32);
  
  // Create texture from canvas
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  
  // Create sprite material
  const spriteMaterial = new THREE.SpriteMaterial({ 
    map: texture,
    transparent: true,
    depthTest: false
  });
  
  const sprite = new THREE.Sprite(spriteMaterial);
  
  // Convert lat/lng to 3D position
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lng + 180) * (Math.PI / 180);
  const radius = 0.86;
  
  sprite.position.x = -(radius * Math.sin(phi) * Math.cos(theta));
  sprite.position.y = radius * Math.cos(phi);
  sprite.position.z = radius * Math.sin(phi) * Math.sin(theta);
  
  sprite.scale.set(0.15, 0.04, 1);
  
  // Store original position for visibility check
  sprite.userData.lat = lat;
  sprite.userData.lng = lng;
  
  earth.add(sprite);
  return sprite;
}

function updateLabelVisibility(labels, camera) {
  labels.forEach(label => {
    // Get label position in world space
    const labelWorldPos = new THREE.Vector3();
    label.getWorldPosition(labelWorldPos);
    
    // Vector from earth center to label
    const labelDirection = labelWorldPos.clone().normalize();
    
    // Vector from earth center to camera
    const cameraDirection = camera.position.clone().normalize();
    
    // Dot product tells us if label is facing camera
    // If dot > 0, label is on visible hemisphere
    const dot = labelDirection.dot(cameraDirection);
    
    // Smooth fade based on dot product
    const targetOpacity = dot > 0.1 ? Math.min((dot - 0.1) / 0.3, 1) : 0;
    
    // Initialize opacity if not set
    if (label.material.opacity === undefined) {
      label.material.opacity = targetOpacity;
    }
    
    // Smooth transition
    label.material.opacity += (targetOpacity - label.material.opacity) * 0.1;
    label.visible = label.material.opacity > 0.01;
  });
}
