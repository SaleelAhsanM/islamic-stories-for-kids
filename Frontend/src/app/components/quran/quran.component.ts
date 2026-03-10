import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface Surah {
    number: string;
    name: string;
}

@Component({
    selector: 'app-quran',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './quran.component.html',
    styleUrl: './quran.component.scss',
})
export class QuranComponent implements OnDestroy {
    surahs: Surah[] = [
        { number: '78', name: 'An-Naba' },
        { number: '79', name: 'An-Naziat' },
        { number: '80', name: 'Abasa' },
        { number: '81', name: 'At-Takwir' },
        { number: '82', name: 'Al-Infitar' },
        { number: '83', name: 'Al-Mutaffifin' },
        { number: '84', name: 'Al-Inshiqaq' },
        { number: '85', name: 'Al-Burooj' },
        { number: '86', name: 'At-Tariq' },
        { number: '87', name: 'Al-Ala' },
        { number: '88', name: 'Al-Ghashiya' },
        { number: '89', name: 'Al-Fajr' },
        { number: '90', name: 'Al-Balad' },
        { number: '91', name: 'Ash-Shams' },
        { number: '92', name: 'Al-Lail' },
        { number: '93', name: 'Ad-Dhuha' },
        { number: '94', name: 'Al-Inshirah' },
        { number: '95', name: 'At-Tin' },
        { number: '96', name: 'Al-Alaq' },
        { number: '97', name: 'Al-Qadr' },
        { number: '98', name: 'Al-Bayyina' },
        { number: '99', name: 'Az-Zalzala' },
        { number: '100', name: 'Al-Adiyat' },
        { number: '101', name: 'Al-Qaria' },
        { number: '102', name: 'At-Takathur' },
        { number: '103', name: 'Al-Asr' },
        { number: '104', name: 'Al-Humaza' },
        { number: '105', name: 'Al-Fil' },
        { number: '106', name: 'Quraish' },
        { number: '107', name: 'Al-Maun' },
        { number: '108', name: 'Al-Kauther' },
        { number: '109', name: 'Al-Kafiroon' },
        { number: '110', name: 'An-Nasr' },
        { number: '111', name: 'Al-Masadd' },
        { number: '112', name: 'Al-Ikhlas' },
        { number: '113', name: 'Al-Falaq' },
        { number: '114', name: 'An-Nas' },
    ];

    currentSurah: Surah | null = null;
    isPlaying = false;
    isLoading = false;
    currentTime = 0;
    duration = 0;
    private audio = new Audio();

    constructor() {
        this.audio.addEventListener('play', () => {
            this.isPlaying = true;
            this.isLoading = false;
        });
        this.audio.addEventListener('pause', () => {
            this.isPlaying = false;
        });
        this.audio.addEventListener('ended', () => {
            this.playNext();
        });
        this.audio.addEventListener('timeupdate', () => {
            this.currentTime = this.audio.currentTime;
            this.duration = this.audio.duration || 0;
        });
        this.audio.addEventListener('waiting', () => {
            this.isLoading = true;
        });
        this.audio.addEventListener('canplay', () => {
            this.isLoading = false;
        });
    }

    playSurah(surah: Surah): void {
        if (this.currentSurah?.number === surah.number) {
            this.togglePlayPause();
            return;
        }

        this.currentSurah = surah;
        this.isLoading = true;
        this.audio.src = `https://download.quranicaudio.com/qdc/siddiq_minshawi/kids_repeat/${surah.number}.mp3`;
        this.audio.load();
        this.audio.play();
    }

    togglePlayPause(): void {
        if (this.audio.paused) {
            this.audio.play();
        } else {
            this.audio.pause();
        }
    }

    playNext(): void {
        if (!this.currentSurah) return;
        const idx = this.surahs.findIndex(s => s.number === this.currentSurah!.number);
        if (idx < this.surahs.length - 1) {
            this.playSurah(this.surahs[idx + 1]);
        } else {
            this.isPlaying = false;
            this.currentSurah = null;
        }
    }

    playPrevious(): void {
        if (!this.currentSurah) return;
        const idx = this.surahs.findIndex(s => s.number === this.currentSurah!.number);
        if (idx > 0) {
            this.playSurah(this.surahs[idx - 1]);
        }
    }

    seek(event: MouseEvent, progressBar: HTMLElement): void {
        const rect = progressBar.getBoundingClientRect();
        const percent = (event.clientX - rect.left) / rect.width;
        this.audio.currentTime = percent * this.duration;
    }

    formatTime(seconds: number): string {
        if (!seconds || isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    ngOnDestroy(): void {
        this.audio.pause();
        this.audio.src = '';
    }
}
