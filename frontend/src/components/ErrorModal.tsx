interface ErrorModalProps {
  open: boolean;
  title: string;
  message: string;
  onClose: () => void;
}

function ErrorModal({
  open,
  title,
  message,
  onClose,
}: ErrorModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

      <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">

        <div className="text-center">

          <div className="text-5xl mb-4">
            ⚠
          </div>

          <h2 className="text-2xl font-bold mb-4">
            {title}
          </h2>

          <p className="text-gray-600 leading-7">
            {message}
          </p>

          <button
            onClick={onClose}
            className="mt-8 w-full bg-indigo-600 hover:bg-indigo-700 text-white py-3 rounded-xl font-semibold transition"
          >
            OK
          </button>

        </div>

      </div>

    </div>
  );
}

export default ErrorModal;