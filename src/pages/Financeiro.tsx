import { useState } from 'react';
import { ArrowUpRight, ArrowDownRight, Filter, Pencil, Trash2 } from 'lucide-react';
import { useData } from '../context/DataContext';
import { Modal } from '../components/ui/Modal';
import type { Transacao } from '../context/DataContext';

export function Financeiro() {
    const { transacoes, addTransacao, updateTransacao, deleteTransacao } = useData();

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [modalType, setModalType] = useState<'entrada' | 'saida'>('entrada');
    const [formData, setFormData] = useState({ descricao: '', categoria: 'Consulta', valor: '', forma: 'PIX' });
    const [customCategoria, setCustomCategoria] = useState('');
    const [filtroCategoria, setFiltroCategoria] = useState('');
    const [editingTransacao, setEditingTransacao] = useState<Transacao | null>(null);
    const [deleteConfirm, setDeleteConfirm] = useState<Transacao | null>(null);

    const categoriasEntrada = ['Consulta', 'Sessão Avulsa', 'Pacote Mensal', 'Pilates', 'Outra...'];
    const categoriasSaida = ['Aluguel', 'Equipamentos', 'Material de Consumo', 'Impostos', 'Marketing', 'Outra...'];

    const filteredTransacoes = transacoes.filter(t => filtroCategoria === '' || t.categoria === filtroCategoria);
    const categoriasExistentes = Array.from(new Set(transacoes.map(t => t.categoria)));

    const saldoAtual = transacoes.reduce((acc, t) => t.tipo === 'entrada' ? acc + t.valor : acc - t.valor, 0);
    const receitasMes = transacoes.filter(t => t.tipo === 'entrada').reduce((acc, t) => acc + t.valor, 0);
    const despesasMes = transacoes.filter(t => t.tipo === 'saida').reduce((acc, t) => acc + t.valor, 0);

    const formatCurrency = (value: number) => `R$ ${value.toFixed(2).replace('.', ',')}`;

    const handleOpenModal = (tipo: 'entrada' | 'saida') => {
        setEditingTransacao(null);
        setModalType(tipo);
        setFormData({ descricao: '', categoria: tipo === 'entrada' ? 'Consulta' : 'Aluguel', valor: '', forma: 'PIX' });
        setCustomCategoria('');
        setIsModalOpen(true);
    };

    const handleEdit = (t: Transacao) => {
        setEditingTransacao(t);
        setModalType(t.tipo);
        const allCategorias = t.tipo === 'entrada' ? categoriasEntrada : categoriasSaida;
        const isCustom = !allCategorias.includes(t.categoria);
        setFormData({
            descricao: t.descricao,
            categoria: isCustom ? 'Outra...' : t.categoria,
            valor: t.valor.toFixed(2).replace('.', ','),
            forma: t.forma,
        });
        setCustomCategoria(isCustom ? t.categoria : '');
        setIsModalOpen(true);
    };

    const handleDelete = (t: Transacao) => {
        setDeleteConfirm(t);
    };

    const confirmDelete = () => {
        if (deleteConfirm) {
            deleteTransacao(deleteConfirm.id);
            setDeleteConfirm(null);
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const numericValue = parseFloat(formData.valor.replace(',', '.'));
        if (isNaN(numericValue)) return;

        const transacaoData = {
            descricao: formData.descricao,
            categoria: formData.categoria === 'Outra...' ? customCategoria : formData.categoria,
            valor: numericValue,
            data: editingTransacao ? editingTransacao.data : new Date().toLocaleDateString('pt-BR'),
            forma: formData.forma,
            tipo: modalType
        };

        if (editingTransacao) {
            updateTransacao(editingTransacao.id, transacaoData);
        } else {
            addTransacao(transacaoData);
        }
        setIsModalOpen(false);
        setEditingTransacao(null);
    };

    return (
        <div className="animate-fade-in" style={{ paddingBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem' }}>
                <div>
                    <h1 style={{ fontSize: '1.875rem', fontWeight: '700', color: 'var(--color-text-primary)', marginBottom: '0.25rem' }}>Financeiro</h1>
                    <p style={{ color: 'var(--color-text-secondary)' }}>Controle de fluxo de caixa e relatórios financeiros.</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                        onClick={() => handleOpenModal('saida')}
                        style={{ backgroundColor: 'var(--color-danger)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-sm)' }}
                    >
                        <ArrowDownRight size={18} /><span>Nova Despesa</span>
                    </button>
                    <button
                        onClick={() => handleOpenModal('entrada')}
                        style={{ backgroundColor: 'var(--color-success)', color: 'white', padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', display: 'flex', alignItems: 'center', gap: '0.5rem', boxShadow: 'var(--shadow-sm)' }}
                    >
                        <ArrowUpRight size={18} /><span>Nova Receita</span>
                    </button>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card" style={{ padding: '1.5rem', borderTop: `4px solid var(--color-primary)` }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: '500', marginBottom: '0.5rem' }}>Saldo Atual</h3>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{formatCurrency(saldoAtual)}</p>
                </div>
                <div className="card" style={{ padding: '1.5rem', borderTop: `4px solid var(--color-success)` }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: '500', marginBottom: '0.5rem' }}>Receitas (Mês)</h3>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{formatCurrency(receitasMes)}</p>
                </div>
                <div className="card" style={{ padding: '1.5rem', borderTop: `4px solid var(--color-danger)` }}>
                    <h3 style={{ fontSize: '1rem', color: 'var(--color-text-secondary)', fontWeight: '500', marginBottom: '0.5rem' }}>Despesas (Mês)</h3>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: 'var(--color-text-primary)' }}>{formatCurrency(despesasMes)}</p>
                </div>
            </div>

            <div className="card" style={{ padding: '0', overflow: 'hidden' }}>
                <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--color-border)', backgroundColor: 'var(--color-surface)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                    <h2 style={{ fontSize: '1.25rem', fontWeight: '600' }}>Últimas Transações</h2>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', backgroundColor: 'var(--color-surface-hover)', padding: '0.5rem 1rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)' }}>
                        <Filter size={16} color="var(--color-text-tertiary)" />
                        <select
                            value={filtroCategoria}
                            onChange={(e) => setFiltroCategoria(e.target.value)}
                            style={{ border: 'none', backgroundColor: 'transparent', outline: 'none', fontSize: '0.875rem', color: 'var(--color-text-secondary)', cursor: 'pointer' }}
                        >
                            <option value="">Todas as Categorias</option>
                            {categoriasExistentes.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>
                </div>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                        <thead style={{ backgroundColor: 'var(--color-surface-hover)', color: 'var(--color-text-secondary)', fontSize: '0.875rem', fontWeight: '600' }}>
                            <tr>
                                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>Descrição</th>
                                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>Categoria</th>
                                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>Data</th>
                                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)' }}>Forma de Pagto.</th>
                                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', textAlign: 'right' }}>Valor</th>
                                <th style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--color-border)', textAlign: 'center', width: '100px' }}>Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredTransacoes.map((t) => (
                                <tr key={t.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '1rem 1.5rem', fontWeight: '500' }}>{t.descricao}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>{t.categoria}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>{t.data}</td>
                                    <td style={{ padding: '1rem 1.5rem', color: 'var(--color-text-secondary)' }}>{t.forma}</td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'right', fontWeight: '600', color: t.tipo === 'entrada' ? 'var(--color-success)' : 'var(--color-danger)' }}>
                                        {t.tipo === 'entrada' ? '+ ' : '- '}{formatCurrency(t.valor)}
                                    </td>
                                    <td style={{ padding: '1rem 1.5rem', textAlign: 'center' }}>
                                        <div style={{ display: 'flex', justifyContent: 'center', gap: '0.5rem' }}>
                                            <button
                                                onClick={() => handleEdit(t)}
                                                title="Editar"
                                                style={{
                                                    padding: '0.4rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    color: 'var(--color-text-secondary)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s',
                                                    border: '1px solid transparent',
                                                    backgroundColor: 'transparent',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.backgroundColor = 'var(--color-primary)';
                                                    e.currentTarget.style.color = 'white';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                                                }}
                                            >
                                                <Pencil size={16} />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(t)}
                                                title="Excluir"
                                                style={{
                                                    padding: '0.4rem',
                                                    borderRadius: 'var(--radius-sm)',
                                                    color: 'var(--color-text-secondary)',
                                                    cursor: 'pointer',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    transition: 'all 0.2s',
                                                    border: '1px solid transparent',
                                                    backgroundColor: 'transparent',
                                                }}
                                                onMouseEnter={e => {
                                                    e.currentTarget.style.backgroundColor = 'var(--color-danger)';
                                                    e.currentTarget.style.color = 'white';
                                                }}
                                                onMouseLeave={e => {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                    e.currentTarget.style.color = 'var(--color-text-secondary)';
                                                }}
                                            >
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredTransacoes.length === 0 && (
                        <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-secondary)' }}>Nenhuma transação encontrada com os filtros atuais.</div>
                    )}
                </div>
            </div>

            {/* Modal de Adicionar/Editar */}
            <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); setEditingTransacao(null); }} title={editingTransacao ? (modalType === 'entrada' ? 'Editar Receita' : 'Editar Despesa') : (modalType === 'entrada' ? 'Nova Receita' : 'Nova Despesa')}>
                <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Descrição *</label>
                        <input required type="text" value={formData.descricao} onChange={e => setFormData({ ...formData, descricao: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                    </div>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Valor (R$) *</label>
                            <input required type="text" placeholder="0.00" value={formData.valor} onChange={e => setFormData({ ...formData, valor: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                        </div>
                        <div style={{ flex: 1 }}>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Categoria *</label>
                            <select required value={formData.categoria} onChange={e => setFormData({ ...formData, categoria: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'transparent' }}>
                                {(modalType === 'entrada' ? categoriasEntrada : categoriasSaida).map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                    {formData.categoria === 'Outra...' && (
                        <div>
                            <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Especifique a Categoria *</label>
                            <input required type="text" placeholder="Nome da nova categoria" value={customCategoria} onChange={e => setCustomCategoria(e.target.value)} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none' }} />
                        </div>
                    )}
                    <div>
                        <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: '500', marginBottom: '0.5rem', color: 'var(--color-text-secondary)' }}>Forma de Pagamento</label>
                        <select value={formData.forma} onChange={e => setFormData({ ...formData, forma: e.target.value })} style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--color-border)', outline: 'none', backgroundColor: 'transparent' }}>
                            <option value="PIX">PIX</option>
                            <option value="Cartão de Crédito">Cartão de Crédito</option>
                            <option value="Cartão de Débito">Cartão de Débito</option>
                            <option value="Dinheiro">Dinheiro</option>
                            <option value="Transferência">Transferência Bancária</option>
                        </select>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1rem' }}>
                        <button type="button" onClick={() => { setIsModalOpen(false); setEditingTransacao(null); }} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', color: 'var(--color-text-secondary)' }}>Cancelar</button>
                        <button type="submit" style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', backgroundColor: modalType === 'entrada' ? 'var(--color-success)' : 'var(--color-danger)', color: 'white' }}>
                            {editingTransacao ? 'Salvar Alterações' : 'Registrar'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Modal de Confirmação de Exclusão */}
            <Modal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} title="Confirmar Exclusão">
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                    <p style={{ color: 'var(--color-text-secondary)', lineHeight: '1.6' }}>
                        Tem certeza que deseja excluir a transação <strong style={{ color: 'var(--color-text-primary)' }}>"{deleteConfirm?.descricao}"</strong> no valor de <strong style={{ color: deleteConfirm?.tipo === 'entrada' ? 'var(--color-success)' : 'var(--color-danger)' }}>{deleteConfirm ? formatCurrency(deleteConfirm.valor) : ''}</strong>?
                    </p>
                    <p style={{ fontSize: '0.875rem', color: 'var(--color-text-tertiary)' }}>Esta ação não pode ser desfeita.</p>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                        <button onClick={() => setDeleteConfirm(null)} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', color: 'var(--color-text-secondary)', backgroundColor: 'transparent', border: '1px solid var(--color-border)', cursor: 'pointer' }}>Cancelar</button>
                        <button onClick={confirmDelete} style={{ padding: '0.75rem 1.5rem', borderRadius: 'var(--radius-md)', fontWeight: '500', backgroundColor: 'var(--color-danger)', color: 'white', border: 'none', cursor: 'pointer' }}>Excluir</button>
                    </div>
                </div>
            </Modal>
        </div>
    );
}
