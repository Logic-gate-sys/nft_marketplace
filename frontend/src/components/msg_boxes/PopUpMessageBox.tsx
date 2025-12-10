interface popUp{
  message: string,
  onClose:() => void
}

// --------------- pop up for message ---------------------------------

export const PopupMessageBox = ({ message, onClose}: popUp) => {
  return (
    <div className="fixed inset-0 bg-gray-600 opacity-65 flex items-center justify-center z-2">
      <div className="bg-gray-900 text-white p-6 rounded-lg shadow-xl w-80">
        <p className="text-lg font-semibold mb-4">{message}</p>
        <button
          onClick={onClose}
          className="bg-purple-600 text-white px-4 py-2 rounded hover:bg-purple-700"
        >
          Close
        </button>
      </div>
    </div>
  );
};