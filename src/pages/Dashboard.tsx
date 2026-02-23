import { Users, FileText, Calendar, DollarSign, TrendingUp, TrendingDown, Clock } from 'lucide-react';
import { useData } from '../context/DataContext';
import { useNavigate } from 'react-router-dom';

export function Dashboard() {
    const { pacientes, agendamentos, prontuarios, transacoes } = useData();
    const navigate = useNavigate();

    const pacientesAtivos = pacientes.filter(p => p.status === 'Ativo').length;
    const sessoesHoje = agendamentos.length;
    const totalProntuarios = prontuarios.length;

    // Faturamento Mensal (apenas entradas)
    const faturamento = transacoes.filter(t => t.tipo === 'entrada').reduce((acc, curr) => acc + curr.valor, 0);
    const despesas = transacoes.filter(t => t.tipo === 'saida').reduce((acc, curr) => acc + curr.valor, 0);
    const saldo = faturamento - despesas;

    const stats = [
        { title: 'Total Pacientes', value: pacientesAtivos.toString(), icon: Users, color: 'var(--color-primary)', change: '', isPositive: true },
        { title: 'Sessões', value: sessoesHoje.toString(), icon: Calendar, color: 'var(--color-accent)', change: 'Agendadas', isPositive: true },
        { title: 'Prontuários', value: totalProntuarios.toString(), icon: FileText, color: 'var(--color-warning)', change: 'Registrados', isPositive: true },
        { title: 'Faturamento', value: `R$ ${faturamento.toFixed(2).replace('.', ',')}`, icon: DollarSign, color: 'var(--color-success)', change: 'Entradas', isPositive: true },
    ];

    // Ordenar horários simples
    const sortedAgendamentos = [...agendamentos].sort((a, b) => a.hora.localeCompare(b.hora)).slice(0, 4);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Dashboard</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Resumo das atividades da clínica hoje.</p>
                </div>
                <button
                    onClick={() => navigate('/agenda')}
                    style={{
                        backgroundColor: 'var(--color-primary)',
                        color: 'white',
                        padding: '0.75rem 1.5rem',
                        borderRadius: 'var(--radius-md)',
                        fontWeight: '500',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        boxShadow: 'var(--shadow-sm)',
                        transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                >
                    <Calendar size={18} />
                    <span>Abrir Calendário</span>
                </button>
            </div>

            {/* Stats Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                gap: '1.5rem',
                marginBottom: '2rem'
            }}>
                {stats.map((stat, idx) => (
                    <div key={idx} className="card" style={{ display: 'flex', flexDirection: 'column', padding: '1.5rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                            <div style={{
                                width: '48px', height: '48px',
                                borderRadius: 'var(--radius-md)',
                                backgroundColor: `${stat.color}15`,
                                color: stat.color,
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                <stat.icon size={24} />
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: stat.isPositive ? 'var(--color-success)' : 'var(--color-danger)', fontSize: '0.875rem', fontWeight: '500', backgroundColor: stat.isPositive ? '#2e7d3215' : '#d32f2f15', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-full)' }}>
                                {stat.isPositive ? <TrendingUp size={14} /> : <TrendingDown size={14} />}
                                <span>{stat.change}</span>
                            </div>
                        </div>
                        <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: '500', marginBottom: '0.25rem' }}>{stat.title}</h3>
                        <p style={{ fontSize: '1.75rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{stat.value}</p>
                    </div>
                ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
                {/* Próximos Atendimentos */}
                <div className="card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                        <h2 style={{ fontSize: '1.25rem', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                            <Clock size={20} color="var(--color-primary)" /> Próximos Atendimentos
                        </h2>
                        <button onClick={() => navigate('/agenda')} style={{ color: 'var(--color-accent)', fontSize: '0.875rem', fontWeight: '500' }}>Ir para Agenda</button>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {sortedAgendamentos.length > 0 ? sortedAgendamentos.map((appt) => (
                            <div key={appt.id} style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                padding: '1rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)',
                                backgroundColor: 'var(--color-surface)', transition: 'border-color var(--transition-fast)'
                            }}
                                onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--color-primary-light)'}
                                onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--color-border)'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ fontWeight: '600', color: 'var(--color-primary)', backgroundColor: 'var(--color-secondary)', padding: '0.5rem 0.75rem', borderRadius: 'var(--radius-sm)' }}>
                                        {appt.hora}
                                    </div>
                                    <div>
                                        <p style={{ fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>{appt.paciente}</p>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{appt.tipo}</p>
                                    </div>
                                </div>
                                <span style={{
                                    fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
                                    backgroundColor: appt.status === 'Confirmado' ? '#e8f5e9' : appt.status === 'Pendente' ? '#fff3e0' : '#ffebee',
                                    color: appt.status === 'Confirmado' ? 'var(--color-success)' : appt.status === 'Pendente' ? 'var(--color-warning)' : 'var(--color-danger)'
                                }}>
                                    {appt.status}
                                </span>
                            </div>
                        )) : (
                            <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Nenhum agendamento para hoje.</div>
                        )}
                    </div>
                </div>

                {/* Resumo Financeiro Curto */}
                <div className="card">
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600', marginBottom: '1.5rem' }}>Fluxo Hoje</h2>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--color-text-secondary)' }}>Receitas</span>
                                <span style={{ fontWeight: '600', color: 'var(--color-success)' }}>R$ {faturamento.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                <div style={{ width: `${(faturamento / (faturamento + despesas || 1)) * 100}%`, height: '100%', backgroundColor: 'var(--color-success)' }}></div>
                            </div>
                        </div>
                        <div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                <span style={{ color: 'var(--color-text-secondary)' }}>Despesas</span>
                                <span style={{ fontWeight: '600', color: 'var(--color-danger)' }}>R$ {despesas.toFixed(2).replace('.', ',')}</span>
                            </div>
                            <div style={{ width: '100%', height: '8px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                                <div style={{ width: `${(despesas / (faturamento + despesas || 1)) * 100}%`, height: '100%', backgroundColor: 'var(--color-danger)' }}></div>
                            </div>
                        </div>
                        <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '1.5rem', marginTop: '0.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <span style={{ fontWeight: '500', color: 'var(--color-text-primary)' }}>Saldo do Dia</span>
                                <span style={{ fontSize: '1.5rem', fontWeight: '700', color: 'var(--color-primary)' }}>R$ {saldo.toFixed(2).replace('.', ',')}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
