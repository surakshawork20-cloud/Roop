"use client";

export default function AlertModal({
  title = "Are you sure?",
  description = "This action cannot be undone.",
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default", // "danger" | "default"
  onConfirm,
  onClose
}) {

  const confirmStyles =
    type === "danger"
      ? "bg-red-600 hover:bg-red-700 text-white"
      : "bg-black hover:bg-gray-800 text-white";

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-6 space-y-5 animate-fadeIn"
        onClick={(e) => e.stopPropagation()}
      >

        {/* HEADER */}
        <div className="space-y-1">
          <h2 className="text-lg font-semibold text-gray-900">
            {title}
          </h2>
          <p className="text-sm text-gray-500">
            {description}
          </p>
        </div>

        {/* ACTIONS */}
        <div className="flex gap-3 pt-2">

          <button
            onClick={onConfirm}
            className={`px-4 py-2.5 rounded-lg w-full transition ${confirmStyles}`}
          >
            {confirmText}
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            {cancelText}
          </button>

        </div>

      </div>
    </div>
  );
}