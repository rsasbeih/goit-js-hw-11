import Player from '@vimeo/player';
import throttle from 'lodash.throttle';

const iframe = document.querySelector('iframe');
const player = new Player(iframe);

function onTimeUpDate(data) {
  localStorage.setItem("videoplayer-current-time", data.seconds);
}

const currentTime = localStorage.getItem("videoplayer-current-time");

if (currentTime) {
  player.setCurrentTime(currentTime);
}

player.on('timeupdate', throttle(onTimeUpDate, 500));