import { useState, useMemo } from 'react';
import { xmlParser, XMLParserResult } from './Parser';
import { ActionsContext } from './context';
import { formatArticleData } from './utils';
import { MobileXmlDocumentViewer } from './components/MobileXmlDocumentViewer';
import { DeskTopXmlDocumentViewer } from './components/DeskTopXmlDocumentViewer';
import { FormatArticleDataResult } from './utils/map';
import { useIsMobile } from '@/hooks';

interface ResourceVisible {
  id: string;
  type: 'image' | 'table';
}

interface BaseViewerProps {
  actions?: React.ReactNode;
  pdf?: {
    viewUrl?: string;
    downloadUrl?: string;
  };
  scrollContainer?: HTMLElement | Window | null; // 滚动容器，默认是 window
}

export interface CommonProps extends BaseViewerProps {
  parsedData: XMLParserResult;
  data: FormatArticleDataResult;
  currentResourceVisible: ResourceVisible;
  setCurrentResourceVisible: (currentResourceVisible: ResourceVisible) => void;
}

export interface XmlDocumentViewerProps extends BaseViewerProps {
  xml: string;
  getResourceUrl?: (path: string) => string;
}

export function XmlDocumentViewer(props: XmlDocumentViewerProps): JSX.Element {
  const { xml, getResourceUrl = () => '', ...rest } = props;

  const [currentResourceVisible, setCurrentResourceVisible] = useState<ResourceVisible>({
    id: '',
    type: 'image',
  });

  const isMobile = useIsMobile();

  const parsedData = useMemo(() => xmlParser({ xml }), [xml]);
  const data = formatArticleData(parsedData);
  
  const commonProps: CommonProps =  {
    currentResourceVisible,
    setCurrentResourceVisible,
    data,
    parsedData,
    ...rest
  };

  return (
    <ActionsContext.Provider value={{ getResourceUrl, onFullScreen: setCurrentResourceVisible }}>
      {isMobile ? <MobileXmlDocumentViewer {...commonProps}  /> : <DeskTopXmlDocumentViewer {...commonProps} />}
    </ActionsContext.Provider>
  );
}