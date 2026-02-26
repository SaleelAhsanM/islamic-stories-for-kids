import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Story } from '../../models/story.model';

@Component({
    selector: 'app-story-card',
    standalone: true,
    imports: [RouterLink],
    templateUrl: './story-card.component.html',
    styleUrl: './story-card.component.scss',
})
export class StoryCardComponent {
    @Input({ required: true }) story!: Story;
}
