export default function Checkbox({ checked, indeterminate, onChange }) {
  return (
    <button
      type="button"
      onClick={onChange}
      className={`h-4 w-4 rounded border flex items-center justify-center transition-colors shrink-0 ${
        checked || indeterminate
          ? "bg-accent-purple border-accent-purple"
          : "border-border hover:border-accent-purple/60"
      }`}
    >
      {indeterminate && !checked && (
        <span className="block h-px w-2 bg-white rounded-full" />
      )}
      {checked && (
        <svg
          viewBox="0 0 10 8"
          className="w-2.5 h-2 fill-none stroke-white stroke-[1.8]"
        >
          <path d="M1 4l3 3 5-6" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      )}
    </button>
  );
}
