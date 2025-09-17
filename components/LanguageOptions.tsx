export const LanguageOptions = ({ langs, onSelect }: { langs: string[]; onSelect: (lang: string) => void }) => (
  <div className="flex gap-4 items-center">
    {langs.map((lang, idx) => (
      <button
        key={idx}
        className="border-[2px] px-[2px] h-5 text-[10px] font-semibold flex justify-center items-center rounded border-[var(--kx-text-2)] text-[var(--kx-text-2)]"
        onClick={() => onSelect(lang)}
      >
        {lang.toUpperCase()}
      </button>
    ))}
  </div>
);