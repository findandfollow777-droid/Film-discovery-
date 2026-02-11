// ============================================
// ALTERNATE UNIVERSE - Game Logic
// Orbit Games Suite - Weekly Casting Discussions
// ============================================

// Weekly scenarios - curated "what if" casting questions
const WEEKLY_SCENARIOS = [
  {
    title: "Tom Cruise was cast as Iron Man instead of Robert Downey Jr.?",
    context: "In 2008, Marvel was building its cinematic universe. Tom Cruise was reportedly considered for Tony Stark before the role went to RDJ, who defined the character.",
    original: { actor: "Robert Downey Jr.", role: "Tony Stark / Iron Man", movie: "Iron Man (2008)" },
    options: [
      { id: 500, name: "Tom Cruise", known: "Mission: Impossible" },
      { id: 287, name: "Brad Pitt", known: "Fight Club" },
      { id: 1461, name: "George Clooney", known: "Ocean's Eleven" },
      { id: 6968, name: "Hugh Jackman", known: "Wolverine" }
    ]
  },
  {
    title: "Will Smith accepted the role of Neo in The Matrix?",
    context: "Will Smith famously turned down Neo to star in Wild Wild West. Keanu Reeves took the role and created cinema history.",
    original: { actor: "Keanu Reeves", role: "Neo", movie: "The Matrix (1999)" },
    options: [
      { id: 2888, name: "Will Smith", known: "Men in Black" },
      { id: 500, name: "Tom Cruise", known: "Mission: Impossible" },
      { id: 287, name: "Brad Pitt", known: "Fight Club" },
      { id: 819, name: "Edward Norton", known: "Fight Club" }
    ]
  },
  {
    title: "Leonardo DiCaprio played Spider-Man in the 90s?",
    context: "James Cameron's unmade Spider-Man had Leonardo DiCaprio attached. The project never happened, but what if it did?",
    original: { actor: "Tobey Maguire", role: "Peter Parker", movie: "Spider-Man (2002)" },
    options: [
      { id: 6193, name: "Leonardo DiCaprio", known: "Titanic" },
      { id: 819, name: "Edward Norton", known: "Fight Club" },
      { id: 85, name: "Johnny Depp", known: "Edward Scissorhands" },
      { id: 1892, name: "Matt Damon", known: "Good Will Hunting" }
    ]
  },
  {
    title: "Al Pacino played Han Solo instead of Harrison Ford?",
    context: "Al Pacino was offered the role of Han Solo but turned it down. Harrison Ford, then a carpenter on set, got the part.",
    original: { actor: "Harrison Ford", role: "Han Solo", movie: "Star Wars (1977)" },
    options: [
      { id: 1158, name: "Al Pacino", known: "The Godfather" },
      { id: 3223, name: "Robert De Niro", known: "Taxi Driver" },
      { id: 4483, name: "Dustin Hoffman", known: "The Graduate" },
      { id: 6856, name: "Kurt Russell", known: "Escape from New York" }
    ]
  },
  {
    title: "Nicolas Cage was Superman in Tim Burton's film?",
    context: "Tim Burton's 'Superman Lives' nearly happened with Nicolas Cage in the cape. The film was cancelled weeks before shooting.",
    original: { actor: "Christopher Reeve", role: "Superman", movie: "Superman (1978)" },
    options: [
      { id: 2963, name: "Nicolas Cage", known: "Face/Off" },
      { id: 6968, name: "Hugh Jackman", known: "X-Men" },
      { id: 880, name: "Ben Affleck", known: "Batman v Superman" },
      { id: 73968, name: "Henry Cavill", known: "Man of Steel" }
    ]
  },
  {
    title: "Sandra Bullock played Neo in a gender-swapped Matrix?",
    context: "The Wachowskis originally wrote the role of Neo with a woman in mind, and Sandra Bullock was their first choice.",
    original: { actor: "Keanu Reeves", role: "Neo", movie: "The Matrix (1999)" },
    options: [
      { id: 18277, name: "Sandra Bullock", known: "Speed" },
      { id: 112, name: "Sigourney Weaver", known: "Alien" },
      { id: 3380, name: "Demi Moore", known: "G.I. Jane" },
      { id: 8944, name: "Jamie Lee Curtis", known: "True Lies" }
    ]
  },
  {
    title: "Sean Connery played Gandalf in Lord of the Rings?",
    context: "Peter Jackson offered Sean Connery the role of Gandalf, including 15% of box office. Connery declined, saying he didn't understand the material.",
    original: { actor: "Ian McKellen", role: "Gandalf", movie: "LOTR: Fellowship (2001)" },
    options: [
      { id: 738, name: "Sean Connery", known: "James Bond" },
      { id: 1758, name: "Anthony Hopkins", known: "Silence of the Lambs" },
      { id: 3392, name: "Michael Caine", known: "The Dark Knight" },
      { id: 1979, name: "Kevin Spacey", known: "The Usual Suspects" }
    ]
  },
  {
    title: "Molly Ringwald was cast as Vivian in Pretty Woman?",
    context: "The role of Vivian was offered to multiple actresses including Molly Ringwald before Julia Roberts made it iconic.",
    original: { actor: "Julia Roberts", role: "Vivian Ward", movie: "Pretty Woman (1990)" },
    options: [
      { id: 5588, name: "Molly Ringwald", known: "Sixteen Candles" },
      { id: 18277, name: "Sandra Bullock", known: "Speed" },
      { id: 5064, name: "Meryl Streep", known: "Sophie's Choice" },
      { id: 3380, name: "Demi Moore", known: "Ghost" }
    ]
  }
];

