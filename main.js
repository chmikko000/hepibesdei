// THE CODE
const SKIP_LOCKSCREEN_FOR_DEBUG = false;
const CORRECT_CODE = "050226";

// MAIN APP FUNCTIONS



const extraNames = ["Angel", "Theris", "Ray", "Tristan", "Orrick", "Jason"];

const lockscreen = document.getElementById("lockscreen");
const home = document.getElementById("home");
const messagesWindow = document.getElementById("messages-window");
const bibleWindow = document.getElementById("bible-window");
const nameTrack1 = document.getElementById("name-track-1");
const nameTrack2 = document.getElementById("name-track-2");
const bibleVerseEl = document.getElementById("bible-verse");
const biblePassageEl = document.getElementById("bible-passage");
const mainPhoto = document.getElementById("main-photo");

const messagesBtn = document.getElementById("open-messages-btn");
const messagesIcon = document.getElementById("messages-icon");
const bibleBtn = document.getElementById("open-bible-btn");
const playBtn = document.getElementById("play-btn");
const audioPlayer = document.getElementById("audio-player");
const audioProgress = document.getElementById("audio-progress");
const audioTime = document.getElementById("audio-time");

let messagesOpen = false;
let bibleOpen = false;
let bibleVerses = [];
let lastBibleIndex = -1;

const dingAudio = new Audio("assets/audio/hepibesdei.wav");
dingAudio.preload = "auto";
let audioRafId = null;

if (mainPhoto) {
  const openSrc = "assets/icons/cat-open.png";
  const closeSrc = "assets/icons/cat-close.png";

  const blink = () => {
    mainPhoto.src = closeSrc;
    setTimeout(() => {
      mainPhoto.src = openSrc;
      const nextBlink = 2000 + Math.random() * 2300;
      setTimeout(blink, nextBlink);
    }, 180);
  };

  const firstBlink = 1500 + Math.random() * 2000;
  setTimeout(blink, firstBlink);
}

// lockscreen.classList.add("hidden");
// home.classList.remove("hidden");

function showHomeInstant() {
  lockscreen.classList.add("hidden");
  home.classList.remove("hidden");
}

function showLockscreenInstant() {
  home.classList.add("hidden");
  lockscreen.classList.remove("hidden");
}

// Start screen (allows skipping lockscreen for debugging).
if (SKIP_LOCKSCREEN_FOR_DEBUG) {
  showHomeInstant();
} else {
  showLockscreenInstant();
}

messagesBtn.onclick = () => {
  const willOpen = !messagesOpen;
  if (willOpen) {
    bibleOpen = false;
    bibleWindow.classList.remove("is-open");
  }

  messagesOpen = willOpen;
  messagesWindow.classList.toggle("is-open", messagesOpen);

  updateMessagesIcon();
};

bibleBtn.onclick = () => {
  const willOpen = !bibleOpen;
  if (willOpen) {
    messagesOpen = false;
    messagesWindow.classList.remove("is-open");
    updateMessagesIcon();
  }

  bibleOpen = willOpen;
  bibleWindow.classList.toggle("is-open", bibleOpen);
  if (bibleOpen) {
    showRandomBibleVerse();
  }
};

function formatTime(seconds) {
  if (!Number.isFinite(seconds) || seconds <= 0) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
  return `${mins}:${secs}`;
}

function updateAudioUI() {
  if (!audioProgress || !audioTime) return;
  const duration = dingAudio.duration || 0;
  const current = dingAudio.currentTime || 0;
  const percent = duration ? (current / duration) * 100 : 0;

  audioProgress.style.width = `${percent}%`;
  audioTime.textContent = `${formatTime(current)} / ${formatTime(duration)}`;
}

function stopAudioTracking() {
  if (audioRafId) {
    cancelAnimationFrame(audioRafId);
    audioRafId = null;
  }
}

let fadeTimer = null;
function hideAudioPlayerWithFade() {
  if (!audioPlayer) return;
  if (fadeTimer) {
    clearTimeout(fadeTimer);
    fadeTimer = null;
  }
  audioPlayer.classList.add("is-fading");
  fadeTimer = setTimeout(() => {
    audioPlayer.classList.add("hidden");
    audioPlayer.classList.remove("is-fading");
    fadeTimer = null;
  }, 300);
}

function trackAudioProgress() {
  updateAudioUI();
  if (!dingAudio.paused && !dingAudio.ended) {
    audioRafId = requestAnimationFrame(trackAudioProgress);
  }
}

