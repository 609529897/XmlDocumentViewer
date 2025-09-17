export const Divider = ({ className }: { className?: string }) => (
  <div className={`border-b border-[var(--kx-border-3)] my-6 w-full border-dashed ${className || ''}`}></div>
);