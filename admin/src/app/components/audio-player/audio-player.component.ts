import { Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { NzButtonComponent } from 'ng-zorro-antd/button';
import { NzWaveDirective } from 'ng-zorro-antd/core/wave';

import { NzIconDirective } from 'ng-zorro-antd/icon';

@Component({
    selector: 'app-audio-player',
    templateUrl: './audio-player.component.html',
    styleUrl: './audio-player.component.scss',
    imports: [NzButtonComponent, NzWaveDirective, NzIconDirective]
})
export class AudioPlayerComponent implements OnInit {
  @Input() url?: string;

  isPlaying = false;
  @ViewChild('audioControl') audioControl!: ElementRef<HTMLAudioElement>;

  ngOnInit() {
    if (this.url) {
      this.play();
    }
  }

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
      console.log("audio ended");
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
