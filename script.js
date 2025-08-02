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
    ['#C9CBA3', '#FFE1A8'],
    ['#E26D5C', '#723D46'],
    ['#472D30', '#E26D5C'],
    ['#FFE1A8', '#E26D5C']
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


  const backgrounds = ['background1-min.png', 'background2-min.png', 'background3-min.png'];

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

  function showSlide(n) {
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

  slides.forEach((slide, index) => {
    const randomBg = backgrounds[Math.floor(Math.random() * backgrounds.length)];
    const bgElement = slide.querySelector('.background');
    if (bgElement) {
      bgElement.style.backgroundImage = `url('assets/${randomBg}')`;
    }

    for (let i = 0; i < 8; i++) {
      const leaf = document.createElement('div');
      leaf.classList.add('leaves-decoration');
      const leafNum = Math.floor(Math.random() * 8) + 1;
      leaf.style.backgroundImage = `url('assets/leves_${leafNum}-min.png')`;
      leaf.style.top = `${Math.random() * 80 + 10}%`;
      leaf.style.left = `${Math.random() * 80 + 10}%`;
      leaf.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.8})`;
      leaf.style.width = `${Math.random() * 80 + 80}px`;
      leaf.style.height = `${Math.random() * 80 + 80}px`;
      slide.appendChild(leaf);
    }

  });

  showSlide(currentSlide);

  attachImageToCard('#qualifiers-card', 2, 'icon_swords-min.png', -30, 10);
  attachImageToCard('#group-stage-card', 4, 'icon_shield-min.png', 30, 10);
  attachImageToCard('#playoffs-card', 2, 'icon_troph-min.png', 0, 10);

  const getRandomRotation = () => Math.random() * 30 - 15;

  // FAIR PLAY & MISCONDUCT
  attachImageToCard('.slide:nth-child(10) .content-box:nth-child(1)', 2, 'icon_sword2-min.png', getRandomRotation(), 13);
  attachImageToCard('.slide:nth-child(10) .content-box:nth-child(2)', 3, 'icon_plus-min.png', getRandomRotation(), 13);

  // NEW IMAGES
  attachImageToCard('.slide:nth-child(3) .content-box:nth-child(4)', 2, 'icon_megaphone-min.png', getRandomRotation(), 13);
  attachImageToCard('#game-restarts-card', 2, 'icon_plus2-min.png', getRandomRotation(), 13);

  // COMMUNICATION
  attachImageToCard('.slide:nth-child(11) .content-box:nth-child(1)', 2, 'icon_clock-min.png', getRandomRotation(), 13);
  attachImageToCard('.slide:nth-child(11) .content-box:nth-child(2)', 3, 'icon_calendar-min.png', getRandomRotation(), 13);

  // CONTACTS & RESOURCES
  // attachImageToCard('.slide:nth-child(13) .content-box:nth-child(1)', 2, 'icon_dude-min.png', getRandomRotation(), 13);
  attachImageToCard('#lobby-settings-card', 2, 'icon_calendar2-min.png', getRandomRotation(), 13);
});
