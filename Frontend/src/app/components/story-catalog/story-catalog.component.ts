import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StoryCardComponent } from '../story-card/story-card.component';
import { StoryService } from '../../services/story.service';
import { Story } from '../../models/story.model';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-story-catalog',
    standalone: true,
    imports: [CommonModule, StoryCardComponent],
    templateUrl: './story-catalog.component.html',
    styleUrl: './story-catalog.component.scss',
})
export class StoryCatalogComponent implements OnInit, OnDestroy {
    stories: Story[] = [];
    isLoading = true;
    private sub = new Subscription();

    constructor(private storyService: StoryService) { }

    ngOnInit(): void {
        this.sub = this.storyService.getStories().subscribe({
            next: (data) => {
                this.stories = data;
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
}
