import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getMoviesByCategory, getGenres } from "../../services/movieService";
import { MovieCard } from "../../components/MovieCard";
import styles from "./styles.module.css";

function Category() {
  const { id } = useParams<{ id: string }>();
  const genreId = Number(id);

  const [movies, setMovies] = useState<any[]>([]);
  const [genreName, setGenreName] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const { results, total_pages } = await getMoviesByCategory(genreId, page);
        setMovies(results);
        setTotalPages(total_pages);

        const genres = await getGenres();
        const g = genres.find((x) => x.id === genreId);
        setGenreName(g ? g.name : "Categoria");
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [genreId, page]);

  if (loading) return <div style={{ padding: 24 }}>Carregando filmes...</div>;

  return (
    <div className={styles.container}>
      <h2>{genreName}</h2>
      <div className={styles.grid}>
        {movies.map((m) => (
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

      <div className={styles.pagination}>
        <button onClick={() => setPage((p) => Math.max(p - 1, 1))} disabled={page === 1}>
          Anterior
        </button>
        <span>Página {page} de {totalPages}</span>
        <button onClick={() => setPage((p) => Math.min(p + 1, totalPages))} disabled={page === totalPages}>
          Próxima
        </button>
      </div>
    </div>
  );
}

export default Category;