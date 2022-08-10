//select all required tags or elements
const wrapper=document.querySelector(".wrapper"),
musicImg=wrapper.querySelector(".img-area img"),
musicName=wrapper.querySelector(".song-details .name"),
musicArtist=wrapper.querySelector(".song-details .artist"),
mainAudio=wrapper.querySelector("#main-audio"),
playPauseBtn=wrapper.querySelector(".play-pause"),
prevBtn=wrapper.querySelector("#prev"),
nextBtn=wrapper.querySelector("#next"),
progressBar=wrapper.querySelector(".progress-bar"),
progressArea=wrapper.querySelector(".progress-area");
musicList=wrapper.querySelector(".music-list"),
showMoreBtn=wrapper.querySelector("#more-music"),
hideMusicBtn=musicList.querySelector("#close");



let musicIndex=Math.floor((Math.random() * allMusic.length) + 1);
let isMusicpaused=true;


window.addEventListener("load", ()=>{
    loadMusic(musicIndex);
    playingSong();
})

function loadMusic(indexNumb){
    musicName.innerHTML=allMusic[indexNumb-1].name;
    musicArtist.innerHTML=allMusic[indexNumb-1].artist;
    musicImg.src=`images/${allMusic[indexNumb-1].img}.jpg`;
    mainAudio.src=`musics/${allMusic[indexNumb-1].src}.mp3`
}

function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerHTML="pause";
    mainAudio.play();
}

function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerHTML="play_arrow";
    mainAudio.pause();
}

function prevMusic(){
    //here we will just increment the index by one
    musicIndex--;
    if(musicIndex<1){
        musicIndex=allMusic.length;
    }
    else{
        musicIndex=musicIndex;
    }
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

function nextMusic(){
    //here we will just increment the index by one
    musicIndex++;
    if(musicIndex>allMusic.length){
        musicIndex=1;
    }
    else{
        musicIndex=musicIndex;
    }
    loadMusic(musicIndex);
    playMusic();
    playingSong();
}

playPauseBtn.addEventListener("click",()=>{
    const isMusicPlay=wrapper.classList.contains("paused");
    isMusicPlay? pauseMusic() : playMusic();
    playingSong();
});

nextBtn.addEventListener("click",()=>{
    nextMusic();
});

prevBtn.addEventListener("click",()=>{
    prevMusic();
})

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate",(e)=>{
    const currentTime=e.target.currentTime; //getting current time of song
    const duration=e.target.duration; //getting total duration of song
    let progressWidth=(currentTime/duration)*100;
    progressBar.style.width=`${progressWidth}%`;

    let musicCurrentTime = wrapper.querySelector(".current-time")
    let musicDuration=wrapper.querySelector(".max-duration");

    mainAudio.addEventListener("loadeddata",()=>{
        

        //update song total duration
        let mainAdDuration=mainAudio.duration;
        //console.log(audioDuration);
        let totalMin=Math.floor(mainAdDuration/60);
        let totalSec=Math.floor(mainAdDuration % 60);
        //console.log(totalMin,totalSec);
        if(totalSec < 10){
            totalSec=`0${totalSec}`;
        }
        musicDuration.innerHTML=`${totalMin}:${totalSec}`;
    });
    //update playing song current time
    let currentMin=Math.floor(currentTime/60);
    let currentSec=Math.floor(currentTime % 60);
    //console.log(currentMin,currentSec);
    if(currentSec < 10){
        currentSec=`0${currentSec}`;
    }
    musicCurrentTime.innerHTML=`${currentMin}:${currentSec}`;
});

