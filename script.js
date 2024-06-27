let currentsong = new Audio();
let songs;
let currentfolder;
function formatTime(seconds) {
  // Calculate minutes and remaining seconds
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  // Format minutes and seconds to always have two digits
  const formattedMinutes = String(minutes).padStart(2, "0");
  const formattedSeconds = String(remainingSeconds).padStart(2, "0");

  // Return the formatted time
  return `${formattedMinutes}:${formattedSeconds}`;
}

async function getsongs(folder) {
  currentfolder = folder;
  let a = await fetch(`http://127.0.0.1:3000/${folder}/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let as = div.getElementsByTagName("a");
  songs = [];
  for (let index = 0; index < as.length; index++) {
    const element = as[index];
    if (element.href.endsWith(".mp3")) {
      songs.push(element.href.split(`/${folder}/`)[1]);
    }
  }

  let songUL = document
    .querySelector(".songlists")
    .getElementsByTagName("ul")[0];
  songUL.innerHTML = "";
  for (const song of songs) {
    songUL.innerHTML =
      songUL.innerHTML +
      `<li><img class="invert" src="music.svg" alt="">
      <div class="info">
          <div>${song.replaceAll("%20", " ")}</div>
          <div>Varun</div>
      </div>
      <div class="play">
          <span>Play Now</span>
          <img class="invert" src="play.svg" alt="">
      </div>
   </li>`;
  }

  Array.from(
    document.querySelector(".songlists").getElementsByTagName("li")
  ).forEach((e) => {
    e.addEventListener("click", (element) => {
      playMusic(e.querySelector(".info").firstElementChild.innerHTML.trim());
    });
  });
}

const playMusic = (track, pause = false) => {
  currentsong.src = `/${currentfolder}/` + track;
  if (!pause) {
    currentsong.play();
    play.src = "pause.svg";
  }
  document.querySelector(".songinfo").innerHTML = decodeURI(track);
  document.querySelector(".time").innerHTML = "00:00 / 00:00";
};

async function displayalbums() {
  let a = await fetch(`http://127.0.0.1:3000/songs/`);
  let response = await a.text();
  let div = document.createElement("div");
  div.innerHTML = response;
  let anchors = div.getElementsByTagName("a");
  let cardcont = document.querySelector(".cardcont");
  let array = Array.from(anchors);

  for (let index = 0; index < array.length; index++) {
    const e = array[index];

    if (e.href.includes("/songs")) {
      let folder = e.href.split("/").slice(-2)[0];
      let a = await fetch(`http://127.0.0.1:3000/songs/${folder}/info.json`);
      let response = await a.json();
      cardcont.innerHTML =
        cardcont.innerHTML +
        `<div data-folder="${folder}" class="cards">
      <div class="playbtn">
          <svg width="50" height="50" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
              <!-- Circle Background -->
              <circle cx="25" cy="25" r="25" fill="#1DB954" />

              <!-- Play Triangle -->
              <polygon points="17.5,12.5 37.5,25 17.5,37.5" fill="black" />
          </svg>
      </div>
      <img src="/songs/${folder}/cover.jpg" alt="img">
      <h2>${response.title}</h2>
      <p>${response.description}</p>
  </div>`;
    }
  }

  Array.from(document.getElementsByClassName("cards")).forEach((e) => {
    e.addEventListener("click", async (item) => {
      songs = await getsongs(`songs/${item.currentTarget.dataset.folder}`);
    });
  });
}

async function main() {
  await getsongs("songs/cs");
  playMusic(songs[0], true);

  //albums
  displayalbums();

  play.addEventListener("click", () => {
    if (currentsong.paused) {
      currentsong.play();
      play.src = "pause.svg";
    } else {
      currentsong.pause();
      play.src = "play.svg";
    }
  });

  currentsong.addEventListener("timeupdate", () => {
    document.querySelector(".time").innerHTML = `${formatTime(
      currentsong.currentTime
    )}/${formatTime(currentsong.duration)}`;
    document.querySelector(".circle").style.left =
      (currentsong.currentTime / currentsong.duration) * 100 + "%";
  });
  document.querySelector(".seekbar").addEventListener("click", (e) => {
    let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
    document.querySelector(".circle").style.left = percent + "%";
    currentsong.currentTime = (currentsong.duration * percent) / 100;
  });
  document.querySelector(".hamburger").addEventListener("click", () => {
    document.querySelector(".left").style.left = "0";
  });
  document.querySelector(".close").addEventListener("click", () => {
    document.querySelector(".left").style.left = "-120%";
  });

  //previous
  previous.addEventListener("click", () => {
    console.log("previous");
    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index - 1 >= 0) {
      playMusic(songs[index - 1]);
    }
  });

  //next
  next.addEventListener("click", () => {
    currentsong.pause();
    let index = songs.indexOf(currentsong.src.split("/").slice(-1)[0]);
    if (index + 1 < songs.length) {
      playMusic(songs[index + 1]);
    }
  });

  //   next.addEventListener("click", () => {
  //     // Check if currentsong is defined
  //     if (!currentsong) {
  //         console.error("currentsong is undefined");
  //         return;
  //     }

  //     // Check if currentsong.src is defined
  //     if (!currentsong.src) {
  //         console.error("currentsong.src is undefined");
  //         return;
  //     }

  //     // Check if songs is defined and is an array
  //     if (!songs || !Array.isArray(songs)) {
  //         console.error("songs is undefined or not an array");
  //         return;
  //     }

  //     // Pause the current song
  //     currentsong.pause();

  //     // Extract the song name from the src
  //     let songName = currentsong.src.split("/").slice(-1)[0];
  //     console.log(songName); // Log the song name

  //     // Find the index of the current song in the songs array
  //     let index = songs.indexOf(songName);
  //     if (index === -1) {
  //         console.error("Song not found in the songs array");
  //         return;
  //     }

  //     // Play the next song if there is one
  //     if ((index + 1) < songs.length) {
  //         playMusic(songs[index + 1]);
  //     }
  // });

  //volume
  document
    .querySelector(".range")
    .getElementsByTagName("input")[0]
    .addEventListener("change", (e) => {
      currentsong.volume = parseInt(e.target.value) / 100;
    });
}

document.querySelector(".volume img").addEventListener("click", (e) => {
  if (e.target.src.includes("volume.svg")) {
    e.target.src = e.target.src.replace("volume.svg", "mute.svg");
    currentsong.volume = 0;
    document.querySelector(".range").getElementsByTagName("input")[0].value = 0;
  } else {
    e.target.src = e.target.src.replace("mute.svg", "volume.svg");
    currentsong.volume = 0.1;
    document
      .querySelector(".range")
      .getElementsByTagName("input")[0].value = 10;
  }
});
main();
