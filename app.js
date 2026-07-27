// State Management
let cards = [];

const FACTORY_SETTINGS = {
  carouselType: 'carousel',
  aspectRatio: 'square',
  cardWidth: 300,
  cardHeight: 300,
  borderRadius: 24,
  cardShadow: 30,
  bgFit: 'cover',
  cardBg: '#1e293b',
  stackOffset: -16,
  scaleStep: 0.1,
  stackDirection: 'up',
  maxVisibleCards: 3,
  bgCardOpacity: 75,
  marginX: 120,
  marginY: 80,
  cardDuration: 2000,
  transitionDuration: 500,
  slideDirection: 'left',
  slideInDirection: 'fade',
  timingEasing: 'cubic-bezier(0.25, 1, 0.5, 1)'
};

let settings = Object.assign({}, FACTORY_SETTINGS);

// UI Element Selections
const dropzone = document.getElementById('dropzone');
const fileInput = document.getElementById('file-input');
const uploadBtn = document.getElementById('upload-btn');
const cardList = document.getElementById('card-list');
const emptyListMsg = document.getElementById('empty-list-msg');
const previewStage = document.getElementById('preview-stage');
const fileSizeBadge = document.getElementById('file-size-badge');
const downloadBtn = document.getElementById('download-btn');
const themeToggle = document.getElementById('theme-toggle');
const carouselTypeToggle = document.getElementById('carousel-type-toggle');

// Control inputs
const inputAspectRatio = document.getElementById('aspect-ratio');
const customDimensions = document.getElementById('custom-dimensions');
const inputCardWidth = document.getElementById('card-width');
const inputCardHeight = document.getElementById('card-height');
const inputBorderRadius = document.getElementById('border-radius');
const valBorderRadius = document.getElementById('border-radius-val');
const inputCardShadow = document.getElementById('card-shadow');
const valCardShadow = document.getElementById('card-shadow-val');
const inputBgFit = document.getElementById('bg-fit');
const inputCardBg = document.getElementById('card-bg');
const inputCardBgHex = document.getElementById('card-bg-hex');
const inputStackOffset = document.getElementById('stack-offset');
const valStackOffset = document.getElementById('stack-offset-val');
const inputScaleStep = document.getElementById('scale-step');
const valScaleStep = document.getElementById('scale-step-val');
const inputStackDirection = document.getElementById('stack-direction');
const inputCardDuration = document.getElementById('card-duration');
const valCardDuration = document.getElementById('card-duration-val');
const inputTransitionDuration = document.getElementById('transition-duration');
const valTransitionDuration = document.getElementById('transition-duration-val');
const inputSlideDirection = document.getElementById('slide-direction');
const inputSlideInDirection = document.getElementById('slide-in-direction');
const inputTimingEasing = document.getElementById('timing-easing');
const valBgCardOpacity = document.getElementById('bg-card-opacity-val');
const inputMaxVisible = document.getElementById('max-visible');
const inputBgCardOpacity = document.getElementById('bg-card-opacity');
const inputMarginX = document.getElementById('margin-x');
const valMarginX = document.getElementById('margin-x-val');
const inputMarginY = document.getElementById('margin-y');
const valMarginY = document.getElementById('margin-y-val');

// Code tab elements
const codeOutputSvg = document.getElementById('svg-code-output');
const codeOutputHtml = document.getElementById('html-code-output');
const codeOutputReact = document.getElementById('react-code-output');
const btnCopySvg = document.getElementById('copy-svg-btn');
const btnCopyHtml = document.getElementById('copy-html-btn');
const btnCopyReact = document.getElementById('copy-react-btn');
const btnSaveDefault = document.getElementById('save-default-btn');
const btnResetDefault = document.getElementById('reset-default-btn');

// Initialize event listeners
function init() {
  // Load saved theme preference
  const savedTheme = localStorage.getItem('theme');
  if (savedTheme === 'light') {
    document.body.classList.add('light-theme');
  }

  // Load saved default configuration settings
  const savedSettings = localStorage.getItem('motionsvg_settings');
  if (savedSettings) {
    try {
      const parsed = JSON.parse(savedSettings);
      settings = Object.assign({}, FACTORY_SETTINGS, parsed);
    } catch (e) {
      console.error('Failed to parse saved settings', e);
    }
  }

  setupEventListeners();
  syncUIFromSettings();
  loadSampleImages(); // Load 3 beautiful placeholder slides to wow the user initially!
}