// Game state
let gameState = {
  weekNumber: 1,
  scenario: null,
  selectedOption: null,
  hasVoted: false,
  votes: {},
  comments: []
};

// Simulated community data (would be server-side in production)
let communityData = {
  votes: {},
  totalVotes: 0,
  comments: []
};

// DOM Elements
let weekNumber, scenarioTitle, scenarioContext, originalCast, originalInfo;
let optionsGrid, resultsChart, totalVotes;
let discussionList;

// ============================================
// INITIALIZATION
// ============================================

document.addEventListener("DOMContentLoaded", () => {
  cacheElements();
  setupEventListeners();
  loadWeeklyScenario();
});

function cacheElements() {
  weekNumber = document.getElementById("weekNumber");
  scenarioTitle = document.getElementById("scenarioTitle");
  scenarioContext = document.getElementById("scenarioContext");
  originalCast = document.getElementById("originalCast");
  originalInfo = document.getElementById("originalInfo");
  optionsGrid = document.getElementById("optionsGrid");
  resultsChart = document.getElementById("resultsChart");
  totalVotes = document.getElementById("totalVotes");
  discussionList = document.getElementById("discussionList");
}

function setupEventListeners() {
  // Custom suggestion
  document.getElementById("customSubmit").addEventListener("click", handleCustomSuggestion);
  document.getElementById("customInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleCustomSuggestion();
  });
  
  // Comment submission
  document.getElementById("commentSubmit").addEventListener("click", handleComment);
  document.getElementById("commentInput").addEventListener("keypress", (e) => {
    if (e.key === "Enter") handleComment();
  });
  
  // Help modal
  document.getElementById("helpBtn").addEventListener("click", () => {
    document.getElementById("helpModal").hidden = false;
  });
  document.getElementById("helpClose").addEventListener("click", () => {
    document.getElementById("helpModal").hidden = true;
  });
  
  // Close modals on overlay click
  document.querySelectorAll(".modal-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) overlay.hidden = true;
    });
  });
}

// ============================================
// SCENARIO LOADING
// ============================================

function getWeekNumber() {
  const launchDate = new Date("2025-01-06"); // First Monday of 2025
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const weekNum = Math.floor((today - launchDate) / (1000 * 60 * 60 * 24 * 7));
  return Math.max(0, weekNum) % WEEKLY_SCENARIOS.length;
}

async function loadWeeklyScenario() {
  const weekIndex = getWeekNumber();
  const scenario = WEEKLY_SCENARIOS[weekIndex];
  
  gameState.weekNumber = weekIndex + 1;
  gameState.scenario = scenario;
  
  weekNumber.textContent = gameState.weekNumber;
  scenarioTitle.textContent = scenario.title;
  scenarioContext.textContent = scenario.context;
  originalCast.textContent = `${scenario.original.actor} as ${scenario.original.role} in ${scenario.original.movie}`;
  
  // Load options
  await loadOptions(scenario.options);
  
  // Load saved state
  loadSavedState();
  
  // Load simulated community data
  loadCommunityData();
  
  // Load comments
  loadComments();
  
  // Start countdown
  startCountdown();
}

async function loadOptions(options) {
  // Fetch photos for all options with name validation
  const optionsWithPhotos = await Promise.all(options.map(async (opt) => {
    try {
      const { person } = await resolvePersonId(opt.id, opt.name);
      return {
        ...opt,
        photo: person && person.profile_path ? `${TMDB_IMG}w185${person.profile_path}` : ""
      };
    } catch {
      return { ...opt, photo: "" };
    }
  }));

  renderOptions(optionsWithPhotos);
}

