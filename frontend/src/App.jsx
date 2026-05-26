import React, { useState, useEffect } from 'react';
import api from './api';
import { Activity, Server, AlertCircle, Database, Plus, RefreshCw, Layers, X, User, Shield, Trophy, Award } from 'lucide-react';

function App() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('teams'); // teams or players

  // Modal Detail State
  const [selectedItem, setSelectedItem] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalLoading, setModalLoading] = useState(false);

  // Modal Create State
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [teamsList, setTeamsList] = useState([]);

  // Form Inputs - Team
  const [teamName, setTeamName] = useState('');
  const [teamCoach, setTeamCoach] = useState('');

  // Form Inputs - Player
  const [playerName, setPlayerName] = useState('');
  const [playerPosition, setPlayerPosition] = useState('');
  const [playerTeamId, setPlayerTeamId] = useState('');

  const fetchTeamsList = async () => {
    try {
      const response = await api.get('/teams');
      setTeamsList(response.data);
      if (response.data.length > 0) {
        setPlayerTeamId(response.data[0].id.toString());
      }
    } catch (err) {
      console.error("Gagal mengambil daftar tim", err);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`/${activeTab}`);
      setData(response.data);
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        "Gagal terhubung ke API Laravel. Pastikan server Laravel sedang berjalan (php artisan serve)."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleOpenDetail = async (item) => {
    setSelectedItem(item);
    setIsModalOpen(true);
    if (activeTab === 'teams') {
      setModalLoading(true);
      try {
        const response = await api.get(`/teams/${item.id}`);
        setSelectedItem(response.data);
      } catch (err) {
        console.error("Gagal memuat detail tim", err);
      } finally {
        setModalLoading(false);
      }
    }
  };

  const handleCreateItem = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (activeTab === 'teams') {
        await api.post('/teams', {
          name: teamName,
          coach: teamCoach,
        });
        setTeamName('');
        setTeamCoach('');
      } else {
        await api.post('/players', {
          name: playerName,
          position: playerPosition,
          team_id: playerTeamId,
        });
        setPlayerName('');
        setPlayerPosition('');
        setPlayerTeamId('');
      }
      setIsCreateOpen(false);
      fetchData();
    } catch (err) {
      console.error("Gagal menyimpan data", err);
      alert(err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setSubmitting(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchTeamsList();
  }, [activeTab]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans selection:bg-blue-200">
      {/* Navbar */}
      <nav className="glass sticky top-0 z-50 shadow-sm border-b border-slate-200/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-3">
              <div className="bg-emerald-600 p-2 rounded-xl shadow-lg shadow-emerald-500/30">
                <Trophy className="text-white w-6 h-6" />
              </div>
              <span className="font-bold text-xl tracking-tight text-white">
                Liga<span className="text-emerald-400">Mini</span>
              </span>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 px-3 py-1.5 bg-gradient-to-r from-emerald-500/10 to-teal-500/10 rounded-full border border-emerald-500/20 text-sm font-medium">
                <span className="text-emerald-700 text-xs font-bold px-2 py-0.5 bg-emerald-100 rounded-full animate-pulse">Live</span>
                <span className="text-slate-600 font-semibold pr-2">System Active</span>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          {/* Tab Selector */}
          <div className="flex space-x-1 p-1 bg-slate-200/60 rounded-xl w-max shadow-inner">
            <button
              onClick={() => setActiveTab('teams')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === 'teams' 
                  ? 'bg-white text-blue-600 shadow-md transform scale-105' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Teams
            </button>
            <button
              onClick={() => setActiveTab('players')}
              className={`px-6 py-2 rounded-lg text-sm font-bold transition-all duration-300 ${
                activeTab === 'players' 
                  ? 'bg-white text-blue-600 shadow-md transform scale-105' 
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/50'
              }`}
            >
              Players
            </button>
          </div>

          <div className="flex gap-3">
            <button 
              onClick={() => setIsCreateOpen(true)}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-bold text-sm shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300 ${
                activeTab === 'teams'
                  ? 'bg-gradient-to-r from-blue-600 to-blue-500 shadow-blue-500/30'
                  : 'bg-gradient-to-r from-indigo-600 to-indigo-500 shadow-indigo-500/30'
              }`}
            >
              <Plus className="w-4 h-4" />
              {activeTab === 'teams' ? 'Tambah Klub' : 'Tambah Pemain'}
            </button>
            <button 
              onClick={fetchData}
              className="flex items-center gap-2 bg-white px-5 py-2.5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md hover:bg-slate-50 transition-all duration-300 text-slate-700 font-bold group"
            >
              <RefreshCw className={`w-4 h-4 text-slate-500 group-hover:text-blue-600 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>
        </div>

        {/* Data Container */}
        <div className="bg-white rounded-2xl shadow-sm border border-slate-200/60 p-6 min-h-[400px]">
          {loading ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-slate-400">
              <Activity className="w-12 h-12 animate-pulse text-blue-500 mb-4" />
              <p className="font-medium animate-pulse">Menghubungkan ke API Laravel...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center h-full min-h-[300px] text-center max-w-md mx-auto">
              <div className="bg-red-50 p-4 rounded-full mb-4">
                <AlertCircle className="w-10 h-10 text-red-500" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Koneksi Gagal</h3>
              <p className="text-slate-500 mb-6">{error}</p>
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 w-full text-left">
                <p className="text-sm font-semibold text-slate-700 mb-2">Langkah Perbaikan:</p>
                <ol className="text-sm text-slate-600 list-decimal pl-4 space-y-1">
                  <li>Pastikan backend Laravel sudah berjalan</li>
                  <li>Jalankan <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">php artisan serve</code></li>
                  <li>Periksa file <code className="bg-slate-200 px-1 py-0.5 rounded text-slate-800">.env</code> di project React ini, pastikan VITE_API_BASE_URL benar</li>
                  <li>Pastikan konfigurasi CORS di Laravel sudah diizinkan untuk frontend ini</li>
                </ol>
              </div>
            </div>
          ) : (
            <div>
              {/* Klasemen / Top Skor Header */}
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h3 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                    {activeTab === 'teams' ? (
                      <>
                        <Trophy className="w-5 h-5 text-amber-500" />
                        Klasemen Sepak Bola
                      </>
                    ) : (
                      <>
                        <Award className="w-5 h-5 text-indigo-500" />
                        Top Skor Sementara
                      </>
                    )}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    {activeTab === 'teams' ? 'Urutan berdasarkan perolehan poin tertinggi.' : 'Urutan pencetak gol terbanyak.'}
                  </p>
                </div>
                <span className="bg-slate-100 text-slate-700 py-1 px-3 rounded-full text-xs font-bold border border-slate-200">
                  {Array.isArray(data) ? data.length : 0} {activeTab === 'teams' ? 'Klub' : 'Pemain'}
                </span>
              </div>
              
              {!data || (Array.isArray(data) && data.length === 0) ? (
                <div className="text-center py-12 border-2 border-dashed border-slate-200 rounded-xl">
                  <Database className="w-10 h-10 text-slate-300 mx-auto mb-3" />
                  <p className="text-slate-500 font-medium mb-1">Belum ada data</p>
                  <p className="text-xs text-slate-400">Buat data baru di backend Anda untuk melihatnya di sini.</p>
                </div>
              ) : activeTab === 'teams' ? (
                /* KLASEMEN TIM */
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="px-4 py-4 text-center w-12">Pos</th>
                        <th className="px-6 py-4">Klub</th>
                        <th className="px-4 py-4 text-center">Main</th>
                        <th className="px-4 py-4 text-center text-green-600">M</th>
                        <th className="px-4 py-4 text-center text-amber-600">S</th>
                        <th className="px-4 py-4 text-center text-red-600">K</th>
                        <th className="px-4 py-4 text-center font-bold text-slate-900 bg-slate-100/50">Poin</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4 text-center font-bold text-slate-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-blue-50 p-2 rounded-lg text-blue-600">
                                <Shield className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{item.name}</div>
                                <div className="text-xs text-slate-500">Pelatih: {item.coach || '-'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-medium text-slate-600">{item.played}</td>
                          <td className="px-4 py-4 text-center font-medium text-green-600">{item.won}</td>
                          <td className="px-4 py-4 text-center font-medium text-amber-600">{item.drawn}</td>
                          <td className="px-4 py-4 text-center font-medium text-red-600">{item.lost}</td>
                          <td className="px-4 py-4 text-center font-extrabold text-slate-950 bg-slate-50">{item.points}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleOpenDetail(item)}
                              className="text-blue-600 hover:text-blue-800 font-semibold text-xs px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition-all"
                            >
                              Detail Klub
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                /* TOP SKOR PLAYERS */
                <div className="overflow-x-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                      <tr>
                        <th className="px-4 py-4 text-center w-12">Pos</th>
                        <th className="px-6 py-4">Pemain</th>
                        <th className="px-6 py-4">Klub</th>
                        <th className="px-4 py-4 text-center font-bold text-slate-900 bg-indigo-50">Gol</th>
                        <th className="px-6 py-4 text-right">Aksi</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                      {data.map((item, index) => (
                        <tr key={item.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-4 py-4 text-center font-bold text-slate-500">
                            {index + 1}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="bg-indigo-50 p-2 rounded-lg text-indigo-600">
                                <User className="w-5 h-5" />
                              </div>
                              <div>
                                <div className="font-bold text-slate-900">{item.name}</div>
                                <div className="text-xs text-slate-500">Posisi: {item.position || '-'}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                              <Shield className="w-4 h-4 text-slate-400" />
                              {item.team?.name || '-'}
                            </div>
                          </td>
                          <td className="px-4 py-4 text-center font-extrabold text-indigo-950 bg-indigo-50/50">{item.goals}</td>
                          <td className="px-6 py-4 text-right">
                            <button 
                              onClick={() => handleOpenDetail(item)}
                              className="text-indigo-600 hover:text-indigo-800 font-semibold text-xs px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 rounded-lg transition-all"
                            >
                              Detail Pemain
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      {/* DETAIL MODAL */}
      {isModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl text-white ${activeTab === 'teams' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-indigo-600 shadow-indigo-500/20'} shadow-lg`}>
                  {activeTab === 'teams' ? <Shield className="w-6 h-6" /> : <User className="w-6 h-6" />}
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">{selectedItem.name}</h3>
                  <p className="text-xs text-slate-500">
                    {activeTab === 'teams' ? `Detail Klub Sepak Bola` : `Profil Pemain Profesional`}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedItem(null);
                }}
                className="text-slate-400 hover:text-slate-600 p-1 bg-white hover:bg-slate-100 rounded-full border border-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6">
              {activeTab === 'teams' ? (
                /* DETAIL TIM */
                <div className="space-y-6">
                  {/* Stats Card */}
                  <div className="grid grid-cols-2 gap-4 bg-blue-50/50 p-4 rounded-xl border border-blue-100/50">
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Nama Pelatih</div>
                      <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedItem.coach || '-'}</div>
                    </div>
                    <div>
                      <div className="text-xs text-slate-500 font-medium">Total Poin</div>
                      <div className="font-extrabold text-blue-700 text-lg mt-0.5">{selectedItem.points || 0} Pts</div>
                    </div>
                    <div className="col-span-2 grid grid-cols-4 gap-2 pt-2 border-t border-blue-100 text-center">
                      <div>
                        <div className="text-[10px] text-slate-500 uppercase font-bold">Main</div>
                        <div className="font-bold text-slate-700">{selectedItem.played || 0}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-green-600 uppercase font-bold">Menang</div>
                        <div className="font-bold text-green-600">{selectedItem.won || 0}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-amber-600 uppercase font-bold">Seri</div>
                        <div className="font-bold text-amber-600">{selectedItem.drawn || 0}</div>
                      </div>
                      <div>
                        <div className="text-[10px] text-red-600 uppercase font-bold">Kalah</div>
                        <div className="font-bold text-red-600">{selectedItem.lost || 0}</div>
                      </div>
                    </div>
                  </div>

                  {/* Daftar Pemain */}
                  <div>
                    <h4 className="font-bold text-sm text-slate-800 mb-3 flex items-center gap-1.5">
                      <User className="w-4 h-4 text-slate-500" />
                      Skuad Pemain ({selectedItem.players?.length || 0})
                    </h4>
                    {modalLoading ? (
                      <div className="flex items-center justify-center py-6 text-slate-400 gap-2 text-sm font-medium">
                        <Activity className="w-4 h-4 animate-spin text-blue-500" />
                        Memuat skuad pemain...
                      </div>
                    ) : !selectedItem.players || selectedItem.players.length === 0 ? (
                      <div className="text-center py-4 bg-slate-50 border border-dashed border-slate-200 rounded-lg text-xs text-slate-500">
                        Belum ada pemain terdaftar di klub ini.
                      </div>
                    ) : (
                      <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                        {selectedItem.players.map((player) => (
                          <div key={player.id} className="flex justify-between items-center p-2.5 bg-slate-50 rounded-lg border border-slate-100 hover:bg-slate-100/50 transition-colors">
                            <div>
                              <div className="font-semibold text-slate-800 text-xs">{player.name}</div>
                              <div className="text-[10px] text-slate-500">Posisi: {player.position || '-'}</div>
                            </div>
                            <span className="bg-indigo-50 text-indigo-700 py-0.5 px-2 rounded-full text-[10px] font-extrabold border border-indigo-100 flex items-center gap-0.5">
                              {player.goals} Gol
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                /* DETAIL PEMAIN */
                <div className="space-y-4">
                  <div className="bg-indigo-50/50 p-5 rounded-xl border border-indigo-100/50 space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Posisi Bermain</div>
                        <div className="font-bold text-slate-800 text-sm mt-0.5">{selectedItem.position || '-'}</div>
                      </div>
                      <div>
                        <div className="text-xs text-slate-500 font-medium">Jumlah Gol</div>
                        <div className="font-extrabold text-indigo-700 text-lg mt-0.5 flex items-center gap-1">
                          <Trophy className="w-4 h-4 text-amber-500" />
                          {selectedItem.goals} Gol
                        </div>
                      </div>
                    </div>
                    
                    <div className="pt-3 border-t border-indigo-100 flex items-center gap-2">
                      <Shield className="w-5 h-5 text-indigo-500" />
                      <div>
                        <div className="text-[10px] text-slate-500 font-semibold uppercase">Klub Terdaftar</div>
                        <div className="font-bold text-slate-700 text-xs">{selectedItem.team?.name || '-'}</div>
                      </div>
                    </div>
                  </div>

                  <div className="text-xs text-slate-500 italic text-center px-4">
                    "Statistik gol dihitung berdasarkan performa di seluruh turnamen resmi liga."
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end">
              <button 
                onClick={() => {
                  setIsModalOpen(false);
                  setSelectedItem(null);
                }}
                className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-sm transition-all"
              >
                Tutup Detail
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE MODAL */}
      {isCreateOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden border border-slate-100 animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex justify-between items-center p-6 border-b border-slate-100 bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl text-white ${activeTab === 'teams' ? 'bg-blue-600 shadow-blue-500/20' : 'bg-indigo-600 shadow-indigo-500/20'} shadow-lg`}>
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-lg text-slate-900">
                    {activeTab === 'teams' ? 'Tambah Klub Baru' : 'Tambah Pemain Baru'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {activeTab === 'teams' ? 'Buat klub sepak bola baru ke dalam liga.' : 'Daftarkan pemain baru ke klub yang ada.'}
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsCreateOpen(false)}
                className="text-slate-400 hover:text-slate-600 p-1 bg-white hover:bg-slate-100 rounded-full border border-slate-200 transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleCreateItem}>
              <div className="p-6 space-y-4">
                {activeTab === 'teams' ? (
                  /* FORM CLUB */
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase">Nama Klub *</label>
                      <input 
                        type="text" 
                        required
                        value={teamName}
                        onChange={(e) => setTeamName(e.target.value)}
                        placeholder="Contoh: Persija Jakarta, Real Madrid"
                        className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase">Nama Pelatih</label>
                      <input 
                        type="text" 
                        value={teamCoach}
                        onChange={(e) => setTeamCoach(e.target.value)}
                        placeholder="Contoh: Carlo Ancelotti, Thomas Tuchel"
                        className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
                      />
                    </div>
                  </>
                ) : (
                  /* FORM PLAYER */
                  <>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase">Nama Pemain *</label>
                      <input 
                        type="text" 
                        required
                        value={playerName}
                        onChange={(e) => setPlayerName(e.target.value)}
                        placeholder="Contoh: Cristiano Ronaldo, Bambang Pamungkas"
                        className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase">Posisi Bermain</label>
                      <input 
                        type="text" 
                        value={playerPosition}
                        onChange={(e) => setPlayerPosition(e.target.value)}
                        placeholder="Contoh: Forward, Midfielder, Defender"
                        className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all placeholder:text-slate-400"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-bold text-slate-600 uppercase">Pilih Klub Terdaftar *</label>
                      {teamsList.length === 0 ? (
                        <div className="text-xs text-amber-600 bg-amber-50 border border-amber-100 rounded-lg p-3">
                          Silakan buat klub sepak bola terlebih dahulu sebelum menambahkan pemain!
                        </div>
                      ) : (
                        <select 
                          required
                          value={playerTeamId}
                          onChange={(e) => setPlayerTeamId(e.target.value)}
                          className="w-full text-sm px-4 py-2.5 rounded-lg border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all bg-white"
                        >
                          {teamsList.map((team) => (
                            <option key={team.id} value={team.id}>
                              {team.name}
                            </option>
                          ))}
                        </select>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Modal Footer */}
              <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
                <button 
                  type="button"
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 hover:bg-slate-100 border border-slate-200 rounded-lg text-xs font-semibold text-slate-700 transition-all"
                >
                  Batal
                </button>
                <button 
                  type="submit"
                  disabled={submitting || (activeTab === 'players' && teamsList.length === 0)}
                  className={`px-4 py-2 text-white rounded-lg text-xs font-semibold shadow-sm transition-all flex items-center gap-1.5 disabled:opacity-50 disabled:cursor-not-allowed ${
                    activeTab === 'teams'
                      ? 'bg-blue-600 hover:bg-blue-700 shadow-blue-500/20'
                      : 'bg-indigo-600 hover:bg-indigo-700 shadow-indigo-500/20'
                  }`}
                >
                  {submitting && <Activity className="w-3.5 h-3.5 animate-spin" />}
                  {submitting ? 'Menyimpan...' : 'Simpan Data'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
