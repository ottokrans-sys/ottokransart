const lightbox = document.getElementById('lightbox');
const lightboxImg = document.getElementById('lightbox-img');
const closeBtn = document.querySelector('.close');
const leftArrow = document.querySelector('.arrow.left');
const rightArrow = document.querySelector('.arrow.right');

const galleryImages = Array.from(document.querySelectorAll('.gallery-item img'));
let currentIndex = 0;

function showImage(index) {
  const img = galleryImages[index];
  const wrapper = img.closest('.image-wrapper');
  const title = wrapper.querySelector('h4').textContent;
  const details = wrapper.querySelector('.caption-details').textContent;

  lightboxImg.src = img.src;
  document.getElementById('lightbox-title').textContent = title;
  document.getElementById('lightbox-details').textContent = details; 
  currentIndex = index;
  lightbox.style.display = 'flex';
}

galleryImages.forEach((img, index) => {
  img.addEventListener('click', () => showImage(index));
});

closeBtn.addEventListener('click', () => {
  lightbox.style.display = 'none';
});

lightbox.addEventListener('click', (e) => {
  if (e.target === lightbox) {
    lightbox.style.display = 'none';
  }
});

leftArrow.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex - 1 + galleryImages.length) % galleryImages.length;
  showImage(currentIndex);
});

rightArrow.addEventListener('click', (e) => {
  e.stopPropagation();
  currentIndex = (currentIndex + 1) % galleryImages.length;
  showImage(currentIndex);
});

document.addEventListener('keydown', (e) => {
  if (lightbox.style.display === 'flex') {
    if (e.key === 'ArrowLeft') {
      leftArrow.click();
    } else if (e.key === 'ArrowRight') {
      rightArrow.click();
    } else if (e.key === 'Escape') {
      closeBtn.click();
    }
  }
});

window.addEventListener('DOMContentLoaded', () => {
  const grid = document.querySelector('.gallery-grid');
  if (!grid) return;

  const items = Array.from(grid.children);
  const columns = 3; // Adjust if your grid changes
  const totalRows = Math.ceil(items.length / columns);

  items.forEach((item, index) => {
    const row = Math.floor(index / columns) + 1;

    // Reset alignment first
    item.style.justifyContent = 'center';

    if (row === 1) {
      // Top row: align to bottom
      item.style.justifyContent = 'flex-end';
    } else if (row === totalRows) {
      // Bottom row: align to top
      item.style.justifyContent = 'flex-start';
    }
  });
});

function matchRowHeights() {
  const centeredRow = document.querySelector('.row-centered');
  if (!centeredRow) return;

  // Get the actual rendered width of the full gallery
  const galleryWidth = document.querySelector('.gallery').offsetWidth;
  const gap = 32; // 2rem gap, matches your CSS

  // Row 1: work 1 (20/17) + work 2 (13/16)
  // Total flex = aspect1 + aspect2, each item width = galleryWidth * aspect / totalFlex
  const row1aspect1 = 20/17;
  const row1aspect2 = 13/16;
  const row1totalFlex = row1aspect1 + row1aspect2;
  const row1item1Width = (galleryWidth - gap) * row1aspect1 / row1totalFlex;
  const row1Height = row1item1Width / row1aspect1;

  // Apply calculated height to row 3
  centeredRow.style.height = row1Height + 'px';
}

window.addEventListener('load', matchRowHeights);
window.addEventListener('resize', matchRowHeights);

// Touch swipe support for mobile lightbox
let touchStartX = 0;
let touchEndX = 0;

lightbox.addEventListener('touchstart', (e) => {
  touchStartX = e.changedTouches[0].screenX;
}, false);

lightbox.addEventListener('touchend', (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
}, false);

function handleSwipe() {
  const swipeThreshold = 50; // Minimum distance for a swipe
  
  if (touchEndX < touchStartX - swipeThreshold) {
    // Swipe left - next image
    rightArrow.click();
  }
  
  if (touchEndX > touchStartX + swipeThreshold) {
    // Swipe right - previous image
    leftArrow.click();
  }
}