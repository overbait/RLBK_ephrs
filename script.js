document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

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

  const prizeChart = document.getElementById('prizeChart');
  if (prizeChart) {
    new Chart(prizeChart, {
      type: 'doughnut',
      data: {
        labels: ['5th-8th Place (total)', '4th Place', '3rd Place', '2nd Place', '1st Place'],
        datasets: [{
          label: 'Prize Pool',
          data: [2500, 500, 1000, 2000, 4000],
          backgroundColor: [
            '#8b4513',
            '#a9a9a9',
            '#cd7f32',
            '#c0c0c0',
            '#ffd700'
          ],
          borderColor: '#0d0d0d',
          borderWidth: 2
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            reverse: true,
            labels: {
              color: '#f5f0e6',
              font: {
                size: 14
              }
            }
          },
          title: {
            display: true,
            text: 'Prize Pool Distribution',
            color: '#f5f0e6',
            font: {
              size: 18
            }
          }
        }
      }
    });
  }

  const colors = [
    ['#C9CBA3', '#FFE1A8'],
    ['#E26D5C', '#723D46'],
    ['#472D30', '#E26D5C'],
    ['#FFE1A8', '#E26D5C']
  ];

  document.querySelectorAll('.content-box').forEach(card => {
    const bg = document.createElement('div');
    bg.classList.add('card-bg');
    for (let i = 0; i < 3; i++) {
      const gradientShape = document.createElement('div');
      const size = Math.random() * 500 + 300;
      const colorPair = colors[Math.floor(Math.random() * colors.length)];
      gradientShape.style.width = `${size}px`;
      gradientShape.style.height = `${size}px`;
      gradientShape.style.position = 'absolute';
      gradientShape.style.borderRadius = `${Math.random() * 100}% ${Math.random() * 100}%`;
      gradientShape.style.background = `radial-gradient(ellipse at center, ${colorPair[0]} 0%, ${colorPair[1]} 100%)`;
      gradientShape.style.top = `${Math.random() * 100}%`;
      gradientShape.style.left = `${Math.random() * 100}%`;
      gradientShape.style.transform = 'translate(-50%, -50%)';
      gradientShape.style.filter = 'blur(60px)';
      gradientShape.style.opacity = '1';
      bg.appendChild(gradientShape);
    }
    card.prepend(bg);
  });

  const sticks = ['upscaled_stick1.png', 'upscaled_stick2.png', 'upscaled_stick3.png'];
  document.querySelectorAll('.content-box').forEach(card => {
    const stick = document.createElement('div');
    stick.classList.add('stick-decoration');
    const randomStick = sticks[Math.floor(Math.random() * sticks.length)];
    stick.style.backgroundImage = `url('assets/${randomStick}')`;
    card.appendChild(stick);
  });

  const backgrounds = ['background1.png', 'background2.png', 'background3.png'];

  function updatePagination() {
    const paginationContainer = document.querySelector('.pagination');
    if (!paginationContainer) return;
    paginationContainer.innerHTML = '';
    slides.forEach((_, index) => {
      const pageIndicator = document.createElement('span');
      pageIndicator.classList.add('page-indicator');
      pageIndicator.textContent = index + 1;
      if (index === currentSlide) {
        pageIndicator.classList.add('active');
      }
      pageIndicator.addEventListener('click', () => showSlide(index));
      paginationContainer.appendChild(pageIndicator);
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
      leaf.style.backgroundImage = `url('assets/leves_${leafNum}.png')`;
      leaf.style.top = `${Math.random() * 80 + 10}%`;
      leaf.style.left = `${Math.random() * 80 + 10}%`;
      leaf.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.8})`;
      leaf.style.width = `${Math.random() * 80 + 80}px`;
      leaf.style.height = `${Math.random() * 80 + 80}px`;
      slide.appendChild(leaf);
    }

    const pageNumber = document.createElement('div');
    pageNumber.classList.add('page-number');
    pageNumber.textContent = index + 1;
    slide.appendChild(pageNumber);
  });

  showSlide(currentSlide);
});
