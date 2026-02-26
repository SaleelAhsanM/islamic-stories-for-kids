import {
    Component,
    ElementRef,
    OnDestroy,
    OnInit,
    ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Subscription, switchMap } from 'rxjs';
import { StoryService } from '../../services/story.service';
import { Story } from '../../models/story.model';

type Language = 'en' | 'ml';

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
    isPlaying = false;
    currentLang: Language = 'en';
    currentTime = 0;
    duration = 0;
    volume = 1;

    private sub = new Subscription();

    constructor(
        private route: ActivatedRoute,
        private storyService: StoryService
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
                },
                error: () => {
                    this.isLoading = false;
                },
            });
    }

    ngOnDestroy(): void {
        this.sub.unsubscribe();
    }

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

    setLanguage(lang: Language): void {
        this.currentLang = lang;
    }

    get progressPercent(): number {
        return this.duration > 0 ? (this.currentTime / this.duration) * 100 : 0;
    }
}
