export default function ConfirmModal({ title, message, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
      <div className="bg-white rounded-xl p-6 w-80 shadow-xl">
        <h2 className="text-md font-semibold mb-4 text-gray-800">{title}</h2>
        <div className="text-sm text-gray-600 mb-4">{message}</div>
        <div className="flex justify-end gap-4">
          <button
            onClick={onCancel}
            className="px-4 py-1 bg-gray-300 rounded hover:bg-gray-400 text-sm focus:outline-none"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-4 py-1 bg-orange-600 text-white rounded hover:bg-red-800 text-sm focus:outline-none"
          >
            Yes
          </button>
        </div>
      </div>
    </div>
  );
}
