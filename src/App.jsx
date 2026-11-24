import { useEffect, useState } from 'react';
import { Routes, Route, NavLink } from 'react-router-dom';
import Estadisticas from './pages/Estadisticas';
import './App.css';

function App() {
  const [jugadores, setJugadores] = useState([]);
  const [busqueda, setBusqueda] = useState('');
  const [posicion, setPosicion] = useState('Todas');
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    const API_KEY = '041f20001625007f70d662ae8908e581';
    const URL = '/api/players/topscorers?league=2&season=2024';

    fetch(URL, {
      method: 'GET',
      headers: {
        'x-apisports-key': API_KEY,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log('Respuesta completa de API-Football:', data);
        console.log('Lista de jugadores:', data.response);

        if (data.response) {
          setJugadores(data.response);
        }
        setCargando(false);
      })
      .catch((error) => {
        console.error('Error al consumir la API:', error);
        setCargando(false);
      });
  }, []);

  // Filtrado en tiempo real por nombre, equipo, nacionalidad y posición
  const jugadoresFiltrados = jugadores.filter((item) => {
    const info = item.player;
    const stats = item.statistics[0];
    const texto = busqueda.toLowerCase();

    const coincideTexto =
      info.name.toLowerCase().includes(texto) ||
      stats.team.name.toLowerCase().includes(texto) ||
      info.nationality.toLowerCase().includes(texto);

    const coincidePosicion =
      posicion === 'Todas' || stats.games.position === posicion;

    return coincideTexto && coincidePosicion;
  });

  return (
    <div>
      {/* Navbar con NavLink para resaltar la ruta activa */}
      <nav className="navbar">
        <div className="navbar-brand">
          ⚽ Fut<span>Market</span>
        </div>
        <div className="navbar-links">
          <NavLink to="/" end className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Explorar Jugadores
          </NavLink>
          <NavLink to="/estadisticas" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Tabla de Estadísticas
          </NavLink>
        </div>
      </nav>

      {/* Hero + Buscador */}
      <header className="hero-section">
        <h1>Marketplace & Scouting de Élite</h1>
        <p>Explora estadísticas oficiales, rendimiento por partido y perfil de los máximos goleadores.</p>

        <div className="search-toolbar">
          <div className="search-input-wrapper">
            <span className="search-icon">🔍</span>
            <input
              type="text"
              className="search-input"
              placeholder="Buscar por jugador, club o país (ej. Haaland, Arsenal, Brazil)..."
              value={busqueda}
              onChange={(e) => setBusqueda(e.target.value)}
            />
          </div>

          <select
            className="filter-select"
            value={posicion}
            onChange={(e) => setPosicion(e.target.value)}
          >
            <option value="Todas">Todas las posiciones</option>
            <option value="Attacker">Delanteros (Attacker)</option>
            <option value="Midfielder">Mediocampistas (Midfielder)</option>
            <option value="Defender">Defensas (Defender)</option>
          </select>
        </div>
      </header>

      {/* Rutas */}
      <Routes>
        <Route
          path="/"
          element={
            <main className="main-container">
              <div className="results-info">
                <span>
                  {cargando
                    ? 'Cargando catálogo de jugadores...'
                    : `Mostrando ${jugadoresFiltrados.length} de ${jugadores.length} jugadores`}
                </span>
                {busqueda && (
                  <button
                    onClick={() => { setBusqueda(''); setPosicion('Todas'); }}
                    style={{ background: 'none', border: 'none', color: '#059669', fontWeight: 'bold', cursor: 'pointer' }}
                  >
                    Limpiar filtros ✕
                  </button>
                )}
              </div>

              {!cargando && jugadoresFiltrados.length === 0 ? (
                <div className="empty-state">
                  <h3>No encontramos jugadores con "{busqueda}"</h3>
                  <p>Prueba buscando otro futbolista, equipo o cambia el filtro de posición.</p>
                </div>
              ) : (
                <div className="players-grid">
                  {jugadoresFiltrados.map((item) => {
                    const info = item.player;
                    const stats = item.statistics[0];
                    return (
                      <div key={info.id} className="player-card">
                        <div className="card-banner">
                          <span className="position-badge">{stats.games.position}</span>
                          <span className="rating-badge">
                            ★ {stats.games.rating ? Number(stats.games.rating).toFixed(1) : 'N/A'}
                          </span>
                        </div>

                        <div className="avatar-wrapper">
                          <img src={info.photo} alt={info.name} className="player-avatar" />
                        </div>

                        <div className="card-body">
                          <h3 className="player-name">{info.name}</h3>
                          <div className="player-team">
                            {stats.team.logo && (
                              <img src={stats.team.logo} alt={stats.team.name} className="team-logo" />
                            )}
                            <span>{stats.team.name} • {info.nationality}</span>
                          </div>

                          <div className="stats-row">
                            <div className="stat-box">
                              <span className="stat-value">{stats.goals.total ?? 0}</span>
                              <span className="stat-label">Goles</span>
                            </div>
                            <div className="stat-box">
                              <span className="stat-value">{stats.goals.assists ?? 0}</span>
                              <span className="stat-label">Asist.</span>
                            </div>
                            <div className="stat-box">
                              <span className="stat-value">{stats.games.appearences ?? 0}</span>
                              <span className="stat-label">Partidos</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </main>
          }
        />
        <Route path="/estadisticas" element={<Estadisticas jugadores={jugadoresFiltrados} />} />
      </Routes>
    </div>
  );
}

export default App;