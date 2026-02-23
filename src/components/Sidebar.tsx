import { Link, useLocation } from 'react-router-dom';
import { Home, Users, FileText, Calendar, DollarSign, Activity } from 'lucide-react';

export function Sidebar() {
    const location = useLocation();

    const navItems = [
        { path: '/', label: 'Dashboard', icon: Home },
        { path: '/pacientes', label: 'Pacientes', icon: Users },
        { path: '/prontuarios', label: 'Prontuários', icon: FileText },
        { path: '/agenda', label: 'Agenda', icon: Calendar },
        { path: '/financeiro', label: 'Financeiro', icon: DollarSign },
    ];

    return (
        <aside style={{
            width: '260px',
            backgroundColor: 'var(--color-primary)',
            color: 'white',
            padding: '2rem 1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '2rem',
            flexShrink: 0,
            boxShadow: 'var(--shadow-lg)',
            zIndex: 10
        }}>
            <div className="flex items-center gap-3 justify-center mb-4">
                <div style={{
                    width: '40px', height: '40px',
                    backgroundColor: 'var(--color-surface)',
                    borderRadius: 'var(--radius-md)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                    <Activity color="var(--color-primary)" size={24} />
                </div>
                <h2 style={{ color: 'white', margin: 0, fontSize: '1.25rem', fontWeight: 'bold' }}>FisioGest</h2>
            </div>

            <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {navItems.map((item) => {
                    const isActive = location.pathname === item.path || (item.path !== '/' && location.pathname.startsWith(item.path));
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.path}
                            to={item.path}
                            style={{
                                color: isActive ? 'white' : 'var(--color-secondary)',
                                padding: '0.75rem 1rem',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: isActive ? 'var(--color-primary-dark)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                fontWeight: isActive ? '600' : '400',
                                transition: 'all var(--transition-fast)'
                            }}
                            onMouseEnter={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.1)';
                                    e.currentTarget.style.color = 'white';
                                }
                            }}
                            onMouseLeave={(e) => {
                                if (!isActive) {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = 'var(--color-secondary)';
                                }
                            }}
                        >
                            <Icon size={20} />
                            {item.label}
                        </Link>
                    )
                })}
            </nav>

            <div style={{ marginTop: 'auto', padding: '1rem', backgroundColor: 'var(--color-primary-dark)', borderRadius: 'var(--radius-md)', fontSize: '0.875rem', color: 'rgba(255, 255, 255, 0.85)', textAlign: 'center', lineHeight: '1.4' }}>
                <p>Desenvolvido por:</p>
                <p style={{ fontWeight: '600' }}>Gerson Bruno</p>
                <p style={{ marginTop: '0.25rem', opacity: 0.8 }}>v1.01</p>
            </div>
        </aside>
    );
}
