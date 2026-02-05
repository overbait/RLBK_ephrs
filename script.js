document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");

  const setActiveSlide = (targetId) => {
    slides.forEach((slide) => {
      slide.classList.toggle("active", slide.id === targetId);
    });
  };

  const syncActiveSlide = () => {
    const hash = window.location.hash;
    const target = hash ? document.querySelector(hash) : null;
    if (target && target.classList.contains("slide")) {
      setActiveSlide(target.id);
    } else if (slides.length) {
      setActiveSlide(slides[0].id);
    }
  };

  syncActiveSlide();
  window.addEventListener("hashchange", syncActiveSlide);

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
    img.src = `https://raw.githubusercontent.com/overbait/RLBK_ephrs/feature/redesign-slides/assets/${imageUrl}`;
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

  document.querySelectorAll('.content-box').forEach((card, cardIndex) => {
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
      const size = 400 + (cardIndex * 100 % 200);
      const colorPair = colors[cardIndex % colors.length];
      gradientShape.style.width = `${size}px`;
      gradientShape.style.height = `${size}px`;
      gradientShape.style.position = 'absolute';
      gradientShape.style.borderRadius = `${(cardIndex * 10) % 100}% ${(cardIndex * 20) % 100}%`;
      gradientShape.style.background = `radial-gradient(ellipse at center, ${colorPair[0]} 0%, ${colorPair[1]} 100%)`;
      gradientShape.style.top = `${(cardIndex * 15) % 100}%`;
      gradientShape.style.left = `${(cardIndex * 25) % 100}%`;
      gradientShape.style.transform = 'translate(-50%, -50%)';
      gradientShape.style.filter = 'blur(80px)';
      gradientShape.style.opacity = '0.1';
      bg.appendChild(gradientShape);
    }
    bgContainer.appendChild(bg);
  });


  const backgrounds = ['background1.png', 'background2.png', 'background3.png'];

  slides.forEach((slide, index) => {
    const bg = backgrounds[index % backgrounds.length];
    const bgElement = slide.querySelector('.background');
    if (bgElement) {
      bgElement.style.backgroundImage = `url('https://raw.githubusercontent.com/overbait/RLBK_ephrs/feature/redesign-slides/assets/${bg}')`;
    }

    for (let i = 0; i < 8; i++) {
      const leaf = document.createElement('div');
      leaf.classList.add('leaves-decoration');
      const leafNum = (index + i) % 8 + 1;
      leaf.style.backgroundImage = `url('https://raw.githubusercontent.com/overbait/RLBK_ephrs/feature/redesign-slides/assets/leves_${leafNum}.png')`;
      leaf.style.top = `${10 + (i * 10)}%`;
      leaf.style.left = `${10 + (i * 5)}%`;
      leaf.style.transform = `rotate(${(i * 45)}deg) scale(${0.8 + (i * 0.05)})`;
      leaf.style.width = `${80 + (i * 10)}px`;
      leaf.style.height = `${80 + (i * 10)}px`;
      slide.appendChild(leaf);
    }
  });

  attachImageToCard('#qualifiers-card', 2, 'icon_swords.png', -30, 10);
  attachImageToCard('#group-stage-card', 4, 'icon_shield.png', 30, 10);
  attachImageToCard('#playoffs-card', 2, 'icon_troph.png', 0, 10);

  const getRotation = (index) => (index % 2 === 0 ? 15 : -15);

  // FAIR PLAY & MISCONDUCT
  attachImageToCard('.slide:nth-child(10) .content-box:nth-child(1)', 2, 'icon_sword2.png', getRotation(0), 13);
  attachImageToCard('.slide:nth-child(10) .content-box:nth-child(2)', 3, 'icon_plus.png', getRotation(1), 13);

  // COMMUNICATION
  attachImageToCard('.slide:nth-child(11) .content-box:nth-child(1)', 2, 'icon_clock.png', getRotation(2), 13);
  attachImageToCard('.slide:nth-child(11) .content-box:nth-child(2)', 3, 'icon_calendar.png', getRotation(3), 13);

  // CONTACTS & RESOURCES
  attachImageToCard('.slide:nth-child(13) .content-box:nth-child(1)', 2, 'icon_dude.png', getRotation(4), 13);
});