// -------------------------------------------------------------
// EVENT LISTENERS & VALUE BINDINGS
// -------------------------------------------------------------
function setupEventListeners() {
  // File Upload Handlers
  uploadBtn.addEventListener('click', () => fileInput.click());
  fileInput.addEventListener('change', handleFileSelect);
  
  dropzone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropzone.classList.add('drag-active');
  });
  
  dropzone.addEventListener('dragleave', () => {
    dropzone.classList.remove('drag-active');
  });
  
  dropzone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropzone.classList.remove('drag-active');
    if (e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  });

  // Slider visual updates & state bindings
  bindInput(inputBorderRadius, valBorderRadius, 'borderRadius', 'px', parseInt);
  bindInput(inputCardShadow, valCardShadow, 'cardShadow', '%', parseInt);
  bindInput(inputStackOffset, valStackOffset, 'stackOffset', 'px', parseInt);
  bindInput(inputScaleStep, valScaleStep, 'scaleStep', '', parseFloat);
  bindInput(inputCardDuration, valCardDuration, 'cardDuration', 'ms', parseInt);
  bindInput(inputTransitionDuration, valTransitionDuration, 'transitionDuration', 'ms', parseInt);
  bindInput(inputBgCardOpacity, valBgCardOpacity, 'bgCardOpacity', '%', parseInt);
  bindInput(inputMarginX, valMarginX, 'marginX', 'px', parseInt);
  bindInput(inputMarginY, valMarginY, 'marginY', 'px', parseInt);

  inputMaxVisible.addEventListener('change', (e) => {
    settings.maxVisibleCards = parseInt(e.target.value) || 3;
    updateCarousel();
  });

  // Aspect ratio custom behavior
  inputAspectRatio.addEventListener('change', (e) => {
    settings.aspectRatio = e.target.value;
    if (settings.aspectRatio === 'custom') {
      customDimensions.classList.remove('hidden');
    } else {
      customDimensions.classList.add('hidden');
      if (settings.aspectRatio === 'portrait') {
        settings.cardWidth = 280;
        settings.cardHeight = 370;
      } else if (settings.aspectRatio === 'square') {
        settings.cardWidth = 300;
        settings.cardHeight = 300;
      } else if (settings.aspectRatio === 'landscape') {
        settings.cardWidth = 400;
        settings.cardHeight = 225;
      }
      inputCardWidth.value = settings.cardWidth;
      inputCardHeight.value = settings.cardHeight;
    }
    updateCarousel();
  });

  inputCardWidth.addEventListener('input', (e) => {
    settings.cardWidth = parseInt(e.target.value) || 300;
    updateCarousel();
  });

  inputCardHeight.addEventListener('input', (e) => {
    settings.cardHeight = parseInt(e.target.value) || 300;
    updateCarousel();
  });

  // Color picker sync
  inputCardBg.addEventListener('input', (e) => {
    settings.cardBg = e.target.value;
    inputCardBgHex.value = e.target.value;
    updateCarousel();
  });

  inputCardBgHex.addEventListener('input', (e) => {
    let hex = e.target.value;
    if (hex.startsWith('#') && hex.length === 7) {
      settings.cardBg = hex;
      inputCardBg.value = hex;
      updateCarousel();
    }
  });

  // Mode toggle listener
  if (carouselTypeToggle) {
    const btns = carouselTypeToggle.querySelectorAll('.segment-btn');
    btns.forEach(btn => {
      btn.addEventListener('click', () => {
        setCarouselType(btn.dataset.type);
      });
    });
  }

  // Dropdown standard selections
  inputBgFit.addEventListener('change', (e) => {
    settings.bgFit = e.target.value;
    updateCarousel();
  });

  inputStackDirection.addEventListener('change', (e) => {
    settings.stackDirection = e.target.value;
    updateCarousel();
  });

  inputSlideDirection.addEventListener('change', (e) => {
    settings.slideDirection = e.target.value;
    updateCarousel();
  });

  inputSlideInDirection.addEventListener('change', (e) => {
    settings.slideInDirection = e.target.value;
    updateCarousel();
  });

  inputTimingEasing.addEventListener('change', (e) => {
    settings.timingEasing = e.target.value;
    updateCarousel();
  });

  // Export Tab triggers
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-pane').forEach(p => p.classList.remove('active'));
      
      const tabId = e.target.getAttribute('data-tab');
      e.target.classList.add('active');
      document.getElementById(`tab-${tabId}`).classList.add('active');
    });
  });

  // Copy Buttons
  setupCopyBtn(btnCopySvg, codeOutputSvg);
  setupCopyBtn(btnCopyHtml, codeOutputHtml);
  setupCopyBtn(btnCopyReact, codeOutputReact);

  // Download Trigger
  downloadBtn.addEventListener('click', downloadSVG);

  // HTML5 Drag & Drop reordering variables
  let dragSrcEl = null;

  cardList.addEventListener('dragstart', (e) => {
    if (e.target.classList.contains('card-item')) {
      dragSrcEl = e.target;
      e.target.classList.add('dragging');
      e.dataTransfer.effectAllowed = 'move';
      e.dataTransfer.setData('text/html', e.target.innerHTML);
    }
  });

  cardList.addEventListener('dragover', (e) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
    return false;
  });

  cardList.addEventListener('dragenter', (e) => {
    if (e.target.closest('.card-item')) {
      e.target.closest('.card-item').classList.add('over');
    }
  });

  cardList.addEventListener('dragleave', (e) => {
    if (e.target.closest('.card-item')) {
      e.target.closest('.card-item').classList.remove('over');
    }
  });

  cardList.addEventListener('drop', (e) => {
    e.stopPropagation();
    const targetItem = e.target.closest('.card-item');
    if (dragSrcEl && targetItem && dragSrcEl !== targetItem) {
      const srcIndex = parseInt(dragSrcEl.getAttribute('data-index'));
      const targetIndex = parseInt(targetItem.getAttribute('data-index'));
      
      // Swap in array
      const temp = cards[srcIndex];
      cards.splice(srcIndex, 1);
      cards.splice(targetIndex, 0, temp);
      
      renderCardList();
      updateCarousel();
    }
    return false;
  });

  cardList.addEventListener('dragend', () => {
    document.querySelectorAll('.card-item').forEach(item => {
      item.classList.remove('dragging');
      item.classList.remove('over');
    });
  });

  // Theme Toggle Handler
  themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('light-theme');
    const isLight = document.body.classList.contains('light-theme');
    localStorage.setItem('theme', isLight ? 'light' : 'dark');
  });

  // Save as Default Click Handler
  btnSaveDefault.addEventListener('click', () => {
    localStorage.setItem('motionsvg_settings', JSON.stringify(settings));
    
    // Feedback effect
    const originalText = btnSaveDefault.textContent;
    btnSaveDefault.textContent = 'Defaults Saved!';
    btnSaveDefault.style.backgroundColor = 'var(--success)';
    btnSaveDefault.style.color = '#ffffff';
    btnSaveDefault.style.boxShadow = '0 0 10px rgba(16, 185, 129, 0.4)';
    
    setTimeout(() => {
      btnSaveDefault.textContent = originalText;
      btnSaveDefault.style.backgroundColor = '';
      btnSaveDefault.style.color = '';
      btnSaveDefault.style.boxShadow = '';
    }, 1500);
  });

  // Reset Defaults Click Handler
  btnResetDefault.addEventListener('click', () => {
    localStorage.removeItem('motionsvg_settings');
    settings = Object.assign({}, FACTORY_SETTINGS);
    syncUIFromSettings();
    updateCarousel();
    
    // Feedback effect
    const originalText = btnResetDefault.textContent;
    btnResetDefault.textContent = 'Reset Successful!';
    btnResetDefault.style.borderColor = 'var(--success)';
    btnResetDefault.style.color = 'var(--success)';
    
    setTimeout(() => {
      btnResetDefault.textContent = originalText;
      btnResetDefault.style.borderColor = '';
      btnResetDefault.style.color = '';
    }, 1500);
  });
}

