import { useEffect, useState } from "react";
import { getGenres, getMoviesByCategory, getPopularMovies } from "../../services/movieService";
import { Carousel } from "../../components/Carousel";
import styles from "./styles.module.css";

function Home() {
  const [popular, setPopular] = useState<any[]>([]);
  const [genres, setGenres] = useState<any[]>([]);
  const [moviesByCategory, setMoviesByCategory] = useState<Record<number, any[]>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        // Populares
        const popularMovies = await getPopularMovies();
        setPopular(popularMovies);

        // Gêneros
        const gs = await getGenres();
        setGenres(gs);

        // Filmes por categoria (só primeira página)
        const results: Record<number, any[]> = {};
        for (const g of gs.slice(0, 4)) { // pega só 4 categorias pra não poluir
          const { results: movies } = await getMoviesByCategory(g.id, 1);
          results[g.id] = movies;
        }
        setMoviesByCategory(results);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  if (loading) return <div style={{ padding: 24 }}>Carregando...</div>;

  return (
    <div className={styles.container}>
      <h2>Mais Populares</h2>
      <Carousel movies={popular} />

      {genres.slice(0, 4).map((g) => (
        <div key={g.id} className={styles.section}>
          <h3>{g.name}</h3>
          <Carousel movies={moviesByCategory[g.id] || []} />
        </div>
      ))}
    </div>
  );
}

export default Home;