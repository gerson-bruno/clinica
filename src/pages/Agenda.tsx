import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock, User, Edit2, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Agendamento } from '../context/DataContext';
import { Modal } from '../components/ui/Modal';

export function Agenda() {
    const { agendamentos, pacientes, addAgendamento, updateAgendamento, deleteAgendamento } = useData();
    const horas = ['08:00', '09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'];

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ hora: '08:00', pacienteId: '', tipo: 'Avaliação Inicial', status: 'Confirmado' });

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
                hora: formData.hora,
                paciente: pacienteObj.nome,
                tipo: formData.tipo,
                status: formData.status as 'Confirmado' | 'Pendente' | 'Cancelado'
            });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem', height: '100%', display: 'flex', flexDirection: 'column' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Agenda</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Gerencie seus horários e sessões hoje.</p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', backgroundColor: 'var(--color-surface)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', overflow: 'hidden' }}>
                        <button style={{ padding: '0.5rem', borderRight: '1px solid var(--color-border)' }}><ChevronLeft size={20} /></button>
                        <span style={{ padding: '0.5rem 1rem', fontWeight: '600', fontSize: '0.875rem' }}>Hoje, 12 de Out</span>
                        <button style={{ padding: '0.5rem', borderLeft: '1px solid var(--color-border)' }}><ChevronRight size={20} /></button>
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
                        const agendamento = agendamentos.find(a => a.hora === hora);

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
                                            backgroundColor: agendamento.status === 'Confirmado' ? '#e0f2f1' : agendamento.status === 'Pendente' ? '#fff3e0' : '#ffebee',
                                            borderLeft: `4px solid ${agendamento.status === 'Confirmado' ? 'var(--color-primary)' : agendamento.status === 'Pendente' ? 'var(--color-warning)' : 'var(--color-danger)'}`
                                        }}>
                                            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                                <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', backgroundColor: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--color-text-secondary)' }}>
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
                                                    backgroundColor: 'white',
                                                    color: agendamento.status === 'Confirmado' ? 'var(--color-primary)' : agendamento.status === 'Pendente' ? 'var(--color-warning)' : 'var(--color-danger)'
                                                }}>
                                                    {agendamento.status}
                                                </span>
                                                <div style={{ display: 'flex', gap: '0.25rem' }}>
                                                    <button onClick={() => handleOpenModal(agendamento)} style={{ padding: '0.25rem', backgroundColor: 'white', borderRadius: 'var(--radius-sm)', color: 'var(--color-text-secondary)' }} title="Editar">
                                                        <Edit2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleDelete(agendamento.id)} style={{ padding: '0.25rem', backgroundColor: 'white', borderRadius: 'var(--radius-sm)', color: 'var(--color-danger)' }} title="Excluir">
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
