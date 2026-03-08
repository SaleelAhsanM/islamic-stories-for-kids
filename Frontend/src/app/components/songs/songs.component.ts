import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
    selector: 'app-songs',
    standalone: true,
    templateUrl: './songs.component.html',
    styleUrl: './songs.component.scss',
})
export class SongsComponent {
    spotifyEmbedUrl: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) {
        this.spotifyEmbedUrl = this.sanitizer.bypassSecurityTrustResourceUrl(
            'https://open.spotify.com/embed/artist/7wrjawCOts34rqzil06HEe?utm_source=generator'
        );
    }
}
