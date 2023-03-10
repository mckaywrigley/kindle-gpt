import { FC, useState } from "react";

interface SettingsProps {
  apiKey: string;
  onApiKeyChange: (apiKey: string) => void;
}

export const Settings: FC<SettingsProps> = ({ apiKey, onApiKeyChange }) => {
  const [show, setShow] = useState(false);

  const handleSave = () => {
    if (apiKey.length !== 51) {
      alert("Please enter a valid API key.");
      return;
    }

    localStorage.setItem("KINDLE_KEY", apiKey);

    setShow(false);
  };

  const handleClear = () => {
    localStorage.removeItem("KINDLE_KEY");
    onApiKeyChange("");
  };

  return (
    <div className="flex flex-col items-center">
      <button
        className="mt-4 flex cursor-pointer items-center space-x-2 rounded-full border border-zinc-600 px-3 py-1 text-sm hover:opacity-50"
        onClick={() => setShow(!show)}
      >
        {show ? "Hide" : "Show"} Settings
      </button>

      {show && (
        <div className="w-[340px] sm:w-[400px]">
          <div className="mt-2">
            <div>OpenAI API Key</div>
            <input
              type="password"
              placeholder="OpenAI API Key"
              className="max-w-[400px] block w-full rounded-md border border-gray-300 p-2 text-black shadow-sm focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500 sm:text-sm"
              value={apiKey}
              onChange={(e) => {
                onApiKeyChange(e.target.value);
              }}
            />
          </div>

          <div className="mt-4 flex space-x-2 justify-center">
            <div
              className="flex cursor-pointer items-center space-x-2 rounded-full bg-green-500 px-3 py-1 text-sm text-white hover:bg-green-600"
              onClick={handleSave}
            >
              Save
            </div>

            <div
              className="flex cursor-pointer items-center space-x-2 rounded-full bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600"
              onClick={handleClear}
            >
              Clear
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
