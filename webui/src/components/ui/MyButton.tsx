interface IProps {
  children: React.ReactNode;
  onClick: () => void;
}

const MyButton: React.FC<IProps> = (props) => {
  return (
    <button
      onClick={props.onClick}
      className="group relative mb-2 me-2 inline-flex items-center justify-center overflow-hidden rounded-lg bg-gradient-to-br from-pink-500 to-orange-400 p-0.5 text-sm font-medium text-gray-900 hover:text-white focus:outline-none  focus:ring-pink-200 group-hover:from-pink-500 group-hover:to-orange-400 dark:text-white dark:focus:ring-pink-800">
      <span className="relative rounded-md bg-white px-5 py-2.5 transition-all duration-75 ease-in group-hover:bg-opacity-0 dark:bg-gray-900">
        {props.children}
      </span>
    </button>
  );
};

export default MyButton;