function renderOptions(options) {
  optionsGrid.innerHTML = options.map(opt => `
    <div class="option-card" data-id="${opt.id}" data-name="${opt.name}">
      <img class="option-photo" src="${opt.photo}" alt="${opt.name}">
      <div class="option-info">
        <div class="option-name">${opt.name}</div>
        <div class="option-known">${opt.known}</div>
      </div>
      <div class="option-check">✓</div>
    </div>
  `).join("");
  
  // Add click handlers
  optionsGrid.querySelectorAll(".option-card").forEach(card => {
    card.addEventListener("click", () => handleVote(card));
  });
}

// ============================================
// VOTING
// ============================================

function handleVote(card) {
  if (gameState.hasVoted) return;
  
  const actorId = card.dataset.id;
  const actorName = card.dataset.name;
  
  // Visual feedback
  optionsGrid.querySelectorAll(".option-card").forEach(c => c.classList.remove("selected"));
  card.classList.add("selected");
  
  // Record vote
  gameState.selectedOption = actorId;
  gameState.hasVoted = true;
  
  // Update community data
  communityData.votes[actorId] = (communityData.votes[actorId] || 0) + 1;
  communityData.totalVotes++;
  
  // Show toast
  showVoteToast();
  
  // Save state
  saveState();
  
  // Update results
  updateResults();
}

function handleCustomSuggestion() {
  const input = document.getElementById("customInput");
  const suggestion = input.value.trim();
  
  if (!suggestion || gameState.hasVoted) return;
  
  // Record custom vote
  gameState.selectedOption = "custom:" + suggestion;
  gameState.hasVoted = true;
  
  communityData.votes["custom:" + suggestion] = (communityData.votes["custom:" + suggestion] || 0) + 1;
  communityData.totalVotes++;
  
  input.value = "";
  
  showVoteToast();
  saveState();
  updateResults();
}

function showVoteToast() {
  const toast = document.getElementById("voteToast");
  toast.hidden = false;
  
  setTimeout(() => {
    toast.hidden = true;
  }, 2000);
}

function updateResults() {
  // Sort by votes
  const sorted = Object.entries(communityData.votes)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5);
  
  const maxVotes = sorted[0]?.[1] || 1;
  
  resultsChart.innerHTML = sorted.map(([id, votes]) => {
    const percentage = Math.round((votes / communityData.totalVotes) * 100);
    const width = (votes / maxVotes) * 100;
    
    // Get name
    let name;
    if (id.startsWith("custom:")) {
      name = id.replace("custom:", "");
    } else {
      const option = gameState.scenario.options.find(o => o.id == id);
      name = option ? option.name : "Unknown";
    }
    
    return `
      <div class="result-bar">
        <span class="result-name">${name}</span>
        <div class="result-bar-wrap">
          <div class="result-bar-fill" style="width: ${width}%">
            <span class="result-percent">${percentage}%</span>
          </div>
        </div>
      </div>
    `;
  }).join("");
  
  totalVotes.textContent = communityData.totalVotes;

  // Enable clickable links after voting
  if (gameState.hasVoted) {
    enablePostGameLinks();
  }
}