//let's update playing song current time according to the progress bar width
progressArea.addEventListener("click",(e)=>{
    let progressWidth=progressArea.clientWidth //getting width of the progress bar
    let clickedOffSetX=e.offsetX; //getting offset x value
    let songDuration=mainAudio.duration; //getting song total duration

    mainAudio.currentTime=(clickedOffSetX/progressWidth)*songDuration;
    playMusic();
    playingSong();
});
//let's work on repeat/suffle song according to the icon
const repeatBtn=wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click",()=>{
    //first we get the innerText of the icon then we'll change accordingly
    let getText=repeatBtn.innerText; //getting inner text of icon
    //let's do different changes on different icon click during switch
    switch(getText){
        case "repeat":
            repeatBtn.innerHTML="repeat_one";
            repeatBtn.setAttribute("title","Song lopped");
            break;
        case "repeat_one":
            repeatBtn.innerHTML="shuffle";
            repeatBtn.setAttribute("title","Playback shuffled");
            break;
        case "shuffle":
            repeatBtn.innerHTML="repeat";
            repeatBtn.setAttribute("title","Playlist lopped");
            break;
    }
});

//above we just changed the icon, now let's work on what to do after the song ended


mainAudio.addEventListener("ended",()=>{
    let getText=repeatBtn.innerText;

    switch(getText){
        case "repeat":
            nextMusic();
            break;
        case "repeat_one":
            mainAudio.currentTime=0;
            loadMusic(musicIndex);
            playMusic();
            break;
        case "shuffle":
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1); //genereting random index/numb with max range of array length
            do{
                let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex); //this loop run until the next random number won't be the same of current musicIndex
            musicIndex = randIndex; //passing randomIndex to musicIndex
            loadMusic(musicIndex);
            playMusic();
            playingSong();
            break;
    }
});

showMoreBtn.addEventListener("click",()=>{
    // //console.log("show more");
    musicList.classList.toggle("show");
});


hideMusicBtn.addEventListener("click",()=>{
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");
// let create li tags according to array length for list
for (let i = 0; i < allMusic.length; i++) {
  //let's pass the song name, artist from the array
  let liTag = `<li li-index="${i + 1}">
                <div class="row">
                  <span>${allMusic[i].name}</span>
                  <p>${allMusic[i].artist}</p>
                </div>
                <span id="${allMusic[i].src}" class="audio-duration"></span>
                <audio class="${allMusic[i].src}" src="songs/${allMusic[i].src}.mp3"></audio>
              </li>`;
  ulTag.insertAdjacentHTML("beforeend", liTag); //inserting the li inside ul tag
  let liAudioDuartionTag = ulTag.querySelector(`#${allMusic[i].src}`);
  let liAudioTag = ulTag.querySelector(`.${allMusic[i].src}`);
  liAudioTag.addEventListener("loadeddata", ()=>{
    let duration = liAudioTag.duration;
    let totalMin = Math.floor(duration / 60);
    let totalSec = Math.floor(duration % 60);
    if(totalSec < 10){ //if sec is less than 10 then add 0 before it
      totalSec = `0${totalSec}`;
    };
    liAudioDuartionTag.innerText = `${totalMin}:${totalSec}`; //passing total duation of song
    liAudioDuartionTag.setAttribute("t-duration", `${totalMin}:${totalSec}`); //adding t-duration attribute with total duration value
  });
}
//play particular song from the list onclick of li tag
function playingSong(){
  const allLiTag = ulTag.querySelectorAll("li");
  
  for (let j = 0; j < allLiTag.length; j++) {
    let audioTag = allLiTag[j].querySelector(".audio-duration");
    
    if(allLiTag[j].classList.contains("playing")){
      allLiTag[j].classList.remove("playing");
      let adDuration = audioTag.getAttribute("t-duration");
      console.log(adDuration);
      audioTag.innerText = adDuration;
    }
    //if the li tag index is equal to the musicIndex then add playing class in it
    if(allLiTag[j].getAttribute("li-index") == musicIndex){
      allLiTag[j].classList.add("playing");
      audioTag.innerText = "Playing";
    }
    allLiTag[j].setAttribute("onclick", "clicked(this)");
  }
}
//particular li clicked function
function clicked(element){
  let getLiIndex = element.getAttribute("li-index");
  musicIndex = getLiIndex; //updating current song index with clicked li index
  loadMusic(musicIndex);
  playMusic();
  playingSong();
}