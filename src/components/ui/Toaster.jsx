export default function Toaster({ title, message, onClose }) {
  return (
    <div className="fixed top-0 right-0 m-4">
      <div className="bg-white border p-4 md:w-96 w-72 rounded-lg shadow-lg flex justify-between items-start">
        <div className="text-left">
          <h1 className="text-lg font-bold">{title || "Toaster"}</h1>
          <p className="text-sm">{message || "This is a message"}</p>
        </div>
        <button
          className="rounded-md hover:bg-gray-200 p-1 px-2"
          onClick={onClose}
        >
          X
        </button>
      </div>
    </div>
  );
}
