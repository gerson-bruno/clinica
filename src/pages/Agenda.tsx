import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Edit2, Trash2, Calendar } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Agendamento } from '../context/DataContext';
import { Modal } from '../components/ui/Modal';

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const DIAS_SEMANA = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function formatDateLabel(date: Date): string {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const target = new Date(date);
    target.setHours(0, 0, 0, 0);

    const diff = target.getTime() - hoje.getTime();
    const diffDays = Math.round(diff / (1000 * 60 * 60 * 24));

    const dia = target.getDate();
    const mes = MESES[target.getMonth()].substring(0, 3);

    if (diffDays === 0) return `Hoje, ${dia} de ${mes}`;
    if (diffDays === 1) return `Amanhã, ${dia} de ${mes}`;
    if (diffDays === -1) return `Ontem, ${dia} de ${mes}`;
    return `${dia} de ${mes}`;
}

function toISODate(date: Date): string {
    return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}

function getDaysInMonth(year: number, month: number): number {
    return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfMonth(year: number, month: number): number {
    return new Date(year, month, 1).getDay();
}

export function Agenda() {
    const { agendamentos, pacientes, addAgendamento, updateAgendamento, deleteAgendamento } = useData();
    const horas = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    const [selectedDate, setSelectedDate] = useState<Date>(() => new Date());
    const [showCalendar, setShowCalendar] = useState(false);
    const [calendarMonth, setCalendarMonth] = useState(new Date().getMonth());
    const [calendarYear, setCalendarYear] = useState(new Date().getFullYear());
    const calendarRef = useRef<HTMLDivElement>(null);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ hora: '08:00', pacienteId: '', tipo: 'Avaliação Inicial', status: 'Confirmado' });

    const selectedDateISO = toISODate(selectedDate);

    // Filter agendamentos by selected date
    const agendamentosDoDia = agendamentos.filter(a => a.data === selectedDateISO);

    // Close calendar on outside click
    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (calendarRef.current && !calendarRef.current.contains(e.target as Node)) {
                setShowCalendar(false);
            }
        }
        if (showCalendar) {
            document.addEventListener('mousedown', handleClickOutside);
            return () => document.removeEventListener('mousedown', handleClickOutside);
        }
    }, [showCalendar]);

    const handlePrevDay = () => {
        setSelectedDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() - 1);
            return d;
        });
    };

    const handleNextDay = () => {
        setSelectedDate(prev => {
            const d = new Date(prev);
            d.setDate(d.getDate() + 1);
            return d;
        });
    };

    const handleSelectCalendarDay = (day: number) => {
        const newDate = new Date(calendarYear, calendarMonth, day);
        setSelectedDate(newDate);
        setShowCalendar(false);
    };

    const handleCalendarPrevMonth = () => {
        if (calendarMonth === 0) {
            setCalendarMonth(11);
            setCalendarYear(y => y - 1);
        } else {
            setCalendarMonth(m => m - 1);
        }
    };

    const handleCalendarNextMonth = () => {
        if (calendarMonth === 11) {
            setCalendarMonth(0);
            setCalendarYear(y => y + 1);
        } else {
            setCalendarMonth(m => m + 1);
        }
    };

    const toggleCalendar = () => {
        if (!showCalendar) {
            setCalendarMonth(selectedDate.getMonth());
            setCalendarYear(selectedDate.getFullYear());
        }
        setShowCalendar(v => !v);
    };

    const handleOpenModal = (horaSelecionada?: string | Agendamento) => {
        if (typeof horaSelecionada === 'object') {
            const paciente = pacientes.find(p => p.nome === horaSelecionada.paciente);
            setEditingId(horaSelecionada.id);
            setFormData({
                hora: horaSelecionada.hora,
                pacienteId: paciente ? paciente.id : '',
                tipo: horaSelecionada.tipo,
                status: horaSelecionada.status
            });
        } else {
            setEditingId(null);
            setFormData({
                hora: horaSelecionada || '08:00',
                pacienteId: pacientes.length > 0 ? pacientes[0].id : '',
                tipo: 'Avaliação Inicial',
                status: 'Confirmado'
            });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (id: string) => {
        if (window.confirm('Tem certeza que deseja cancelar e excluir este agendamento?')) {
            deleteAgendamento(id);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const pacienteObj = pacientes.find(p => p.id === formData.pacienteId);
        if (!pacienteObj) return;

        if (editingId) {
            updateAgendamento(editingId, {
                hora: formData.hora,
                paciente: pacienteObj.nome,
                tipo: formData.tipo,
                status: formData.status as 'Confirmado' | 'Pendente' | 'Cancelado'
            });
        } else {
            addAgendamento({
                data: selectedDateISO,
                hora: formData.hora,
                paciente: pacienteObj.nome,
                tipo: formData.tipo,
                status: formData.status as 'Confirmado' | 'Pendente' | 'Cancelado'
            });
        }
        setIsModalOpen(false);
    };

    // Calendar grid rendering
    const daysInMonth = getDaysInMonth(calendarYear, calendarMonth);
    const firstDay = getFirstDayOfMonth(calendarYear, calendarMonth);
    const todayISO = toISODate(new Date());

    const calendarDays: (number | null)[] = [];
    for (let i = 0; i < firstDay; i++) calendarDays.push(null);
    for (let d = 1; d <= daysInMonth; d++) calendarDays.push(d);

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Agenda</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Gerencie seus horários e sessões.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {/* Date Navigation */}
                    <div style={{ position: 'relative' }} ref={calendarRef}>
                        <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                            <button onClick={handlePrevDay} style={{ padding: '0.5rem', borderRight: '1px solid var(--color-border)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <ChevronLeft size={20} />
                            </button>
                            <button
                                onClick={toggleCalendar}
                                style={{ padding: '0.5rem 1rem', fontWeight: '600', fontSize: '0.875rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'transparent', border: 'none', color: 'var(--color-text-primary)' }}
                            >
                                <Calendar size={16} color="var(--color-primary)" />
                                {formatDateLabel(selectedDate)}
                            </button>
                            <button onClick={handleNextDay} style={{ padding: '0.5rem', borderLeft: '1px solid var(--color-border)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
                                <ChevronRight size={20} />
                            </button>
                        </div>

                        {/* Calendar Dropdown */}
                        {showCalendar && (
                            <div style={{
                                position: 'absolute', top: 'calc(100% + 8px)', right: 0, zIndex: 100,
                                backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)',
                                borderRadius: 'var(--radius-lg)', boxShadow: 'var(--shadow-lg)',
                                padding: '1rem', width: '320px',
                                animation: 'fadeIn 0.2s ease'
                            }}>
                                {/* Calendar Header */}
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                                    <button onClick={handleCalendarPrevMonth} style={{ padding: '0.25rem', cursor: 'pointer', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', backgroundColor: 'transparent', border: 'none', display: 'flex', alignItems: 'center' }}>
                                        <ChevronLeft size={18} />
                                    </button>
                                    <span style={{ fontWeight: '600', fontSize: '0.95rem', color: 'var(--color-text-primary)' }}>
                                        {MESES[calendarMonth]} {calendarYear}
                                    </span>
                                    <button onClick={handleCalendarNextMonth} style={{ padding: '0.25rem', cursor: 'pointer', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', backgroundColor: 'transparent', border: 'none', display: 'flex', alignItems: 'center' }}>
                                        <ChevronRight size={18} />
                                    </button>
                                </div>

                                {/* Weekday Headers */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px', marginBottom: '0.5rem' }}>
                                    {DIAS_SEMANA.map(d => (
                                        <div key={d} style={{ textAlign: 'center', fontSize: '0.75rem', fontWeight: '600', color: 'var(--color-text-tertiary)', padding: '0.25rem' }}>
                                            {d}
                                        </div>
                                    ))}
                                </div>

                                {/* Calendar Days */}
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '2px' }}>
                                    {calendarDays.map((day, i) => {
                                        if (day === null) return <div key={`empty-${i}`} />;

                                        const dayISO = `${calendarYear}-${String(calendarMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                                        const isToday = dayISO === todayISO;
                                        const isSelected = dayISO === selectedDateISO;
                                        const hasAgendamentos = agendamentos.some(a => a.data === dayISO);

                                        return (
                                            <button
                                                key={day}
                                                onClick={() => handleSelectCalendarDay(day)}
                                                style={{
                                                    padding: '0.5rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    cursor: 'pointer',
                                                    border: isToday && !isSelected ? '2px solid var(--color-primary)' : '2px solid transparent',
                                                    backgroundColor: isSelected ? 'var(--color-primary)' : 'transparent',
                                                    color: isSelected ? 'white' : 'var(--color-text-primary)',
                                                    fontWeight: isToday || isSelected ? '700' : '400',
                                                    fontSize: '0.875rem',
                                                    position: 'relative',
                                                    transition: 'all 0.15s ease',
                                                }}
                                                onMouseEnter={e => {
                                                    if (!isSelected) e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)';
                                                }}
                                                onMouseLeave={e => {
                                                    if (!isSelected) e.currentTarget.style.backgroundColor = 'transparent';
                                                }}
                                            >
                                                {day}
                                                {hasAgendamentos && (
                                                    <span style={{
                                                        position: 'absolute', bottom: '2px', left: '50%', transform: 'translateX(-50%)',
                                                        width: '5px', height: '5px', borderRadius: '50%',
                                                        backgroundColor: isSelected ? 'white' : 'var(--color-primary)'
                                                    }} />
                                                )}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Today Button */}
                                <button
                                    onClick={() => {
                                        const today = new Date();
                                        setSelectedDate(today);
                                        setCalendarMonth(today.getMonth());
                                        setCalendarYear(today.getFullYear());
                                        setShowCalendar(false);
                                    }}
                                    style={{
                                        width: '100%', marginTop: '0.75rem', padding: '0.5rem',
                                        borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)',
                                        backgroundColor: 'transparent', cursor: 'pointer',
                                        fontSize: '0.8125rem', fontWeight: '500', color: 'var(--color-primary)',
                                        transition: 'background 0.15s'
                                    }}
                                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                >
                                    Ir para Hoje
                                </button>
                            </div>
                        )}
                    </div>

                    <button
                        onClick={() => handleOpenModal()}
                        style={{ backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-sm)', transition: 'background var(--transition-fast)' }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                    >
                        <Clock size={18} /><span>Agendar Sessão</span>
                    </button>
                </div>
            </div>

            <div className="card" style={{ padding: '0', flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-hover)', display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem' }}>
                    <div style={{ fontWeight: '600', color: 'var(--color-text-secondary)', textAlign: 'center' }}>Horário</div>
                    <div style={{ fontWeight: '600', color: 'var(--color-text-secondary)' }}>Agendamento</div>
                </div>

                <div style={{ flex: 1, overflowY: 'auto' }}>
                    {horas.map((hora) => {
                        const agendamento = agendamentosDoDia.find(a => a.hora === hora);

                        return (
                            <div key={hora} style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', borderBottom: '1px solid var(--color-border)', minHeight: '80px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid var(--color-border)', color: 'var(--color-text-secondary)', fontWeight: '500' }}>
                                    {hora}
                                </div>
                                <div style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center' }}>
                                    {agendamento ? (
                                        <div style={{
                                            width: '100%', padding: '1rem', borderRadius: 'var(--radius-md)',
                                            display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                                            backgroundColor: agendamento.status === 'Confirmado' ? 'var(--color-status-confirmed-bg)' : agendamento.status === 'Pendente' ? 'var(--color-status-pending-bg)' : 'var(--color-status-cancelled-bg)',
                                            borderLeft: `4px solid ${agendamento.status === 'Confirmado' ? 'var(--color-primary)' : agendamento.status === 'Pendente' ? 'var(--color-warning)' : 'var(--color-danger)'}`
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-status-element-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
                                                    <User size={20} />
                                                </div>
                                                <div>
                                                    <p style={{ fontWeight: '600', color: 'var(--color-text-primary)' }}>{agendamento.paciente}</p>
                                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{agendamento.tipo}</p>
                                                </div>
                                            </div>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <span style={{
                                                    fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
                                                    backgroundColor: 'var(--color-status-element-bg)',
                                                    color: agendamento.status === 'Confirmado' ? 'var(--color-primary)' : agendamento.status === 'Pendente' ? 'var(--color-warning)' : 'var(--color-danger)'
                                                }}>
                                                    {agendamento.status}
                                                </span>
                                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                    <button onClick={() => handleOpenModal(agendamento)} style={{ padding: '0.25rem', backgroundColor: 'var(--color-status-element-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)', cursor: 'pointer', border: 'none' }} title="Editar">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(agendamento.id)} style={{ padding: '0.25rem', backgroundColor: 'var(--color-status-element-bg)', borderRadius: 'var(--radius-sm)', color: 'var(--color-danger)', cursor: 'pointer', border: 'none' }} title="Excluir">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    ) : (
                                        <div
                                            onClick={() => handleOpenModal(hora)}
                                            style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', color: 'var(--color-text-tertiary)', fontSize: '0.875rem', fontStyle: 'italic', cursor: 'pointer', borderRadius: 'var(--radius-md)', padding: '0 1rem', transition: 'background var(--transition-fast)' }}
                                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                                        >
                                            + Clique para agendar um paciente
                                        </div>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Sessão' : 'Agendar Sessão'}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Paciente *</label>
                        <select required value={formData.pacienteId} onChange={e => setFormData({ ...formData, pacienteId: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'transparent' }}>
                            <option value="" disabled>Selecione um paciente</option>
                            {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Horário *</label>
                            <select required value={formData.hora} onChange={e => setFormData({ ...formData, hora: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'transparent' }}>
                                {horas.map(h => <option key={h} value={h}>{h}</option>)}
                            </select>
                        </div>
                        <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Tipo de Sessão *</label>
                            <select required value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'transparent' }}>
                                <option value="Avaliação Inicial">Avaliação Inicial</option>
                                <option value="Evolução">Evolução / Fisioterapia Geral</option>
                                <option value="Pilates Clínico">Pilates Clínico</option>
                                <option value="Acupuntura">Acupuntura</option>
                            </select>
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Status</label>
                        <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'transparent' }}>
                            <option value="Confirmado">Confirmado</option>
                            <option value="Pendente">Pendente / Aguardando Confirmação</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', color: 'var(--color-text-secondary)' }}>Cancelar</button>
                        <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', backgroundColor: 'var(--color-primary)', color: 'white' }}>Agendar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
