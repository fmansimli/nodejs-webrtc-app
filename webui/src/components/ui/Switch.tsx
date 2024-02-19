interface IProps {
  label: string;
  onChange: (value: boolean) => void;
  checked: boolean;
}

const Switch: React.FC<IProps> = ({ label, onChange, checked }) => {
  return (
    <label className="relative inline-flex cursor-pointer items-center">
      <input
        type="checkbox"
        checked={checked}
        className="peer sr-only"
        onChange={(e) => onChange(e.target.checked)}
      />
      <div className="peer h-6 w-11 rounded-full bg-gray-700 after:absolute after:start-[2px] after:top-[2px] after:h-5 after:w-5 after:rounded-full after:bg-white after:transition-all after:content-[''] peer-checked:bg-blue-600 peer-checked:after:translate-x-full peer-focus:outline-none rtl:peer-checked:after:-translate-x-full"></div>
      <span className="ms-3 text-sm font-medium text-gray-300">{label}</span>
    </label>
  );
};

export default Switch;
