const LangSelect = () => {
  return (
    <select
      className="block w-full rounded-lg border border-gray-400 bg-gray-700 p-2.5 text-sm text-white placeholder-gray-400 focus:border-blue-500 focus:ring-blue-500"
      defaultValue="en">
      <option value="en">English</option>
      <option value="es">Spanish</option>
      <option value="tr">Turkish</option>
      <option value="ru">Russian</option>
      <option value="de">Deutsch</option>
    </select>
  );
};

export default LangSelect;
