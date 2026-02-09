let threeModulePromise;
let orbitControlsPromise;
let gltfLoaderPromise;

async function loadThree() {
  if (!threeModulePromise) {
    threeModulePromise = import('three');
  }
  return threeModulePromise;
}

async function loadOrbitControls() {
  if (!orbitControlsPromise) {
    orbitControlsPromise = import('three/addons/controls/OrbitControls.js');
  }
  const module = await orbitControlsPromise;
  return module.OrbitControls;
}

async function loadGLTFLoader() {
  if (!gltfLoaderPromise) {
    gltfLoaderPromise = import('three/addons/loaders/GLTFLoader.js');
  }
  const module = await gltfLoaderPromise;
  return module.GLTFLoader;
}

function isIOSDevice() {
  const ua = navigator.userAgent || '';
  const isIOS = /iPad|iPhone|iPod/.test(ua);
  const isIPadOS = navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1;
  return isIOS || isIPadOS;
}

function prefersReducedMotion() {
  return window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function get3dSettings() {
  const dpr = window.devicePixelRatio || 1;
  const isSmallScreen = window.innerWidth <= 767;
  const reducedMotion = prefersReducedMotion();
  const lowPower = isIOSDevice() || isSmallScreen;
  const pixelRatio = lowPower ? Math.min(dpr, 1.25) : Math.min(dpr * 1.5, 2);
  return { reducedMotion, lowPower, pixelRatio };
}

function setupRenderLoop(renderer, container, renderFrame, { allowAnimation } = {}) {
  if (!allowAnimation) {
    renderFrame(0);
    return () => {};
  }

  let isInView = true;
  let isPageVisible = !document.hidden;
  let observer = null;

  function updateLoop() {
    if (isInView && isPageVisible) {
      renderer.setAnimationLoop(renderFrame);
    } else {
      renderer.setAnimationLoop(null);
    }
  }

  if ('IntersectionObserver' in window) {
    observer = new IntersectionObserver((entries) => {
      isInView = entries.some((entry) => entry.isIntersecting);
      updateLoop();
    }, { threshold: 0.1 });
    observer.observe(container);
  }

  document.addEventListener('visibilitychange', () => {
    isPageVisible = !document.hidden;
    updateLoop();
  });

  updateLoop();

  return () => {
    if (observer) {
      observer.disconnect();
    }
    renderer.setAnimationLoop(null);
  };
}

// Accordion functionality
document.addEventListener('DOMContentLoaded', function() {
  const accordionItems = document.querySelectorAll('.accordion-item');

  function closeItem(item) {
    const wrapper = item.querySelector('.accordion-content-wrapper');
    if (!wrapper || !item.classList.contains('active')) return;
    wrapper.style.height = `${wrapper.scrollHeight}px`;
    // Force reflow to ensure the height transition runs
    void wrapper.offsetHeight;
    wrapper.style.height = '0px';
    item.classList.remove('active');
  }

  function openItem(item) {
    const wrapper = item.querySelector('.accordion-content-wrapper');
    if (!wrapper) return;
    item.classList.add('active');
    wrapper.style.height = `${wrapper.scrollHeight}px`;

    const onEnd = (e) => {
      if (e.propertyName !== 'height') return;
      if (item.classList.contains('active')) {
        wrapper.style.height = 'auto';
      }
      wrapper.removeEventListener('transitionend', onEnd);
    };

    wrapper.addEventListener('transitionend', onEnd);
  }

  accordionItems.forEach((item) => {
    item.addEventListener('click', () => {
      if (item.classList.contains('active')) {
        closeItem(item);
        return;
      }

      accordionItems.forEach((other) => {
        if (other !== item) closeItem(other);
      });

      openItem(item);
    });
  });

  // Mobile menu toggle
  const burger = document.querySelector('.burger');
  const nav = document.querySelector('.nav');
  
  if (burger && nav) {
    burger.addEventListener('click', () => {
      burger.classList.toggle('active');
      nav.classList.toggle('active');
      document.body.classList.toggle('menu-open');
    });

    // Close menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('active');
        nav.classList.remove('active');
        document.body.classList.remove('menu-open');
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

  // Drag scroll for pricing cards
  const pricingWrapper = document.querySelector('.pricing-wrapper');
  if (pricingWrapper) {
    let isDown = false;
    let startX;
    let scrollLeft;

    pricingWrapper.addEventListener('mousedown', (e) => {
      isDown = true;
      pricingWrapper.style.cursor = 'grabbing';
      startX = e.pageX - pricingWrapper.offsetLeft;
      scrollLeft = pricingWrapper.scrollLeft;
      e.preventDefault();
    });

    pricingWrapper.addEventListener('mouseleave', () => {
      isDown = false;
      pricingWrapper.style.cursor = 'grab';
    });

    pricingWrapper.addEventListener('mouseup', () => {
      isDown = false;
      pricingWrapper.style.cursor = 'grab';
    });

    pricingWrapper.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - pricingWrapper.offsetLeft;
      const walk = (x - startX) * 2;
      pricingWrapper.scrollLeft = scrollLeft - walk;
    });

    // Prevent click on links when dragging
    let hasMoved = false;
    pricingWrapper.addEventListener('mousedown', () => {
      hasMoved = false;
    });
    
    pricingWrapper.addEventListener('mousemove', () => {
      if (isDown) hasMoved = true;
    });

    pricingWrapper.addEventListener('click', (e) => {
      if (hasMoved) {
        e.preventDefault();
        e.stopPropagation();
      }
    }, true);

    // Arrow buttons for pricing slider
    const prevButton = document.querySelector('.pricing-arrow-prev');
    const nextButton = document.querySelector('.pricing-arrow-next');

    if (prevButton && nextButton) {
      // Calculate card width including gap dynamically
      const firstCard = pricingWrapper.querySelector('.pricing-card');
      let scrollAmount = 300;
      
      if (firstCard) {
        const secondCard = pricingWrapper.querySelectorAll('.pricing-card')[1];
        if (secondCard) {
          // Distance from first card to second card = card width + gap
          scrollAmount = secondCard.offsetLeft - firstCard.offsetLeft;
        } else {
          scrollAmount = firstCard.offsetWidth;
        }
        
      }

      // Function to update button states
      function updateButtonStates() {
        const maxScroll = pricingWrapper.scrollWidth - pricingWrapper.offsetWidth;
        
        // Previous button disabled when at start (keep left padding visible)
        prevButton.disabled = pricingWrapper.scrollLeft <= 1;
        
        // Next button disabled when can't scroll further
        // The CSS ::after element already provides right padding
        const canScrollRight = pricingWrapper.scrollLeft < maxScroll - 1;
        nextButton.disabled = !canScrollRight;
      }

      prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const targetScroll = Math.max(0, pricingWrapper.scrollLeft - scrollAmount);
        pricingWrapper.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      });

      nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const maxScroll = pricingWrapper.scrollWidth - pricingWrapper.offsetWidth;
        // Scroll to maxScroll - the ::after CSS element already provides right padding
        const targetScroll = Math.min(maxScroll, pricingWrapper.scrollLeft + scrollAmount);
        pricingWrapper.scrollTo({
          left: targetScroll,
          behavior: 'smooth'
        });
      });

      // Update button states on scroll
      pricingWrapper.addEventListener('scroll', updateButtonStates);

      // Initial button state
      updateButtonStates();
      
      // Update on window resize
      window.addEventListener('resize', updateButtonStates);
    }
  }

  // Initialize 3D Flag Coin
  const flagIcon = document.getElementById('flagIcon');
  if (flagIcon) {
    const flagPath = flagIcon.getAttribute('data-flag');
    if (flagPath) {
      initFlagCoin(flagIcon, flagPath);
    }
  }

  // Initialize Earth
  const globeContainer = document.getElementById('globeViz');
  if (globeContainer) {
    initEarth(globeContainer);
  }
});

