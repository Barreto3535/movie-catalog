import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import { useNavigate } from 'react-router-dom';
import styles from './styles.module.css';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function signIn(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMsg(null);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setMsg(error.message);
    } else {
      navigate("/home");
    }

    setLoading(false);
  }

  return (
    <div className={styles.container}>
      <form onSubmit={signIn} className={styles.form}>
        {msg && (
          <div className={styles.errorMessage}>
            Não foi possível entrar: {msg}
          </div>
        )}

        <div className={styles.formGroup}>
          <label htmlFor="email" className={styles.label}>
            E-mail
          </label>
          <input
            type="email"
            id="email"
            name="email"
            placeholder="Digite seu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <div className={styles.formGroup}>
          <label htmlFor="password" className={styles.label}>
            Senha
          </label>
          <input
            type="password"
            id="password"
            name="password"
            placeholder="Digite sua senha"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className={styles.input}
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={styles.button}
        >
          {loading ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </div>
  );
}