export default function Estadisticas({ jugadores }) {
  return (
    <div className="main-container" style={{ marginTop: '24px' }}>
      <div className="results-info">
        <span><strong>Tabla Comparativa de Rendimiento</strong></span>
        <span>Mostrando {jugadores.length} futbolistas</span>
      </div>

      {jugadores.length === 0 ? (
        <div className="empty-state">
          <h3>No se encontraron jugadores</h3>
          <p>Intenta buscar con otro nombre, equipo o nacionalidad.</p>
        </div>
      ) : (
        <div className="table-card">
          <table className="stats-table">
            <thead>
              <tr>
                <th>#</th>
                <th>Jugador</th>
                <th>Equipo</th>
                <th>Posición</th>
                <th>Partidos</th>
                <th>Goles</th>
                <th>Asistencias</th>
                <th>Rating</th>
              </tr>
            </thead>
            <tbody>
              {jugadores.map((item, index) => {
                const info = item.player;
                const stats = item.statistics[0];
                return (
                  <tr key={info.id}>
                    <td><strong>{index + 1}</strong></td>
                    <td>
                      <div className="table-player-cell">
                        <img src={info.photo} alt={info.name} className="table-avatar" />
                        <div>
                          <div>{info.name}</div>
                          <small style={{ color: '#64748b', fontWeight: 'normal' }}>{info.nationality}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {stats.team.logo && <img src={stats.team.logo} alt={stats.team.name} className="team-logo" />}
                        <span>{stats.team.name}</span>
                      </div>
                    </td>
                    <td>{stats.games.position}</td>
                    <td>{stats.games.appearences ?? 0}</td>
                    <td><strong>{stats.goals.total ?? 0}</strong></td>
                    <td>{stats.goals.assists ?? 0}</td>
                    <td>
                      <span className="rating-badge">
                        {stats.games.rating ? Number(stats.games.rating).toFixed(2) : 'N/A'}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}