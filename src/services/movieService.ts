import { getApiKey } from "./keyService";

const BASE_URL = "https://api.themoviedb.org/3";

// Tipagem básica de filme
export interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  release_date: string;
}

// Função auxiliar para requisições
async function fetchFromTMDB(endpoint: string) {
  const token = await getApiKey(); // mesmo sendo token, mantemos nome getApiKey
  if (!token) throw new Error("Token não encontrado");

  const res = await fetch(`${BASE_URL}${endpoint}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    throw new Error(`Erro TMDB: ${res.status} ${res.statusText}`);
  }

  return res.json();
}

// Filmes populares
export async function getPopularMovies(): Promise<Movie[]> {
  const data = await fetchFromTMDB("/movie/popular?language=pt-BR");
  return data.results;
}

// Filmes por categoria (genreId)
export async function getMoviesByCategory(genreId: number, page: number = 1): Promise<{ results: Movie[]; total_pages: number }> {
  const data = await fetchFromTMDB(`/discover/movie?with_genres=${genreId}&language=pt-BR&page=${page}`);
  return { results: data.results, total_pages: data.total_pages };
}
// Lista de gêneros
export async function getGenres(): Promise<{ id: number; name: string }[]> {
  const data = await fetchFromTMDB("/genre/movie/list?language=pt-BR");
  return data.genres;
}
// Buscar filmes por nome com paginação
export async function searchMovies(query: string, page: number = 1): Promise<{ results: Movie[]; total_pages: number }> {
  const data = await fetchFromTMDB(`/search/movie?query=${encodeURIComponent(query)}&language=pt-BR&page=${page}`);
  return { results: data.results, total_pages: data.total_pages };
}
// Detalhes de um filme
export async function getMovieDetails(id: number) {
  return await fetchFromTMDB(`/movie/${id}?language=pt-BR`);
}

// Filmes similares
export async function getSimilarMovies(id: number) {
  const data = await fetchFromTMDB(`/movie/${id}/similar?language=pt-BR`);
  return data.results;
}