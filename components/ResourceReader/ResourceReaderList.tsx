import { useEffect } from 'react';
import { useControls } from 'react-zoom-pan-pinch';
import { useGraphicUrl } from '../../hooks';
import { Skeleton } from 'antd';

const handleScrollToView = (id: string) => {
  const dom = document.getElementById(id);
  if (dom) {
    dom.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

const wrapReaderId = (id: string) => `READER_${id}`;

interface ImageProps {
  item: any;
}

const Image = ({ item }: ImageProps) => {
  const src = useGraphicUrl(item.graphics);
  return <img className="w-full mb-2" src={src} alt={item.label || ''} />;
};

const TableDisplay = ({ item }: { item: any }) => {
  return (
    <>
    {item.src ? (
      <img src={item.src} alt="" className="mb-2" />
    ) : (
      <Skeleton.Image active className='w-[120px] h-[120px]' />
    )}
    </>
  );
};

interface ListProps {
  items: any[];
  type: 'image' | 'table';
  currentId?: string;
  onChange: (id: string) => void;
}


const List = ({ items, type, currentId, onChange }: ListProps) => {
  const handleClick = (id: string) => () => onChange(id);

  return (
    <div className="flex flex-col gap-4">
      {items.map((item) => (
        <button
          key={item.id}
          id={wrapReaderId(item.id)}
          onClick={handleClick(item.id)}
          className="text-center"
        >
          {type === 'image' && <Image item={item} />}
          {type === 'table' && <TableDisplay item={item} />}
          {item.label && (
            <div>
                <span
              className={`text-xs inline-block text-white p-1 rounded ${
                currentId === item.id ? 'bg-blue-600' : ''
              }`}
            >
              {item.label}
            </span>
            </div>
          )}
        </button>
      ))}
    </div>
  );
};

interface ResourceReaderListProps {
  visibleList: boolean;
  figList: any[];
  tableList: any[];
  currentList: any[];
  setCurrent: (obj: { id: string; type: 'image' | 'table' }) => void;
  type: 'image' | 'table';
  id?: string;
}

export default function ResourceReaderList({
  visibleList,
  figList,
  tableList,
  setCurrent,
  type,
  id,
}: ResourceReaderListProps) {
  const controls = useControls();

  useEffect(() => {
    if (id) handleScrollToView(wrapReaderId(id));
  }, [id]);

  useEffect(() => {
    if (id) controls.resetTransform();
  }, [id]);

  if (!visibleList) return null;

  const switchToType = (targetType: 'image' | 'table') => {
    const list = targetType === 'image' ? figList : tableList;
    if (!list.length) return;
    setCurrent({ id: list[0].id, type: targetType });
  };

  return (
    <div className="relative left-0 top-[64px] w-[200px] box-border border-r h-screen border-[var(--kx-fill-6)]">
      <header className="h-[46px] flex items-center w-full mb-2 px-8">
        <div className="flex justify-between text-[var(--kx-text-w40)] text-base w-full">
          <button
            className={`${type === 'image' ? 'text-[--kx-text-white]' : ''} ${
              figList.length <= 0 ? 'cursor-not-allowed' : ''
            }`}
            onClick={() => switchToType('image')}
          >
            图片({figList.length})
          </button>
          <button
            className={`${type === 'table' ? 'text-[var(--kx-text-white)]' : ''} ${
              tableList.length <= 0 ? 'cursor-not-allowed' : ''
            }`}
            onClick={() => switchToType('table')}
          >
            表格({tableList.length})
          </button>
        </div>
      </header>
      <div className="overflow-y-auto px-8 h-[calc(100vh-110px)]">
        {type === 'image' && (
          <List
            items={figList}
            type="image"
            currentId={id}
            onChange={(newId) => setCurrent({ id: newId, type: 'image' })}
          />
        )}
        {type === 'table' && (
          <List
            items={tableList}
            type="table"
            currentId={id}
            onChange={(newId) => setCurrent({ id: newId, type: 'table' })}
          />
        )}
      </div>
    </div>
  );
}