// Syncs all UI inputs to settings values
function syncUIFromSettings() {
  inputAspectRatio.value = settings.aspectRatio;
  if (settings.aspectRatio === 'custom') {
    customDimensions.classList.remove('hidden');
  } else {
    customDimensions.classList.add('hidden');
  }
  
  inputCardWidth.value = settings.cardWidth;
  inputCardHeight.value = settings.cardHeight;
  
  inputBorderRadius.value = settings.borderRadius;
  valBorderRadius.textContent = settings.borderRadius + 'px';
  
  inputCardShadow.value = settings.cardShadow;
  valCardShadow.textContent = settings.cardShadow + '%';
  
  inputBgFit.value = settings.bgFit;
  
  inputCardBg.value = settings.cardBg;
  inputCardBgHex.value = settings.cardBg;
  
  inputStackOffset.value = settings.stackOffset;
  valStackOffset.textContent = settings.stackOffset + 'px';
  
  inputScaleStep.value = settings.scaleStep;
  valScaleStep.textContent = parseFloat(settings.scaleStep).toFixed(2);
  
  inputStackDirection.value = settings.stackDirection;
  inputMaxVisible.value = settings.maxVisibleCards;
  
  inputBgCardOpacity.value = settings.bgCardOpacity;
  valBgCardOpacity.textContent = settings.bgCardOpacity + '%';
  
  if (inputCardDuration) {
    inputCardDuration.value = settings.cardDuration || 2000;
    valCardDuration.textContent = (settings.cardDuration || 2000) + 'ms';
  }
  
  if (inputTransitionDuration) {
    inputTransitionDuration.value = settings.transitionDuration || 500;
    valTransitionDuration.textContent = (settings.transitionDuration || 500) + 'ms';
  }
  
  inputSlideDirection.value = settings.slideDirection;
  inputSlideInDirection.value = settings.slideInDirection;
  inputTimingEasing.value = settings.timingEasing;
  
  inputMarginX.value = settings.marginX;
  valMarginX.textContent = settings.marginX + 'px';
  
  inputMarginY.value = settings.marginY;
  valMarginY.textContent = settings.marginY + 'px';

  setCarouselType(settings.carouselType || 'carousel');
}

