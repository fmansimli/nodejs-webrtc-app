interface IProps {
  className: string;
}

const Spinner: React.FC<IProps> = ({ className }) => {
  return (
    <div
      className={`${className} animate-spin rounded-full  border-gray-300 border-t-blue-600`}
    />
  );
};

export default Spinner;
