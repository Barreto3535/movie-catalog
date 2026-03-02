import { supabase } from '../lib/supabaseClient';


export async function getApiKey(): Promise<string | null> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    console.error("Nenhum usuário logado");
    return null;
  }

  const { data, error } = await supabase
    .from("api_keys")
    .select("key")
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("Erro ao buscar API Key:", error);
    return null;
  }

  return data?.key ?? null;
}