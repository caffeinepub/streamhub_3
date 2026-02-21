import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface Movie {
    title: string;
    duration: bigint;
    thumbnailUrl: string;
    description: string;
    genre: string;
    videoUrl: string;
    releaseYear: bigint;
}
export interface TVShow {
    title: string;
    thumbnailUrl: string;
    seasons: bigint;
    description: string;
}
export interface Episode {
    title: string;
    duration: bigint;
    thumbnailUrl: string;
    description: string;
    tvShowId: Principal;
    seasonNumber: bigint;
    episodeNumber: bigint;
    videoUrl: string;
}
export interface backendInterface {
    addEpisode(episode: Episode): Promise<Principal>;
    addMovie(movie: Movie): Promise<Principal>;
    addTVShow(tvShow: TVShow): Promise<Principal>;
    deleteEpisode(): Promise<void>;
    deleteMovie(): Promise<void>;
    deleteTVShow(): Promise<void>;
    getEpisode(episodeId: Principal): Promise<Episode>;
    getEpisodesBySeason(tvShowId: Principal, seasonNumber: bigint): Promise<Array<Episode>>;
    getEpisodesByTVShow(tvShowId: Principal): Promise<Array<Episode>>;
    getMovie(movieId: Principal): Promise<Movie>;
    getTVShow(tvShowId: Principal): Promise<TVShow>;
    updateEpisode(episode: Episode): Promise<void>;
    updateMovie(movie: Movie): Promise<void>;
    updateTVShow(tvShow: TVShow): Promise<void>;
}
