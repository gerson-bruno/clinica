import { Bell, Search, User, LogOut, Camera } from 'lucide-react';
import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Modal } from './ui/Modal';
import { ThemeToggle } from './ThemeToggle';

export function Header() {
    const { user, updateProfile, logout } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
    const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

    // Profile form state
    const [profileData, setProfileData] = useState({
        nome: user?.nome || '',
        email: user?.email || '',
        senha: user?.senha || '',
        crefito: user?.crefito || '',
        fotoBase64: user?.fotoBase64 || ''
    });

    const fileInputRef = useRef<HTMLInputElement>(null);
    const navigate = useNavigate();

    const [mockNotifications, setMockNotifications] = useState([
        { id: 1, title: 'Agendamento Confirmado', message: 'Marta (14:00) confirmou a sessão.', time: 'há 10 min', read: false },
        { id: 2, title: 'Nova Avaliação', message: 'Carlos Silva agendou avaliação inicial amanhã.', time: 'há 1 hora', read: false },
        { id: 3, title: 'Lembrete', message: 'Revise o prontuário de Joana antes das 16:00.', time: 'há 2 horas', read: true },
    ]);

    const markAllAsRead = () => {
        setMockNotifications(mockNotifications.map(n => ({ ...n, read: true })));
    };

    const clearAll = () => {
        setMockNotifications([]);
        setIsNotificationsOpen(false);
    };

    const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter' && searchTerm.trim() !== '') {
            navigate(`/pacientes?q=${encodeURIComponent(searchTerm)}`);
        }
    };

    const handleProfileSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        updateProfile(profileData);
        setIsProfileModalOpen(false);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileData({ ...profileData, fotoBase64: reader.result as string });
            };
            reader.readAsDataURL(file);
        }
    };

    const getInitials = (name: string) => {
        return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();
    };

    const unreadCount = mockNotifications.filter(n => !n.read).length;

    return (
        <header style={{
            height: '70px',
            backgroundColor: 'var(--color-surface)',
            borderBottom: '1px solid var(--color-border)',
            display: 'flex',
            alignItems: 'center',
            padding: '0 2rem',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            zIndex: 10
        }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flex: 1 }}>
                <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                    <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                    <input
                        type="text"
                        placeholder="Buscar pacientes e pressione Enter..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={handleSearch}
                        style={{
                            width: '100%',
                            padding: '0.6rem 1rem 0.6rem 2.5rem',
                            borderRadius: 'var(--radius-full)',
                            border: '1px solid var(--color-border)',
                            backgroundColor: 'var(--color-surface-hover)',
                            fontSize: '0.875rem',
                            outline: 'none',
                            transition: 'border var(--transition-fast)'
                        }}
                        onFocus={(e) => e.target.style.borderColor = 'var(--color-primary-light)'}
                        onBlur={(e) => e.target.style.borderColor = 'var(--color-border)'}
                    />
                </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                <ThemeToggle />

                <div style={{ position: 'relative' }}>
                    <button
                        onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                        style={{ position: 'relative', color: isNotificationsOpen ? 'var(--color-primary)' : 'var(--color-text-secondary)', transition: 'color var(--transition-fast)' }}
                    >
                        <Bell size={20} />
                        <span style={{
                            position: 'absolute', top: '-2px', right: '-2px',
                            width: '16px', height: '16px',
                            backgroundColor: 'var(--color-danger)', borderRadius: '50%',
                            color: 'white', fontSize: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold',
                            opacity: unreadCount > 0 ? 1 : 0
                        }}>
                            {unreadCount}
                        </span>
                    </button>

                    {isNotificationsOpen && (
                        <div style={{
                            position: 'absolute', top: '100%', right: '0', marginTop: '1rem',
                            width: '320px', backgroundColor: 'var(--color-surface)',
                            borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-lg)',
                            border: '1px solid var(--color-border)', zIndex: 100,
                            animation: 'fadeIn 0.2s ease-out', overflow: 'hidden'
                        }}>
                            <div style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: 'var(--color-surface-hover)' }}>
                                <h3 style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>Notificações</h3>
                                <button onClick={markAllAsRead} style={{ fontSize: '0.75rem', color: 'var(--color-primary)', fontWeight: '500' }}>Marcar como lidas</button>
                            </div>
                            <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
                                {mockNotifications.length === 0 ? (
                                    <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>Nenhuma notificação.</div>
                                ) : (
                                    mockNotifications.map(notif => (
                                        <div key={notif.id} style={{ padding: '1rem', borderBottom: '1px solid var(--color-border)', backgroundColor: notif.read ? 'transparent' : '#f8f9fa', cursor: 'pointer', transition: 'background var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = notif.read ? 'transparent' : '#f8f9fa'}>
                                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                                                <p style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-primary)', margin: 0 }}>{notif.title}</p>
                                                <span style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>{notif.time}</span>
                                            </div>
                                            <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', margin: 0 }}>{notif.message}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                            <div style={{ padding: '0.75rem', textAlign: 'center', borderTop: '1px solid var(--color-border)' }}>
                                <button onClick={clearAll} style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: '500' }}>Limpar todas as notificações</button>
                            </div>
                        </div>
                    )}
                </div>
                <div
                    style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', borderLeft: '1px solid var(--color-border)', paddingLeft: '1.5rem', cursor: 'pointer' }}
                    onClick={() => {
                        setProfileData({
                            nome: user?.nome || '', email: user?.email || '',
                            senha: user?.senha || '', crefito: user?.crefito || '',
                            fotoBase64: user?.fotoBase64 || ''
                        });
                        setIsProfileModalOpen(true);
                    }}
                >
                    <div style={{ textAlign: 'right' }}>
                        <p className="font-medium text-sm" style={{ margin: 0, color: 'var(--color-text-primary)' }}>{user?.nome}</p>
                        <p className="text-xs text-muted" style={{ margin: 0 }}>{user?.crefito ? `CREFITO ${user.crefito}` : 'Fisioterapeuta'}</p>
                    </div>
                    {user?.fotoBase64 ? (
                        <img
                            src={user.fotoBase64}
                            alt="Perfil"
                            style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--color-primary-light)' }}
                        />
                    ) : (
                        <div style={{
                            width: '40px', height: '40px',
                            borderRadius: 'var(--radius-full)',
                            backgroundColor: 'var(--color-primary-light)',
                            color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold'
                        }}>
                            {getInitials(user?.nome || 'User')}
                        </div>
                    )}
                </div>
                <button onClick={logout} style={{ color: 'var(--color-text-tertiary)', marginLeft: '0.5rem' }} title="Sair">
                    <LogOut size={20} />
                </button>
            </div>

            <Modal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} title="Meu Perfil">
                <form onSubmit={handleProfileSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <div style={{ position: 'relative' }}>
                            {profileData.fotoBase64 ? (
                                <img src={profileData.fotoBase64} alt="Avatar" style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '3px solid var(--color-border)' }} />
                            ) : (
                                <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: 'var(--color-surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-tertiary)' }}>
                                    <User size={32} />
                                </div>
                            )}
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                style={{ position: 'absolute', bottom: 0, right: 0, backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.25rem', borderRadius: '50%', border: '2px solid white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                                <Camera size={14} />
                            </button>
                            <input type="file" ref={fileInputRef} onChange={handleFileChange} accept="image/*" style={{ display: 'none' }} />
                        </div>
                        <div>
                            <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>Foto de Perfil</h3>
                            <p style={{ margin: 0, fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>JPG, GIF ou PNG. Tamanho máximo 2MB.</p>
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Nome Completo *</label>
                        <input required type="text" value={profileData.nome} onChange={e => setProfileData({ ...profileData, nome: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                    </div>

                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Usuário / E-mail *</label>
                            <input required type="text" value={profileData.email} onChange={e => setProfileData({ ...profileData, email: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Registro CREFITO *</label>
                            <input required type="text" value={profileData.crefito} onChange={e => setProfileData({ ...profileData, crefito: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                        </div>
                    </div>

                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Alterar Senha</label>
                        <input type="password" value={profileData.senha} onChange={e => setProfileData({ ...profileData, senha: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} placeholder="Deixe em branco para não alterar" />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '0.5rem' }}>
                        <button type="button" onClick={() => setIsProfileModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', color: 'var(--color-text-secondary)' }}>Cancelar</button>
                        <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', backgroundColor: 'var(--color-primary)', color: 'white' }}>Salvar Perfil</button>
                    </div>
                </form>
            </Modal>
        </header>
    );
}
