import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Subscription, switchMap } from 'rxjs';
import { StoryService } from '../../services/story.service';
import { Story } from '../../models/story.model';

type Language = 'en' | 'ml';

const AUDIO_API_BASE =
    'https://edj10kw0o2.execute-api.ap-south-1.amazonaws.com/audio';

@Component({
    selector: 'app-story-detail',
    standalone: true,
    imports: [CommonModule, RouterLink],
    templateUrl: './story-detail.component.html',
    styleUrl: './story-detail.component.scss',
})
export class StoryDetailComponent implements OnInit, OnDestroy {
    @ViewChild('audioPlayer') audioPlayer!: ElementRef<HTMLAudioElement>;

    story: Story | undefined;
    isLoading = true;
    currentLang: Language = 'en';

    // ── Audio state ──────────────────────────────────
    isPlaying = false;
    audioUrl: string | null = null;
    audioAvailable = false;
    audioLoading = false;
    currentTime = 0;
    duration = 0;
    volume = 1;

    private sub = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private storyService: StoryService,
        private http: HttpClient
    ) { }

    ngOnInit(): void {
        this.sub = this.route.paramMap
            .pipe(
                switchMap((params) => {
                    const id = params.get('id') ?? '';
                    return this.storyService.getStoryById(id);
                })
            )
            .subscribe({
                next: (story) => {
                    this.story = story;
                    this.isLoading = false;
                    if (story) {
                        this.loadAudio();
                    }
                },
                error: () => {
                    this.isLoading = false;
                },
            });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
        this.stopAudio();
    }

    // ── Language ──────────────────────────────────────
    setLanguage(lang: Language): void {
        if (lang === this.currentLang) return;
        this.currentLang = lang;
        this.stopAudio();
        this.loadAudio();
    }

    // ── Audio loading ────────────────────────────────
    /**
     * Fetches the audio URL from the API.
     * Format: story-<id>-<lang>.mp3
     * If the API fails or returns no data, audioAvailable stays false
     * and the player is hidden.
     */
    private loadAudio(): void {
        if (!this.story) return;

        this.audioAvailable = false;
        this.audioLoading = true;
        this.audioUrl = null;
        this.resetPlayerState();

        const filename = `story-${this.story.id}-${this.currentLang}.mp3`;
        const url = `${AUDIO_API_BASE}?filename=${encodeURIComponent(filename)}`;

        this.http.get(url, { responseType: 'blob' }).subscribe({
            next: (blob) => {
                // Only treat as available if we actually got audio data
                if (blob && blob.size > 0) {
                    this.audioUrl = URL.createObjectURL(blob);
                    this.audioAvailable = true;
                }
                this.audioLoading = false;
            },
            error: () => {
                this.audioAvailable = false;
                this.audioLoading = false;
            },
        });
    }

    private stopAudio(): void {
        const audio = this.audioPlayer?.nativeElement;
        if (audio) {
            audio.pause();
            audio.currentTime = 0;
        }
        // Revoke old blob URL to prevent memory leaks
        if (this.audioUrl) {
            URL.revokeObjectURL(this.audioUrl);
        }
        this.resetPlayerState();
    }

    private resetPlayerState(): void {
        this.isPlaying = false;
        this.currentTime = 0;
        this.duration = 0;
    }

    // ── Player controls ──────────────────────────────
    togglePlay(): void {
        const audio = this.audioPlayer?.nativeElement;
        if (!audio) return;

        if (this.isPlaying) {
            audio.pause();
        } else {
            audio.play();
        }
        this.isPlaying = !this.isPlaying;
    }

    onTimeUpdate(event: Event): void {
        const audio = event.target as HTMLAudioElement;
        this.currentTime = audio.currentTime;
        this.duration = audio.duration || 0;
    }

    onLoadedMetadata(event: Event): void {
        const audio = event.target as HTMLAudioElement;
        this.duration = audio.duration;
    }

    onAudioEnded(): void {
        this.isPlaying = false;
        this.currentTime = 0;
    }

    seekTo(event: Event): void {
        const input = event.target as HTMLInputElement;
        const audio = this.audioPlayer?.nativeElement;
        if (!audio) return;
        audio.currentTime = Number(input.value);
        this.currentTime = audio.currentTime;
    }

    setVolume(event: Event): void {
        const input = event.target as HTMLInputElement;
        const audio = this.audioPlayer?.nativeElement;
        if (!audio) return;
        this.volume = Number(input.value);
        audio.volume = this.volume;
    }

    formatTime(seconds: number): string {
        if (!seconds || isNaN(seconds)) return '0:00';
        const m = Math.floor(seconds / 60);
        const s = Math.floor(seconds % 60);
        return `${m}:${s.toString().padStart(2, '0')}`;
    }

    get progressPercent(): number {
        return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    }
}