if (playBtn) {
  playBtn.onclick = () => {
    if (audioPlayer) {
      if (fadeTimer) {
        clearTimeout(fadeTimer);
        fadeTimer = null;
      }
      audioPlayer.classList.remove("hidden");
      audioPlayer.classList.remove("is-fading");
    }
    dingAudio.currentTime = 0;
    dingAudio.play();
    stopAudioTracking();
    trackAudioProgress();
  };
}

dingAudio.addEventListener("loadedmetadata", updateAudioUI);
dingAudio.addEventListener("ended", () => {
  stopAudioTracking();
  updateAudioUI();
  hideAudioPlayerWithFade();
});

// PASSWORD INPUT

const realInput = document.getElementById("real-password");
const boxes = document.querySelectorAll(".box");

document.getElementById("fake-input").onclick = () => {
  realInput.focus();
};

    // DATA VALIDATION FOR PASSWORD
    
    document.getElementById("unlock-btn").onclick = () => {
    if (realInput.value === CORRECT_CODE) {
        // correct → unlock
        localStorage.setItem("unlocked", "true");
        showHomeInstant();
    } else {
        shakeBoxes();
    }
    };

    // HINT FUNCTION
    const hintBtn = document.getElementById("hint-btn");
    const hintText = document.getElementById("hint-text");

    hintBtn.onclick = () => {
    const isHidden = hintText.classList.toggle("hidden");
    hintBtn.textContent = isHidden ? "Hint" : "Hide";
    hintBtn.classList.toggle("shifted", !isHidden);
    };


    // DISABLE OR ENABLE UNLOCK BUTTON
    const unlockBtn = document.getElementById("unlock-btn");
    unlockBtn.classList.add("unlock-hidden");
    unlockBtn.classList.remove("unlock-visible");

    realInput.addEventListener("input", () => {
    realInput.value = realInput.value.replace(/\D/g, "");
    const value = realInput.value;

    boxes.forEach((box, index) => {
        box.textContent = value[index] ?? "";
    });

    unlockBtn.disabled = value.length !== CORRECT_CODE.length;
    const isCorrect = value === CORRECT_CODE;
    unlockBtn.classList.toggle("unlock-hidden", !isCorrect);
    unlockBtn.classList.toggle("unlock-visible", isCorrect);

    boxes.forEach((box, index) => {
        const isActive = value.length < CORRECT_CODE.length && index === value.length;
        box.classList.toggle("active", isActive);
    });
    });

    // ERROR ALERT
    function shakeBoxes() {
    boxes.forEach(box => {
        box.classList.add("error");
        setTimeout(() => box.classList.remove("error"), 300);
    });
}


// MESSAGE WINDOW
document.getElementById("x-btn").onclick = () => {
  messagesOpen = false;
  messagesWindow.classList.remove("is-open");
  updateMessagesIcon();
};

document.getElementById("bible-x-btn").onclick = () => {
  bibleOpen = false;
  bibleWindow.classList.remove("is-open");
};

// BIBLE VERSES

fetch("bible.json")
  .then(res => res.json())
  .then(data => {
    bibleVerses = data;
    showRandomBibleVerse();
  })
  .catch(() => {
    if (bibleVerseEl) {
      bibleVerseEl.textContent = "Unable to load verse.";
    }
  });

function showRandomBibleVerse() {
  if (!bibleVerseEl) return;
  if (!bibleVerses || bibleVerses.length === 0) {
    bibleVerseEl.textContent = "No verses available.";
    if (biblePassageEl) {
      biblePassageEl.textContent = "";
    }
    return;
  }

  let randomIndex = Math.floor(Math.random() * bibleVerses.length);
  if (bibleVerses.length > 1) {
    while (randomIndex === lastBibleIndex) {
      randomIndex = Math.floor(Math.random() * bibleVerses.length);
    }
  }
  lastBibleIndex = randomIndex;
  const verse = bibleVerses[randomIndex];
  if (biblePassageEl) {
    biblePassageEl.textContent = verse?.passage ?? "No passage.";
  }
  bibleVerseEl.textContent = verse?.verse ?? "No verse text.";
}

let messages = [];

const grid = document.getElementById("messages-grid");
const READ_STORAGE_KEY = "readMessageIds";

