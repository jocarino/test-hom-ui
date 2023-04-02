export type PosterData = {
    title: string;
    description: string;
}

export type PosterDoc = PosterData & { id: string }

export enum State {
    Loading = 'loading',
    Loaded = 'loaded',
    Error = 'error',
    NotFound = 'not-found'
}