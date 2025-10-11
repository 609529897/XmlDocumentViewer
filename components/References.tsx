export const References = ({ data }: { data: {text: string, id: string}[] }) => {
  return (
    <section className="flex flex-col gap-6">
      {data.map((item, index, self) => (
        <div key={item.id} id={item.id}>
          <div className="flex items-start">
            <div className="text-[var(--kx-text-2)] text-base w-10">
              [{index + 1}]
            </div>
            <div className="text-[var(--kx-text-1)] text-sm flex-1 leading-[22px]">
              {item.text}
            </div>
          </div>
        </div>
      ))}
    </section>
  );
};