function loadReadMessageIds() {
  try {
    const raw = localStorage.getItem(READ_STORAGE_KEY);
    const parsed = raw ? JSON.parse(raw) : [];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReadMessageIds(ids) {
  localStorage.setItem(READ_STORAGE_KEY, JSON.stringify(ids));
}

fetch("messages.json")
  .then(res => res.json())
  .then(data => {
    const readIds = new Set(loadReadMessageIds());
    messages = data.map(msg => ({
      ...msg,
      read: readIds.has(msg.id) || msg.read,
    }));
    renderMessagesGrid();
    updateUnreadCount();

    const messageNames = messages.map(msg => msg.author);
    updateFromMarquee([...messageNames, ...extraNames]);
  });

const reader = document.getElementById("message-reader");
const readerAuthor = document.getElementById("reader-author");
const readerContent = document.getElementById("reader-content");
const keywordContainer = document.getElementById("keyword-container");
const keywordInput = document.getElementById("keyword-input");

function normalizeKey(key) {
  return (key || "").toUpperCase().replace(/[^A-Z]/g, "");
}

function decryptVigenere(cipherText, key) {
  const cleanKey = normalizeKey(key);
  if (!cleanKey) return cipherText;

  let keyIndex = 0;
  let result = "";
  for (let i = 0; i < cipherText.length; i++) {
    const char = cipherText[i];
    const code = char.charCodeAt(0);
    const isUpper = code >= 65 && code <= 90;
    const isLower = code >= 97 && code <= 122;

    if (!isUpper && !isLower) {
      result += char;
      continue;
    }

    const base = isUpper ? 65 : 97;
    const keyShift = cleanKey.charCodeAt(keyIndex % cleanKey.length) - 65;
    const normalized = code - base;
    const decoded = (normalized - keyShift + 26) % 26;
    result += String.fromCharCode(decoded + base);
    keyIndex += 1;
  }
  return result;
}

function openMessage(msg) {
  grid.classList.add("hidden");
  reader.classList.remove("hidden");

  readerAuthor.textContent = msg.author;
  if (msg.encrypted && keywordContainer && keywordInput) {
    keywordContainer.classList.remove("hidden");
    keywordInput.value = "";
    readerContent.textContent = msg.message;
    keywordInput.oninput = () => {
      readerContent.textContent = decryptVigenere(msg.message, keywordInput.value);
    };
  } else {
    if (keywordContainer) {
      keywordContainer.classList.add("hidden");
    }
    if (keywordInput) {
      keywordInput.oninput = null;
    }
    readerContent.textContent = msg.message;
  }

  msg.read = true;
  const readIds = new Set(loadReadMessageIds());
  readIds.add(msg.id);
  saveReadMessageIds(Array.from(readIds));

  updateUnreadCount();
}

document.getElementById("back-to-grid").onclick = () => {
  reader.classList.add("hidden");
  grid.classList.remove("hidden");
  renderMessagesGrid(); 
};

// QOL MESSAGES

const unreadCountEl = document.getElementById("unread-count");

function updateUnreadCount() {
  const unreadCount = messages.filter(msg => !msg.read).length;
  if (unreadCount === 0) {
    unreadCountEl.textContent = "You have read all messages";
  } else {
    unreadCountEl.textContent = `You have ${unreadCount} unread messages`;
  }
}

function renderMessagesGrid() {
  grid.innerHTML = "";

  messages.forEach(msg => {
    const item = document.createElement("div");
    item.classList.add("message-item");

    if (msg.read) {
      item.classList.add("read");
    } else {
      item.classList.add("unread");
    }

    item.innerHTML = `
      <div class="avatar"></div>
      <span>${msg.author}</span>
    `;

    item.onclick = () => openMessage(msg);
    grid.appendChild(item);
  });
}

function updateFromMarquee(names) {
  const safeNames = names && names.length ? Array.from(new Set(names)) : ["Someone"];
  if (safeNames.length === 1) {
    safeNames.push(safeNames[0]);
  }

  const content = safeNames
    .map(name => `<span class="from-name">${name}</span>`)
    .join("");

  if (nameTrack1) {
    nameTrack1.innerHTML = content;
  }
  if (nameTrack2) {
    nameTrack2.innerHTML = content;
  }
}

// MESSAGES ICON


function updateMessagesIcon() {
  if (messagesOpen) {
    messagesIcon.src = "assets/icons/letter_open.png";
  } else {
    messagesIcon.src = "assets/icons/letter_close.png";
  }
}

messagesBtn.addEventListener("mouseenter", () => {
  if (messagesOpen) {
    updateMessagesIcon(true);
  }
});

messagesBtn.addEventListener("mouseleave", () => {
  updateMessagesIcon(false);
});
