import { useState } from 'react';

type Health = { backend?: string; database?: string; version?: string; detail?: string };

export default function App() {
  const [estado, setEstado] = useState<Health | null>(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function probarConexion() {
    setCargando(true);
    setError(null);
    try {
      const res = await fetch('/api/health');
      setEstado(await res.json());
    } catch {
      setError('No se pudo contactar al backend');
    } finally {
      setCargando(false);
    }
  }

  return (
    <main style={{ fontFamily: 'sans-serif', padding: '2rem' }}>
      <h1>Sistema de Eventos: prueba de conexión</h1>
      <button onClick={probarConexion} disabled={cargando}>
        {cargando ? 'Probando...' : 'Probar conexión'}
      </button>
      {error && <p style={{ color: 'crimson' }}>{error}</p>}
      {estado && <pre>{JSON.stringify(estado, null, 2)}</pre>}
    </main>
  );
}