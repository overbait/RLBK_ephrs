document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  window.showSlide = function(n) {
    slides.forEach(slide => {
      slide.classList.remove('active');
      slide.style.display = 'none';
    });
    slides[n].style.display = "block";
    // A small delay to allow the display property to be set before adding the active class for the transition
    setTimeout(() => {
      slides[n].classList.add('active');
    }, 20);
    currentSlide = n;
    updatePagination();
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  // Add event listeners for next and previous buttons if they exist
  const nextButton = document.querySelector(".next");
  const prevButton = document.querySelector(".prev");

  if (nextButton) {
    nextButton.addEventListener("click", nextSlide);
  }

  if (prevButton) {
    prevButton.addEventListener("click", prevSlide);
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  });

  document.querySelectorAll('.toc-list-item').forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      // Find the closest parent with the data-slide-to attribute
      let target = e.target;
      while (target && !target.hasAttribute('data-slide-to')) {
        target = target.parentElement;
      }
      if (target) {
        const slideIndex = parseInt(target.getAttribute('data-slide-to'));
        if (!isNaN(slideIndex)) {
            showSlide(slideIndex);
        }
      }
    });
  });

  document.addEventListener('click', function(e) {
    let target = e.target;
    while (target && !target.hasAttribute('data-slide-to')) {
        target = target.parentElement;
    }

    if (target) {
        e.preventDefault();
        const slideIndex = parseInt(target.getAttribute('data-slide-to'));
        if (!isNaN(slideIndex)) {
            showSlide(slideIndex);
        }
    }
  });

  function attachImageToCard(cardSelector, hookNumber, imageUrl, rotation = 0, scale = 1) {
    const card = document.querySelector(cardSelector);
    if (!card) return;

    let hook = card.querySelector(`.image-hook-${hookNumber}`);
    if (!hook) {
      for (let i = 1; i <= 4; i++) {
        const newHook = document.createElement('div');
        newHook.classList.add('image-hook', `image-hook-${i}`);
        card.appendChild(newHook);
      }
      hook = card.querySelector(`.image-hook-${hookNumber}`);
    }

    const img = document.createElement('img');
    img.src = `assets/${imageUrl}`;
    img.classList.add('attached-image');
    img.style.transform = `rotate(${rotation}deg) scale(${scale})`;
    img.style.transformOrigin = 'center center';

    hook.appendChild(img);
  }

  const colors = [
    ['#4fd3ff', '#0b1f3f'],
    ['#5fd1ff', '#0a2238'],
    ['#6a93ff', '#0d1a3d'],
    ['#8e7dff', '#130f30'],
    ['#b57bff', '#1b0f2c'],
    ['#ff7fd1', '#2a0f24'],
    ['#ff9bb4', '#2a1218'],
    ['#ffb57a', '#2a1a10'],
    ['#ffd45f', '#2a220e'],
    ['#b6f768', '#1a2a12'],
    ['#7fea7f', '#102a18'],
    ['#62e3b0', '#0a2a24'],
    ['#5fd6ff', '#0a2636'],
    ['#7ad8c8', '#0a2831']
  ];

  document.querySelectorAll('.content-box').forEach(card => {
    let bgContainer = card.querySelector('.card-bg-container');
    if (!bgContainer) {
        bgContainer = document.createElement('div');
        bgContainer.classList.add('card-bg-container');
        card.prepend(bgContainer);
    }
    const bg = document.createElement('div');
    bg.classList.add('card-bg');
    for (let i = 0; i < 3; i++) {
      const gradientShape = document.createElement('div');
      const size = Math.random() * 600 + 400;
      const colorPair = colors[Math.floor(Math.random() * colors.length)];
      gradientShape.style.width = `${size}px`;
      gradientShape.style.height = `${size}px`;
      gradientShape.style.position = 'absolute';
      gradientShape.style.borderRadius = `${Math.random() * 100}% ${Math.random() * 100}%`;
      gradientShape.style.background = `radial-gradient(ellipse at center, ${colorPair[0]} 0%, ${colorPair[1]} 100%)`;
      gradientShape.style.top = `${Math.random() * 100}%`;
      gradientShape.style.left = `${Math.random() * 100}%`;
      gradientShape.style.transform = 'translate(-50%, -50%)';
      gradientShape.style.filter = 'blur(80px)';
      gradientShape.style.opacity = '0.1';
      bg.appendChild(gradientShape);
    }
    bgContainer.appendChild(bg);
  });


  const backgroundsBySlide = [
    { image: 'spring_assets/bgs/bg_01.png', position: 'left top' },
    { image: 'spring_assets/bgs/bg_02.png', position: 'center top' },
    { image: 'spring_assets/bgs/bg_03.png', position: 'right top' },
    { image: 'spring_assets/bgs/bg_04.png', position: 'left top' },
    { image: 'spring_assets/bgs/bg_05.png', position: 'center top' },
    { image: 'spring_assets/bgs/bg_06.png', position: 'right top' },
    { image: 'spring_assets/bgs/bg_01.png', position: 'center top' },
    { image: 'spring_assets/bgs/bg_02.png', position: 'right top' },
    { image: 'spring_assets/bgs/bg_03.png', position: 'left top' },
    { image: 'spring_assets/bgs/bg_04.png', position: 'center top' },
    { image: 'spring_assets/bgs/bg_05.png', position: 'right top' },
    { image: 'spring_assets/bgs/bg_06.png', position: 'left top' },
    { image: 'spring_assets/bgs/bg_01.png', position: 'right top' },
    { image: 'spring_assets/bgs/bg_02.png', position: 'left top' }
  ];

  const leafLayoutsBySlide = [
    [
      { src: 'spring_assets/leaves/leaves_green_mid7.png', top: '6%', left: '8%', rotate: -35, scale: 1.15, width: 180, height: 180 },
      { src: 'spring_assets/leaves/leaves_pink_mid9.png', top: '10%', left: '22%', rotate: -18, scale: 1.1, width: 170, height: 170 },
      { src: 'spring_assets/leaves/leaves_green_small4.png', top: '14%', left: '36%', rotate: -6, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_green_mid2.png', top: '18%', left: '52%', rotate: 8, scale: 1.1, width: 165, height: 165 },
      { src: 'spring_assets/leaves/leaves_pink_mid4.png', top: '12%', left: '70%', rotate: 14, scale: 1.05, width: 160, height: 160 },
      { src: 'spring_assets/leaves/leaves_green_small1.png', top: '10%', left: '84%', rotate: -8, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid6.png', top: '28%', left: '10%', rotate: 26, scale: 1.1, width: 165, height: 165 },
      { src: 'spring_assets/leaves/leaves_green_mid5.png', top: '32%', left: '26%', rotate: 18, scale: 1.05, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small6.png', top: '38%', left: '42%', rotate: 30, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid2.png', top: '44%', left: '58%', rotate: 22, scale: 1.1, width: 165, height: 165 },
      { src: 'spring_assets/leaves/leaves_green_mid8.png', top: '36%', left: '74%', rotate: 10, scale: 1.05, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small2.png', top: '30%', left: '88%', rotate: -2, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid5.png', top: '70%', left: '6%', rotate: 38, scale: 1.1, width: 170, height: 170 },
      { src: 'spring_assets/leaves/leaves_green_mid1.png', top: '74%', left: '22%', rotate: 30, scale: 1.05, width: 160, height: 160 },
      { src: 'spring_assets/leaves/leaves_green_small3.png', top: '66%', left: '38%', rotate: 40, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid7.png', top: '78%', left: '54%', rotate: 46, scale: 1.1, width: 170, height: 170 },
      { src: 'spring_assets/leaves/leaves_green_mid3.png', top: '82%', left: '70%', rotate: 34, scale: 1.05, width: 160, height: 160 },
      { src: 'spring_assets/leaves/leaves_green_small5.png', top: '72%', left: '86%', rotate: 24, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_green_mid1.png', top: '10%', left: '62%', rotate: -18, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_pink_mid6.png', top: '16%', left: '74%', rotate: -5, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small1.png', top: '22%', left: '86%', rotate: 12, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_green_mid7.png', top: '68%', left: '58%', rotate: 22, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_pink_mid1.png', top: '74%', left: '72%', rotate: 35, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small3.png', top: '62%', left: '84%', rotate: 48, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid3.png', top: '30%', left: '40%', rotate: 10, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid4.png', top: '22%', left: '52%', rotate: -2, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small5.png', top: '16%', left: '64%', rotate: -12, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid8.png', top: '76%', left: '40%', rotate: 48, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid2.png', top: '84%', left: '54%', rotate: 34, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small4.png', top: '68%', left: '66%', rotate: 24, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_pink_mid7.png', top: '8%', left: '14%', rotate: -30, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid2.png', top: '14%', left: '28%', rotate: -16, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small5.png', top: '20%', left: '42%', rotate: -4, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid3.png', top: '68%', left: '10%', rotate: 24, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid6.png', top: '74%', left: '24%', rotate: 36, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small6.png', top: '60%', left: '38%', rotate: 48, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid1.png', top: '28%', left: '54%', rotate: 8, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid9.png', top: '20%', left: '66%', rotate: -6, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small2.png', top: '14%', left: '78%', rotate: -18, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid10.png', top: '76%', left: '50%', rotate: 46, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid3.png', top: '84%', left: '64%', rotate: 32, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small5.png', top: '68%', left: '76%', rotate: 22, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_green_mid8.png', top: '12%', left: '70%', rotate: -20, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_pink_mid5.png', top: '18%', left: '82%', rotate: -6, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small2.png', top: '24%', left: '90%', rotate: 10, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid8.png', top: '64%', left: '62%', rotate: 26, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid4.png', top: '70%', left: '76%', rotate: 38, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small1.png', top: '58%', left: '88%', rotate: 50, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid2.png', top: '30%', left: '46%', rotate: 8, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid6.png', top: '22%', left: '58%', rotate: -4, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small3.png', top: '16%', left: '70%', rotate: -14, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid7.png', top: '76%', left: '46%', rotate: 46, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid9.png', top: '84%', left: '60%', rotate: 32, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small5.png', top: '68%', left: '72%', rotate: 22, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_green_mid3.png', top: '14%', left: '8%', rotate: -22, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_pink_mid9.png', top: '20%', left: '20%', rotate: -8, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small4.png', top: '26%', left: '34%', rotate: 6, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid10.png', top: '66%', left: '6%', rotate: 28, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid5.png', top: '72%', left: '20%', rotate: 40, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small3.png', top: '60%', left: '34%', rotate: 52, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid4.png', top: '30%', left: '48%', rotate: 8, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid7.png', top: '22%', left: '60%', rotate: -4, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small1.png', top: '16%', left: '72%', rotate: -14, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid6.png', top: '76%', left: '44%', rotate: 46, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid2.png', top: '84%', left: '58%', rotate: 32, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small6.png', top: '68%', left: '70%', rotate: 22, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_green_mid9.png', top: '10%', left: '58%', rotate: -24, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_pink_mid2.png', top: '16%', left: '70%', rotate: -10, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small5.png', top: '22%', left: '84%', rotate: 4, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid6.png', top: '66%', left: '56%', rotate: 26, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid1.png', top: '72%', left: '70%', rotate: 38, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small2.png', top: '60%', left: '84%', rotate: 50, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid8.png', top: '30%', left: '40%', rotate: 10, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid4.png', top: '22%', left: '52%', rotate: -2, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small1.png', top: '16%', left: '64%', rotate: -12, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid9.png', top: '76%', left: '38%', rotate: 48, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid7.png', top: '84%', left: '52%', rotate: 34, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small3.png', top: '68%', left: '64%', rotate: 24, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_pink_mid4.png', top: '14%', left: '12%', rotate: -28, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid6.png', top: '20%', left: '26%', rotate: -14, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small1.png', top: '26%', left: '40%', rotate: 0, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid8.png', top: '68%', left: '12%', rotate: 22, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid7.png', top: '74%', left: '26%', rotate: 34, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small4.png', top: '62%', left: '40%', rotate: 46, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid5.png', top: '30%', left: '52%', rotate: 10, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid1.png', top: '22%', left: '64%', rotate: -2, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small6.png', top: '16%', left: '76%', rotate: -12, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid2.png', top: '76%', left: '50%', rotate: 48, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid8.png', top: '84%', left: '64%', rotate: 34, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small2.png', top: '68%', left: '76%', rotate: 24, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_green_mid2.png', top: '12%', left: '64%', rotate: -20, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_pink_mid1.png', top: '18%', left: '76%', rotate: -6, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small6.png', top: '24%', left: '88%', rotate: 10, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid5.png', top: '64%', left: '62%', rotate: 24, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid8.png', top: '70%', left: '76%', rotate: 36, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small2.png', top: '58%', left: '88%', rotate: 48, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid6.png', top: '30%', left: '46%', rotate: 8, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid5.png', top: '22%', left: '58%', rotate: -4, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small4.png', top: '16%', left: '70%', rotate: -14, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid3.png', top: '76%', left: '44%', rotate: 46, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid1.png', top: '84%', left: '58%', rotate: 32, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small5.png', top: '68%', left: '70%', rotate: 22, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_green_mid4.png', top: '10%', left: '10%', rotate: -26, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_pink_mid7.png', top: '16%', left: '24%', rotate: -12, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small3.png', top: '22%', left: '38%', rotate: 2, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid9.png', top: '66%', left: '8%', rotate: 24, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid9.png', top: '72%', left: '22%', rotate: 36, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small5.png', top: '60%', left: '36%', rotate: 48, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid1.png', top: '30%', left: '52%', rotate: 8, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid6.png', top: '22%', left: '64%', rotate: -4, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small2.png', top: '16%', left: '76%', rotate: -14, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid4.png', top: '76%', left: '50%', rotate: 46, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid3.png', top: '84%', left: '64%', rotate: 32, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small1.png', top: '68%', left: '76%', rotate: 22, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_green_mid5.png', top: '14%', left: '66%', rotate: -22, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_pink_mid3.png', top: '20%', left: '78%', rotate: -8, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small1.png', top: '26%', left: '90%', rotate: 6, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid4.png', top: '62%', left: '64%', rotate: 22, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid2.png', top: '68%', left: '78%', rotate: 34, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small6.png', top: '56%', left: '90%', rotate: 46, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid7.png', top: '30%', left: '44%', rotate: 8, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid9.png', top: '22%', left: '56%', rotate: -4, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small3.png', top: '16%', left: '68%', rotate: -14, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid8.png', top: '76%', left: '42%', rotate: 46, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid4.png', top: '84%', left: '56%', rotate: 32, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small2.png', top: '68%', left: '68%', rotate: 22, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_pink_mid10.png', top: '12%', left: '12%', rotate: -26, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid7.png', top: '18%', left: '26%', rotate: -12, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small2.png', top: '24%', left: '40%', rotate: 2, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid6.png', top: '64%', left: '10%', rotate: 24, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid4.png', top: '70%', left: '24%', rotate: 36, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small4.png', top: '58%', left: '38%', rotate: 48, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid3.png', top: '30%', left: '52%', rotate: 8, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid1.png', top: '22%', left: '64%', rotate: -4, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small6.png', top: '16%', left: '76%', rotate: -14, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid5.png', top: '76%', left: '50%', rotate: 46, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid7.png', top: '84%', left: '64%', rotate: 32, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small4.png', top: '68%', left: '76%', rotate: 22, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_green_mid1.png', top: '10%', left: '60%', rotate: -20, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_pink_mid2.png', top: '16%', left: '74%', rotate: -6, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small5.png', top: '22%', left: '88%', rotate: 10, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid8.png', top: '66%', left: '58%', rotate: 24, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid6.png', top: '72%', left: '72%', rotate: 36, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small1.png', top: '60%', left: '86%', rotate: 48, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid9.png', top: '30%', left: '48%', rotate: 8, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid8.png', top: '22%', left: '60%', rotate: -4, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small1.png', top: '16%', left: '72%', rotate: -14, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid2.png', top: '76%', left: '46%', rotate: 46, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid5.png', top: '84%', left: '60%', rotate: 32, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small6.png', top: '68%', left: '72%', rotate: 22, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_green_mid3.png', top: '12%', left: '14%', rotate: -24, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_pink_mid5.png', top: '18%', left: '28%', rotate: -10, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small6.png', top: '24%', left: '42%', rotate: 4, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid7.png', top: '66%', left: '12%', rotate: 26, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid9.png', top: '72%', left: '26%', rotate: 38, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small3.png', top: '60%', left: '40%', rotate: 50, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid4.png', top: '30%', left: '50%', rotate: 8, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid2.png', top: '22%', left: '62%', rotate: -4, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small3.png', top: '16%', left: '74%', rotate: -14, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid6.png', top: '76%', left: '48%', rotate: 46, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid8.png', top: '84%', left: '62%', rotate: 32, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small2.png', top: '68%', left: '74%', rotate: 22, scale: 0.85, width: 95, height: 95 }
    ],
    [
      { src: 'spring_assets/leaves/leaves_green_mid8.png', top: '10%', left: '62%', rotate: -18, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_pink_mid9.png', top: '16%', left: '76%', rotate: -4, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_small2.png', top: '22%', left: '90%', rotate: 10, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid1.png', top: '64%', left: '60%', rotate: 24, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid5.png', top: '70%', left: '74%', rotate: 36, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small4.png', top: '58%', left: '88%', rotate: 48, scale: 0.85, width: 95, height: 95 },
      { src: 'spring_assets/leaves/leaves_pink_mid8.png', top: '30%', left: '48%', rotate: 8, scale: 1.05, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_mid6.png', top: '22%', left: '60%', rotate: -4, scale: 1, width: 145, height: 145 },
      { src: 'spring_assets/leaves/leaves_green_small5.png', top: '16%', left: '72%', rotate: -14, scale: 0.8, width: 90, height: 90 },
      { src: 'spring_assets/leaves/leaves_pink_mid3.png', top: '76%', left: '46%', rotate: 46, scale: 1.1, width: 155, height: 155 },
      { src: 'spring_assets/leaves/leaves_green_mid2.png', top: '84%', left: '60%', rotate: 32, scale: 1.05, width: 150, height: 150 },
      { src: 'spring_assets/leaves/leaves_green_small1.png', top: '68%', left: '72%', rotate: 22, scale: 0.85, width: 95, height: 95 }
    ]
  ];

  function updatePagination() {
    slides.forEach((slide, slideIndex) => {
      let paginationContainer = slide.querySelector('.pagination');
      if (!paginationContainer) {
        paginationContainer = document.createElement('div');
        paginationContainer.classList.add('pagination');
        slide.appendChild(paginationContainer);
      }

      if (!paginationContainer.querySelector('.prev')) {
        const prevButton = document.createElement('button');
        prevButton.classList.add('prev');
        prevButton.innerHTML = `<img src="assets/icon_arrow_red-min.png" alt="Previous">`;
        prevButton.addEventListener('click', prevSlide);
        paginationContainer.appendChild(prevButton);
      }

      let pageIndicatorContainer = paginationContainer.querySelector('.page-indicator-container');
      if (!pageIndicatorContainer) {
        pageIndicatorContainer = document.createElement('div');
        pageIndicatorContainer.classList.add('page-indicator-container');
        paginationContainer.appendChild(pageIndicatorContainer);
      }

      pageIndicatorContainer.innerHTML = '';
      slides.forEach((_, pageIndex) => {
        const pageIndicator = document.createElement('span');
        pageIndicator.classList.add('page-indicator');
        pageIndicator.textContent = pageIndex + 1;
        if (pageIndex === currentSlide) {
          pageIndicator.classList.add('active');
        }
        pageIndicator.addEventListener('click', () => showSlide(pageIndex));
        pageIndicatorContainer.appendChild(pageIndicator);
      });

      if (!paginationContainer.querySelector('.next')) {
        const nextButton = document.createElement('button');
        nextButton.classList.add('next');
        nextButton.innerHTML = `<img src="assets/icon_arrow_green-min.png" alt="Next">`;
        nextButton.addEventListener('click', nextSlide);
        paginationContainer.appendChild(nextButton);
      }

      // Reorder elements to ensure correct layout
      const prevButton = paginationContainer.querySelector('.prev');
      const nextButton = paginationContainer.querySelector('.next');
      paginationContainer.insertBefore(pageIndicatorContainer, nextButton);
      paginationContainer.insertBefore(prevButton, pageIndicatorContainer);

    });
  }

  slides.forEach((slide, index) => {
    const backgroundConfig = backgroundsBySlide[index];
    const bgElement = slide.querySelector('.background');
    if (bgElement && backgroundConfig) {
      bgElement.style.backgroundImage = `url('${backgroundConfig.image}')`;
      bgElement.style.backgroundPosition = index === 0 ? 'center center' : backgroundConfig.position;
    }

    const leafLayout = leafLayoutsBySlide[index] || [];
    leafLayout.forEach(leafConfig => {
      const leaf = document.createElement('div');
      leaf.classList.add('leaves-decoration');
      leaf.style.backgroundImage = `url('${leafConfig.src}')`;
      leaf.style.top = leafConfig.top;
      leaf.style.left = leafConfig.left;
      leaf.style.transform = `rotate(${leafConfig.rotate}deg) scale(${leafConfig.scale})`;
      leaf.style.width = `${leafConfig.width}px`;
      leaf.style.height = `${leafConfig.height}px`;
      slide.appendChild(leaf);
    });

  });

  showSlide(currentSlide);

  attachImageToCard('#qualifiers-card', 2, 'icon_swords-min.png', -30, 10);
  attachImageToCard('#group-stage-card', 4, 'icon_shield-min.png', 30, 10);
  attachImageToCard('#playoffs-card', 2, 'icon_troph-min.png', 0, 10);

  const getRandomRotation = () => Math.random() * 30 - 15;

  // FAIR PLAY & MISCONDUCT
  attachImageToCard('.slide:nth-child(11) .content-box:nth-child(1)', 2, 'icon_sword2-min.png', getRandomRotation(), 13);
  attachImageToCard('.slide:nth-child(11) .content-box:nth-child(2)', 2, 'icon_plus-min.png', getRandomRotation(), 13);

  // NEW IMAGES
  attachImageToCard('.slide:nth-child(3) .content-box:nth-child(4)', 2, 'icon_megaphone-min.png', getRandomRotation(), 13);
  attachImageToCard('#game-restarts-card', 2, 'icon_plus2-min.png', getRandomRotation(), 13);

  // CONTENT CREATING
  attachImageToCard('#content-creating-slide .content-box', 2, 'icon_camera.png', getRandomRotation(), 13);

  // COMMUNICATION
  attachImageToCard('.slide:nth-child(12) .content-box:nth-child(1)', 2, 'icon_clock-min.png', getRandomRotation(), 13);

  // CONTACTS & RESOURCES
  // attachImageToCard('.slide:nth-child(13) .content-box:nth-child(1)', 2, 'icon_dude-min.png', getRandomRotation(), 13);
  attachImageToCard('#lobby-settings-card', 2, 'icon_calendar2-min.png', getRandomRotation(), 13);
});