// Sets active carousel type mode and toggles mode-specific UI controls
function setCarouselType(type) {
  settings.carouselType = type;
  if (carouselTypeToggle) {
    const btns = carouselTypeToggle.querySelectorAll('.segment-btn');
    btns.forEach(btn => {
      if (btn.dataset.type === type) {
        btn.classList.add('active');
      } else {
        btn.classList.remove('active');
      }
    });
  }

  const depthControls = document.querySelectorAll('.depth-only-control');
  depthControls.forEach(el => {
    if (type === 'stack') {
      el.classList.add('hidden');
    } else {
      el.classList.remove('hidden');
    }
  });

  updateCarousel();
}

// Binds inputs with their label and syncs changes to state
function bindInput(elem, label, configKey, suffix = '', parser = (v) => v) {
  elem.addEventListener('input', (e) => {
    const val = parser(e.target.value);
    settings[configKey] = val;
    label.textContent = e.target.value + suffix;
    updateCarousel();
  });
}

// Sets up copy triggers
function setupCopyBtn(btn, sourceElem) {
  btn.addEventListener('click', () => {
    navigator.clipboard.writeText(sourceElem.textContent).then(() => {
      const originalText = btn.textContent;
      btn.textContent = 'Copied!';
      btn.style.backgroundColor = 'var(--success)';
      btn.style.color = '#ffffff';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 1500);
    });
  });
}

// -------------------------------------------------------------
// IMAGE PROCESSING & ASSET MANAGER
// -------------------------------------------------------------
function handleFileSelect(e) {
  if (e.target.files.length > 0) {
    processFiles(e.target.files);
  }
}

function processFiles(fileList) {
  let loadedCount = 0;
  const total = fileList.length;

  for (let i = 0; i < total; i++) {
    const file = fileList[i];
    if (!file.type.match('image.*')) continue;

    const reader = new FileReader();
    reader.onload = (event) => {
      const cardId = 'card_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5);
      cards.push({
        id: cardId,
        name: file.name,
        type: file.type,
        size: formatBytes(file.size),
        dataUrl: event.target.result
      });

      loadedCount++;
      if (loadedCount === total || i === total - 1) {
        renderCardList();
        updateCarousel();
      }
    };
    reader.readAsDataURL(file);
  }
  fileInput.value = ''; // Reset input so same file can be uploaded again
}

// Renders list in Card Stack Manager
function renderCardList() {
  if (cards.length === 0) {
    emptyListMsg.classList.remove('hidden');
    cardList.innerHTML = '';
    return;
  }
  
  emptyListMsg.classList.add('hidden');
  cardList.innerHTML = '';
  
  cards.forEach((card, index) => {
    const li = document.createElement('li');
    li.className = 'card-item';
    li.setAttribute('draggable', 'true');
    li.setAttribute('data-index', index);
    
    li.innerHTML = `
      <div class="drag-handle" title="Drag to reorder">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="9" cy="5" r="1"/>
          <circle cx="9" cy="12" r="1"/>
          <circle cx="9" cy="19" r="1"/>
          <circle cx="15" cy="5" r="1"/>
          <circle cx="15" cy="12" r="1"/>
          <circle cx="15" cy="19" r="1"/>
        </svg>
      </div>
      <div class="card-thumb" style="background-image: url(${card.dataUrl});"></div>
      <div class="card-info">
        <div class="card-name" title="${card.name}">${card.name}</div>
        <div class="card-meta">${card.size} • ${card.type.split('/')[1].toUpperCase()}</div>
      </div>
      <div class="card-item-actions">
        <button class="action-btn" onclick="moveCard(${index}, -1)" title="Move Up" ${index === 0 ? 'disabled' : ''}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="18 15 12 9 6 15"/>
          </svg>
        </button>
        <button class="action-btn" onclick="moveCard(${index}, 1)" title="Move Down" ${index === cards.length - 1 ? 'disabled' : ''}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="6 9 12 15 18 9"/>
          </svg>
        </button>
        <button class="action-btn btn-delete" onclick="deleteCard(${index})" title="Delete image">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
        </button>
      </div>
    `;
    cardList.appendChild(li);
  });
}

// Swaps cards (up/down triggers)
window.moveCard = function(index, direction) {
  const targetIndex = index + direction;
  if (targetIndex < 0 || targetIndex >= cards.length) return;
  
  const temp = cards[index];
  cards[index] = cards[targetIndex];
  cards[targetIndex] = temp;
  
  renderCardList();
  updateCarousel();
};

// Delete card
window.deleteCard = function(index) {
  cards.splice(index, 1);
  renderCardList();
  updateCarousel();
};

