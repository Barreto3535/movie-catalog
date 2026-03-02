import { useNavigate } from "react-router-dom";
import styles from "./styles.module.css";

export function MovieCard({ id, title, posterPath, voteAverage, releaseDate }: {
  id: number;
  title: string;
  posterPath: string;
  voteAverage: number;
  releaseDate: string;
}) {
  const navigate = useNavigate();

  function handleClick() {
    navigate(`/details/${id}`);
  }

  return (
    <div className={styles.card} onClick={handleClick}>
      <div className={styles.posterWrapper}>
        {posterPath ? (
          <img
            src={`https://image.tmdb.org/t/p/w300${posterPath}`}
            alt={title}
            className={styles.poster}
          />
        ) : (
          <div className={styles.noPoster}>Sem imagem</div>
        )}
        <div className={styles.rating}>
          ⭐ {voteAverage.toFixed(1)}
        </div>
      </div>
      <div className={styles.info}>
        <h4 className={styles.title}>{title}</h4>
        <p className={styles.year}>{releaseDate?.slice(0, 4)}</p>
      </div>
    </div>
  );
}