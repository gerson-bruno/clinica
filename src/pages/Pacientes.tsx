import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Plus, Edit2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import type { Paciente } from '../context/DataContext';
import { Modal } from '../components/ui/Modal';

export function Pacientes() {
    const { pacientes, addPaciente, updatePaciente } = useData();
    const [searchParams] = useSearchParams();
    const [searchTerm, setSearchTerm] = useState(searchParams.get('q') || '');

    useEffect(() => {
        const q = searchParams.get('q');
        if (q !== null) setSearchTerm(q);
    }, [searchParams]);

    // States do Modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState({ nome: '', idade: '', telefone: '', patologia: '', status: 'Ativo', ultimaConsulta: '' });

    const filteredPacientes = pacientes.filter(p => p.nome.toLowerCase().includes(searchTerm.toLowerCase()));

    const handleOpenModal = (paciente?: Paciente) => {
        if (paciente) {
            setEditingId(paciente.id);
            setFormData({
                nome: paciente.nome,
                idade: paciente.idade.toString(),
                telefone: paciente.telefone,
                patologia: paciente.patologia,
                status: paciente.status,
                ultimaConsulta: paciente.ultimaConsulta || new Date().toLocaleDateString('pt-BR')
            });
        } else {
            setEditingId(null);
            setFormData({ nome: '', idade: '', telefone: '', patologia: '', status: 'Ativo', ultimaConsulta: new Date().toLocaleDateString('pt-BR') });
        }
        setIsModalOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const idadeNum = parseInt(formData.idade) || 0;

        if (editingId) {
            updatePaciente(editingId, { ...formData, idade: idadeNum, status: formData.status as 'Ativo' | 'Inativo' });
        } else {
            addPaciente({ ...formData, idade: idadeNum, status: formData.status as 'Ativo' | 'Inativo' });
        }

        setIsModalOpen(false);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Pacientes</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Gerencie o cadastro e histórico de seus pacientes.</p>
                </div>
                <button
                    onClick={() => handleOpenModal()}
                    style={{
                        backgroundColor: 'var(--color-primary)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)',
                        fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-sm)', transition: 'background var(--transition-fast)'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary-dark)'}
                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'var(--color-primary)'}
                >
                    <Plus size={18} /><span>Novo Paciente</span>
                </button>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)' }}>
                    <div style={{ position: 'relative', width: '300px' }}>
                        <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--color-text-tertiary)' }} />
                        <input
                            type="text" placeholder="Buscar por nome, CPF..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                            style={{ width: '100%', padding: '0.6rem 1rem 0.6rem 2.5rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface-hover)', fontSize: '0.875rem', outline: 'none' }}
                        />
                    </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: '600' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>Nome do Paciente</th>
                                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>Idade</th>
                                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>Diagnóstico Principal</th>
                                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>Status</th>
                                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>Última Consulta</th>
                                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', textAlign: 'center' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredPacientes.map((paciente) => (
                                <tr key={paciente.id} style={{ borderBottom: '1px solid var(--color-border)', transition: 'background var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <div>
                                            <p style={{ fontWeight: '600', color: 'var(--color-text-primary)', marginBottom: '0.125rem' }}>{paciente.nome}</p>
                                            <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>{paciente.telefone}</p>
                                        </div>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-primary)' }}>{paciente.idade} anos</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-primary)' }}>{paciente.patologia}</td>
                                    <td style={{ padding: '1rem 1.5rem' }}>
                                        <span style={{
                                            fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.75rem', borderRadius: 'var(--radius-full)',
                                            backgroundColor: paciente.status === 'Ativo' ? 'var(--color-status-confirmed-bg)' : 'var(--color-surface-hover)',
                                            color: paciente.status === 'Ativo' ? 'var(--color-success)' : 'var(--color-text-secondary)'
                                        }}>
                                            {paciente.status}
                                        </span>
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>{paciente.ultimaConsulta}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                                            <button onClick={() => handleOpenModal(paciente)} style={{ color: 'var(--color-text-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }} title="Editar">
                                                <Edit2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredPacientes.length === 0 && (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Nenhum paciente encontrado.</div>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Paciente' : 'Novo Paciente'}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Nome Completo *</label>
                        <input required type="text" value={formData.nome} onChange={e => setFormData({ ...formData, nome: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Idade</label>
                            <input type="number" value={formData.idade} onChange={e => setFormData({ ...formData, idade: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                        </div>
                        <div style={{ flex: 2 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Telefone</label>
                            <input type="text" value={formData.telefone} onChange={e => setFormData({ ...formData, telefone: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                        </div>
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Diagnóstico Principal</label>
                        <input type="text" value={formData.patologia} onChange={e => setFormData({ ...formData, patologia: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                    </div>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Status</label>
                        <select value={formData.status} onChange={e => setFormData({ ...formData, status: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'transparent' }}>
                            <option value="Ativo">Ativo</option>
                            <option value="Inativo">Inativo</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', color: 'var(--color-text-secondary)' }}>Cancelar</button>
                        <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', backgroundColor: 'var(--color-primary)', color: 'white' }}>Salvar</button>
                    </div>
                </form>
            </Modal>
        </div>
    );
}
