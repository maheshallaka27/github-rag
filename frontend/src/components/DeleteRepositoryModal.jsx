function DeleteRepositoryModal({ repo, onConfirm, onCancel, deleting }) {
  if (!repo) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70">
      <div className="w-[400px] border border-[#333] bg-[#0a0a0a] p-5">
        <h2 className="text-sm font-medium text-white">Delete repository?</h2>

        <p className="mt-3 text-xs leading-5 text-[#777]">
          This will permanently remove{" "}
          <span className="text-[#ccc]">{repo.name || repo.repoId}</span> and
          its indexed data.
        </p>

        <div className="mt-5 flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={deleting}
            className="border border-[#333] px-3 py-2 text-xs text-[#888] hover:bg-[#181818] hover:text-white"
          >
            Cancel
          </button>

          <button
            onClick={onConfirm}
            disabled={deleting}
            className="border border-[#555] bg-white px-3 py-2 text-xs text-black hover:bg-[#ddd] disabled:opacity-50"
          >
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteRepositoryModal;
