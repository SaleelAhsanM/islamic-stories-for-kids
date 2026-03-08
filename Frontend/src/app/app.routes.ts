import { Routes } from '@angular/router';
import { StoryCatalogComponent } from './components/story-catalog/story-catalog.component';
import { StoryDetailComponent } from './components/story-detail/story-detail.component';

export const routes: Routes = [
    {
        path: 'stories',
        component: StoryCatalogComponent,
    },
    {
        path: 'stories/:id',
        component: StoryDetailComponent,
    },
    {
        path: '',
        redirectTo: 'stories',
        pathMatch: 'full',
    },
    {
        path: '**',
        redirectTo: 'stories',
    },
];
