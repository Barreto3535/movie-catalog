import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMovieDetails, getSimilarMovies } from "../../services/movieService";
import { MovieCard } from "../../components/MovieCard";
import styles from "./styles.module.css";

function Details() {
  const { id } = useParams<{ id: string }>();
  const movieId = Number(id);

  const [movie, setMovie] = useState<any>(null);
  const [similar, setSimilar] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const details = await getMovieDetails(movieId);
        setMovie(details);

        const sims = await getSimilarMovies(movieId);
        setSimilar(sims);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [movieId]);

  if (loading) return (
    <div className={styles.loadingContainer}>
      <div className={styles.spinner}></div>
      <p>Carregando detalhes do filme...</p>
    </div>
  );

  return (
    <div className={styles.container}>
      <div className={styles.contentWrapper}>
        <div className={styles.infoSection}>
          <div className={styles.posterPlaceholder}>
            {movie.poster_path ? (
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className={styles.poster}
              />
            ) : (
              <div className={styles.noPoster}>🎬</div>
            )}
          </div>

          <div className={styles.info}>
            <h1 className={styles.title}>{movie.title}</h1>

            <div className={styles.metadata}>
              <span className={styles.year}>{movie.release_date?.slice(0, 4)}</span>
              <span className={styles.rating}>
                <span className={styles.star}>★</span>
                {movie.vote_average?.toFixed(1)}
              </span>
              {movie.runtime > 0 && (
                <span className={styles.runtime}>{movie.runtime} min</span>
              )}
            </div>

            <div className={styles.genres}>
              {movie.genres?.map((genre: any) => (
                <span key={genre.id} className={styles.genre}>{genre.name}</span>
              ))}
            </div>

            {movie.tagline && (
              <p className={styles.tagline}>"{movie.tagline}"</p>
            )}

            {movie.overview && (
              <div className={styles.synopsisSection}>
                <h3>Sinopse</h3>
                <p className={styles.synopsis}>{movie.overview}</p>
              </div>
            )}
          </div>
        </div>

        <div className={styles.playerSection}>
          <h3 className={styles.sectionTitle}>Assistir Agora</h3>
          <div className={styles.playerWrapper}>
            <iframe
              src={`https://playerflixapi.com/filme/${id}`}
              // Sandbox restritiva, mas funcional para vídeos
              allow="autoplay; encrypted-media; picture-in-picture"
              allowFullScreen
              frameBorder="0"
              scrolling="no"
              className={styles.player}
              title={movie.title}
            // Remova estilos inline e use a classe .player para tudo
            />
          </div>
        </div>

        {similar.length > 0 && (
          <div className={styles.similarSection}>
            <h3 className={styles.sectionTitle}>Filmes Semelhantes</h3>
            <div className={styles.grid}>
              {similar.map((m) => (
                <MovieCard
                  key={m.id}
                  id={m.id}
                  title={m.title}
                  posterPath={m.poster_path}
                  voteAverage={m.vote_average}
                  releaseDate={m.release_date}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Details;