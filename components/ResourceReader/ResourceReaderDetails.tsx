import { SvgIcon } from "@/components/SvgIcon";

export default function ResourceReaderDetails(props: any) {
    const { visibleDetails, setVisibleDetails, current } = props;

    if (!visibleDetails) {
        return null;
    }

    return (
        <div className='w-[300px] h-screen relative right-0 top-[64px] border-l border-[var(--kx-fill-6)] '>
            <header className="px-4 h-12 border-b border-[var(--kx-fill-6)] flex justify-between items-center">
                <span className='text-white text-sm'>
                    {current?.label}
                </span>
                <button onClick={() => setVisibleDetails(false)}>
                  <SvgIcon
                    icon="icon-guanbi-da"
                    className='text-[var(--kx-text-w64)] w-4 h-4'
                />
                </button>
            </header>

            <div className="text-[var(--kx-text-w64)] px-4 py-2 text-sm leading-[22px]">
                {current.caption}
            </div>
        </div>
    );
}
