document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

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
  }

  function nextSlide() {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  }

  function prevSlide() {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  }

  showSlide(currentSlide);

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
        labels: ['1st Place', '2nd Place', '3rd Place', '4th Place', '5th-8th Place (total)'],
        datasets: [{
          label: 'Prize Pool',
          data: [4000, 2000, 1000, 500, 2500],
          backgroundColor: [
            '#ffd700',
            '#c0c0c0',
            '#cd7f32',
            '#a9a9a9',
            '#8b4513'
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

  slides.forEach((slide, index) => {
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
});
