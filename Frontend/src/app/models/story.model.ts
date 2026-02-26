export interface BilingualText {
    en: string;
    ml: string;
}

export interface Story {
    id: string;
    title: BilingualText;
    content: BilingualText;
    coverImageUrl: string;
    audioUrl: string;
    ageGroup?: string;
    durationMinutes?: number;
    storyImages?: string[]; // inline illustrated images shown in the reading view
}
