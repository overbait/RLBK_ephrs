document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let currentSlide = 0;

  function showSlide(n) {
    slides.forEach(slide => (slide.style.display = "none"));
    slides[n].style.display = "block";
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
      type: 'pie',
      data: {
        labels: ['1st', '2nd', '3rd', '4th', '5th-8th'],
        datasets: [{
          label: 'Prize Pool',
          data: [4000, 2000, 1000, 500, 625],
          backgroundColor: [
            '#ffd27d',
            '#e06636',
            '#c8a2c8',
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
          },
          title: {
            display: true,
            text: 'Prize Pool Distribution'
          }
        }
      }
    });
  }

  slides.forEach((slide, index) => {
    for (let i = 0; i < 5; i++) {
      const leaf = document.createElement('div');
      leaf.classList.add('leaf-decoration');
      const leafNum = Math.floor(Math.random() * 4) + 1;
      leaf.style.backgroundImage = `url('assets/leaves_${leafNum}.png')`;
      leaf.style.top = `${Math.random() * 100}%`;
      leaf.style.left = `${Math.random() * 100}%`;
      leaf.style.transform = `rotate(${Math.random() * 360}deg) scale(${Math.random() * 0.5 + 0.5})`;
      leaf.style.width = `${Math.random() * 50 + 50}px`;
      leaf.style.height = `${Math.random() * 50 + 50}px`;
      slide.appendChild(leaf);
    }
  });
});
