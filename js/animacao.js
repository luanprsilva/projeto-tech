const canvas = document.getElementById('bg-canvas');
const ctx = canvas.getContext('2d');

const TOTAL_FRAMES = 200;
const FPS = 30;
const FRAME_INTERVAL = 1000 / FPS;

const images = [];
let currentFrame = 0;
let lastTime = 0;

// Formata o número do frame para 3 dígitos: 001, 002, ..., 200
function getFrameSrc(index) {
  const paddedIndex = String(index + 1).padStart(3, '0');
  return `imagens/ezgif-frame-${paddedIndex}.jpg`;
}

// Redimensiona o canvas respeitando o tamanho da janela
function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  drawFrame(currentFrame);
}

// Desenha a imagem centralizada no estilo "object-fit: cover"
function drawFrame(index) {
  const img = images[index];
  if (!img || !img.complete || img.naturalWidth === 0) return;

  const cWidth = canvas.width;
  const cHeight = canvas.height;
  const iWidth = img.naturalWidth;
  const iHeight = img.naturalHeight;

  const cRatio = cWidth / cHeight;
  const iRatio = iWidth / iHeight;

  let renderWidth, renderHeight, offsetX, offsetY;

  if (cRatio > iRatio) {
    renderWidth = cWidth;
    renderHeight = cWidth / iRatio;
    offsetX = 0;
    offsetY = (cHeight - renderHeight) / 2;
  } else {
    renderWidth = cHeight * iRatio;
    renderHeight = cHeight;
    offsetX = (cWidth - renderWidth) / 2;
    offsetY = 0;
  }

  ctx.clearRect(0, 0, cWidth, cHeight);
  ctx.drawImage(img, offsetX, offsetY, renderWidth, renderHeight);
}

// Pré-carrega todos os frames para garantir transição suave
function preloadImages() {
  for (let i = 0; i < TOTAL_FRAMES; i++) {
    const img = new Image();
    img.src = getFrameSrc(i);

    // Se for o primeiro frame, renderiza assim que estiver pronto
    if (i === 0) {
      img.onload = () => {
        resizeCanvas();
        drawFrame(0);
      };
    }
    images.push(img);
  }
}

// Loop de animação controlado por tempo (FPS estável)
function animate(timestamp) {
  if (!lastTime) lastTime = timestamp;
  const delta = timestamp - lastTime;

  if (delta >= FRAME_INTERVAL) {
    lastTime = timestamp - (delta % FRAME_INTERVAL);
    currentFrame = (currentFrame + 1) % TOTAL_FRAMES;
    drawFrame(currentFrame);
  }

  requestAnimationFrame(animate);
}

// Inicialização e ouvintes de eventos
window.addEventListener('resize', resizeCanvas);

preloadImages();
resizeCanvas();
requestAnimationFrame(animate);
