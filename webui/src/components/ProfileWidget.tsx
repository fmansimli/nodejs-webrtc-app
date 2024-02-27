interface IProps {
  user: {
    username: string;
    lang: string;
    profession: string;
    id: string;
  };
  onCall: (user: any) => void;
}

const ProfileWidget: React.FC<IProps> = ({ user, onCall }) => {
  function callHandler(event: React.MouseEvent<HTMLAnchorElement, MouseEvent>): void {
    event.preventDefault();
    onCall(user);
  }

  return (
    <div className="w-full rounded-lg border border-gray-200 bg-white shadow dark:border-gray-700 dark:bg-gray-800">
      <div className="flex flex-col items-center py-10">
        <h5 className="mb-1 text-xl font-medium text-gray-900 dark:text-white">
          {user.username}
        </h5>
        <div className="mt-4 flex md:mt-6">
          <a
            href="/active"
            onClick={callHandler}
            className="inline-flex items-center rounded-lg bg-blue-700 px-4 py-2 text-center text-sm font-medium text-white hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
            call
          </a>
          <a
            href="/active"
            className="ms-3 inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-center text-sm font-medium text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:hover:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-700">
            Message
          </a>
        </div>
      </div>
    </div>
  );
};

export default ProfileWidget;
