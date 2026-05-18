const map = new Map();

let lastId = 0;

async function deleteComment(cmtId) {
  try {
    await fetch("http://localhost:3000/comments", {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json"
      },

      body: JSON.stringify({
        id: cmtId
      })
    });
  } catch (error) {
    console.error("Error: ", error);
  }
}

async function loadComments() {
  const res = await fetch("http://localhost:3000/comments");
  const data = await res.json();
  // Finsh fetch

  const box = document.getElementById("comments");
  const template = document.getElementById("cmt_template");

  data.reverse().forEach(cmt => {
    if (cmt.id > lastId) {
      let clone = template.content.cloneNode(true);

      clone.querySelector(".cmt_username").textContent = cmt.username;
      clone.querySelector(".cmt_content").textContent = cmt.content;

      // console.log(cmt.username, ": ", cmt.content);
      

      // Remove cmt
      const item = clone.querySelector(".cmt");

      clone.querySelector(".delete_btn").onclick = () => {
        console.log("Remove cmt:  ",cmt.username, ": ", cmt.content);
        deleteComment(cmt.id);
        item.remove();
      };
      

      box.appendChild(clone);
      box.scrollTop = box.scrollHeight;
      
      map.set(cmt.id, clone);
      lastId = cmt.id;
    }
  });
}

async function sendCommentToServer(request) {
  try {
    await fetch(request);
  } catch (err) {
    console.error("Error: ", error);
  }

  document.getElementById("content").value = "";

  loadComments();
}

// I'm practicing to handle with request and fetch different types of data in Frontend
// Treading in server.js is more easier
// Click -> sendComment -> sendCommentToServer

function sendComment() {
  const username = document.getElementById("username").value;
  const content = document.getElementById("content").value;

  const request1 = new Request("http://localhost:3000/comments", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      username: username,
      content: content
    })
  });

  if (username === "") {
    const request2 = new Request(request1, {
      body: JSON.stringify({
        username: "Anonymous",
        content: content
      })

      // if have no name
    });

    sendCommentToServer(request2);
  } else {
    sendCommentToServer(request1);
  }

}

// load khi mở web

loadComments();

// auto refresh mỗi 5s

setInterval(loadComments, 5000);