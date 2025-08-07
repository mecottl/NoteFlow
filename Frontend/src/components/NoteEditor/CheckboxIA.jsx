
import '../../styles/checkboxIA.css';

export default function Checkbox({ iaActiva, setIaActiva }) {
    return (
        <label className="checkbox-wrapper">
            <input
                type="checkbox"
                checked={iaActiva}
                onChange={() => setIaActiva(prev => !prev)}
            />
            <div className="checkmark">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path
                        d="M20 6L9 17L4 12"
                        strokeWidth="3"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    ></path>
                </svg>
            </div>
            <span className="label">🤖 IA Asistente</span>
        </label>
    );
}
