import useNavigation from "../hooks/use-navigation";

interface IProps {
  path: string;
  children: React.ReactNode;
}

const Route: React.FC<IProps> = ({ path, children }) => {
  const { currentPath } = useNavigation();

  if (currentPath === path) {
    return children;
  }

  return null;
};

export default Route;
