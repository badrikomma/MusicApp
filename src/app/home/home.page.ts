import { Component,ViewChild } from '@angular/core';
import { IonRange, Platform } from "@ionic/angular";

import { MusicControls } from '@ionic-native/music-controls/ngx';


@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  @ViewChild("range",{static:false}) range:IonRange;

  songs = [
    {
      title: "Frisson",
      subtitle: "Emotional Excitement",
      img: "/assets/image.jpg",
      path: "https://content.production.cdn.art19.com/validation=1594964365,04cdc86d-72a7-522c-a6b6-b8112c827e03,YJzOcUwW-LklLCfJt8WVOnoMZ20/episodes/1af3a417-3aeb-4ddd-a8b3-718264627263/db731a3f66a70b58c1d1edfda86b2b310cece458167f2e6ddc152bfb1fe705be23d4fa4fd6019fadb9816cbb8b62c6e5fc2a8be527bfe37658bc29c837e28868/wd20200712.mp3",
    },
    {
      title: "What makes you beautiful",
      subtitle: "One Direction",
      img: "/assets/image2.jpg",
      path: "/assets/song2.mp3",
    },
  ];

  currTitle;
  currSubtitle;
  currImage;

  progress=0;
  isPlaying = false;
  isTouched = false;

  currSecsText;
  durationText;


  currRangeTime;
  maxRangeValue;
  
  currSong: HTMLAudioElement;

  upNextImg;
  upNextTitle;
  upNextSubtitle;

  constructor( private musicControls : MusicControls, private platform : Platform ) {
  }

  playSong(title,subTitle,img,song){

    if(this.currSong != null){
      this.currSong.pause();
    }

    document.getElementById("fullPlayer").style.bottom = "0px";
    this.currTitle = title;
    this.currSubtitle = subTitle;
    this.currImage = img;


    this.currSong = new Audio(song);

    this.currSong.play().then(() => {

      this.durationText = this.sToTime(this.currSong.duration);

      this.maxRangeValue = Number(this.currSong.duration.toFixed(2).toString().substring(0,5));

      var index = this.songs.findIndex(x => x.title == this.currTitle);

      if((index + 1) == this.songs.length){
        this.upNextImg = this.songs[0].img;
        this.upNextTitle = this.songs[0].title;
        this.upNextSubtitle = this.songs[0].subtitle;
      }
      else{
        this.upNextImg = this.songs[index + 1].img;
        this.upNextTitle = this.songs[index + 1].title;
        this.upNextSubtitle = this.songs[index + 1].subtitle;
      }

      this.isPlaying = true;
    })

    this.currSong.addEventListener("timeupdate",() => {

      if(!this.isTouched){

        this.currRangeTime = Number(this.currSong.currentTime.toFixed(2).toString().substring(0,5));

        this.currSecsText = this.sToTime(this.currSong.currentTime);

        this.progress = (Math.floor(this.currSong.currentTime)/Math.floor(this.currSong.duration));


        if(this.currSong.currentTime == this.currSong.duration){
          this.playNext();
        }
      }
    })
    this.createNotificationMusic();
  }

  sToTime(t){
    return this.padZero(parseInt(String((t / (60)) % 60))) + ":" +
    this.padZero(parseInt(String((t) % 60)));
  }

  padZero(v){
    return(v < 10) ? "0" + v : v;
  }

  playNext(){
    var index = this.songs.findIndex(x => x.title == this.currTitle);

    if((index + 1) == this.songs.length){
      this.playSong(this.songs[0].title, this.songs[0].subtitle,this.songs[0].img,this.songs[0].path);
    }
    else{
      var nextIndex = index + 1;
      this.playSong(this.songs[nextIndex].title, this.songs[nextIndex].subtitle,this.songs[nextIndex].img,this.songs[nextIndex].path);
    }
  }

  playPrev(){
    var index = this.songs.findIndex(x => x.title == this.currTitle);

    if (index == 0){
      var lastIndex = this.songs.length - 1;
      this.playSong(this.songs[lastIndex].title, this.songs[lastIndex].subtitle,this.songs[lastIndex].img,this.songs[lastIndex].path);
    }
    else{
      var prevIndex = index - 1;
      this.playSong(this.songs[prevIndex].title, this.songs[prevIndex].subtitle,this.songs[prevIndex].img,this.songs[prevIndex].path);
    }
  }

  minimize(){
    document.getElementById("fullPlayer").style.bottom = "-1000px";
    document.getElementById("miniPlayer").style.bottom = "0px";
  }

  maximize(){
    document.getElementById("fullPlayer").style.bottom = "0px";
    document.getElementById("miniPlayer").style.bottom = "-100px";
  }

  pause(){
    this.currSong.pause();
    this.isPlaying = false;
  }

  play(){
    this.currSong.play();
    this.isPlaying = true;
  }

  cancel(){
    document.getElementById("miniPlayer").style.bottom = "-100px";
    this.currImage = "";
    this.currSubtitle = "";
    this.currTitle = "";
    this.progress = 0;
    this.currSong.pause();
    this.isPlaying = false;
  }

  touchStart(){
    this.isTouched = true;
    this.currRangeTime = Number(this.range.value);
  }

  touchMove(){
    this.currSecsText = this.sToTime(this.range.value);
  }

  touchEnd(){
    this.isTouched = false;
    this.currSong.currentTime = Number(this.range.value);
    this.currSecsText = this.sToTime(this.currSong.currentTime);
    this.currRangeTime = Number(this.currSong.currentTime.toFixed(2).toString().substring(0,5));
    if(this.isPlaying){
      this.currSong.play();
    }
  }

  createNotificationMusic(){
    this.musicControls.destroy();
    this.musicControls.create({
      track: this.currTitle,
      artist: this.currSubtitle,
      cover: this.currImage,
      isPlaying: true,
      dismissable: false,
      hasPrev: true,
      hasNext: true,
      hasSkipForward: false,
      hasSkipBackward: false,
      skipForwardInterval: 0,
      skipBackwardInterval: 0,
      hasClose: false,
      album: this.currImage,
      duration: 100,
      elapsed: 20,
      ticker: 'Ahora estas escuchando la' + this.currTitle,
    })
    console.log("Notification Started");

    this.musicControls.subscribe().subscribe(action => {
      console.log(action);
      
      const message = JSON.parse(action).message;
  
      switch(message){
        case 'music-controls-next':
          this.playNext();
          // Do something
          break;
        case 'music-controls-previous':
          // Do something
          this.playPrev();
          break;
        case 'music-controls-pause':
          // Do something
          if(this.isPlaying)
          {this.pause();
            this.musicControls.updateIsPlaying(false);
            console.log("music pause");
          }
          else
          {this.play();
            this.musicControls.updateIsPlaying(true);
          }
          break;
        case 'music-controls-play':
          // Do something
          if(!this.isPlaying){
          console.log('music play');
          this.play();
          this.musicControls.updateIsPlaying(true);
          }
          else
          {console.log("music pause");
            this.pause();
            this.musicControls.updateIsPlaying(false);
          }
          break;
        case 'music-controls-destroy':
          // Do something
          break;
          // External controls (iOS only)
        case 'music-controls-toggle-play-pause' :
         // Do something
         break;
        case 'music-controls-seek-to':
           // Do something
         break;
        case 'music-controls-skip-forward':
       // Do something
       break;
      case 'music-controls-skip-backward':
       // Do something
       break;
  
       // Headset events (Android only)
       // All media button events are listed below
      case 'music-controls-media-button' :
           // Do something
           break;
      case 'music-controls-headset-unplugged':
           // Do something
           break;
      case 'music-controls-headset-plugged':
           // Do something
           break;
  
       default:
           break;
      }
    
  })
  this.musicControls.listen();
  }
}