// -------------------------------------------------------------
// DYNAMIC SVG COMPILATION ENGINE
// -------------------------------------------------------------
function updateCarousel() {
  if (cards.length < 2) {
    // Revert to placeholder state
    previewStage.innerHTML = `
      <div class="preview-placeholder">
        <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1" class="placeholder-icon">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21 15 16 10 5 21"/>
        </svg>
        <h3>Live Animated Preview</h3>
        <p>Add 2 or more images in the sidebar to compile your animated SVG carousel.</p>
      </div>
    `;
    fileSizeBadge.textContent = 'Export Size: 0 KB';
    downloadBtn.disabled = true;
    codeOutputSvg.textContent = '<!-- Upload images to generate animated SVG -->';
    codeOutputHtml.textContent = '<!-- Generate SVG to get HTML snippet -->';
    codeOutputReact.textContent = '// Generate SVG to view React component code';
    return;
  }

  // Calculate coordinates & spacing
  const cardWidth = settings.cardWidth;
  const cardHeight = settings.cardHeight;
  
  // Set viewBox based on custom horizontal and vertical margins
  const svgWidth = cardWidth + settings.marginX * 2;
  const svgHeight = cardHeight + settings.marginY * 2;
  
  const cardX = settings.marginX;
  const cardY = settings.marginY; // Safe spacing from top of SVG viewport

  const N = cards.length;
  const cardDurationMs = settings.cardDuration || 2000;
  const transitionDurationMs = settings.transitionDuration || 500;
  const stepTimeMs = cardDurationMs + transitionDurationMs;
  const totalLoopMs = N * stepTimeMs;
  const loopDurationSec = (totalLoopMs / 1000).toFixed(2);

  const L = 100 / N;
  const T_dur = (transitionDurationMs / totalLoopMs) * 100;

  const loopSummaryVal = document.getElementById('loop-summary-val');
  const loopDetailsVal = document.getElementById('loop-details-val');
  if (loopSummaryVal && loopDetailsVal) {
    loopSummaryVal.textContent = `${loopDurationSec}s`;
    loopDetailsVal.textContent = `${N} cards × ${(stepTimeMs / 1000).toFixed(1)}s`;
  }

  const spacing = settings.stackOffset;
  const scaleStep = settings.scaleStep;
  const shadow = settings.cardShadow;
  const direction = settings.stackDirection;
  
  // Helper to compile state styles
  function getStateProps(S) {
    if (settings.carouselType === 'stack') {
      const shadowBlur = Math.round(28 * (1 - Math.min(S, 2) * 0.15));
      const shadowY = Math.round(12 * (1 - Math.min(S, 2) * 0.15));
      const shadowAlpha = (shadow / 100).toFixed(2);
      const boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha})`;
      
      const zIndex = N - S;
      
      return {
        transform: 'translate(0px, 0px) scale(1)',
        opacity: S === N - 1 ? '0' : '1',
        boxShadow: boxShadow,
        zIndex: zIndex
      };
    }

    const s = Math.max(0.1, 1 - S * scaleStep);
    
    // Shift calculations based on direction
    const dx = (direction === 'left' ? S * spacing : (direction === 'right' ? S * -spacing : 0));
    const dy = (direction === 'up' ? S * spacing : (direction === 'down' ? S * -spacing : 0));
    
    // Dynamic visible quantity & fog opacity calculations
    const maxVisible = settings.maxVisibleCards;
    const opacityStep = (100 - settings.bgCardOpacity) / 100;
    
    let opacity;
    if (S === 0) {
      opacity = '1';
    } else if (S >= maxVisible) {
      opacity = '0';
    } else {
      opacity = Math.max(0.05, 1 - S * opacityStep).toFixed(2);
    }
    
    const zIndex = N - S;
    
    // Physical shadows
    const shadowBlur = Math.round(28 * (1 - S * 0.25));
    const shadowY = Math.round(12 * (1 - S * 0.25));
    const shadowAlpha = (shadow / 100 * (1 - S * 0.3)).toFixed(2);
    const boxShadow = `0 ${shadowY}px ${shadowBlur}px rgba(0, 0, 0, ${shadowAlpha})`;
    
    return {
      transform: `translate(${dx}px, ${dy}px) scale(${s})`,
      opacity: opacity,
      boxShadow: boxShadow,
      zIndex: zIndex
    };
  }

  // Helper to get Slide Out Transform coordinates
  function getSlideOutTransform() {
    const dir = settings.slideDirection;
    if (dir === 'left') return 'translate(-125%, 30px) rotate(-12deg) scale(0.95)';
    if (dir === 'right') return 'translate(125%, 30px) rotate(12deg) scale(0.95)';
    if (dir === 'up') return `translate(0px, -${cardHeight + 40}px) scale(0.9)`;
    if (dir === 'down') return `translate(0px, ${cardHeight + 40}px) scale(0.9)`;
    return 'scale(0.85)'; // fade
  }

  // Helper to get Slide In Start Transform coordinates (for Back card entry)
  function getSlideInStartTransform(propsNext) {
    const dir = settings.slideInDirection;
    const S = N - 1;
    const s_back = Math.max(0.1, 1 - S * scaleStep);
    const dx_back = (direction === 'left' ? S * spacing : (direction === 'right' ? S * -spacing : 0));
    const dy_back = (direction === 'up' ? S * spacing : (direction === 'down' ? S * -spacing : 0));
    
    const shiftX = cardWidth * 0.4;
    const shiftY = cardHeight * 0.4;
    
    if (dir === 'left') return `translate(${dx_back - shiftX}px, ${dy_back}px) scale(${s_back})`;
    if (dir === 'right') return `translate(${dx_back + shiftX}px, ${dy_back}px) scale(${s_back})`;
    if (dir === 'up') return `translate(${dx_back}px, ${dy_back - shiftY}px) scale(${s_back})`;
    if (dir === 'down') return `translate(${dx_back}px, ${dy_back + shiftY}px) scale(${s_back})`;
    if (dir === 'scale') return `translate(${dx_back}px, ${dy_back}px) scale(0)`;
    return propsNext.transform; // fade
  }

  // Generate CSS Keyframes for each card i
  let keyframesCSS = '';
  for (let i = 0; i < N; i++) {
    keyframesCSS += `    @keyframes card-anim-${i} {\n`;
    for (let k = 0; k < N; k++) {
      const pStart = k * L;
      const pEnd = (k + 1) * L;
      const holdEnd = pEnd - T_dur;
      const stateNow = (i - k + N) % N;
      const stateNext = (i - (k + 1) + N) % N;
      
      const propsNow = getStateProps(stateNow);
      const propsNext = getStateProps(stateNext);
      
      if (stateNow === 0 && stateNext === N - 1) {
        // SLIDE OUT & SLIDE IN TRANSITION (Front to Back)
        const pMid1 = holdEnd + T_dur * 0.49;
        const pMid2 = holdEnd + T_dur * 0.51;
        const slideTransform = getSlideOutTransform();
        
        // Directions are compatible for continuous swoop if they match, or if slide-in is set to default 'fade'
        const isContinuous = (settings.slideInDirection === 'fade' || settings.slideInDirection === settings.slideDirection) && (settings.slideDirection !== 'fade');
        
        if (isContinuous) {
          // CONTINUOUS ORBITAL SWOOP (Card stays visible, swooping out and back in seamlessly)
          const isHiddenBack = parseFloat(propsNext.opacity) === 0;
          const midOpacity = isHiddenBack ? 0 : Math.max(0.7, parseFloat(propsNext.opacity));
          
          keyframesCSS += `      ${pStart.toFixed(2)}% {\n`;
          keyframesCSS += `        transform: ${propsNow.transform};\n`;
          keyframesCSS += `        opacity: ${propsNow.opacity};\n`;
          keyframesCSS += `        box-shadow: ${propsNow.boxShadow};\n`;
          keyframesCSS += `        z-index: ${propsNow.zIndex};\n`;
          keyframesCSS += `      }\n`;
          
          keyframesCSS += `      ${holdEnd.toFixed(2)}% {\n`;
          keyframesCSS += `        transform: ${propsNow.transform};\n`;
          keyframesCSS += `        opacity: ${propsNow.opacity};\n`;
          keyframesCSS += `        box-shadow: ${propsNow.boxShadow};\n`;
          keyframesCSS += `        z-index: ${propsNow.zIndex};\n`;
          keyframesCSS += `      }\n`;
          
          // Midpoint 1 (slid out, still on top layer)
          keyframesCSS += `      ${pMid1.toFixed(2)}% {\n`;
          keyframesCSS += `        transform: ${slideTransform};\n`;
          keyframesCSS += `        opacity: ${midOpacity};\n`;
          keyframesCSS += `        box-shadow: ${propsNow.boxShadow};\n`;
          keyframesCSS += `        z-index: ${N + 2};\n`;
          keyframesCSS += `      }\n`;
          
          // Midpoint 2 (instantly swap layer order to back while fully clear of stack)
          keyframesCSS += `      ${pMid2.toFixed(2)}% {\n`;
          keyframesCSS += `        transform: ${slideTransform};\n`;
          keyframesCSS += `        opacity: ${midOpacity};\n`;
          keyframesCSS += `        box-shadow: ${propsNext.boxShadow};\n`;
          keyframesCSS += `        z-index: ${propsNext.zIndex};\n`;
          keyframesCSS += `      }\n`;
          
          keyframesCSS += `      ${pEnd.toFixed(2)}% {\n`;
          keyframesCSS += `        transform: ${propsNext.transform};\n`;
          keyframesCSS += `        opacity: ${propsNext.opacity};\n`;
          keyframesCSS += `        box-shadow: ${propsNext.boxShadow};\n`;
          keyframesCSS += `        z-index: ${propsNext.zIndex};\n`;
          keyframesCSS += `      }\n`;
        } else {
          // FADED TELEPORT (For disparate directions - fades out, jumps, fades in)
          const slideInStart = getSlideInStartTransform(propsNext);
          
          keyframesCSS += `      ${pStart.toFixed(2)}% {\n`;
          keyframesCSS += `        transform: ${propsNow.transform};\n`;
          keyframesCSS += `        opacity: ${propsNow.opacity};\n`;
          keyframesCSS += `        box-shadow: ${propsNow.boxShadow};\n`;
          keyframesCSS += `        z-index: ${propsNow.zIndex};\n`;
          keyframesCSS += `      }\n`;
          
          keyframesCSS += `      ${holdEnd.toFixed(2)}% {\n`;
          keyframesCSS += `        transform: ${propsNow.transform};\n`;
          keyframesCSS += `        opacity: ${propsNow.opacity};\n`;
          keyframesCSS += `        box-shadow: ${propsNow.boxShadow};\n`;
          keyframesCSS += `        z-index: ${propsNow.zIndex};\n`;
          keyframesCSS += `      }\n`;
          
          // Midpoint 1 (slid out, fully transparent)
          keyframesCSS += `      ${pMid1.toFixed(2)}% {\n`;
          keyframesCSS += `        transform: ${slideTransform};\n`;
          keyframesCSS += `        opacity: 0;\n`;
          keyframesCSS += `        box-shadow: none;\n`;
          keyframesCSS += `        z-index: ${N + 2};\n`;
          keyframesCSS += `      }\n`;
          
          // Midpoint 2 (teleport to slide-in starting position, still transparent, swap z-index)
          keyframesCSS += `      ${pMid2.toFixed(2)}% {\n`;
          keyframesCSS += `        transform: ${slideInStart};\n`;
          keyframesCSS += `        opacity: 0;\n`;
          keyframesCSS += `        box-shadow: none;\n`;
          keyframesCSS += `        z-index: ${propsNext.zIndex};\n`;
          keyframesCSS += `      }\n`;
          
          keyframesCSS += `      ${pEnd.toFixed(2)}% {\n`;
          keyframesCSS += `        transform: ${propsNext.transform};\n`;
          keyframesCSS += `        opacity: ${propsNext.opacity};\n`;
          keyframesCSS += `        box-shadow: ${propsNext.boxShadow};\n`;
          keyframesCSS += `        z-index: ${propsNext.zIndex};\n`;
          keyframesCSS += `      }\n`;
        }
      } else {
        // SMOOTH SLIDE FORWARD
        keyframesCSS += `      ${pStart.toFixed(2)}% {\n`;
        keyframesCSS += `        transform: ${propsNow.transform};\n`;
        keyframesCSS += `        opacity: ${propsNow.opacity};\n`;
        keyframesCSS += `        box-shadow: ${propsNow.boxShadow};\n`;
        keyframesCSS += `        z-index: ${propsNow.zIndex};\n`;
        keyframesCSS += `      }\n`;
        
        keyframesCSS += `      ${holdEnd.toFixed(2)}% {\n`;
        keyframesCSS += `        transform: ${propsNow.transform};\n`;
        keyframesCSS += `        opacity: ${propsNow.opacity};\n`;
        keyframesCSS += `        box-shadow: ${propsNow.boxShadow};\n`;
        keyframesCSS += `        z-index: ${propsNow.zIndex};\n`;
        keyframesCSS += `      }\n`;
        
        keyframesCSS += `      ${pEnd.toFixed(2)}% {\n`;
        keyframesCSS += `        transform: ${propsNext.transform};\n`;
        keyframesCSS += `        opacity: ${propsNext.opacity};\n`;
        keyframesCSS += `        box-shadow: ${propsNext.boxShadow};\n`;
        keyframesCSS += `        z-index: ${propsNext.zIndex};\n`;
        keyframesCSS += `      }\n`;
      }
    }
    keyframesCSS += `    }\n\n`;
  }

  // Compile individual CSS declarations for cards
  let cardsCSS = '';
  for (let i = 0; i < N; i++) {
    cardsCSS += `    .card-${i} {\n`;
    cardsCSS += `      animation: card-anim-${i} ${loopDurationSec}s ${settings.timingEasing} infinite;\n`;
    cardsCSS += `    }\n`;
  }

  // Build the complete standalone SVG
  const svgMarkup = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${svgWidth} ${svgHeight}" width="100%" height="100%" style="background: transparent;">
  <foreignObject width="${svgWidth}" height="${svgHeight}">
    <div xmlns="http://www.w3.org/1999/xhtml" class="carousel-container">
      <style>
        .carousel-container {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: transparent;
          font-family: system-ui, -apple-system, sans-serif;
          margin: 0;
          padding: 0;
          perspective: 1200px;
          overflow: hidden;
        }
        
        .card-deck {
          position: absolute;
          width: ${cardWidth}px;
          height: ${cardHeight}px;
          top: ${cardY}px;
          left: ${cardX}px;
          transform-style: preserve-3d;
        }
        
        .card {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          border-radius: ${settings.borderRadius}px;
          background-color: ${settings.cardBg};
          overflow: hidden;
          will-change: transform, opacity, box-shadow;
          transform-origin: center center;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        .card-image {
          width: 100%;
          height: 100%;
          background-size: ${settings.bgFit};
          background-position: center;
          background-repeat: no-repeat;
          border-radius: inherit;
        }
        
        /* Animation keyframes assignements */
${cardsCSS}
        /* Mathematical looping keyframes */
${keyframesCSS}      </style>
      <div class="card-deck">
        ${cards.map((card, idx) => `
        <div class="card card-${idx}">
          <div class="card-image" style="background-image: url('${card.dataUrl}');"></div>
        </div>`).join('')}
      </div>
    </div>
  </foreignObject>
</svg>`;

  // Display SVG in preview stage via safe image wrapper
  const svgBlob = new Blob([svgMarkup], { type: 'image/svg+xml;charset=utf-8' });
  const blobUrl = URL.createObjectURL(svgBlob);

  previewStage.innerHTML = `<img src="${blobUrl}" class="rendered-svg-preview" alt="MotionSVG Stack Carousel Live Preview" style="width: ${svgWidth}px; max-width: 100%;" />`;
  
  // Update export badge size
  const sizeKb = (svgBlob.size / 1024).toFixed(1);
  fileSizeBadge.textContent = `Export Size: ${sizeKb} KB`;
  downloadBtn.disabled = false;

  // Populate code output tabs
  codeOutputSvg.textContent = svgMarkup;
  codeOutputHtml.textContent = `<img src="carousel.svg" alt="Animated Card Stack Carousel" width="${svgWidth}" height="${svgHeight}" />`;
  
  // Dynamic React component code
  codeOutputReact.textContent = `import React from 'react';

const SvgCarousel = () => {
  return (
    <div style={{ width: '100%', maxWidth: '${svgWidth}px', aspectRatio: '${svgWidth}/${svgHeight}' }}>
      ${svgMarkup.replace(/class=/g, 'className=').replace(/style="([^"]*)"/g, (_, styles) => {
        const reactStyles = styles.split(';').reduce((acc, pair) => {
          const [key, val] = pair.split(':');
          if (key && val) acc[key.trim().replace(/-./g, x => x[1].toUpperCase())] = val.trim();
          return acc;
        }, {});
        return `style={${JSON.stringify(reactStyles)}}`;
      })}
    </div>
  );
};

export default SvgCarousel;`;
}

