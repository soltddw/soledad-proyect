const https://cedhdbkktjqyfcshsnfv.supabase.co= 'https://tu-proyecto.supabase.co';
const eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNlZGhkYmtrdGpxeWZjc2hzbmZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIwNTcxNDAsImV4cCI6MjEwNzYzMzE0MH0.kcySS2yG0lXZ0-V-UVQpYLFTmsoDlpH_534euw6VsrY= 'tu-clave-anon-publica';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const likeBtn = document.getElementById('like-btn');
const likeCountSpan = document.getElementById('like-count');

let currentCount = 0;
const RECORD_ID = 1;

// 1. Obtener el valor inicial al cargar la página
async function fetchInitialLikes() {
    const { data, error } = await supabaseClient
        .from('likes_counter')
        .select('count')
        .eq('id', RECORD_ID)
        .single();

    if (error) {
        console.error('Error al obtener los likes:', error.message);
    } else if (data) {
        currentCount = data.count;
        likeCountSpan.textContent = currentCount;
    }
}

// 2. Incrementar el contador en la base de datos al hacer clic
likeBtn.addEventListener('click', async () => {
    const newCount = currentCount + 1;
    
    const { error } = await supabaseClient
        .from('likes_counter')
        .update({ count: newCount })
        .eq('id', RECORD_ID);

    if (error) {
        console.error('Error al actualizar el like:', error.message);
    }
});

// 3. Escuchar cambios en tiempo real mediante Supabase Realtime
supabaseClient
    .channel('public:likes_counter')
    .on('postgres_changes', { 
        event: 'UPDATE', 
        schema: 'public', 
        table: 'likes_counter' 
    }, (payload) => {
        currentCount = payload.new.count;
        likeCountSpan.textContent = currentCount;
    })
    .subscribe();

fetchInitialLikes();