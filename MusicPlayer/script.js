let songs = [];
let songIndex = 0;
const audio = document.getElementById("audio");
const playPauseBtn = document.getElementById("play-pause");
const progressBar = document.getElementById("progress-bar");
const volumeBar = document.getElementById("volume-bar");

// Load playlist from localStorage
window.onload = () => {
  const savedSongs = JSON.parse(localStorage.getItem("myPlaylist"));
  if (savedSongs) {
    songs = savedSongs;
    renderPlaylist();
  }
};

// Add Local Files
document.getElementById("file-input").addEventListener("change", (e) => {
  const files = e.target.files;
  for (let file of files) {
    songs.push({ title: file.name, src: URL.createObjectURL(file) });
  }
  saveAndRender();
});

// FIXED: Play Song Function
function playSong(index) {
  if (songs.length === 0) return;

  songIndex = index;
  const song = songs[songIndex];

  // Check if the source is still valid
  audio.src = song.src;

  // Play with error handling
  audio.play().catch((error) => {
    console.error("Playback failed:", error);
    alert(
      "This file is no longer accessible. Please re-add it from your computer.",
    );
  });

  playPauseBtn.innerText = "Pause";
  document.getElementById("title").innerText = song.title;
  renderPlaylist();
}

// Delete Song Function
function deleteSong(index, event) {
  event.stopPropagation();
  songs.splice(index, 1);

  if (songIndex === index) {
    audio.pause();
    audio.src = "";
    playPauseBtn.innerText = "Play";
  } else if (songIndex > index) {
    songIndex--;
  }
  saveAndRender();
}

function saveAndRender() {
  localStorage.setItem("myPlaylist", JSON.stringify(songs));
  renderPlaylist();
}

// Render Playlist
function renderPlaylist() {
  const list = document.getElementById("playlist");
  list.innerHTML = "";
  songs.forEach((song, i) => {
    let li = document.createElement("li");
    li.className = i === songIndex ? "active" : "";
    li.innerHTML = `
            <span onclick="playSong(${i})">${song.title}</span>
            <button class="delete-btn" onclick="deleteSong(${i}, event)">Delete</button>
        `;
    list.appendChild(li);
  });
}

// Existing Controls Logic
playPauseBtn.onclick = () => {
  if (songs.length === 0) return;
  audio.paused ? audio.play() : audio.pause();
  playPauseBtn.innerText = audio.paused ? "Play" : "Pause";
};

document.getElementById("prev").onclick = () => {
  if (songs.length === 0) return;
  songIndex = (songIndex - 1 + songs.length) % songs.length;
  playSong(songIndex);
};

document.getElementById("next").onclick = () => {
  if (songs.length === 0) return;
  songIndex = (songIndex + 1) % songs.length;
  playSong(songIndex);
};

progressBar.addEventListener("input", () => {
  if (audio.duration)
    audio.currentTime = (progressBar.value * audio.duration) / 100;
});

volumeBar.addEventListener("input", (e) => {
  audio.volume = e.target.value;
});

audio.addEventListener("timeupdate", () => {
  if (!isNaN(audio.duration)) {
    progressBar.value = (audio.currentTime / audio.duration) * 100;
    document.getElementById("current-time").innerText = formatTime(
      audio.currentTime,
    );
    document.getElementById("duration").innerText = formatTime(audio.duration);
  }
});

function formatTime(time) {
  const min = Math.floor(time / 60);
  const sec = Math.floor(time % 60);
  return `${min}:${sec < 10 ? "0" : ""}${sec}`;
}

audio.addEventListener("ended", () =>
  document.getElementById("next").onclick(),
);
