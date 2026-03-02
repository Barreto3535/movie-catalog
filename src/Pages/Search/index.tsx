import { useState } from "react";
import { searchMovies } from "../../services/movieService";
import { MovieCard } from "../../components/MovieCard";
import styles from "./styles.module.css";

function Search() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  async function handleSearch(e?: React.FormEvent) {
    if (e) e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const { results, total_pages } = await searchMovies(query, page);
      setResults(results);
      setTotalPages(total_pages);
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  function nextPage() {
    if (page < totalPages) {
      setPage((p) => p + 1);
      handleSearch();
    }
  }

  function prevPage() {
    if (page > 1) {
      setPage((p) => p - 1);
      handleSearch();
    }
  }

  return (
    <div className={styles.container}>
      <h2>Buscar Filmes</h2>
      <form onSubmit={handleSearch} className={styles.form}>
        <input
          type="text"
          placeholder="Digite o nome do filme..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <button type="submit">Buscar</button>
      </form>

      {loading && <p>Carregando...</p>}

      <div className={styles.results}>
        {results.map((m) => (
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

      {results.length > 0 && (
        <div className={styles.pagination}>
          <button onClick={prevPage} disabled={page === 1}>Anterior</button>
          <span>Página {page} de {totalPages}</span>
          <button onClick={nextPage} disabled={page === totalPages}>Próxima</button>
        </div>
      )}
    </div>
  );
}

export default Search;