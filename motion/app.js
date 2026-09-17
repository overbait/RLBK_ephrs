(function () {
  const FPS = 30;
  const FRAME_WIDTH = 1920;
  const FRAME_HEIGHT = 1080;
  const params = new URLSearchParams(window.location.search);
  const sceneName = params.get("scene") || "invited_players";
  const initialFrame = Number(params.get("frame") || 0);
  const app = document.getElementById("app");

  const invitedPlayers = [
    { name: "VortiX", country: "Spain", flag: "../countryflags/es.png" },
    { name: "MarineLorD", country: "France", flag: "../countryflags/fr.png" },
    { name: "Wam01", country: "Canada", flag: "../countryflags/ca.png" },
    { name: "Anotand", country: "Belarus", flag: "../countryflags/by.png" },
    { name: "Puppypaw", country: "Canada", flag: "../countryflags/ca.png" },
    { name: "Bee", country: "Russia", flag: "../countryflags/ru.png" }
  ];

  const datePhases = [
    {
      phase: "Stage One",
      title: "Qualifiers",
      dates: "Apr 11-12",
      desc: "Two qualification days. Five players advance from each qualifier."
    },
    {
      phase: "Stage Two",
      title: "Group Stage",
      dates: "Apr 18-19",
      desc: "GSL groups with sixteen players. Top two from each group advance."
    },
    {
      phase: "Final Stage",
      title: "Playoffs",
      dates: "Apr 25-26",
      desc: "Single elimination weekend ending with the grand final."
    }
  ];

  const prizePayouts = [
    { place: "1st Place", share: "", amount: "$1,000", tier: "gold" },
    { place: "2nd Place", share: "", amount: "$500", tier: "silver" },
    { place: "3rd Place", share: "", amount: "$250", tier: "bronze" },
    { place: "4th Place", share: "", amount: "$150", tier: "" },
    { place: "5th-8th Places", share: "", amount: "$100 each", tier: "" },
    { place: "9th-12th Places", share: "", amount: "$50 each", tier: "" }
  ];

  const mapPool = [
    { name: "Dry Arabia", image: "../assets/mappool/dry-arabia-min.png" },
    { name: "EGC - Holy Island", image: "../assets/mappool/holy-island-min.png" },
    { name: "EGC - Gorge", image: "../assets/mappool/gorge.png" },
    { name: "EGC - Lipany", image: "../assets/lipany.png" },
    { name: "EGCMS - Frisian Marshes", image: "../assets/mappool/frisian_marshes.png" },
    { name: "Coastal Cliffs", image: "../assets/mappool/coastal_cliffs.png" },
    { name: "Moving Out", image: "../assets/mappool/Moving_Out_AoE4_map.png" },
    { name: "EGC - Socotra", image: "../assets/mappool/socotra.png" },
    { name: "Epohers - Three Little Pigs", image: "../assets/mappool/Epohers_threeLittlePigs.jpg" }
  ];

  const threeLittlePigsMap = {
    name: "Three Little Pigs",
    image: "../assets/mappool/Epohers_threeLittlePigs.jpg"
  };

  const formatStages = [
    { stage: "Stage One", title: "Qualifiers", date: "Apr 11-12", desc: "Two qualification brackets. Five players advance from each." },
    { stage: "Stage Two", title: "Group Stage", date: "Apr 18-19", desc: "Sixteen players in GSL groups. Top two from each group move on." },
    { stage: "Final Stage", title: "Playoffs", date: "Apr 25-26", desc: "Single elimination finish with third place match and grand final." }
  ];

  const springLeaves = [
    "../spring_assets/leaves/leaves_green_mid1.png",
    "../spring_assets/leaves/leaves_green_mid2.png",
    "../spring_assets/leaves/leaves_green_mid7.png",
    "../spring_assets/leaves/leaves_green_small3.png",
    "../spring_assets/leaves/leaves_green_small5.png",
    "../spring_assets/leaves/leaves_pink_mid2.png",
    "../spring_assets/leaves/leaves_pink_mid5.png",
    "../spring_assets/leaves/leaves_pink_mid8.png",
    "../spring_assets/leaves/leaves_pink_mid9.png"
  ];

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function lerp(start, end, t) {
    return start + (end - start) * t;
  }

  function easeOutCubic(t) {
    return 1 - Math.pow(1 - t, 3);
  }

  function easeOutBack(t) {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }

  function easeInOutSine(t) {
    return -(Math.cos(Math.PI * t) - 1) / 2;
  }

  function seededRandom(seed) {
    const x = Math.sin(seed * 999.91) * 10000;
    return x - Math.floor(x);
  }

  function normalize(frame, start, duration) {
    return clamp((frame - start) / duration, 0, 1);
  }

  function createElement(tag, className, text) {
    const element = document.createElement(tag);
    if (className) {
      element.className = className;
    }
    if (typeof text === "string") {
      element.textContent = text;
    }
    return element;
  }

  function setTransform(element, x, y, scale, rotate) {
    element.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
  }

  function animatePop(element, frame, startFrame, duration, options = {}) {
    const progress = normalize(frame, startFrame, duration);
    const eased = easeOutBack(progress);
    const fromScale = options.fromScale ?? 0.86;
    const fromY = options.fromY ?? 40;
    const fromX = options.fromX ?? 0;
    const toX = options.toX ?? 0;
    const toY = options.toY ?? 0;
    const fromRotate = options.fromRotate ?? 0;
    const settleRotate = options.settleRotate ?? 0;
    const scale = lerp(fromScale, 1, eased);
    const x = lerp(fromX, toX, eased);
    const y = lerp(fromY, toY, eased);
    const rotate = lerp(fromRotate, settleRotate, eased);
    const opacity = clamp(progress * 1.15, 0, 1);
    element.style.opacity = opacity.toFixed(4);
    setTransform(element, x, y, scale, rotate);
  }

  function animateSoftFloat(element, frame, amplitude, speed, phase, baseRotate) {
    const y = Math.sin(frame * speed + phase) * amplitude;
    const x = Math.cos(frame * speed * 0.8 + phase) * amplitude * 0.5;
    const rotate = baseRotate + Math.sin(frame * speed * 0.55 + phase) * 3;
    setTransform(element, x, y, 1, rotate);
  }

  function createSceneHeading(kicker, title) {
    const wrap = createElement("div", "scene-heading-wrap");
    wrap.appendChild(createElement("div", "scene-heading-kicker", kicker));
    wrap.appendChild(createElement("div", "scene-heading", title));
    wrap.appendChild(createElement("div", "scene-heading-line"));
    return wrap;
  }

  const scenes = {
    invited_players: createInvitedPlayersScene(),
    transition_leaves: createTransitionLeavesScene(),
    transition_leaves_slow: createTransitionLeavesScene({ slow: true }),
    transition_leaves_slow_wind_alt: createTransitionLeavesScene({ slow: true, windMode: "alt" }),
    transition_leaves_slow_swirl: createTransitionLeavesScene({ slow: true, windMode: "swirl" }),
    dates: createDatesScene(),
    prize_pool: createPrizePoolScene(),
    prize_pool_pan_up: createPrizePoolScene({ cinematic: true }),
    prize_pool_pan_up_tight: createPrizePoolScene({ cinematic: true, tightFrame: true }),
    map_pool: createMapPoolScene(),
    map_pool_pan: createMapPoolScene({ cinematic: true }),
    three_little_pigs: createThreeLittlePigsScene(),
    format_dates: createFormatDatesScene(),
    title_card: createTitleCardScene(),
    title_card_slow: createTitleCardScene({ slow: true }),
    discord_cta: createDiscordCtaScene(),
    final_cta: createFinalCtaScene()
  };

  const activeScene = scenes[sceneName] || scenes.invited_players;
  activeScene.mount(app);
  setFrame(initialFrame);

  function createInvitedPlayersScene() {
    let root;
    let safe;
    let heading;
    let cards = [];

    return {
      totalFrames: 210,
      mount(container) {
        root = createElement("section", "scene");
        safe = createElement("div", "scene-safe");
        root.appendChild(safe);

        heading = createSceneHeading("Spring World Cup", "Invited Players");
        safe.appendChild(heading);

        const grid = createElement("div", "players-grid");
        safe.appendChild(grid);

        const orderRanks = [0, 2, 1, 3, 5, 4];
        cards = invitedPlayers.map((player, index) => {
          const card = createElement("article", "player-card");
          card.dataset.orderIndex = String(orderRanks[index]);

          const label = createElement("div", "player-card__label", "Invited");
          card.appendChild(label);

          const header = createElement("div", "player-card__header");
          const name = createElement("div", "player-card__name", player.name);
          header.appendChild(name);
          card.appendChild(header);

          const country = createElement("div", "player-card__country");
          country.appendChild(createElement("span", "", player.country));
          card.appendChild(country);

          const flagChip = createElement("div", "player-card__flag-chip");
          const flag = document.createElement("img");
          flag.className = "player-card__flag";
          flag.src = player.flag;
          flag.alt = player.country;
          flagChip.appendChild(flag);
          card.appendChild(flagChip);

          const accent = createElement("div", "player-card__accent");
          card.appendChild(accent);

          const shine = createElement("div", "player-card__shine");
          card.appendChild(shine);

          const leaf = document.createElement("img");
          leaf.className = "player-card__leaf";
          leaf.src = springLeaves[index % springLeaves.length];
          leaf.alt = "";
          card.appendChild(leaf);

          grid.appendChild(card);

          return {
            card,
            accent,
            flagChip,
            shine,
            leaf,
            orderIndex: orderRanks[index]
          };
        });

        container.appendChild(root);
      },
      update(frame) {
        animatePop(heading, frame, 2, 13, { fromScale: 0.9, fromY: 20, fromRotate: -1.4 });

        cards.forEach((entry, index) => {
          const startFrame = 14 + entry.orderIndex * 4 + Math.round(seededRandom(index + 1) * 3);
          animatePop(entry.card, frame, startFrame, 10, {
            fromScale: 0.76,
            fromY: 58,
            fromX: seededRandom(index + 9) > 0.5 ? 14 : -14,
            fromRotate: seededRandom(index + 700) > 0.5 ? 5.5 : -5.5
          });

          const detailProgress = normalize(frame, startFrame + 2, 10);
          entry.accent.style.opacity = String(0.2 + detailProgress * 0.8);
          entry.flagChip.style.opacity = String(0.16 + detailProgress * 0.56);
          entry.shine.style.opacity = String(0.12 + detailProgress * 0.55);
          entry.shine.style.transform = `translateX(${Math.sin(frame * 0.05 + index) * 18}px)`;

          const idleProgress = normalize(frame, startFrame + 8, 16);
          const cardSwing = Math.sin(frame * 0.08 + index * 0.9) * 0.85 * idleProgress;
          const cardLift = Math.sin(frame * 0.06 + index * 1.4) * 4.5 * idleProgress;
          entry.card.style.transform += ` rotate(${cardSwing}deg) translateY(${cardLift}px)`;

          const flagDriftX = Math.sin(frame * 0.048 + index * 1.2) * 4;
          const flagDriftY = Math.cos(frame * 0.044 + index * 0.9) * 3;
          const flagRotate = -7 + Math.sin(frame * 0.034 + index * 1.4) * 2.2;
          const flagScale = 1.02 + Math.sin(frame * 0.026 + index) * 0.025;
          entry.flagChip.style.transform = `translate(${flagDriftX}px, ${flagDriftY}px) rotate(${flagRotate}deg) scale(${flagScale})`;

          const leafOpacity = 0.26 + detailProgress * 0.2 + Math.sin(frame * 0.04 + index) * 0.04;
          entry.leaf.style.opacity = leafOpacity.toFixed(4);
          const leafScale = 1 + Math.sin(frame * 0.03 + index) * 0.035;
          const leafRotate = 8 + Math.sin(frame * 0.028 + index * 1.7) * 8;
          entry.leaf.style.transform = `translate(${Math.sin(frame * 0.024 + index) * 8}px, ${Math.cos(frame * 0.027 + index) * 7}px) scale(${leafScale}) rotate(${leafRotate}deg)`;
        });
      }
    };
  }

  function createTransitionLeavesScene(options = {}) {
    let root;
    let leaves = [];
    const isSlow = Boolean(options.slow);
    const windMode = options.windMode || "default";
    const totalFrames = isSlow ? 84 : 52;

    return {
      totalFrames,
      mount(container) {
        root = createElement("section", "scene");
        leaves = Array.from({ length: 36 }, (_, index) => {
          const leaf = document.createElement("img");
          leaf.className = "transition-leaf";
          leaf.src = springLeaves[index % springLeaves.length];
          leaf.alt = "";

          const layerRand = seededRandom(index + 3);
          const layer = layerRand < 0.28 ? 0 : layerRand < 0.74 ? 1 : 2;
          const scale = layer === 0 ? lerp(0.22, 0.52, seededRandom(index + 10)) : layer === 1 ? lerp(0.48, 0.88, seededRandom(index + 10)) : lerp(0.86, 1.46, seededRandom(index + 10));
          const width = 150 * scale;
          leaf.style.width = `${width}px`;
          leaf.dataset.index = String(index);
          leaf.dataset.layer = String(layer);
          leaf.dataset.scale = String(scale);
          const startX = windMode === "alt"
            ? lerp(-320, 260, seededRandom(index + 41))
            : windMode === "swirl"
              ? lerp(FRAME_WIDTH - 120, FRAME_WIDTH + 360, seededRandom(index + 41))
              : lerp(-180, FRAME_WIDTH + 220, seededRandom(index + 41));
          const startY = windMode === "swirl"
            ? lerp(FRAME_HEIGHT - 80, FRAME_HEIGHT + 360, seededRandom(index + 71))
            : windMode === "alt"
              ? lerp(-220, FRAME_HEIGHT + 140, seededRandom(index + 71))
              : lerp(-420, -30, seededRandom(index + 71));

          const endX = windMode === "alt"
            ? startX + lerp(920, 1780, seededRandom(index + 87))
            : windMode === "swirl"
              ? startX - lerp(980, 1780, seededRandom(index + 87))
              : startX - lerp(40, 620, seededRandom(index + 87));
          const endY = windMode === "swirl"
            ? -lerp(220, 680, seededRandom(index + 97))
            : windMode === "alt"
              ? lerp(-180, FRAME_HEIGHT + 240, seededRandom(index + 97))
              : FRAME_HEIGHT + lerp(120, 420, seededRandom(index + 97));

          leaf.dataset.startX = String(startX);
          leaf.dataset.startY = String(startY);
          leaf.dataset.endX = String(endX);
          leaf.dataset.endY = String(endY);
          leaf.dataset.rotBase = String(lerp(-65, 55, seededRandom(index + 131)));
          leaf.dataset.rotSpeed = String(layer === 0 ? lerp(0.5, 1.8, seededRandom(index + 151)) : layer === 1 ? lerp(1.2, 3.9, seededRandom(index + 151)) : lerp(2.2, 6.9, seededRandom(index + 151)));
          leaf.dataset.phase = String(lerp(0, Math.PI * 2, seededRandom(index + 171)));
          leaf.dataset.swing = String(layer === 0 ? lerp(8, 34, seededRandom(index + 191)) : layer === 1 ? lerp(14, 56, seededRandom(index + 191)) : lerp(24, 82, seededRandom(index + 191)));
          leaf.dataset.startFrame = String(Math.floor(lerp(0, isSlow ? 34 : 24, seededRandom(index + 211))));
          leaf.dataset.duration = String(Math.floor(lerp(isSlow ? 30 : 18, isSlow ? 52 : 34, seededRandom(index + 241))));
          const baseWind = lerp(-0.45, 0.62, seededRandom(index + 271));
          const shapedWind = windMode === "alt"
            ? Math.abs(baseWind) * lerp(1.2, 2.6, seededRandom(index + 811))
            : windMode === "swirl"
              ? -Math.abs(lerp(0.12, 0.34, seededRandom(index + 731)))
              : baseWind;
          const baseArc = lerp(-90, 90, seededRandom(index + 301));
          const shapedArc = windMode === "swirl"
            ? baseArc * 2.9
            : windMode === "alt"
              ? Math.abs(baseArc) * 1.45
            : baseArc;
          leaf.dataset.wind = String(shapedWind);
          leaf.dataset.arc = String(shapedArc);
          leaf.dataset.wave = String(lerp(0.06, 0.22, seededRandom(index + 331)));
          leaf.dataset.opacity = String(layer === 0 ? lerp(0.2, 0.5, seededRandom(index + 361)) : layer === 1 ? lerp(0.45, 0.78, seededRandom(index + 361)) : lerp(0.62, 0.98, seededRandom(index + 361)));
          leaf.dataset.swirlDir = String(seededRandom(index + 761) > 0.5 ? 1 : -1);
          leaf.dataset.swirlRadius = String(lerp(24, 120, seededRandom(index + 791)));
          leaf.dataset.scatterX = String(lerp(-120, 120, seededRandom(index + 841)));
          leaf.dataset.scatterY = String(lerp(-140, 140, seededRandom(index + 871)));

          root.appendChild(leaf);
          return leaf;
        });

        container.appendChild(root);
      },
      update(frame) {
        leaves.forEach((leaf, index) => {
          const scale = Number(leaf.dataset.scale);
          const startX = Number(leaf.dataset.startX);
          const startY = Number(leaf.dataset.startY);
          const endX = Number(leaf.dataset.endX);
          const endY = Number(leaf.dataset.endY);
          const rotBase = Number(leaf.dataset.rotBase);
          const rotSpeed = Number(leaf.dataset.rotSpeed);
          const phase = Number(leaf.dataset.phase);
          const swing = Number(leaf.dataset.swing);
          const layer = Number(leaf.dataset.layer);
          const startFrame = Number(leaf.dataset.startFrame);
          const duration = Number(leaf.dataset.duration);
          const wind = Number(leaf.dataset.wind);
          const arc = Number(leaf.dataset.arc);
          const wave = Number(leaf.dataset.wave);
          const opacityBase = Number(leaf.dataset.opacity);
          const swirlDir = Number(leaf.dataset.swirlDir || 1);
          const swirlRadius = Number(leaf.dataset.swirlRadius || 50);
          const scatterX = Number(leaf.dataset.scatterX || 0);
          const scatterY = Number(leaf.dataset.scatterY || 0);
          const progress = normalize(frame, startFrame, duration);
          const eased = easeInOutSine(progress);
          const arcDrift = Math.sin(progress * Math.PI) * arc;
          const frameFactor = isSlow ? 0.66 : 1;
          const swirlPush = windMode === "swirl"
            ? Math.sin(progress * Math.PI * 3.8 + phase) * swirlRadius * swirlDir
            : 0;
          const swirlLift = windMode === "swirl"
            ? Math.cos(progress * Math.PI * 3.8 + phase) * swirlRadius * 0.62
            : 0;
          const altCross = windMode === "alt"
            ? Math.sin(progress * Math.PI * 1.6 + phase) * swing * 1.1
            : 0;
          const randomSpreadX = (windMode === "alt" || windMode === "swirl") ? scatterX * Math.sin(progress * Math.PI) : 0;
          const randomSpreadY = (windMode === "alt" || windMode === "swirl") ? scatterY * Math.sin(progress * Math.PI * 0.85) : 0;
          const x = lerp(startX, endX, eased) + Math.sin(frame * wave * frameFactor + phase) * swing + wind * frame * 4 * frameFactor + arcDrift + swirlPush + randomSpreadX;
          const y = lerp(startY, endY, eased) + Math.cos(frame * (wave * 0.85) * frameFactor + phase) * swing * (windMode === "swirl" ? 0.34 : 0.24) + swirlLift + altCross + randomSpreadY;
          const rotate = rotBase - frame * rotSpeed * frameFactor + Math.sin(frame * (wave + 0.04) * frameFactor + phase) * (windMode === "swirl" ? 42 : windMode === "alt" ? 22 : 15);

          const fadeIn = normalize(frame, startFrame, 5);
          const fadeOut = 1 - normalize(frame, startFrame + duration - 5, 5);
          leaf.style.opacity = String(opacityBase * fadeIn * fadeOut);
          leaf.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
          leaf.style.zIndex = String(5 + layer);
        });
      }
    };
  }

  function createDatesScene() {
    let root;
    let safe;
    let progressWrap;
    let progressSegments = [];
    let progressOrbs = [];
    let cards = [];

    return {
      totalFrames: 210,
      mount(container) {
        root = createElement("section", "scene");
        safe = createElement("div", "scene-safe");
        root.appendChild(safe);

        const layout = createElement("div", "dates-layout");
        safe.appendChild(layout);

        progressWrap = createElement("div", "dates-progress");
        const leftSegment = createElement("div", "dates-progress__segment dates-progress__segment--left");
        const rightSegment = createElement("div", "dates-progress__segment dates-progress__segment--right");
        progressWrap.appendChild(leftSegment);
        progressWrap.appendChild(rightSegment);
        progressSegments = [leftSegment, rightSegment];
        progressOrbs = ["18%", "50%", "82%"].map((left) => {
          const orb = createElement("div", "dates-progress__orb");
          orb.style.left = left;
          progressWrap.appendChild(orb);
          return orb;
        });
        layout.appendChild(progressWrap);

        const cardsWrap = createElement("div", "dates-cards");
        layout.appendChild(cardsWrap);

        cards = datePhases.map((item, index) => {
          const card = createElement("article", "date-card");
          card.classList.add(index === 0 ? "date-card--qf" : index === 1 ? "date-card--gs" : "date-card--po");
          card.appendChild(createElement("div", "date-card__phase", item.phase));
          card.appendChild(createElement("div", "date-card__title", item.title));
          card.appendChild(createElement("div", "date-card__dates", item.dates));
          card.appendChild(createElement("div", "date-card__desc", item.desc));

          const accent = createElement("div", "date-card__accent");
          card.appendChild(accent);

          const leaf = document.createElement("img");
          leaf.className = "date-card__leaf";
          leaf.src = springLeaves[(index + 4) % springLeaves.length];
          leaf.alt = "";
          card.appendChild(leaf);

          cardsWrap.appendChild(card);
          return { card, accent, leaf };
        });

        container.appendChild(root);
      },
      update(frame) {
        animatePop(progressWrap, frame, 8, 13, { fromScale: 0.94, fromY: 24 });
        progressSegments.forEach((segment, index) => {
          segment.style.transform = `scaleX(${0.72 + normalize(frame, 14 + index * 4, 18) * 0.28})`;
          segment.style.opacity = String(0.18 + normalize(frame, 12 + index * 4, 18) * 0.54);
        });
        progressOrbs.forEach((orb, index) => {
          const start = 14 + index * 7;
          const p = normalize(frame, start, 12);
          const pulse = 1 + Math.sin(frame * 0.09 + index * 1.4) * 0.08;
          const scale = (0.72 + p * 0.28) * pulse;
          orb.style.opacity = String(0.18 + p * 0.82);
          orb.style.transform = `translateX(-50%) scale(${scale})`;
        });

        cards.forEach((entry, index) => {
          const startFrame = 20 + index * 7 + Math.round(seededRandom(index + 1201) * 2);
          animatePop(entry.card, frame, startFrame, 11, {
            fromScale: 0.8,
            fromY: 54,
            fromX: index === 1 ? 0 : index === 0 ? -14 : 14,
            fromRotate: index === 0 ? -4.2 : index === 2 ? 4.2 : 0.8
          });

          const detail = normalize(frame, startFrame + 3, 12);
          entry.accent.style.opacity = String(0.2 + detail * 0.8);

          const idle = normalize(frame, startFrame + 10, 18);
          const tilt = Math.sin(frame * 0.065 + index) * 0.7 * idle;
          const lift = Math.sin(frame * 0.05 + index * 1.4) * 4 * idle;
          entry.card.style.transform += ` rotate(${tilt}deg) translateY(${lift}px)`;

          const leafScale = 1 + Math.sin(frame * 0.032 + index) * 0.035;
          const leafRotate = 8 + Math.sin(frame * 0.026 + index * 1.7) * 7;
          entry.leaf.style.opacity = String(0.22 + detail * 0.18 + Math.sin(frame * 0.03 + index) * 0.03);
          entry.leaf.style.transform = `translate(${Math.sin(frame * 0.025 + index) * 8}px, ${Math.cos(frame * 0.022 + index) * 7}px) scale(${leafScale}) rotate(${leafRotate}deg)`;
        });
      }
    };
  }

  function createPrizePoolScene(options = {}) {
    let root;
    let safe;
    let camera;
    let panel;
    let line;
    let art;
    let rows = [];

    return {
      totalFrames: 210,
      mount(container) {
        root = createElement("section", "scene");
        safe = createElement("div", "scene-safe");
        root.appendChild(safe);

        const layout = createElement("div", "prize-layout");
        safe.appendChild(layout);

        const viewport = options.cinematic
          ? createElement("div", "prize-viewport")
          : layout;

        if (options.cinematic) {
          camera = createElement("div", "prize-camera");
          viewport.appendChild(camera);
          layout.appendChild(viewport);
        }

        panel = createElement(
          "div",
          options.cinematic
            ? `prize-panel prize-panel--cinematic${options.tightFrame ? " prize-panel--cinematic-tight" : ""}`
            : "prize-panel"
        );
        (camera || viewport).appendChild(panel);

        const header = createElement("div", "prize-panel__header");
        header.appendChild(createElement("div", "prize-panel__kicker", "Prize Pool & Payouts"));
        line = createElement("div", "prize-panel__line");
        header.appendChild(line);
        art = document.createElement("img");
        art.className = "prize-panel__art";
        art.src = "../assets/tropheys-min.png";
        art.alt = "";
        header.appendChild(art);
        panel.appendChild(header);

        const list = createElement("div", "prize-list");
        panel.appendChild(list);

        rows = prizePayouts.map((item) => {
          const row = createElement("div", `prize-row${item.tier ? ` prize-row--${item.tier}` : ""}`);
          row.appendChild(createElement("div", "prize-row__place", item.place));
          row.appendChild(createElement("div", "prize-row__amount", item.amount));
          list.appendChild(row);
          return row;
        });

        container.appendChild(root);
      },
      update(frame) {
        if (camera) {
          const reveal = easeInOutSine(normalize(frame, 0, 34));
          const travel = easeInOutSine(normalize(frame, 24, 156));
          const scale = options.tightFrame
            ? lerp(1.18, 1.3, reveal)
            : lerp(1.58, 1.74, reveal);
          const panY = options.tightFrame
            ? lerp(300, -180, travel)
            : lerp(420, -240, travel);
          const panX = options.tightFrame
            ? lerp(-10, 8, travel)
            : lerp(-34, 14, travel);
          const tiltX = options.tightFrame
            ? lerp(18, 12, reveal)
            : lerp(24, 16, reveal);
          const tiltY = options.tightFrame
            ? lerp(-6, -2, reveal)
            : lerp(-8, -4, reveal);
          const tiltZ = lerp(-1.2, -0.3, reveal) + Math.sin(frame * 0.018) * 0.28;
          camera.style.transform = `translate(-50%, -50%) scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) translateX(${panX}px) translateY(${panY}px)`;
          panel.style.opacity = String(0.24 + reveal * 0.76);
        } else {
          animatePop(panel, frame, 6, 14, { fromScale: 0.86, fromY: 34, fromRotate: -0.8 });
        }

        line.style.opacity = String(0.24 + normalize(frame, 12, 16) * 0.76);
        art.style.transform = `translateY(${Math.sin(frame * 0.03) * 5}px) rotate(${Math.sin(frame * 0.025) * 2}deg)`;

        rows.forEach((row, index) => {
          const orderIndex = options.cinematic ? rows.length - 1 - index : index;
          const start = 18 + orderIndex * 4;
          animatePop(row, frame, start, 9, {
            fromScale: 0.96,
            fromY: options.cinematic ? 42 : 24,
            fromX: 0,
            fromRotate: 0
          });
          const idle = normalize(frame, start + 8, 18);
          row.style.transform += ` translateX(${Math.sin(frame * 0.04 + index) * 2.5 * idle}px)`;
        });
      }
    };
  }

  function createMapPoolScene(options = {}) {
    let root;
    let safe;
    let camera;
    let thumbs = [];

    return {
      totalFrames: 210,
      mount(container) {
        root = createElement("section", "scene");
        safe = createElement("div", "scene-safe");
        root.appendChild(safe);

        const layout = createElement("div", "map-layout");
        safe.appendChild(layout);

        const viewport = options.cinematic
          ? createElement("div", "map-viewport")
          : layout;

        if (options.cinematic) {
          camera = createElement("div", "map-camera");
          viewport.appendChild(camera);
          layout.appendChild(viewport);
        }

        const grid = createElement(
          "div",
          options.cinematic ? "map-grid map-grid--cinematic" : "map-grid"
        );
        (camera || viewport).appendChild(grid);

        const topRow = createElement("div", "map-row");
        const bottomRow = createElement("div", "map-row");
        grid.appendChild(topRow);
        grid.appendChild(bottomRow);

        thumbs = mapPool.map((map, index) => {
          const thumb = createElement(
            "article",
            options.cinematic ? "map-thumb map-thumb--cinematic" : "map-thumb"
          );
          const image = document.createElement("img");
          image.className = "map-thumb__image";
          image.src = map.image;
          image.alt = map.name;
          thumb.appendChild(image);
          thumb.appendChild(createElement("div", "map-thumb__name", map.name));
          thumb.appendChild(createElement("div", "map-thumb__accent"));
          (index < 5 ? topRow : bottomRow).appendChild(thumb);
          return thumb;
        });

        container.appendChild(root);
      },
      update(frame) {
        if (camera) {
          const reveal = easeInOutSine(normalize(frame, 0, 36));
          const panProgress = easeInOutSine(normalize(frame, 30, 150));
          const panX = lerp(-92, 84, panProgress);
          const liftY = lerp(22, -10, panProgress);
          const driftRotate = Math.sin(frame * 0.018) * 0.9;
          const scale = lerp(1.2, 1.32, reveal);
          const tiltX = lerp(18, 14, reveal);
          const tiltY = lerp(28, 22, reveal);
          const tiltZ = -2.4 + driftRotate * 0.4;
          camera.style.transform = `translate(-50%, -50%) scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) translateX(${panX}px) translateY(${liftY}px)`;
        }

        thumbs.forEach((thumb, index) => {
          const row = index < 5 ? 0 : 1;
          const start = 10 + row * 10 + (index % 5) * 2;
          animatePop(thumb, frame, start, 9, {
            fromScale: 0.7,
            fromX: 0,
            fromY: row === 0 ? 62 : -42,
            fromRotate: row === 0 ? -4.2 : 4.2
          });
          const idle = normalize(frame, start + 8, 16);
          thumb.style.transform += ` rotate(${Math.sin(frame * 0.038 + index) * 0.35 * idle}deg) translateY(${Math.sin(frame * 0.05 + index * 1.4) * 2.6 * idle}px)`;
        });
      }
    };
  }

  function createThreeLittlePigsScene() {
    let root;
    let safe;
    let viewport;
    let camera;
    let orbitRig;
    let stage;
    let thumb;
    let image;
    let label;

    return {
      totalFrames: 225,
      mount(container) {
        root = createElement("section", "scene");
        safe = createElement("div", "scene-safe");
        root.appendChild(safe);

        const layout = createElement("div", "tlp-layout");
        safe.appendChild(layout);

        viewport = createElement("div", "tlp-viewport");
        camera = createElement("div", "tlp-camera");
        orbitRig = createElement("div", "tlp-orbit-rig");
        stage = createElement("div", "tlp-stage");
        layout.appendChild(viewport);
        viewport.appendChild(camera);
        camera.appendChild(orbitRig);
        orbitRig.appendChild(stage);

        thumb = createElement("article", "map-thumb map-thumb--cinematic tlp-thumb");
        image = document.createElement("img");
        image.className = "map-thumb__image tlp-thumb__image";
        image.src = threeLittlePigsMap.image;
        image.alt = threeLittlePigsMap.name;
        thumb.appendChild(image);

        label = createElement("div", "map-thumb__name tlp-thumb__name", threeLittlePigsMap.name);
        thumb.appendChild(label);
        thumb.appendChild(createElement("div", "map-thumb__accent"));
        stage.appendChild(thumb);

        container.appendChild(root);
      },
      update(frame) {
        const reveal = easeInOutSine(normalize(frame, 0, 34));
        const orbit = easeInOutSine(normalize(frame, 26, 155));

        const orbitRadiusX = lerp(110, 150, reveal);
        const orbitRadiusY = lerp(18, 34, reveal);
        const orbitAngle = lerp(-0.95, 0.95, orbit);
        const camX = Math.sin(orbitAngle) * orbitRadiusX;
        const camY = lerp(-24, 28, orbit) + Math.cos(orbitAngle) * orbitRadiusY;
        const scale = lerp(1.95, 2.24, reveal);
        const tiltX = lerp(20, 16, reveal);
        const tiltY = lerp(26, -26, orbit);
        const tiltZ = Math.sin(frame * 0.018) * 0.45;
        camera.style.transform =
          `translate(-50%, -50%) scale(${scale}) rotateX(${tiltX}deg) rotateY(${tiltY}deg) rotateZ(${tiltZ}deg) translateX(${camX}px) translateY(${camY}px)`;

        orbitRig.style.transform =
          `translateX(${-camX * 0.82}px) translateY(${-camY * 0.78}px) rotateY(${-tiltY * 0.58}deg) rotateX(${-tiltX * 0.12}deg) rotateZ(${-tiltZ * 0.35}deg)`;

        animatePop(thumb, frame, 10, 9, {
          fromScale: 0.7,
          fromX: 0,
          fromY: 62,
          fromRotate: -4.2
        });
        image.style.transform = "";
        label.style.transform = "";
      }
    };
  }

  function createFormatDatesScene() {
    let root;
    let safe;
    let line;
    let nodes = [];
    let cards = [];

    return {
      totalFrames: 210,
      mount(container) {
        root = createElement("section", "scene");
        safe = createElement("div", "scene-safe");
        root.appendChild(safe);

        const layout = createElement("div", "format-layout");
        safe.appendChild(layout);

        const track = createElement("div", "format-track");
        layout.appendChild(track);

        line = createElement("div", "format-line");
        track.appendChild(line);

        nodes = ["16.6%", "50%", "83.4%"].map((left) => {
          const node = createElement("div", "format-node");
          node.style.left = left;
          track.appendChild(node);
          return node;
        });

        const grid = createElement("div", "format-grid");
        track.appendChild(grid);

        cards = formatStages.map((stage) => {
          const card = createElement("article", "format-card");
          card.appendChild(createElement("div", "format-card__stage", stage.stage));
          card.appendChild(createElement("div", "format-card__title", stage.title));
          card.appendChild(createElement("div", "format-card__date", stage.date));
          card.appendChild(createElement("div", "format-card__desc", stage.desc));
          grid.appendChild(card);
          return card;
        });

        container.appendChild(root);
      },
      update(frame) {
        line.style.opacity = String(0.16 + normalize(frame, 10, 18) * 0.54);
        line.style.transform = `scaleX(${0.72 + normalize(frame, 10, 20) * 0.28})`;

        nodes.forEach((node, index) => {
          const p = normalize(frame, 16 + index * 6, 12);
          const pulse = 1 + Math.sin(frame * 0.08 + index) * 0.08;
          node.style.opacity = String(0.18 + p * 0.82);
          node.style.transform = `translateX(-50%) scale(${(0.72 + p * 0.28) * pulse})`;
        });

        cards.forEach((card, index) => {
          const start = 18 + index * 6;
          animatePop(card, frame, start, 11, {
            fromScale: 0.82,
            fromY: 50,
            fromX: index === 0 ? -12 : index === 2 ? 12 : 0,
            fromRotate: index === 0 ? -3.2 : index === 2 ? 3.2 : 0.8
          });
          const idle = normalize(frame, start + 8, 18);
          card.style.transform += ` translateY(${Math.sin(frame * 0.05 + index * 1.4) * 4 * idle}px)`;
        });
      }
    };
  }

  function createTitleCardScene(options = {}) {
    let root;
    let safe;
    let stack;
    let logo;
    let mainTitle;
    let subTitle;
    let dateLabel;
    let line;

    return {
      totalFrames: 180,
      mount(container) {
        root = createElement("section", "scene");
        safe = createElement("div", "scene-safe");
        root.appendChild(safe);
        const layout = createElement("div", "title-layout");
        safe.appendChild(layout);
        stack = createElement("div", "title-stack");
        layout.appendChild(stack);
        logo = document.createElement("img");
        logo.className = "title-logo";
        logo.src = "../spring_assets/Logo_Spring4.png";
        logo.alt = "";
        stack.appendChild(logo);
        mainTitle = createElement("div", "title-main", "Epohers World Cup 2");
        subTitle = createElement("div", "title-sub", "Age of Empires IV Tournament");
        dateLabel = createElement("div", "title-date", "April 11 - 26, 2026");
        stack.appendChild(mainTitle);
        stack.appendChild(subTitle);
        stack.appendChild(dateLabel);
        line = createElement("div", "title-line");
        stack.appendChild(line);
        container.appendChild(root);
      },
      update(frame) {
        const timings = options.slow
          ? {
              stackStart: 0,
              stackDuration: 40,
              logoStart: 8,
              logoDuration: 30,
              logoFloatStart: 34,
              logoFloatDuration: 24,
              mainStart: 24,
              mainDuration: 20,
              mainIdleStart: 40,
              mainIdleDuration: 24,
              subStart: 34,
              subDuration: 18,
              dateStart: 44,
              dateDuration: 18,
              lineStart: 54,
              lineDuration: 20
            }
          : {
              stackStart: 0,
              stackDuration: 24,
              logoStart: 4,
              logoDuration: 18,
              logoFloatStart: 20,
              logoFloatDuration: 18,
              mainStart: 12,
              mainDuration: 14,
              mainIdleStart: 24,
              mainIdleDuration: 18,
              subStart: 18,
              subDuration: 12,
              dateStart: 24,
              dateDuration: 12,
              lineStart: 28,
              lineDuration: 16
            };

        const stackReveal = easeOutCubic(normalize(frame, timings.stackStart, timings.stackDuration));
        stack.style.opacity = String(0.2 + stackReveal * 0.8);
        stack.style.transform = `translateY(${lerp(28, 0, stackReveal)}px) scale(${lerp(0.98, 1, stackReveal)})`;

        const logoReveal = easeOutBack(normalize(frame, timings.logoStart, timings.logoDuration));
        const logoFloat = normalize(frame, timings.logoFloatStart, timings.logoFloatDuration);
        const logoY = lerp(-82, 0, logoReveal) + Math.sin(frame * 0.03) * 6 * logoFloat;
        const logoScale = lerp(0.58, 1, logoReveal) + Math.sin(frame * 0.045) * 0.012 * logoFloat;
        const logoRotate = lerp(-16, 0, logoReveal) + Math.sin(frame * 0.028) * 1.4 * logoFloat;
        logo.style.opacity = String(clamp(logoReveal * 1.18, 0, 1));
        logo.style.transform = `translateY(${logoY}px) scale(${logoScale}) rotate(${logoRotate}deg)`;
        logo.style.filter = `drop-shadow(0 18px 30px rgba(0, 0, 0, 0.28)) drop-shadow(0 0 ${lerp(0, 18, logoReveal)}px rgba(255, 214, 133, ${0.12 + logoReveal * 0.14}))`;

        animatePop(mainTitle, frame, timings.mainStart, timings.mainDuration, { fromScale: 0.92, fromY: 46, fromRotate: -2.4, settleRotate: 0 });
        const mainIdle = normalize(frame, timings.mainIdleStart, timings.mainIdleDuration);
        mainTitle.style.transform += ` translateY(${Math.sin(frame * 0.032) * 4 * mainIdle}px)`;

        animatePop(subTitle, frame, timings.subStart, timings.subDuration, { fromScale: 0.94, fromY: 34, fromX: -16, fromRotate: -0.8 });
        const subReveal = normalize(frame, timings.subStart, timings.subDuration);
        subTitle.style.letterSpacing = `${lerp(0.22, 0.06, subReveal).toFixed(4)}em`;

        animatePop(dateLabel, frame, timings.dateStart, timings.dateDuration, { fromScale: 0.96, fromY: 24, fromX: 18, fromRotate: 0.8 });

        const lineReveal = easeOutCubic(normalize(frame, timings.lineStart, timings.lineDuration));
        line.style.opacity = String(0.08 + lineReveal * 0.92);
        line.style.transform = `scaleX(${lerp(0.1, 1, lineReveal)}) translateY(${lerp(12, 0, lineReveal)}px)`;
      }
    };
  }

  function createDiscordCtaScene() {
    let root;
    let safe;
    let panel;
    let icon;
    let button;

    return {
      totalFrames: 180,
      mount(container) {
        root = createElement("section", "scene");
        safe = createElement("div", "scene-safe");
        root.appendChild(safe);
        const layout = createElement("div", "cta-layout");
        safe.appendChild(layout);
        panel = createElement("div", "cta-panel");
        layout.appendChild(panel);
        icon = document.createElement("img");
        icon.className = "cta-icon";
        icon.src = "../assets/discord-min.png";
        icon.alt = "";
        panel.appendChild(icon);
        panel.appendChild(createElement("div", "cta-title", "Join Discord"));
        panel.appendChild(createElement("div", "cta-text", "Follow updates, brackets, schedule changes and match coordination."));
        button = createElement("div", "cta-button", "discord.gg/WWt2VUncCJ");
        panel.appendChild(button);
        container.appendChild(root);
      },
      update(frame) {
        animatePop(panel, frame, 6, 14, { fromScale: 0.84, fromY: 40, fromRotate: 0.8 });
        icon.style.transform = `translateY(${Math.sin(frame * 0.04) * 4}px) rotate(${Math.sin(frame * 0.03) * 3}deg)`;
        button.style.transform = `scale(${1 + Math.sin(frame * 0.035) * 0.015})`;
        button.style.opacity = String(0.2 + normalize(frame, 16, 14) * 0.8);
      }
    };
  }

  function createFinalCtaScene() {
    let root;
    let safe;
    let panel;
    let title;
    let line;
    let deadline;
    let badge;
    let innerLeaves = [];

    return {
      totalFrames: 180,
      mount(container) {
        root = createElement("section", "scene");
        safe = createElement("div", "scene-safe");
        root.appendChild(safe);

        const layout = createElement("div", "final-cta-layout");
        safe.appendChild(layout);

        panel = createElement("div", "final-cta-panel");
        layout.appendChild(panel);

        panel.appendChild(createElement("div", "final-cta-kicker", "Last Chance"));
        title = createElement("div", "final-cta-title", "Register Now");
        panel.appendChild(title);
        line = createElement("div", "final-cta-line");
        panel.appendChild(line);
        deadline = createElement("div", "final-cta-deadline", "Registration closes on");
        panel.appendChild(deadline);
        panel.appendChild(createElement("div", "final-cta-detail", "April 10 · 20:00 GMT"));
        badge = createElement("div", "final-cta-badge", "Do Not Miss The Deadline");
        panel.appendChild(badge);

        innerLeaves = [
          { src: "../spring_assets/leaves/leaves_green_mid2.png", width: 132, left: -8, top: 20, rotate: -24 },
          { src: "../spring_assets/leaves/leaves_pink_mid8.png", width: 118, right: -10, top: 34, rotate: 18 },
          { src: "../spring_assets/leaves/leaves_green_small5.png", width: 70, left: 128, bottom: 16, rotate: 18 },
          { src: "../spring_assets/leaves/leaves_pink_mid2.png", width: 104, right: 112, bottom: -10, rotate: -12 }
        ].map((config) => {
          const leaf = document.createElement("img");
          leaf.className = "final-cta-leaf";
          leaf.src = config.src;
          leaf.alt = "";
          leaf.style.width = `${config.width}px`;
          if (typeof config.left === "number") {
            leaf.style.left = `${config.left}px`;
          }
          if (typeof config.right === "number") {
            leaf.style.right = `${config.right}px`;
          }
          if (typeof config.top === "number") {
            leaf.style.top = `${config.top}px`;
          }
          if (typeof config.bottom === "number") {
            leaf.style.bottom = `${config.bottom}px`;
          }
          leaf.dataset.rotate = String(config.rotate);
          panel.appendChild(leaf);
          return leaf;
        });

        container.appendChild(root);
      },
      update(frame) {
        animatePop(panel, frame, 6, 14, { fromScale: 0.84, fromY: 40, fromRotate: 0.8 });
        title.style.transform = `translateY(${Math.sin(frame * 0.03) * 3}px)`;
        line.style.opacity = String(0.2 + normalize(frame, 14, 14) * 0.8);
        line.style.transform = `scaleX(${0.86 + normalize(frame, 14, 18) * 0.14})`;
        const deadlinePulse = 1 + Math.sin(frame * 0.05) * 0.018;
        deadline.style.transform = `scale(${deadlinePulse})`;
        badge.style.opacity = String(0.2 + normalize(frame, 20, 14) * 0.8);
        badge.style.transform = `scale(${0.96 + normalize(frame, 20, 14) * 0.04})`;

        innerLeaves.forEach((leaf, index) => {
          const baseRotate = Number(leaf.dataset.rotate || 0);
          const x = Math.sin(frame * 0.03 + index * 1.1) * 5;
          const y = Math.cos(frame * 0.028 + index * 1.4) * 4;
          const rotate = baseRotate + Math.sin(frame * 0.024 + index) * 4;
          const scale = 1 + Math.sin(frame * 0.02 + index) * 0.03;
          leaf.style.transform = `translate(${x}px, ${y}px) scale(${scale}) rotate(${rotate}deg)`;
        });
      }
    };
  }

  function setFrame(frame) {
    window.__FRAME__ = frame;
    activeScene.update(frame);
  }

  window.setFrame = setFrame;
  window.getSceneMeta = function () {
    return {
      scene: sceneName,
      fps: FPS,
      totalFrames: activeScene.totalFrames
    };
  };
})();
