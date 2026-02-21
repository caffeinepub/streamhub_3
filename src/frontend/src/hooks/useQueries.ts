import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useActor } from './useActor';
import { Principal } from '@icp-sdk/core/principal';
import type { Movie, TVShow, Episode } from '../backend';

// Movie queries
export function useGetMovie(movieId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['movie', movieId],
    queryFn: async () => {
      if (!actor || !movieId) return null;
      const principal = Principal.fromText(movieId);
      return await actor.getMovie(principal);
    },
    enabled: !!actor && !isFetching && !!movieId,
  });
}

// TV Show queries
export function useGetTVShow(showId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['tvshow', showId],
    queryFn: async () => {
      if (!actor || !showId) return null;
      const principal = Principal.fromText(showId);
      return await actor.getTVShow(principal);
    },
    enabled: !!actor && !isFetching && !!showId,
  });
}

// Episode queries
export function useGetEpisode(episodeId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['episode', episodeId],
    queryFn: async () => {
      if (!actor || !episodeId) return null;
      const principal = Principal.fromText(episodeId);
      return await actor.getEpisode(principal);
    },
    enabled: !!actor && !isFetching && !!episodeId,
  });
}

export function useGetEpisodesByTVShow(showId: string | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['episodes', showId],
    queryFn: async () => {
      if (!actor || !showId) return [];
      const principal = Principal.fromText(showId);
      return await actor.getEpisodesByTVShow(principal);
    },
    enabled: !!actor && !isFetching && !!showId,
  });
}

export function useGetEpisodesBySeason(showId: string | undefined, seasonNumber: number | undefined) {
  const { actor, isFetching } = useActor();

  return useQuery({
    queryKey: ['episodes', showId, seasonNumber],
    queryFn: async () => {
      if (!actor || !showId || seasonNumber === undefined) return [];
      const principal = Principal.fromText(showId);
      return await actor.getEpisodesBySeason(principal, BigInt(seasonNumber));
    },
    enabled: !!actor && !isFetching && !!showId && seasonNumber !== undefined,
  });
}

// Mutations
export function useAddMovie() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (movie: Movie) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.addMovie(movie);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movies'] });
    },
  });
}

export function useAddTVShow() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (tvShow: TVShow) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.addTVShow(tvShow);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tvshows'] });
    },
  });
}

export function useAddEpisode() {
  const { actor } = useActor();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (episode: Episode) => {
      if (!actor) throw new Error('Actor not initialized');
      return await actor.addEpisode(episode);
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['episodes', variables.tvShowId.toString()] });
    },
  });
}
