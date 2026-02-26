import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Story } from '../models/story.model';
import { MOCK_STORIES } from '../data/mock-stories.data';

@Injectable({
    providedIn: 'root',
})
export class StoryService {
    // HttpClient is injected here for future use with a real API.
    // Currently all methods return mock data via rxjs `of()`.
    constructor(private http: HttpClient) { }

    getStories(): Observable<Story[]> {
        return of(MOCK_STORIES);
    }

    getStoryById(id: string): Observable<Story | undefined> {
        const story = MOCK_STORIES.find((s) => s.id === id);
        return of(story);
    }
}
