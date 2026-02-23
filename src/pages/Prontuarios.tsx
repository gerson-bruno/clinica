import { useState } from 'react';
import { FileText, Search, User, ChevronRight } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/ui/Modal';
import { useNavigate } from 'react-router-dom';

export function Prontuarios() {
    const { pacientes, prontuarios, addProntuario } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const navigate = useNavigate();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({ pacienteId: '', tipo: 'Evolução', resumo: '' });

    const filteredPacientes = pacientes.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()) || p.patologia.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleOpenModal = (pacienteId?: string) => {
        setFormData({
            pacienteId: pacienteId || (pacientes.length > 0 ? pacientes[0].id : ''),
            tipo: 'Evolução',
            resumo: ''
        });
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const pacienteObj = pacientes.find(p => p.id === formData.pacienteId);
        if (!pacienteObj) return;

        addProntuario({
            paciente: pacienteObj.nome,
            data: new Date().toLocaleDateString('pt-BR'),
            tipo: formData.tipo,
            fisioterapeuta: 'Dr. Gerson Bruno',
            resumo: formData.resumo
        });
        setIsModalOpen(false);
        navigate(`/prontuarios/${pacienteObj.id}`);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Prontuários</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Acesse o histórico clínico e evoluções por paciente.</p>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                    <div style={{ position: 'relative', width: '100%', maxWidth: '400px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                        <input
                            type="text" placeholder="Buscar prontuário do paciente..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-hover)', fontSize: '0.875rem', outline: 'none' }}
                        />
                    </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem', padding: '1.5rem' }}>
                    {filteredPacientes.map((paciente) => {
                        const pacienteProntuarios = prontuarios.filter(p => p.paciente === paciente.nome);
                        const totalEvolucoes = pacienteProntuarios.length;
                        const ultimaEvolucao = totalEvolucoes > 0 ? pacienteProntuarios[0].data : 'Sem registros';

                        return (
                            <div key={paciente.id}
                                style={{
                                    border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', backgroundColor: 'var(--color-surface)',
                                    display: 'flex', flexDirection: 'column', gap: '1rem', transition: 'box-shadow var(--transition-fast)'
                                }}
                                onMouseEnter={e => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
                                onMouseLeave={e => e.currentTarget.style.boxShadow = 'none'}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                    <div style={{ width: '40px', height: '40px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-primary-light)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                        <User size={20} />
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>{paciente.nome}</h3>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{paciente.patologia || 'Sem diagnóstico'}</p>
                                    </div>
                                </div>

                                <div style={{ backgroundColor: 'var(--color-surface-hover)', padding: '0.75rem', borderRadius: 'var(--radius-sm)', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontWeight: '500' }}>Registros</span>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>{totalEvolucoes}</span>
                                    </div>
                                    <div>
                                        <span style={{ display: 'block', fontSize: '0.75rem', color: 'var(--color-text-tertiary)', fontWeight: '500' }}>Última Atualização</span>
                                        <span style={{ fontSize: '0.875rem', fontWeight: '600', color: 'var(--color-text-primary)' }}>{ultimaEvolucao}</span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: '0.5rem', marginTop: 'auto' }}>
                                    <button
                                        onClick={() => handleOpenModal(paciente.id)}
                                        style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', fontSize: '0.875rem', fontWeight: '500', color: 'var(--color-text-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                                        onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                                        onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                                    >
                                        <FileText size={16} /> Nova
                                    </button>
                                    <button
                                        onClick={() => navigate(`/prontuarios/${paciente.id}`)}
                                        style={{ flex: 1, padding: '0.5rem', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-primary)', color: 'white', fontSize: '0.875rem', fontWeight: '500', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}
                                    >
                                        Ver Prontuário <ChevronRight size={16} />
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                    {filteredPacientes.length === 0 && (
                        <div style={{ gridColumn: '1 / -1', padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Nenhum paciente encontrado.</div>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title="Nova Evolução">
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Paciente *</label>
                        <select required value={formData.pacienteId} onChange={e => setFormData({ ...formData, pacienteId: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'var(--color-surface-hover)' }} disabled={!!formData.pacienteId}>
                            <option value="" disabled>Selecione um paciente</option>
                            {pacientes.map(p => <option key={p.id} value={p.id}>{p.nome}</option>)}
                        </select>
                        <p style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: '0.25rem' }}>Apenas informativo.</p>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Tipo de Registro *</label>
                        <select required value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'transparent' }}>
                            <option value="Avaliação Inicial">Avaliação Inicial</option>
                            <option value="Evolução">Evolução</option>
                            <option value="Alta">Alta Médica/Fisioterapêutica</option>
                        </select>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Resumo Clínico *</label>
                        <textarea required value={formData.resumo} onChange={e => setFormData({ ...formData, resumo: e.target.value })} rows={4} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }} />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', color: 'var(--color-text-secondary)' }}>Cancelar</button>
                        <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', backgroundColor: 'var(--color-primary)', color: 'white' }}>Salvar Evolução</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