async function initEarth(container) {
  const THREE = await loadThree();
  const OrbitControls = await loadOrbitControls();
  const settings = get3dSettings();
  const reduceMotion = settings.reducedMotion;
  const lowPower = settings.lowPower;

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
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;
  container.appendChild(renderer.domElement);

  function resizeRenderer() {
    const rect = container.getBoundingClientRect();
    const fallbackSize = 660;
    const width = rect.width || fallbackSize;
    const height = rect.height || fallbackSize;
    const size = Math.min(width, height);
    renderer.setSize(size, size);
    renderer.setPixelRatio(get3dSettings().pixelRatio);
    camera.aspect = 1;
    camera.updateProjectionMatrix();
  }

  resizeRenderer();
  window.addEventListener('resize', resizeRenderer);
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
  scene.add(ambientLight);
  
  const sunLight = new THREE.DirectionalLight(0xffffff, 2);
  sunLight.position.set(5, 3, 5);
  scene.add(sunLight);
  
  // Textures
  const textureLoader = new THREE.TextureLoader();
  const earthTextureUrl = lowPower ? '/2k_earth_daymap.jpg' : '/8k_earth_daymap.jpg';
  const earthTexture = textureLoader.load(earthTextureUrl);
  earthTexture.colorSpace = THREE.SRGBColorSpace;
  earthTexture.anisotropy = lowPower ? 1 : renderer.capabilities.getMaxAnisotropy();
  earthTexture.minFilter = THREE.LinearMipMapLinearFilter;
  earthTexture.magFilter = THREE.LinearFilter;
  earthTexture.generateMipmaps = true;
  
  // Earth geometry
  const earthSegments = lowPower ? 64 : 128;
  const earthGeometry = new THREE.SphereGeometry(0.85, earthSegments, earthSegments);
  
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
  const atmosphereSegments = lowPower ? 48 : 64;
  const atmosphereGeometry = new THREE.SphereGeometry(0.87, atmosphereSegments, atmosphereSegments);
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
    const localUrl = '/data/ne_110m_admin_0_countries.geojson';
    let response = await fetch(localUrl);
    if (!response.ok) {
      response = await fetch('https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson');
    }
    const data = await response.json();
    console.log('Country data loaded:', data.features.length, 'countries');
    
    // Add country borders and labels
    let labelCount = 0;
    data.features.forEach(feature => {
      const props = feature.properties;
      const name = props.NAME || props.ADMIN || props.name;
      
      // Add borders
      addCountryBorders(earth, feature, THREE);
      
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
        const label = addLabel(scene, name, labelLat, labelLng, earth, THREE);
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
  controls.enableDamping = !reduceMotion;
  controls.dampingFactor = 0.05;
  controls.enableZoom = false;
  controls.autoRotate = false;
  
  // Animation
  const clock = new THREE.Clock();
  let rotationSpeed = 0.06;
  
  function renderFrame() {
    if (!reduceMotion) {
      const delta = Math.min(clock.getDelta(), 0.05);
      earth.rotation.y += delta * rotationSpeed;
      atmosphere.rotation.y += delta * rotationSpeed;
      controls.update();
    }

    // Update label visibility based on camera position
    if (labels.length > 0) {
      updateLabelVisibility(labels, camera, THREE);
    }
    renderer.render(scene, camera);
  }

  setupRenderLoop(renderer, container, renderFrame, { allowAnimation: !reduceMotion });
}

function addCountryBorders(earth, feature, THREE) {
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

function addLabel(scene, text, lat, lng, earth, THREE) {
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

function updateLabelVisibility(labels, camera, THREE) {
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

// Initialize 3D Flag Coin
async function initFlagCoin(container, flagPath) {
  const THREE = await loadThree();
  const GLTFLoader = await loadGLTFLoader();
  const settings = get3dSettings();
  const reduceMotion = settings.reducedMotion;

  // Scene
  const scene = new THREE.Scene();
  
  // Camera
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
  camera.position.set(0, 0, 3);
  
  // Renderer
  const renderer = new THREE.WebGLRenderer({ 
    antialias: true, 
    alpha: true
  });
  
  const isMobile = window.innerWidth <= 767;
  const size = isMobile ? window.innerWidth - 32 : container.offsetWidth; // На мобиле: ширина экрана - padding
  renderer.setSize(size, size);
  renderer.setPixelRatio(settings.pixelRatio);
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  container.appendChild(renderer.domElement);
  
  // Lighting
  const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
  scene.add(ambientLight);
  
  const directionalLight = new THREE.DirectionalLight(0xffffff, 4.2);
  directionalLight.position.set(5, 5, 5);
  scene.add(directionalLight);
  
  const directionalLight2 = new THREE.DirectionalLight(0xffffff, 2.4);
  directionalLight2.position.set(-5, -5, -5);
  scene.add(directionalLight2);
  
  const rimLight = new THREE.DirectionalLight(0xffffff, 2.3);
  rimLight.position.set(0, 5, -5);
  scene.add(rimLight);
  
  const rimLight2 = new THREE.DirectionalLight(0xffffff, 1.5);
  rimLight2.position.set(0, -5, 5);
  scene.add(rimLight2);
  
  // Animation variables (declare early)
  let mouseX = 0;
  let mouseY = 0;
  let targetRotationX = 0;
  let targetRotationY = 0;
  let autoRotationSpeed = 0.5;
  
  // Float animation parameters
  const floatParams = {
    speedX: 1.2,
    speedY: 0.8,
    speedZ: 1.4,
    amplitudeX: 0.15,
    amplitudeY: 0,
    amplitudeZ: 0.21
  };
  
  // Light parameters
  const lightParams = {
    ambient: 1.8,
    main: 4.2,
    secondary: 2.4,
    rim1: 2.3,
    rim2: 1.5
  };
  
  // Update light intensities
  ambientLight.intensity = lightParams.ambient;
  directionalLight.intensity = lightParams.main;
  directionalLight2.intensity = lightParams.secondary;
  rimLight.intensity = lightParams.rim1;
  rimLight2.intensity = lightParams.rim2;
  
  // Model rotation parameters
  const modelRotation = {
    x: 90,
    y: 0,
    z: 77
  };
  
  // Load coin model
  const loader = new GLTFLoader();
  let coin = null;
  
  try {
    const gltf = await new Promise((resolve, reject) => {
      loader.load('/images/flags/cc0_-_gold_coin_blank.glb', resolve, undefined, reject);
    });
    
    coin = gltf.scene;
    
    // Load flag texture
    const textureLoader = new THREE.TextureLoader();
    const flagTexture = await new Promise((resolve, reject) => {
      textureLoader.load(flagPath, resolve, undefined, reject);
    });
    
    flagTexture.colorSpace = THREE.SRGBColorSpace;
    flagTexture.wrapS = THREE.ClampToEdgeWrapping; // Убирает повтор
    flagTexture.wrapT = THREE.ClampToEdgeWrapping; // Убирает повтор
    flagTexture.anisotropy = renderer.capabilities.getMaxAnisotropy(); // Улучшает качество
    
    // UV adjustment parameters
    const uvParams = {
      scaleU: 1.7,
      scaleV: 1.7,
      offsetU: 0.86,
      offsetV: 0.12,
      rotation: 0,
      flipY: false
    };
    
    let meshes = [];
    
    // Apply texture to coin
    coin.traverse((child) => {
      if (child.isMesh) {
        child.material = new THREE.MeshStandardMaterial({
          map: flagTexture,
          metalness: 0.66,
          roughness: 0.4,
          side: THREE.DoubleSide
        });
        
        // Store original UVs
        if (child.geometry.attributes.uv) {
          const uvs = child.geometry.attributes.uv;
          const originalUVs = [];
          for (let i = 0; i < uvs.count; i++) {
            originalUVs.push({
              u: uvs.getX(i),
              v: uvs.getY(i)
            });
          }
          child.userData.originalUVs = originalUVs;
          meshes.push(child);
        }
      }
    });
    
    // Function to update UVs
    function updateUVs() {
      meshes.forEach(mesh => {
        const uvs = mesh.geometry.attributes.uv;
        const originalUVs = mesh.userData.originalUVs;
        
        for (let i = 0; i < uvs.count; i++) {
          let u = originalUVs[i].u;
          let v = originalUVs[i].v;
          
          if (uvParams.flipY) {
            v = 1 - v;
          }
          
          // Center
          u -= 0.5;
          v -= 0.5;
          
          // Rotate
          if (uvParams.rotation !== 0) {
            const angle = uvParams.rotation * Math.PI / 180;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const newU = u * cos - v * sin;
            const newV = u * sin + v * cos;
            u = newU;
            v = newV;
          }
          
          // Scale
          u *= uvParams.scaleU;
          v *= uvParams.scaleV;
          
          // Offset
          u += uvParams.offsetU;
          v += uvParams.offsetV;
          
          uvs.setXY(i, u, v);
        }
        uvs.needsUpdate = true;
      });
    }
    
    // Initial UV update
    updateUVs();
    
    // Scale and position coin
    const box = new THREE.Box3().setFromObject(coin);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const scale = 2 / maxDim;
    coin.scale.setScalar(scale);
    
    // Center coin
    box.setFromObject(coin);
    const center = box.getCenter(new THREE.Vector3());
    coin.position.sub(center);
    
    scene.add(coin);
    
  } catch (error) {
    console.error('Failed to load coin model:', error);
    return;
  }
  
  // Mouse interaction
  container.addEventListener('mousemove', (e) => {
    const rect = container.getBoundingClientRect();
    mouseX = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    mouseY = -((e.clientY - rect.top) / rect.height) * 2 + 1;
    
    targetRotationY = mouseX * 0.3;
    targetRotationX = mouseY * 0.3;
  });
  
  container.addEventListener('mouseleave', () => {
    targetRotationX = 0;
    targetRotationY = 0;
  });
  
  // Animation
  const clock = new THREE.Clock();
  
  function renderFrame() {
    if (coin) {
      const time = clock.getElapsedTime();
      
      // Apply base rotation from GUI
      const baseRotX = modelRotation.x * Math.PI / 180;
      const baseRotZ = modelRotation.z * Math.PI / 180;
      
      // Плавное качание в обе стороны
      const floatX = Math.sin(time * floatParams.speedX) * floatParams.amplitudeX; // Качание вверх-вниз
      const floatY = Math.sin(time * floatParams.speedY) * floatParams.amplitudeY;  // Качание влево-вправо
      
      // Применяем все вращения
      coin.rotation.x = baseRotX + targetRotationX + floatX;
      coin.rotation.y = targetRotationY + floatY;
      coin.rotation.z = baseRotZ;
    }
    
    renderer.render(scene, camera);
  }
  
  setupRenderLoop(renderer, container, renderFrame, { allowAnimation: !reduceMotion });
  
  // Handle resize
  window.addEventListener('resize', () => {
    const isSmall = window.innerWidth <= 767;
    const size = isSmall ? window.innerWidth - 32 : container.offsetWidth;
    camera.aspect = 1;
    camera.updateProjectionMatrix();
    renderer.setSize(size, size);
    renderer.setPixelRatio(get3dSettings().pixelRatio);
    if (reduceMotion) {
      renderFrame();
    }
  });
}
