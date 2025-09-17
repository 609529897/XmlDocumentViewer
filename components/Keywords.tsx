export const Keywords = ({ keywords }: { keywords: string[] }) => {
  return (
    <div className="flex flex-wrap gap-2">
      {keywords.map((kwd) => (
        <span
          key={kwd}
          className="px-2 py-0.5 bg-[var(--kx-fill-2)] text-xs text-[var(--kx-text-2)] rounded"
        >
          {kwd}
        </span>
      ))}
    </div>
  );
};
