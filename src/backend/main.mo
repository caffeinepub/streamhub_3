import Map "mo:core/Map";
import Runtime "mo:core/Runtime";
import Array "mo:core/Array";
import Principal "mo:core/Principal";
import Text "mo:core/Text";

actor {
  type Movie = {
    title : Text;
    description : Text;
    thumbnailUrl : Text;
    videoUrl : Text;
    duration : Nat;
    genre : Text;
    releaseYear : Nat;
  };

  type TVShow = {
    title : Text;
    description : Text;
    thumbnailUrl : Text;
    seasons : Nat;
  };

  type Episode = {
    tvShowId : Principal;
    title : Text;
    description : Text;
    thumbnailUrl : Text;
    videoUrl : Text;
    duration : Nat;
    seasonNumber : Nat;
    episodeNumber : Nat;
  };

  let movies = Map.empty<Principal, Movie>();
  let tvShows = Map.empty<Principal, TVShow>();
  let episodes = Map.empty<Principal, Episode>();

  public shared ({ caller }) func addMovie(movie : Movie) : async Principal {
    movies.add(caller, movie);
    caller;
  };

  public shared ({ caller }) func updateMovie(movie : Movie) : async () {
    if (not movies.containsKey(caller)) {
      Runtime.trap("Movie does not exist");
    };
    movies.add(caller, movie);
  };

  public shared ({ caller }) func deleteMovie() : async () {
    if (not movies.containsKey(caller)) {
      Runtime.trap("Movie does not exist");
    };
    movies.remove(caller);
  };

  public query ({ caller }) func getMovie(movieId : Principal) : async Movie {
    switch (movies.get(movieId)) {
      case (null) { Runtime.trap("Movie does not exist") };
      case (?movie) { movie };
    };
  };

  public shared ({ caller }) func addTVShow(tvShow : TVShow) : async Principal {
    tvShows.add(caller, tvShow);
    caller;
  };

  public shared ({ caller }) func updateTVShow(tvShow : TVShow) : async () {
    if (not tvShows.containsKey(caller)) {
      Runtime.trap("TV show does not exist");
    };
    tvShows.add(caller, tvShow);
  };

  public shared ({ caller }) func deleteTVShow() : async () {
    if (not tvShows.containsKey(caller)) {
      Runtime.trap("TV show does not exist");
    };
    tvShows.remove(caller);
  };

  public query ({ caller }) func getTVShow(tvShowId : Principal) : async TVShow {
    switch (tvShows.get(tvShowId)) {
      case (null) { Runtime.trap("TV show does not exist") };
      case (?tvShow) { tvShow };
    };
  };

  public shared ({ caller }) func addEpisode(episode : Episode) : async Principal {
    if (not tvShows.containsKey(episode.tvShowId)) {
      Runtime.trap("TV show does not exist");
    };
    episodes.add(caller, episode);
    caller;
  };

  public shared ({ caller }) func updateEpisode(episode : Episode) : async () {
    if (not episodes.containsKey(caller)) {
      Runtime.trap("Episode does not exist");
    };
    episodes.add(caller, episode);
  };

  public shared ({ caller }) func deleteEpisode() : async () {
    if (not episodes.containsKey(caller)) {
      Runtime.trap("Episode does not exist");
    };
    episodes.remove(caller);
  };

  public query ({ caller }) func getEpisode(episodeId : Principal) : async Episode {
    switch (episodes.get(episodeId)) {
      case (null) { Runtime.trap("Episode does not exist") };
      case (?episode) { episode };
    };
  };

  public query ({ caller }) func getEpisodesByTVShow(tvShowId : Principal) : async [Episode] {
    if (not tvShows.containsKey(tvShowId)) {
      Runtime.trap("TV show does not exist");
    };
    episodes.values().toArray().filter(
      func(e) { e.tvShowId == tvShowId }
    );
  };

  public query ({ caller }) func getEpisodesBySeason(tvShowId : Principal, seasonNumber : Nat) : async [Episode] {
    if (not tvShows.containsKey(tvShowId)) {
      Runtime.trap("TV show does not exist");
    };
    episodes.values().toArray().filter(
      func(e) { e.tvShowId == tvShowId and e.seasonNumber == seasonNumber }
    );
  };
};
