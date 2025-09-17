import { useEffect, useMemo, useState } from 'react';
import ResourceReaderHeader from './ResourceReaderHeader';
import ResourceReaderMain from './ResourceReaderMain';
import { TransformWrapper } from 'react-zoom-pan-pinch';
import ReactDOM from 'react-dom';
import type { FormatArticleDataResult } from '../../utils';
import { defaultScale, maxScale, minScale } from './const';

// export enum TableMode {
//     image = 1,
//     dom = 2,
// }
const Portal = ({ children, container, className }: any) => {
  const [portalContainer, setPortalContainer] = useState<HTMLDivElement | null>(null);

  useEffect(() => {
    // 如果提供了现有的容器元素，直接使用
    if (container) {
      setPortalContainer(container);
      return;
    }
    
    // 否则创建一个新的div元素作为容器
    const newContainer = document.createElement('div');
    if (className) {
      newContainer.className = className;
    }
    document.body.appendChild(newContainer);
    setPortalContainer(newContainer);
    
    // 清理函数：组件卸载时移除创建的容器
    return () => {
      if (!container) {
        document.body.removeChild(newContainer);
      }
    };
  }, [container, className]);

  // 等待容器准备好后再渲染内容
  return portalContainer ? ReactDOM.createPortal(children, portalContainer) : null;
};



interface Props {
    current: {
        id: string;
        type: 'image' | 'table';
    };
    setCurrent: (current: {
        id: string;
        type: 'image' | 'table';
    }) => void;
    data: FormatArticleDataResult
}

export const ResourceReader = ({ current: currentResource, setCurrent, data }: Props) => {

    const {
     figures,
    tables,
    title,
    doi,
    } = data;

    const [visibleList, setVisibleList] = useState(true);
    const [visibleDetails, setVisibleDetails] = useState(true);

    const { id, type } = currentResource;

    // const [tableMode, setTableMode] = useState(TableMode.dom);

    const figList = figures;
    const tableList = tables;

    const isImageActiveTab = useMemo(() => {
        return type === 'image';
    }, [type]);

    const currentList = useMemo(() => {
        return isImageActiveTab ? figList : tableList;
    }, [figList, isImageActiveTab, tableList]);

    const current = useMemo(() => {
        const index = currentList.findIndex((item) => item.id === id);
        return currentList[index];
    }, [currentList, id]);

    const max = useMemo(() => {
        return currentList.length - 1;
    }, [currentList]);

    return (
        <Portal>
            <div className="fixed inset-0 w-screen h-screen bg-[var(--kx-fill-7)] z-[1000000]">
                <TransformWrapper
                    centerOnInit
                    minScale={minScale}
                    maxScale={maxScale}
                    initialScale={defaultScale}
                >
                    <ResourceReaderHeader
                        onClose={() => setCurrent({ id: '', type: "image" })}
                        setVisibleList={setVisibleList}
                        visibleList={visibleList}
                        setVisibleDetails={setVisibleDetails}
                        visibleDetails={visibleDetails}
                        current={current}
                        title={title}
                        type={type}
                        doi={doi}
                    />
                    <ResourceReaderMain
                        visibleList={visibleList}
                        setVisibleDetails={setVisibleDetails}
                        visibleDetails={visibleDetails}
                        max={max}
                        tableList={tableList}
                        figList={figList}
                        currentList={currentList}

                        id={id}
                        type={type}
                        current={current}
                        setCurrent={setCurrent}
                    />
                </TransformWrapper>
            </div>
        </Portal>
    );
};