// Blob SVG download
function downloadSVG() {
  if (cards.length < 2) return;
  const svgCode = codeOutputSvg.textContent;
  const blob = new Blob([svgCode], { type: 'image/svg+xml;charset=utf-8' });
  const blobUrl = URL.createObjectURL(blob);
  
  const downloadLink = document.createElement('a');
  downloadLink.href = blobUrl;
  downloadLink.download = 'motionsvg-carousel.svg';
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(blobUrl);
}

// -------------------------------------------------------------
// AUXILIARY UTILS & SAMPLE LOADER
// -------------------------------------------------------------
function formatBytes(bytes, decimals = 1) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

// Helper to pre-load beautiful template examples
function loadSampleImages() {
  const sampleColors = [
    { name: 'Dropbox Card.png', color1: '#0061FE', color2: '#002566', logo: '📦', text: 'Dropbox' },
    { name: 'Google Drive Card.png', color1: '#34A853', color2: '#0F5132', logo: '▲', text: 'Google Drive' },
    { name: 'Figma Canvas Card.png', color1: '#F24E1E', color2: '#5551FF', logo: '❖', text: 'Figma' }
  ];

  let loadCount = 0;
  sampleColors.forEach((sample, i) => {
    // Generate a beautiful, vector mockup slide in the canvas and convert to base64
    const canvas = document.createElement('canvas');
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    // Create premium gradient
    const gradient = ctx.createLinearGradient(0, 0, 400, 400);
    gradient.addColorStop(0, sample.color1);
    gradient.addColorStop(1, sample.color2);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 400, 400);

    // Draw tech highlights
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
    ctx.lineWidth = 1.5;
    for (let j = 0; j < 5; j++) {
      ctx.beginPath();
      ctx.arc(200, 200, 80 + j * 40, 0, Math.PI * 2);
      ctx.stroke();
    }

    // Draw central icon
    ctx.fillStyle = '#ffffff';
    ctx.font = '72px system-ui, -apple-system, sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(sample.logo, 200, 175);

    // Draw brand name
    ctx.font = 'bold 24px system-ui, -apple-system, sans-serif';
    ctx.fillText(sample.text, 200, 260);

    // Subtext
    ctx.fillStyle = 'rgba(255,255,255,0.7)';
    ctx.font = '500 14px system-ui, -apple-system, sans-serif';
    ctx.fillText('Cloud Storage Sync', 200, 290);

    const base64Data = canvas.toDataURL('image/png');
    cards.push({
      id: 'sample_' + i,
      name: sample.name,
      type: 'image/png',
      size: '22.4 KB',
      dataUrl: base64Data
    });
    
    loadCount++;
    if (loadCount === sampleColors.length) {
      renderCardList();
      updateCarousel();
    }
  });
}

// Run init
document.addEventListener('DOMContentLoaded', init);
if (document.readyState === 'interactive' || document.readyState === 'complete') {
  init();
}
