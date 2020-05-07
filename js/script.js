const video_container = document.querySelector(".video_container");
const video = document.getElementById("video");
const player_container = document.querySelector(".player_container");
const play_and_pause = document.getElementById("play_and_pause");
const play = document.querySelector(".play");
const pause = document.querySelector(".pause");
const progress_borders = document.querySelector(".progress_borders");
const progress = document.querySelector(".progress");
const progress_hover = document.querySelector(".progress_hover");
const volume_borders = document.querySelector(".volume_borders");
const volume = document.querySelector(".volume");
const volume_hover = document.querySelector(".volume_hover");
const volume_status = document.querySelector(".volume_status");
const turned = document.querySelector(".turned");
const muted = document.querySelector(".muted");
const current_time = document.getElementById("current_time");
const video_time = document.getElementById("video_time");
let volume_value = 0;

volume.style.width = "100%";

// Play and Pause button and Time
play_and_pause.addEventListener("click", play_pause_button);

function play_pause_toggle() {
  play.classList.toggle("active");
  pause.classList.toggle("active");
}

function play_pause_button() {
  if (play.classList.contains("active")) {
    video.play();
  }
  if (pause.classList.contains("active")) {
    video.pause();
  }

  play_pause_toggle();
}

video.addEventListener("timeupdate", () => {
  const currentTime = Math.round(video.currentTime);
  let currentTime_hour = Math.floor(currentTime / 60 / 60);
  let currentTime_minute = Math.floor(currentTime / 60);
  let currentTime_second = currentTime % 60;

  if (currentTime >= 3600) {
    if (currentTime_hour <= 9) {
      currentTime_hour = "0" + currentTime_hour;
    }

    currentTime_minute = Math.floor((currentTime / 60) % 60);

    if (currentTime_hour > 12) {
      return;
    }

    if (currentTime_minute <= 9) {
      currentTime_minute = "0" + currentTime_minute;
    }

    if (currentTime_second <= 9) {
      currentTime_second = "0" + currentTime_second;
    }

    current_time.style.fontSize = "12px";
    current_time.innerHTML =
      currentTime_hour + ":" + currentTime_minute + ":" + currentTime_second;
  } else {
    if (currentTime_minute <= 9) {
      currentTime_minute = "0" + currentTime_minute;
    }
    if (currentTime_second <= 9) {
      currentTime_second = "0" + currentTime_second;
    }

    current_time.innerHTML = currentTime_minute + ":" + currentTime_second;
  }
});

window.addEventListener("load", () => {
  const duration = Math.round(video.duration);
  let duration_hour = Math.floor(duration / 60 / 60);
  let duration_minute = Math.floor(duration / 60);
  let duration_second = duration % 60;

  if (duration >= 3600) {
    if (duration_hour <= 9) {
      duration_hour = "0" + duration_hour;
    }

    duration_minute = Math.floor((duration / 60) % 60);

    if (duration_hour > 12) {
      return;
    }

    if (duration_minute <= 9) {
      duration_minute = "0" + duration_minute;
    }

    if (duration_second <= 9) {
      duration_second = "0" + duration_second;
    }

    video_time.style.fontSize = "12px";
    video_time.innerHTML =
      duration_hour + ":" + duration_minute + ":" + duration_second;
  } else {
    if (duration_minute <= 9) {
      duration_minute = "0" + duration_minute;
    }

    if (duration_second <= 9) {
      duration_second = "0" + duration_second;
    }

    video_time.innerHTML = duration_minute + ":" + duration_second;
  }
});

// Progress bar tap
video.addEventListener("timeupdate", progressUpdate);

function progressUpdate() {
  const d = video.duration;
  const c = video.currentTime;

  progress.style.width = (c * 100) / d + "%";

  if (progress.style.width == "100%") {
    play_pause_toggle();
  }
}

progress_borders.addEventListener("click", progressPosition);

function progressPosition() {
  const w = this.offsetWidth;
  const o = event.offsetX;

  if (play.classList.contains("active")) {
    play.classList.remove("active");
    pause.classList.add("active");
  }

  progress.style.width = (o * 100) / w + "%";
  video.pause();
  video.currentTime = video.duration * (o / w);
  video.play();
}

// Volume bar tap
volume_borders.addEventListener("click", volumePosition);

function volumePosition() {
  const w = this.offsetWidth;
  const o = event.offsetX;
  const count = (o * 100) / w;

  volume.style.width = count + "%";
  video.volume = volume.offsetWidth / w;

  if (count >= 95) {
    volume.style.width = "100%";
    video.volume = 1;
  }

  if (turned.classList.contains("block") && count > 5) {
    volume.style.width = count + "%";
    video.volume = volume.offsetWidth / w;
    turned.classList.remove("block");
    muted.classList.add("block");
  }

  if (count <= 5) {
    muted.classList.remove("block");
    turned.classList.add("block");
    volume.style.width = "0%";
    video.volume = 0;
  }
}

// Volume bar Hover
const volVal1 = document.getElementById("volVal1");
const volVal2 = document.getElementById("volVal2");

volume_borders.addEventListener("mouseover", () => {
  volVal1.classList.add("volume_value_1");
  volVal2.classList.add("volume_value_2");
});

volume_borders.addEventListener("mousemove", desirable_volume);

function desirable_volume() {
  const x = event.offsetX;
  const y = this.offsetWidth;
  const count = (x * 100) / y;

  volVal1.style.left = x + "px";
  volVal2.style.left = x + "px";
  volVal1.innerHTML = Math.round(count);
}

volume_borders.addEventListener("mouseout", reset_volume_hover_value);

function reset_volume_hover_value() {
  volVal1.classList.remove("volume_value_1");
  volVal2.classList.remove("volume_value_2");
  volVal1.innerHTML = "";
}

// Volume Status Button
volume_status.addEventListener("click", volumeStatusChange);

function volumeStatusChange() {
  if (volume.style.width > "0%") {
    volume_value = volume.style.width;
  }

  if (muted.classList.contains("block")) {
    video.volume = 0;
    volume.style.width = "0%";
  }

  turned.classList.toggle("block");
  muted.classList.toggle("block");

  if (muted.classList.contains("block")) {
    volume.style.width = volume_value;
    video.volume = volume.offsetWidth / volume_borders.offsetWidth;
  }
}

// Video Play or Pause when tap on video
video_container.addEventListener("click", () => {
  if (event.target !== player_container && event.target == video) {
    play_pause_button();
  }
  return;
});

// Full screen request
const full = document.getElementById("full_screen");

full.addEventListener("click", () => {
  if (video.requestFullscreen) {
    video.requestFullscreen();
  } else if (video.mozRequestFullScreen) {
    /* Firefox */
    video.mozRequestFullScreen();
  } else if (video.webkitRequestFullscreen) {
    /* Chrome, Safari & Opera */
    video.webkitRequestFullscreen();
  } else if (video.msRequestFullscreen) {
    /* IE/Edge */
    video.msRequestFullscreen();
  }
});
