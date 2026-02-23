import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useData } from '../context/DataContext';
import { useAuth } from '../context/AuthContext';
import { ChevronLeft, Plus, Edit2, Trash2, FileText, Eye, Printer } from 'lucide-react';
import { Modal } from '../components/ui/Modal';
import type { Prontuario, AvaliacaoDetalhes } from '../context/DataContext';

export function ProntuarioDetalhes() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const { pacientes, prontuarios, addProntuario, updateProntuario, deleteProntuario } = useData();
    const { user } = useAuth();

    const paciente = pacientes.find(p => p.id === id);
    const registros = prontuarios.filter(p => p.paciente === paciente?.nome);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [formData, setFormData] = useState<{ tipo: string; resumo: string; avaliacao?: AvaliacaoDetalhes }>({
        tipo: 'Evolução',
        resumo: ''
    });

    const handleAvaliacaoChange = (field: keyof AvaliacaoDetalhes, value: string) => {
        setFormData(prev => ({
            ...prev,
            avaliacao: { ...prev.avaliacao, [field]: value }
        }));
    };

    const [isViewModalOpen, setIsViewModalOpen] = useState(false);
    const [viewingRegistro, setViewingRegistro] = useState<Prontuario | null>(null);

    if (!paciente) {
        return (
            <div style={{ padding: '2rem', textAlign: 'center' }}>
                <h2>Paciente não encontrado.</h2>
                <button onClick={() => navigate('/prontuarios')} style={{ marginTop: '1rem', color: 'var(--color-primary)' }}>Voltar</button>
            </div>
        );
    }

    const handleOpenModal = (registro?: Prontuario) => {
        if (registro) {
            setEditingId(registro.id);
            setFormData({ tipo: registro.tipo, resumo: registro.resumo, avaliacao: registro.avaliacao });
        } else {
            setEditingId(null);
            setFormData({ tipo: 'Evolução', resumo: '', avaliacao: undefined });
        }
        setIsModalOpen(true);
    };

    const handleDelete = (registroId: string) => {
        if (window.confirm('Tem certeza que deseja excluir esta evolução?')) {
            deleteProntuario(registroId);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const finalResumo = formData.tipo === 'Avaliação Inicial' && !formData.resumo
            ? 'Avaliação Inicial Estruturada (Vide Campos detalhados)'
            : formData.resumo;

        if (editingId) {
            updateProntuario(editingId, { ...formData, resumo: finalResumo });
        } else {
            addProntuario({
                paciente: paciente.nome,
                data: new Date().toLocaleDateString('pt-BR'),
                tipo: formData.tipo,
                fisioterapeuta: user?.nome || 'Fisioterapeuta Externo',
                resumo: finalResumo,
                avaliacao: formData.tipo === 'Avaliação Inicial' ? formData.avaliacao : undefined
            });
        }
        setIsModalOpen(false);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem', gap: '1rem' }}>
                <button
                    onClick={() => navigate('/prontuarios')}
                    style={{ padding: '0.5rem', backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background var(--transition-fast)' }}
                    onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'}
                    onMouseLeave={e => e.currentTarget.style.backgroundColor = 'var(--color-surface)'}
                >
                    <ChevronLeft size={20} color="var(--color-text-secondary)" />
                </button>
                <div style={{ flex: 1 }}>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>Prontuário - {paciente.nome}</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>{paciente.idade} anos | {paciente.patologia || 'Sem diagnóstico formal'}</p>
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
                    <Plus size={18} /><span>Nova Evolução</span>
                </button>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                    {registros.map((item) => (
                        <div key={item.id} style={{ display: 'flex', gap: '1.5rem', padding: '1.5rem', borderBottom: '1px solid var(--color-border)', transition: 'background var(--transition-fast)' }} onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--color-surface-hover)'} onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}>
                            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', backgroundColor: 'var(--color-secondary)', color: 'var(--color-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <FileText size={20} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                                        <span style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', fontWeight: '500' }}>{item.data}</span>
                                        <div style={{ fontSize: '0.75rem', fontWeight: '600', padding: '0.25rem 0.5rem', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--color-primary-light)', color: 'white' }}>
                                            {item.tipo}
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <button onClick={() => { setViewingRegistro(item); setIsViewModalOpen(true); }} style={{ color: 'var(--color-primary)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }} title="Visualizar/Imprimir">
                                            <Eye size={16} />
                                        </button>
                                        <button onClick={() => handleOpenModal(item)} style={{ color: 'var(--color-text-secondary)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }} title="Editar">
                                            <Edit2 size={16} />
                                        </button>
                                        <button onClick={() => handleDelete(item.id)} style={{ color: 'var(--color-danger)', padding: '0.25rem', borderRadius: 'var(--radius-sm)' }} title="Excluir">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.875rem', lineHeight: '1.6' }}>
                                    {item.resumo.length > 150 ? item.resumo.substring(0, 150) + '...' : item.resumo}
                                </p>
                                <div style={{ marginTop: '1rem', fontSize: '0.75rem', color: 'var(--color-text-tertiary)' }}>
                                    Registrado por: <strong>{item.fisioterapeuta}</strong>
                                </div>
                            </div>
                        </div>
                    ))}
                    {registros.length === 0 && (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Nenhum prontuário registrado para este paciente.</div>
                    )}
                </div>
            </div>

            <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={editingId ? 'Editar Evolução' : 'Nova Evolução'}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Tipo de Registro *</label>
                        <select required value={formData.tipo} onChange={e => setFormData({ ...formData, tipo: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'transparent' }}>
                            <option value="Avaliação Inicial">Avaliação Inicial</option>
                            <option value="Evolução">Evolução</option>
                            <option value="Alta">Alta Médica/Fisioterapêutica</option>
                        </select>
                    </div>

                    {formData.tipo === 'Avaliação Inicial' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1rem', backgroundColor: 'var(--color-surface-hover)', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', maxHeight: '400px', overflowY: 'auto' }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--color-text-secondary)' }}>Queixa Principal</label>
                                <textarea value={formData.avaliacao?.queixaPrincipal || ''} onChange={e => handleAvaliacaoChange('queixaPrincipal', e.target.value)} rows={2} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--color-text-secondary)' }}>História da Doença Atual</label>
                                <textarea value={formData.avaliacao?.historiaDoenca || ''} onChange={e => handleAvaliacaoChange('historiaDoenca', e.target.value)} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--color-text-secondary)' }}>Medicamentos em Uso</label>
                                <textarea value={formData.avaliacao?.medicamentos || ''} onChange={e => handleAvaliacaoChange('medicamentos', e.target.value)} rows={2} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--color-text-secondary)' }}>Exame Físico (Inspeção, Palpação, Força, ADM)</label>
                                <textarea value={formData.avaliacao?.exameFisico || ''} onChange={e => handleAvaliacaoChange('exameFisico', e.target.value)} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--color-text-secondary)' }}>Avaliação Funcional (Testes Específicos)</label>
                                <textarea value={formData.avaliacao?.avaliacaoFuncional || ''} onChange={e => handleAvaliacaoChange('avaliacaoFuncional', e.target.value)} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--color-text-secondary)' }}>Diagnóstico Fisioterapêutico</label>
                                <textarea value={formData.avaliacao?.diagnosticoFisioterapeutico || ''} onChange={e => handleAvaliacaoChange('diagnosticoFisioterapeutico', e.target.value)} rows={2} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--color-text-secondary)' }}>Objetivos do Tratamento</label>
                                <textarea value={formData.avaliacao?.objetivos || ''} onChange={e => handleAvaliacaoChange('objetivos', e.target.value)} rows={2} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.25rem', color: 'var(--color-text-secondary)' }}>Plano de Tratamento</label>
                                <textarea value={formData.avaliacao?.planoTratamento || ''} onChange={e => handleAvaliacaoChange('planoTratamento', e.target.value)} rows={3} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', resize: 'vertical' }} />
                            </div>
                        </div>
                    )}
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

            {/* Modal de Visualização e Impressão */}
            <Modal isOpen={isViewModalOpen} onClose={() => setIsViewModalOpen(false)} title="Detalhes do Registro">
                {viewingRegistro && (
                    <div id="print-area">
                        <div style={{ padding: '1.5rem', border: '1px solid var(--color-border)', borderRadius: 'var(--radius-md)', backgroundColor: 'var(--color-surface)', marginBottom: '1.5rem' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px dashed var(--color-border)', paddingBottom: '1rem', marginBottom: '1rem' }}>
                                <div>
                                    <h3 style={{ fontSize: '1.25rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>Clínica FisioGest</h3>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>Relatório Fisioterapêutico</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontWeight: '600' }}>Data: {viewingRegistro.data}</p>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)' }}>{viewingRegistro.tipo}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Paciente</p>
                                    <p style={{ fontWeight: '600', fontSize: '1.125rem', margin: 0 }}>{viewingRegistro.paciente}</p>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.25rem' }}>Dados Clínicos</p>
                                    <p style={{ fontWeight: '500', fontSize: '1rem', margin: 0 }}>{paciente.idade} anos | {paciente.patologia || 'Patologia não informada'}</p>
                                </div>
                            </div>

                            <div style={{ marginBottom: '2rem' }}>
                                {viewingRegistro.tipo === 'Avaliação Inicial' && viewingRegistro.avaliacao ? (
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                        {viewingRegistro.avaliacao.queixaPrincipal && <div><p style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Queixa Principal</p><p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{viewingRegistro.avaliacao.queixaPrincipal}</p></div>}
                                        {viewingRegistro.avaliacao.historiaDoenca && <div><p style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.875rem' }}>História da Doença Atual</p><p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{viewingRegistro.avaliacao.historiaDoenca}</p></div>}
                                        {viewingRegistro.avaliacao.medicamentos && <div><p style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Medicamentos em Uso</p><p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{viewingRegistro.avaliacao.medicamentos}</p></div>}
                                        {viewingRegistro.avaliacao.exameFisico && <div><p style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Exame Físico</p><p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{viewingRegistro.avaliacao.exameFisico}</p></div>}
                                        {viewingRegistro.avaliacao.avaliacaoFuncional && <div><p style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Avaliação Funcional</p><p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{viewingRegistro.avaliacao.avaliacaoFuncional}</p></div>}
                                        {viewingRegistro.avaliacao.diagnosticoFisioterapeutico && <div><p style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Diagnóstico Fisioterapêutico</p><p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{viewingRegistro.avaliacao.diagnosticoFisioterapeutico}</p></div>}
                                        {viewingRegistro.avaliacao.objetivos && <div><p style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Objetivos do Tratamento</p><p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{viewingRegistro.avaliacao.objetivos}</p></div>}
                                        {viewingRegistro.avaliacao.planoTratamento && <div><p style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Plano de Tratamento</p><p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{viewingRegistro.avaliacao.planoTratamento}</p></div>}
                                        {viewingRegistro.resumo && <div><p style={{ fontWeight: '600', marginBottom: '0.25rem', fontSize: '0.875rem' }}>Resumo/Adendos</p><p style={{ whiteSpace: 'pre-wrap', lineHeight: '1.6' }}>{viewingRegistro.resumo}</p></div>}
                                    </div>
                                ) : (
                                    <>
                                        <p style={{ fontSize: '0.875rem', color: 'var(--color-text-secondary)', marginBottom: '0.5rem' }}>Resumo Clínico</p>
                                        <p style={{ lineHeight: '1.8', color: 'var(--color-text-primary)', whiteSpace: 'pre-wrap' }}>{viewingRegistro.resumo}</p>
                                    </>
                                )}
                            </div>

                            <div style={{ borderTop: '1px dashed var(--color-border)', paddingTop: '1rem', display: 'flex', justifyContent: 'flex-end' }}>
                                <div style={{ textAlign: 'center', width: '250px' }}>
                                    <div style={{ borderBottom: '1px solid var(--color-text-primary)', height: '2rem', marginBottom: '0.5rem' }}></div>
                                    <p style={{ fontWeight: '600', fontSize: '0.875rem' }}>{user?.nome || viewingRegistro.fisioterapeuta}</p>
                                    <p style={{ fontSize: '0.75rem', color: 'var(--color-text-secondary)' }}>CREFITO {user?.crefito || 'Não informado'}</p>
                                </div>
                            </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }} className="no-print">
                            <button onClick={() => setIsViewModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', color: 'var(--color-text-secondary)' }}>Fechar</button>
                            <button
                                onClick={() => {
                                    const printContent = document.getElementById('print-area');
                                    const originalContent = document.body.innerHTML;
                                    if (printContent) {
                                        document.body.innerHTML = printContent.innerHTML;
                                        window.print();
                                        document.body.innerHTML = originalContent;
                                        window.location.reload(); // Quick reset after print hack
                                    }
                                }}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', backgroundColor: 'var(--color-primary)', color: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                            >
                                <Printer size={18} /> Imprimir / PDF
                            </button>
                        </div>
                    </div>
                )}
            </Modal>
        </div>
    );
}
