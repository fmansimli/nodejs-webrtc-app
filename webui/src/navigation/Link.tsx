import useNavigation from "../hooks/use-navigation";

interface IProps {
  to: string;
  children: React.ReactNode;
  className: string;
}

const Link: React.FC<IProps> = ({ to, children, className }) => {
  const { navigate } = useNavigation();

  const handleClick = (event: React.MouseEvent) => {
    if (event.metaKey || event.ctrlKey) {
      return;
    }
    event.preventDefault();

    navigate(to);
  };

  return (
    <a className={className} href={to} onClick={handleClick}>
      {children}
    </a>
  );
};

export default Link;
