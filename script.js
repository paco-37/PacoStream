// script.js

const playlistSongs = [
  {
    title: "Through Da Storm",
    artist: "Polo G",
    duration: "3:18",
    src: "audio/Polo G - Through Da Storm (Official Audio).mp3",
  },
  {
    title: "Dream That I Had",
    artist: "Lil Tjay",
    duration: "2:48",
    src: "audio/Lil Tjay - Dream That I Had (Official Audio).mp3",
  },
  {
    title: "Shoot For The Stars",
    artist: "Lil Tjay",
    duration: "2:29",
    src: "audio/Lil Tjay - Shoot for the Stars (Official Audio) ft. Fivio Foreign.mp3",
  },
  {
    title: "BST",
    artist: "Polo G",
    duration: "3:25",
    src: "audio/Polo G - BST (Official Audio).mp3",
  }
];

// script.js

const playlistSongs = [
  {
    title: "Song 1",
    artist: "Artist 1",
    duration: "3:45",
    src: "song1.mp3",
    // cover: "cover1.jpg", // Cover entfernt
  },
  {
    title: "Song 2",
    artist: "Artist 2",
    duration: "4:05",
    src: "song2.mp3",
    // cover: "cover2.jpg", // Cover entfernt
  },
  // Fügen Sie hier weitere Songs hinzu
];

let currentSongIndex = 0;
let isShuffle = false;
let isRepeat = false;

const audio = new Audio();
audio.src = playlistSongs[currentSongIndex].src;

const playButton = document.getElementById("play");
const pauseButton = document.getElementById("pause");
const nextButton = document.getElementById("next");
const prevButton = document.getElementById("previous");
const shuffleButton = document.getElementById("shuffle");
const repeatButton = document.getElementById("repeat");
const playerSongTitle = document.getElementById("player-song-title");
const playerSongArtist = document.getElementById("player-song-artist");
const currentTimeDisplay = document.getElementById("current-time");
const durationDisplay = document.getElementById("duration");
const seekBar = document.getElementById("seek-bar");

function loadPlaylist() {
  const playlistElement = document.getElementById("playlist-songs");
  playlistElement.innerHTML = "";
  playlistSongs.forEach((song, index) => {
    const songElement = document.createElement("li");
    songElement.classList.add("playlist-song");
    songElement.setAttribute("data-index", index);

    songElement.innerHTML = `
      <div class="playlist-song-info">
        <p class="playlist-song-title">${song.title}</p>
        <p class="playlist-song-artist">${song.artist}</p>
      </div>
      <p class="playlist-song-duration">${song.duration}</p>
      <button class="playlist-song-delete">&times;</button>
    `;

    // Klick auf das Song-Element, um abzuspielen
    songElement.addEventListener("click", (e) => {
      // Verhindern, dass der Delete-Button den Klick auslöst
      if (e.target.classList.contains("playlist-song-delete")) return;
      currentSongIndex = index;
      updatePlayerDisplay();
      playSong();
    });

    // Klick auf den Delete-Button
    songElement.querySelector(".playlist-song-delete").addEventListener("click", (e) => {
      e.stopPropagation(); // Verhindert, dass das übergeordnete Klick-Event ausgelöst wird
      deleteSong(index);
    });

    playlistElement.appendChild(songElement);
  });
}

function updatePlayerDisplay() {
  const currentSong = playlistSongs[currentSongIndex];
  playerSongTitle.textContent = currentSong.title;
  playerSongArtist.textContent = currentSong.artist;

  audio.src = currentSong.src;

  const songs = document.querySelectorAll(".playlist-song");
  songs.forEach((song) => {
    song.classList.remove("active");
    if (parseInt(song.getAttribute("data-index")) === currentSongIndex) {
      song.classList.add("active");
    }
  });
}

function playSong() {
  audio.play();
  playButton.classList.add("hidden");
  pauseButton.classList.remove("hidden");
}

function pauseSong() {
  audio.pause();
  pauseButton.classList.add("hidden");
  playButton.classList.remove("hidden");
}

function nextSong() {
  if (isShuffle) {
    playRandomSong();
  } else {
    currentSongIndex = (currentSongIndex + 1) % playlistSongs.length;
  }
  updatePlayerDisplay();
  playSong();
}

function prevSong() {
  if (isShuffle) {
    playRandomSong();
  } else {
    currentSongIndex = (currentSongIndex - 1 + playlistSongs.length) % playlistSongs.length;
  }
  updatePlayerDisplay();
  playSong();
}

function toggleShuffle() {
  isShuffle = !isShuffle;
  shuffleButton.classList.toggle("active", isShuffle);
}

function toggleRepeat() {
  isRepeat = !isRepeat;
  repeatButton.classList.toggle("active", isRepeat);
}

function playRandomSong() {
  let randomIndex = Math.floor(Math.random() * playlistSongs.length);
  // Sicherstellen, dass ein anderes Lied ausgewählt wird
  if (randomIndex === currentSongIndex && playlistSongs.length > 1) {
    randomIndex = (randomIndex + 1) % playlistSongs.length;
  }
  currentSongIndex = randomIndex;
}

function deleteSong(index) {
  // Entfernen des Songs aus dem Array
  playlistSongs.splice(index, 1);

  // Anpassen des aktuellen Index
  if (index < currentSongIndex) {
    currentSongIndex -= 1;
  } else if (index === currentSongIndex) {
    if (playlistSongs.length > 0) {
      currentSongIndex = currentSongIndex % playlistSongs.length;
      updatePlayerDisplay();
      playSong();
    } else {
      // Keine Songs mehr in der Playlist
      audio.pause();
      audio.src = "";
      playerSongTitle.textContent = "Keine Songs verfügbar";
      playerSongArtist.textContent = "";
      playButton.classList.remove("hidden");
      pauseButton.classList.add("hidden");
    }
  }

  // Neu laden der Playlist
  loadPlaylist();
}

function updateProgressBar() {
  const { currentTime, duration } = audio;
  seekBar.value = duration ? (currentTime / duration) * 100 : 0;
  currentTimeDisplay.textContent = formatTime(currentTime);
  durationDisplay.textContent = formatTime(duration);
}

function seekAudio() {
  const seekTo = audio.duration * (seekBar.value / 100);
  audio.currentTime = seekTo;
}

function formatTime(time) {
  if (isNaN(time)) return "0:00";
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
}

// Event Listener für Play/Pause Buttons
playButton.addEventListener("click", playSong);
pauseButton.addEventListener("click", pauseSong);

// Event Listener für Next/Previous Buttons
nextButton.addEventListener("click", nextSong);
prevButton.addEventListener("click", prevSong);

// Event Listener für Shuffle und Repeat Buttons
shuffleButton.addEventListener("click", toggleShuffle);
repeatButton.addEventListener("click", toggleRepeat);

// Event Listener für das Audio-Element
audio.addEventListener("timeupdate", updateProgressBar);
audio.addEventListener("ended", () => {
  if (isRepeat) {
    playSong();
  } else {
    nextSong();
  }
});

// Event Listener für die Seek-Bar
seekBar.addEventListener("input", seekAudio);

// Initial Laden der Playlist und Anzeige
loadPlaylist();
updatePlayerDisplay();

