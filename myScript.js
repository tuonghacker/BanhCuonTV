const gameMap = new Map(); // id → element

// Cập nhật ảnh, tỉ số
function updateGameElement(el, game) {
  const date = new Date(game.datetime);
  // // ⏰ giờ phút (dòng trên)
  const time = date.toLocaleTimeString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    hour: "2-digit",
    minute: "2-digit"
  });
  // 📅 ngày tháng (dòng dưới)
  const day = date.toLocaleDateString("vi-VN", {
    timeZone: "Asia/Ho_Chi_Minh",
    day: "2-digit",
    month: "2-digit"
  });
  // // gán vào HTML
  el.querySelector(".time").textContent = time;
  el.querySelector(".date").textContent = day;
  // // debug
  // console.log(time, day);
   
  // console.log(day);

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

function Card_loadComments(gameId, card) {
  const box = card.querySelector(".Game-comments");

  if (!card.last_cmt) card.last_cmt = 0;

  fetch(`http://localhost:3000/game_comments?gameId=${gameId}`)
    .then(res => res.json())
    .then(data => {
      data.reverse().forEach(cmt => {
        if (cmt.id > card.last_cmt) {
          box.innerHTML += `
            <div class="Game-cmt">
              <b>${cmt.username}</b>: ${cmt.content}
            </div>
          `;
          card.last_cmt = cmt.id;
        }
      });
    });
}
function startAutoLoadComments(gameId, card) {
  // load ngay lần đầu
  Card_loadComments(gameId, card);

  // mỗi 3 giây load lại
  setInterval(() => {
    Card_loadComments(gameId, card);
  }, 3000); // 3000ms = 3s
}
function Card_sendComment(gameId, card) {
  const username = card.querySelector(".username").value;
  const content = card.querySelector(".content").value;

  if (!username || !content) {
    alert("Nhập thiếu!");
    return;
  }

  fetch("http://localhost:3000/game_comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      gameId,
      username,
      content
    })
  })
  .then(() => {
    // clear input
    card.querySelector(".content").value = "";

    // reload comment
    loadComments(gameId, card);
  });
}

/////////// Chèn lần đầu
function initialRender(data) {
  // console.log(123);
  const container = document.getElementById("Result");
  const template = document.getElementById("game-template");

  // container.innerHTML = "";
  // gameMap.clear();
  data.data.sort((a, b) => {
    return new Date(b.datetime) - new Date(a.datetime);
  });

  

  data.data.forEach(game => {
    const clone = template.content.cloneNode(true);
    const el = clone.querySelector(".card");

    console.log(game.datetime);
    el.dataset.id = game.id;
    // 
    // 
    // set dữ liệu ban đầu
    updateGameElement(el, game);

    ///// Comment
      // 🔥 load comment cho trận này
      startAutoLoadComments(game.id, el);

      

      // // 🔥 gắn nút gửi
      const btn = el.querySelector(".send-btn");
      btn.addEventListener("click", () => {
        console.log("Send cmt at ", game.id);
        Card_sendComment(game.id, el);
      });
      console.log("Finish ", game.id);
    //////////

    container.prepend(clone);
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


function loadGames(first = false, t) {
  return fetch(`https://api.balldontlie.io/v1/games?dates[]=${t}`, {
    headers: { Authorization: "fc0fc756-6f9c-426e-86ba-c5c47fcd4ed2" }
  })
  .then(res => res.json())
  .then(data => {
    console.log("loading");
    if (first) initialRender(data);
    else updateGames(data);
  });
}

function FirstloadGames(first = false) {
  fetch(`https://api.balldontlie.io/v1/games?dates[]=${tm}&dates[]=${t}&dates[]=${y}`, {
    headers: { Authorization: "fc0fc756-6f9c-426e-86ba-c5c47fcd4ed2" }
  })
  .then(res => res.json())
  .then(data => {
    console.log("loading");
    if (first) initialRender(data);
    else updateGames(data);
  });
}



// Chuẩn hóa ngày
function formatDate(date) {
    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0");
} 

// Date




//   for (let i = days_ago; i <= 1; i++){
//     current_day.setDate(today.getDate() + i);
//     loadGames(true, formatDate(current_day));
//     console.log("Date: ", i,": ", formatDate(current_day));
//   }
// async function run() {
//   for (let i = -1; i <= days_ago; i++){
//     let d = new Date(today);
//     d.setDate(today.getDate() - i);

//     await loadGames(true, formatDate(d)); // 👈 chờ
//   }
// }
// run();

async function loadOlder() {
  // ⬅️ lùi 1 ngày
  days_ago++;
  let old_date = new Date(today);
  old_date.setDate(today.getDate()-days_ago);
  // loadGames(true, formatDate(d));

  const d = formatDate(old_date);

  console.log("Load ngày:", d);

  await loadGames(true, d); // 👈 gọi API
}
////////////////////////////////////////////////////////
const today = new Date();
let days_ago = 1;

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);
//fsdf
const y = formatDate(yesterday);
const t = formatDate(today);
const tm = formatDate(tomorrow);
FirstloadGames(true);

console.log("Yesterday:", y);
console.log("Today:", t);
console.log("Tomorrow:", tm);

// mỗi 10s
setInterval(() => {
  if (!document.hidden) {
    loadGames(false, t);
  }
}, 10000);