interface SwitchProps {
  checked: boolean;
  onChange: () => void;
  disabled?: boolean;
}

export const Switch = ({ checked, onChange, disabled }: SwitchProps) => (
  <button
    role="switch"
    aria-checked={checked}
    onClick={onChange}
    disabled={disabled}
    className={`
      relative inline-flex h-6 w-11 items-center rounded-full
      ${checked ? 'bg-blue-600' : 'bg-gray-200'}
      ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
    `}
  >
    <span
      className={`
        inline-block h-4 w-4 transform rounded-full bg-white transition
        ${checked ? 'translate-x-6' : 'translate-x-1'}
      `}
    />
  </button>
); 