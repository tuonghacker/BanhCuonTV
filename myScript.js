const gameMap = new Map(); // id → element

function updateGameElement(el, game) {
  const vnTime = new Date(game.datetime).toLocaleTimeString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit"
  });

  el.querySelector(".time").textContent = vnTime;

  el.querySelector(".name-home").textContent = game.home_team.full_name;
  el.querySelector(".name-away").textContent = game.visitor_team.full_name;

  el.querySelector(".logo-home").src =
    `https://a.espncdn.com/i/teamlogos/nba/500/${game.home_team.abbreviation.toLowerCase()}.png`;

  el.querySelector(".logo-away").src =
    `https://a.espncdn.com/i/teamlogos/nba/500/${game.visitor_team.abbreviation.toLowerCase()}.png`;

  const score = game.period == 0
    ? "Sắp diễn ra"
    : `${game.home_team_score} - ${game.visitor_team_score}`;

  el.querySelector(".score").textContent = score;
}
///////////
function initialRender(data) {
  // console.log(123);
  const container = document.getElementById("Result");
  const template = document.getElementById("game-template");

  container.innerHTML = "";
  gameMap.clear();

  data.data.forEach(game => {
    const clone = template.content.cloneNode(true);
    const el = clone.querySelector(".game-card");

    el.dataset.id = game.id;
    // 
    console.log(game.home_team_score);
    // 
    // set dữ liệu ban đầu
    updateGameElement(el, game);

    container.appendChild(clone);
    gameMap.set(game.id, el); // 🔥 lưu lại
  });
}

function updateGames(data) {
  data.data.forEach(game => {
    const el = gameMap.get(game.id);

    if (el) {
      updateGameElement(el, game); // 🔥 chỉ update số
    }
  });
}

function formatDate(date) {
    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0");
} 

// Date
const today = new Date();

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
//fsdf
const y = formatDate(yesterday);
const t = formatDate(today);
const tm = formatDate(tomorrow);

console.log("Yesterday:", y);
console.log("Today:", t);
console.log("Tomorrow:", tm);

function loadGames(first = false) {
  fetch(`https://api.balldontlie.io/v1/games?dates[]=${y}&dates[]=${t}&dates[]=${tm}`, {
    headers: { Authorization: "fc0fc756-6f9c-426e-86ba-c5c47fcd4ed2" }
  })
  .then(res => res.json())
  .then(data => {
    console.log("loading");
    if (first) initialRender(data);
    else updateGames(data);
  });
}

// lần đầu
loadGames(true);

// mỗi 10s
setInterval(() => {
  if (!document.hidden) {
    loadGames(false);
  }
}, 10000);