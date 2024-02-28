const LangSelect = () => {
  return (
    <select
      className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
      defaultValue="en">
      <option value="en">Azerbaijani</option>
      <option value="en">English</option>
      <option value="tr">Turkish</option>
      <option value="es">Spanish</option>
      <option value="ru">Russian</option>
      <option value="de">Deutsch</option>
    </select>
  );
};

export default LangSelect;
