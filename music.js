var musicList = [{
	src:'http://cloud.hunger-valley.com/music/ifyou.mp3',
    title: 'IF YOU',
    author:'Big Bang'
},{
	src:'http://cloud.hunger-valley.com/music/玫瑰.mp3',
	title:'玫瑰',
	author:'贰佰'
}]


var backBtn = document.querySelector('.back');
var playBtn = document.querySelector('.play');
var forwardBtn = document.querySelector('.forward');
var titleNode = document.querySelector('.song-title');
var authorNode = document.querySelector('.song-author');
var timeNode = document.querySelector('.time');
var progressBarNode = document.querySelector('.bar');
var progressNowNode = document.querySelector('.progress-now');
var progressVoiceBarNode = document.querySelector('.voice-bar');
var progressVoiceNowNode = document.querySelector('.voice-now');

var music = new Audio();
music.autoplay = true;
var musicIndex = 0;

getMusic(function(musicList){
	loadMusic(musicList[musicIndex]);
})

playBtn.onclick = function(){          //播放暂停点击事件
	this.classList.toggle('play');
	this.classList.toggle('pause');
	var icon = this.querySelector('.fa');
	icon.classList.contains('fa-play')?music.play():music.pause();
	icon.classList.toggle('fa-play');
	icon.classList.toggle('fa-pause');
}


forwardBtn.onclick = loadNextMusic;
backBtn.onclick = loadLastMusic;
music.onended = loadNextMusic;
music.shouldUpdate = true;
var timer;
music.onplaying = function(){
	timer = setInterval(function(){
		updateProgress();
	},1000)
}
music.onpause = function(){
	clearTimeout(timer);
}





function updateProgress(){                //播放的进度条(自动的)和时间
	var percent =( music.currentTime / music.duration )*100+'%';
	progressNowNode.style.width = percent;

	var minutes = parseInt(music.currentTime / 60);
	var seconds = parseInt(music.currentTime%60)+'';     //不然的话10秒会显示为100S
	seconds = seconds.length==2 ? seconds : "0"+seconds;
	timeNode.innerText = minutes+':'+seconds;
}

progressBarNode.onclick = function(e){
	var percent = e.offsetX / parseInt((getComputedStyle(this).width));
	music.currentTime = percent*music.duration;
	progressNowNode.style.width = percent*100+'%';
}

/*音量*/
progressVoiceBarNode.onclick = function (e){
	var percent = e.offsetX / parseInt((getComputedStyle(this).width));
	music.volume = percent*1;
	progressVoiceNowNode.style.width = percent*100+'%';
}





function loadMusic(songObj){     //歌曲的链接 歌名以及歌手
	music.src = songObj.src;
	titleNode.innerText = songObj.title;
	authorNode.innerText = songObj.author;
}


function loadNextMusic(){       //播放下一首歌曲
	musicIndex++;
	musicIndex = musicIndex % musicList.length;
	loadMusic(musicList[musicIndex]);
}

function loadLastMusic(){        //播放上一首歌曲
	musicIndex--;
	musicIndex = (musicIndex + musicList.length) % musicList.length;
	loadMusic(musicList[musicIndex]);
}


function getMusic(callback) {
    var xhr = new XMLHttpRequest();
    xhr.open('get', 'music.json', true);
    xhr.send();
    xhr.onload = function() {
        if ((xhr.status >= 200 && xhr.status < 300) || xhr.status == 304) {
        	callback(JSON.parse(xhr.responseText));
        }
      }
    }