// const today = new Date();
// const date =
//   today.getFullYear() + "-" +
//   String(today.getMonth() + 1).padStart(2, "0") + "-" +
//   String(today.getDate()).padStart(2, "0");

// console.log(date);

// fetch(`https://api.balldontlie.io/v1/games?dates[]=${date}`, {
//     headers: {
//         Authorization: "fc0fc756-6f9c-426e-86ba-c5c47fcd4ed2"
//     }
// })
//     .then(function(response) {
//         return response.json();
//     })
//     .then(function(data) {
//         data.data.forEach(function(game) {
//             console.log(game.home_team_score +" "+ game.home_team.full_name + ' vs ' + game.visitor_team.full_name);
//             console.log(game.period);
//         });
//     });

function formatDate(date) {
    return date.getFullYear() + "-" +
        String(date.getMonth() + 1).padStart(2, "0") + "-" +
        String(date.getDate()).padStart(2, "0");
} 

const today = new Date();

const yesterday = new Date();
yesterday.setDate(today.getDate() - 1);

const tomorrow = new Date();
tomorrow.setDate(today.getDate() + 1);

const y = formatDate(yesterday);
const t = formatDate(today);
const tm = formatDate(tomorrow);

console.log("Yesterday:", y);
console.log("Today:", t);
console.log("Tomorrow:", tm);


// fetch(`https://api.balldontlie.io/v1/games?dates[]=${y}&dates[]=${t}&dates[]=${tm}`, {
fetch(`https://api.balldontlie.io/v1/games?dates[]=${y}&dates[]=${t}`, {
// fetch(`https://api.balldontlie.io/v1/games?dates[]=${t}`, {
    headers: {
        Authorization: "fc0fc756-6f9c-426e-86ba-c5c47fcd4ed2"
    }
})
    .then(function(response) {
        return response.json();
    })
    .then(function(data) {
        data.data.forEach(function(game) {
            // console.log(game.home_team_score +" "+ game.home_team.full_name + ' vs ' + game.visitor_team.full_name);
            // console.log(game.period);
            
            function tiso(game){
                if (game.period == 0) return "Sắp diễn ra";
                    return `${game.home_team_score} - ${game.visitor_team_score}`;
            }

            const home = Math.floor(Number(Math.random()*100));
            const away = 100-home;

            const barHTML = `
            <div class="win-bar">
                <div style="display:flex; height:100%;">
                <div class="win-fill-home" style="width:${home}%"></div>
                <div class="win-fill-away" style="width:${away}%"></div>
                </div>
            </div>

            <div class="win-text">
                <span>${home}%</span>
                <span>${away}%</span>
            </div>
            `;
            // let Score;
            // if (game.period==0) Score="Sắp diễn ra"; 
            //     else Score=game.home_team_score+"-"+game.visitor_team_score;

            const vnTime = new Date(game.datetime).toLocaleString("vi-VN", {
            timeZone: "Asia/Ho_Chi_Minh"
            });
            console.log(vnTime);

            document.getElementById("Result").innerHTML+=`
                <section class="game-card">
                    <p>${vnTime}</p>
                    <div class="team">
                    <img src="https://a.espncdn.com/i/teamlogos/nba/500/${game.home_team.abbreviation.toLowerCase()}.png">
                    ${game.home_team.full_name}
                    </div>
                    

                    <div class="score">
                        ${tiso(game)}
                        ${game.period == 0 ? barHTML : ""}
                    </div>

                    <div class="team away">
                    ${game.visitor_team.full_name}
                    <img src="https://a.espncdn.com/i/teamlogos/nba/500/${game.visitor_team.abbreviation.toLowerCase()}.png">
                    </div>

                </section>
            `;
            

        });
    });