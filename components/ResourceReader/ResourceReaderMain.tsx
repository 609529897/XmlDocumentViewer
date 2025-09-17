import { useEffect, useRef, useState } from 'react';
import html2canvas from 'html2canvas';
import ResourceReaderContent from './ResourceReaderContent';
import ResourceReaderDetails from './ResourceReaderDetails';
import ResourceReaderList from './ResourceReaderList';
import Table from './Table';

interface Props {
    visibleDetails: boolean;
    visibleList: boolean;
    setVisibleDetails: (visibleDetails: boolean) => void;
    current: any;
    max: number;
    figList: any[];
    tableList: any[];
    currentList: any[]
    setCurrent: (current: { type: "image"| "table"; id: string }) => void;
    id: string;
    type: "image" | "table"
}

const ResourceReaderMain = (props: Props) => {
  const refs = useRef<(HTMLTableElement | null)[]>([]);

  const {
    visibleDetails,
    visibleList,
    setVisibleDetails,
    // tableMode,
    current,
    max,
    figList,
    tableList: _tableList,
    currentList,
    setCurrent,
    id,
    type,
  } = props;

  const [tableList, setTableList] = useState<any[]>(_tableList);

  useEffect(() => {
    const generateImages = async () => {
      for (let i = 0; i < _tableList.length; i++) {
        const tableEl = refs.current[i];
        if (tableEl) {
          const canvas = await html2canvas(tableEl, { scale: 1 });
          const src = canvas.toDataURL("image/png");
          setTableList(pre => pre.map((item, index) => ({
            ...item,
            src: index === i ? src : item.src
          })));
        }
      }
    };
    generateImages();
  }, [_tableList]);

  return (
    <main className='w-full flex'>
      <ResourceReaderList
        figList={figList}
        tableList={tableList}
        visibleList={visibleList}
        currentList={currentList}
        setCurrent={setCurrent}
        type={type}
        id={id}
      />
      <ResourceReaderContent
        max={max}
        visibleDetails={visibleDetails}
        visibleList={visibleList}
        current={current}
        currentList={currentList}
        id={id}
        type={type}
        setCurrent={setCurrent}
      />
      <ResourceReaderDetails
        current={current}
        setVisibleDetails={setVisibleDetails}
        visibleDetails={visibleDetails}
      />
      <div className="fixed -left-[1000000px] top-0">
        {_tableList.map((item, idx) => (
          <Table
            key={idx}
            item={item}
            ref={el => (refs.current[idx] = el)}
          />
        ))}
      </div>
    </main>
  );
};

export default ResourceReaderMain;
