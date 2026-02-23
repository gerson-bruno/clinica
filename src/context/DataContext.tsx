import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

// Interfaces Básicas
export interface Paciente {
    id: string;
    nome: string;
    idade: number;
    telefone: string;
    status: 'Ativo' | 'Inativo';
    ultimaConsulta: string;
    patologia: string;
}

export interface AvaliacaoDetalhes {
    queixaPrincipal?: string;
    historiaDoenca?: string;
    medicamentos?: string;
    exameFisico?: string;
    avaliacaoFuncional?: string;
    diagnosticoFisioterapeutico?: string;
    objetivos?: string;
    planoTratamento?: string;
}

export interface Prontuario {
    id: string;
    paciente: string;
    data: string;
    tipo: string;
    fisioterapeuta: string;
    resumo: string;
    avaliacao?: AvaliacaoDetalhes;
}

export interface Transacao {
    id: string;
    descricao: string;
    categoria: string;
    valor: number;
    data: string;
    forma: string;
    tipo: 'entrada' | 'saida';
}

export interface Agendamento {
    id: string;
    data: string;
    hora: string;
    paciente: string;
    tipo: string;
    status: 'Confirmado' | 'Pendente' | 'Cancelado';
}

interface DataContextType {
    pacientes: Paciente[];
    prontuarios: Prontuario[];
    transacoes: Transacao[];
    agendamentos: Agendamento[];
    addPaciente: (p: Omit<Paciente, 'id'>) => void;
    updatePaciente: (id: string, p: Partial<Paciente>) => void;
    addProntuario: (p: Omit<Prontuario, 'id'>) => void;
    updateProntuario: (id: string, p: Partial<Prontuario>) => void;
    deleteProntuario: (id: string) => void;
    addTransacao: (t: Omit<Transacao, 'id'>) => void;
    updateTransacao: (id: string, t: Partial<Transacao>) => void;
    deleteTransacao: (id: string) => void;
    addAgendamento: (a: Omit<Agendamento, 'id'>) => void;
    updateAgendamento: (id: string, a: Partial<Agendamento>) => void;
    deleteAgendamento: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Dados Iniciais Mockados
const initialPacientes: Paciente[] = [
    { id: '1', nome: 'Ana Silva', idade: 34, telefone: '(11) 98765-4321', status: 'Ativo', ultimaConsulta: '10/10/2023', patologia: 'Lombalgia' },
    { id: '2', nome: 'Carlos Mendes', idade: 45, telefone: '(11) 91234-5678', status: 'Ativo', ultimaConsulta: '11/10/2023', patologia: 'Pós-operatório LCA' },
];

const initialProntuarios: Prontuario[] = [
    { id: '1', paciente: 'Ana Silva', data: '12/10/2023', tipo: 'Evolução', fisioterapeuta: 'Dr. Gerson Bruno', resumo: 'Paciente relata melhora de 50% na dor lombar.' },
];

const initialTransacoes: Transacao[] = [
    { id: '1', descricao: 'Sessão - Ana Silva', categoria: 'Receita', valor: 150.00, data: '12/10/2023', forma: 'PIX', tipo: 'entrada' },
    { id: '2', descricao: 'Aluguel Clínica', categoria: 'Despesa Fixa', valor: 2500.00, data: '10/10/2023', forma: 'Boleto', tipo: 'saida' },
];

const initialAgendamentos: Agendamento[] = [
    { id: '1', data: new Date().toISOString().split('T')[0], hora: '09:00', paciente: 'Ana Silva', tipo: 'Avaliação Inicial', status: 'Confirmado' },
];

export function DataProvider({ children }: { children: ReactNode }) {
    const [pacientes, setPacientes] = useState<Paciente[]>(() => {
        const saved = localStorage.getItem('fisio_pacientes');
        return saved ? JSON.parse(saved) : initialPacientes;
    });

    const [prontuarios, setProntuarios] = useState<Prontuario[]>(() => {
        const saved = localStorage.getItem('fisio_prontuarios');
        return saved ? JSON.parse(saved) : initialProntuarios;
    });

    const [transacoes, setTransacoes] = useState<Transacao[]>(() => {
        const saved = localStorage.getItem('fisio_transacoes');
        return saved ? JSON.parse(saved) : initialTransacoes;
    });

    const [agendamentos, setAgendamentos] = useState<Agendamento[]>(() => {
        const saved = localStorage.getItem('fisio_agendamentos');
        return saved ? JSON.parse(saved) : initialAgendamentos;
    });

    // Salvar no LocalStorage sempre que alterar
    useEffect(() => { localStorage.setItem('fisio_pacientes', JSON.stringify(pacientes)); }, [pacientes]);
    useEffect(() => { localStorage.setItem('fisio_prontuarios', JSON.stringify(prontuarios)); }, [prontuarios]);
    useEffect(() => { localStorage.setItem('fisio_transacoes', JSON.stringify(transacoes)); }, [transacoes]);
    useEffect(() => { localStorage.setItem('fisio_agendamentos', JSON.stringify(agendamentos)); }, [agendamentos]);

    const addPaciente = (p: Omit<Paciente, 'id'>) => setPacientes(prev => [...prev, { ...p, id: Math.random().toString(36).substr(2, 9) }]);
    const updatePaciente = (id: string, pd: Partial<Paciente>) => setPacientes(prev => prev.map(p => p.id === id ? { ...p, ...pd } : p));
    const addProntuario = (p: Omit<Prontuario, 'id'>) => setProntuarios(prev => [{ ...p, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
    const updateProntuario = (id: string, p: Partial<Prontuario>) => setProntuarios(prev => prev.map(pr => pr.id === id ? { ...pr, ...p } : pr));
    const deleteProntuario = (id: string) => setProntuarios(prev => prev.filter(pr => pr.id !== id));
    const addTransacao = (t: Omit<Transacao, 'id'>) => setTransacoes(prev => [{ ...t, id: Math.random().toString(36).substr(2, 9) }, ...prev]);
    const updateTransacao = (id: string, t: Partial<Transacao>) => setTransacoes(prev => prev.map(tr => tr.id === id ? { ...tr, ...t } : tr));
    const deleteTransacao = (id: string) => setTransacoes(prev => prev.filter(tr => tr.id !== id));
    const addAgendamento = (a: Omit<Agendamento, 'id'>) => setAgendamentos(prev => [...prev, { ...a, id: Math.random().toString(36).substr(2, 9) }]);
    const updateAgendamento = (id: string, a: Partial<Agendamento>) => setAgendamentos(prev => prev.map(ag => ag.id === id ? { ...ag, ...a } : ag));
    const deleteAgendamento = (id: string) => setAgendamentos(prev => prev.filter(ag => ag.id !== id));

    return (
        <DataContext.Provider value={{
            pacientes, prontuarios, transacoes, agendamentos,
            addPaciente, updatePaciente,
            addProntuario, updateProntuario, deleteProntuario,
            addTransacao, updateTransacao, deleteTransacao,
            addAgendamento, updateAgendamento, deleteAgendamento
        }}>
            {children}
        </DataContext.Provider>
    );
}

export const useData = () => {
    const context = useContext(DataContext);
    if (context === undefined) throw new Error('useData must be used within a DataProvider');
    return context;
};