function enablePostGameLinks() {
  // Make option cards clickable → timeline
  document.querySelectorAll('.option-card').forEach(card => {
    const actorId = card.dataset.id;
    const actorName = card.dataset.name;
    if (actorId && actorName) {
      card.style.position = 'relative';
      // Add hint if not already present
      if (!card.querySelector('.explore-hint')) {
        const hint = document.createElement('div');
        hint.className = 'explore-hint';
        hint.textContent = '→ TIMELINE';
        card.appendChild(hint);
      }
      // Remove old vote handler by adding a new overlay
      if (!card.querySelector('.clickable-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'clickable-overlay';
        overlay.addEventListener('click', (e) => {
          e.stopPropagation();
          window.location.href = `timeline.html?id=${actorId}&name=${encodeURIComponent(actorName)}`;
        });
        card.appendChild(overlay);
        card.classList.add('voted');
      }
    }
  });

  // Make result bar names clickable → timeline
  document.querySelectorAll('.result-bar').forEach(bar => {
    const nameEl = bar.querySelector('.result-name');
    if (!nameEl) return;
    const name = nameEl.textContent.trim();
    // Find matching option by name
    const option = gameState.scenario.options.find(o => o.name === name);
    if (option) {
      bar.classList.add('clickable-actor');
      bar.addEventListener('click', () => {
        window.location.href = `timeline.html?id=${option.id}&name=${encodeURIComponent(option.name)}`;
      });
    }
  });
}

// ============================================
// COMMENTS / DISCUSSION
// ============================================

function handleComment() {
  const input = document.getElementById("commentInput");
  const text = input.value.trim();
  
  if (!text) return;
  
  const comment = {
    id: Date.now(),
    author: "You",
    text: text,
    time: "Just now",
    likes: 0
  };
  
  communityData.comments.unshift(comment);
  input.value = "";
  
  saveComments();
  renderComments();
}

function loadComments() {
  // Load saved comments from localStorage
  const saved = localStorage.getItem(`alternate_comments_${gameState.weekNumber}`);
  if (saved) {
    communityData.comments = JSON.parse(saved);
  } else {
    // Add some starter comments
    communityData.comments = [
      {
        id: 1,
        author: "CinemaFan42",
        text: "This would have changed everything! Can't imagine anyone else in the role now.",
        time: "2 hours ago",
        likes: 12
      },
      {
        id: 2,
        author: "MovieBuff",
        text: "Actually, I think the alternate casting might have worked in a different way. Different energy, but still compelling.",
        time: "5 hours ago",
        likes: 8
      },
      {
        id: 3,
        author: "FilmCritic",
        text: "The chemistry would have been completely different. Interesting to think about!",
        time: "1 day ago",
        likes: 15
      }
    ];
  }
  
  renderComments();
}

function saveComments() {
  localStorage.setItem(`alternate_comments_${gameState.weekNumber}`, JSON.stringify(communityData.comments));
}

function renderComments() {
  discussionList.innerHTML = communityData.comments.slice(0, 10).map(comment => `
    <div class="discussion-item" data-id="${comment.id}">
      <div class="discussion-header">
        <span class="discussion-author">${comment.author}</span>
        <span class="discussion-time">${comment.time}</span>
      </div>
      <p class="discussion-text">${comment.text}</p>
      <div class="discussion-actions">
        <button class="discussion-action like-btn" data-id="${comment.id}">
          ❤️ ${comment.likes}
        </button>
        <button class="discussion-action">Reply</button>
      </div>
    </div>
  `).join("");
  
  // Add like handlers
  discussionList.querySelectorAll(".like-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = parseInt(btn.dataset.id);
      const comment = communityData.comments.find(c => c.id === id);
      if (comment) {
        comment.likes++;
        saveComments();
        renderComments();
      }
    });
  });
}

// ============================================
// STATE MANAGEMENT
// ============================================

function loadSavedState() {
  const key = `alternate_state_${gameState.weekNumber}`;
  const saved = localStorage.getItem(key);
  
  if (saved) {
    const state = JSON.parse(saved);
    gameState.hasVoted = state.hasVoted;
    gameState.selectedOption = state.selectedOption;
    
    if (state.selectedOption) {
      const card = optionsGrid.querySelector(`[data-id="${state.selectedOption}"]`);
      if (card) card.classList.add("selected");
    }
  }
}

function saveState() {
  const key = `alternate_state_${gameState.weekNumber}`;
  localStorage.setItem(key, JSON.stringify({
    hasVoted: gameState.hasVoted,
    selectedOption: gameState.selectedOption
  }));
}

function loadCommunityData() {
  // In a real app, this would come from a server
  // For now, simulate with localStorage + random seed based on week
  const key = `alternate_community_${gameState.weekNumber}`;
  const saved = localStorage.getItem(key);
  
  if (saved) {
    communityData = JSON.parse(saved);
  } else {
    // Generate simulated starting data
    const options = gameState.scenario.options;
    const baseVotes = [45, 30, 15, 10]; // Distribution
    
    options.forEach((opt, i) => {
      communityData.votes[opt.id] = baseVotes[i] + Math.floor(Math.random() * 20);
      communityData.totalVotes += communityData.votes[opt.id];
    });
    
    // Save for consistency
    localStorage.setItem(key, JSON.stringify(communityData));
  }
  
  updateResults();
}

// ============================================
// COUNTDOWN
// ============================================

function startCountdown() {
  const countdownTimer = document.getElementById("countdownTimer");
  
  function update() {
    const now = new Date();
    
    // Find next Monday midnight
    const nextMonday = new Date(now);
    nextMonday.setDate(now.getDate() + ((1 + 7 - now.getDay()) % 7 || 7));
    nextMonday.setHours(0, 0, 0, 0);
    
    const diff = nextMonday - now;
    
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    countdownTimer.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
  }
  
  update();
  setInterval(update, 1000);
}