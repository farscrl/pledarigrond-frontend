import { Component, ElementRef, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';

@Component({
  selector: 'app-audio-player',
  imports: [],
  templateUrl: './audio-player.html',
  changeDetection: ChangeDetectionStrategy.Eager,
  styleUrl: './audio-player.scss'
})
export class AudioPlayer {
  @Input() url?: string;

  isPlaying = false;
  @ViewChild('audioControl') audioControl!: ElementRef<HTMLAudioElement>;

  async play() {
    if (!this.url) {
      return;
    }

    const audioElement = this.audioControl.nativeElement;
    audioElement.src = this.url;
    audioElement.load();
    audioElement.addEventListener("ended", () => {
      audioElement.currentTime = 0;
      this.isPlaying = false;
      // console.log("audio ended");
    });
    this.isPlaying = true;
    await audioElement.play();
  }

  async pause() {
    const audioElement = this.audioControl.nativeElement;
    this.isPlaying = false;
    audioElement.pause();
    audioElement.currentTime = 0;
  }
}
