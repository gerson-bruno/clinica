import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Activity, Lock, Mail, User } from 'lucide-react';
import { ThemeToggle } from '../components/ThemeToggle';

export function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [nome, setNome] = useState('');
    const [crefito, setCrefito] = useState('');
    const [error, setError] = useState('');

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (isRegistering) {
            register({
                id: Date.now().toString(),
                nome,
                email,
                senha,
                crefito
            });
            setIsRegistering(false);
            setError('Cadastro realizado! Faça login.');
        } else {
            const success = login(email, senha);
            if (success) {
                navigate('/');
            } else {
                setError('Credenciais inválidas.');
            }
        }
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--color-background)', padding: '1rem', position: 'relative'
        }}>
            <div style={{ position: 'absolute', top: '1.5rem', left: '1.5rem' }}>
                <ThemeToggle />
            </div>

            <div className="card" style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '2rem' }}>
                    <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '1rem', color: 'white' }}>
                        <Activity size={24} />
                    </div>
                    <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>Clínica FisioGest</h1>
                    <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem' }}>{isRegistering ? 'Crie sua conta' : 'Acesse seu painel'}</p>
                </div>

                {error && (
                    <div style={{ padding: '0.75rem', borderRadius: 'var(--radius-md)', backgroundColor: error.includes('Cadastro') ? 'var(--color-success-bg)' : 'var(--color-error-bg)', color: error.includes('Cadastro') ? 'var(--color-success)' : 'var(--color-danger)', fontSize: '0.875rem', marginBottom: '1.5rem', textAlign: 'center' }}>
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {isRegistering && (
                        <>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Nome Completo *</label>
                                <div style={{ position: 'relative' }}>
                                    <User size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                                    <input required type="text" value={nome} onChange={e => setNome(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} placeholder="Dr. Gerson Bruno" />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>CREFITO *</label>
                                <input required type="text" value={crefito} onChange={e => setCrefito(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} placeholder="12345-F" />
                            </div>
                        </>
                    )}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Usuário / E-mail *</label>
                        <div style={{ position: 'relative' }}>
                            <Mail size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                            <input required type="text" value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} placeholder="admin ou email@..." />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Senha *</label>
                        <div style={{ position: 'relative' }}>
                            <Lock size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                            <input required type="password" value={senha} onChange={e => setSenha(e.target.value)} style={{ width: '100%', padding: '0.75rem 1rem 0.75rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} placeholder="••••••" />
                        </div>
                    </div>

                    <button type="submit" style={{ width: '100%', padding: '0.875rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary)', color: 'white', fontWeight: '600', marginTop: '0.5rem', transition: 'background var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}>
                        {isRegistering ? 'Cadastrar' : 'Entrar'}
                    </button>

                    <div style={{ marginTop: '1rem', textAlign: 'center' }}>
                        <button type="button" onClick={() => { setIsRegistering(!isRegistering); setError(''); }} style={{ fontSize: '0.875rem', color: 'var(--color-primary)', fontWeight: '500', backgroundColor: 'transparent', border: 'none', cursor: 'pointer', padding: '0.5rem' }}>
                            {isRegistering ? 'Já tem uma conta? Faça login' : 'Não tem conta? Cadastre-se'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
