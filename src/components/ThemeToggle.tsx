import { useTheme } from '../context/ThemeContext';
import { Moon, Sun } from 'lucide-react';

export function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();
    const isDark = theme === 'dark';

    return (
        <button
            onClick={toggleTheme}
            style={{
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                width: '60px',
                height: '32px',
                borderRadius: '999px',
                backgroundColor: isDark ? 'var(--color-primary)' : 'var(--color-border)',
                border: 'none',
                cursor: 'pointer',
                transition: 'background-color 0.3s ease',
                padding: '4px'
            }}
            title={`Mudar para modo ${isDark ? 'claro' : 'escuro'}`}
        >
            <div style={{
                position: 'absolute',
                left: isDark ? '32px' : '4px',
                width: '24px',
                height: '24px',
                borderRadius: '50%',
                backgroundColor: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'left 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
            }}>
                {isDark ? (
                    <Moon size={14} color="var(--color-primary)" />
                ) : (
                    <Sun size={14} color="#f59e0b" />
                )}
            </div>
            {/* Visual labels indicating state (optional, but good for UX on toggle) */}
            <span style={{ marginLeft: 'auto', marginRight: '6px', opacity: isDark ? 0 : 0.8 }}><Moon size={14} color="var(--color-text-secondary)" /></span>
            <span style={{ marginLeft: '6px', marginRight: 'auto', opacity: isDark ? 0.8 : 0 }}><Sun size={14} color="rgba(255,255,255,0.8)" /></span>
        </button>
    );
}
