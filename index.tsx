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

export interface CommonProps {
  actions?: React.ReactNode;
  pdf?: {
    viewUrl?: string;
    downloadUrl?: string;
  };
  parsedData: XMLParserResult;
  data: FormatArticleDataResult;
  currentResourceVisible: ResourceVisible;
  setCurrentResourceVisible: (currentResourceVisible: ResourceVisible) => void;
}

interface XmlDocumentViewerProps {
  xml: string;
  getResourceUrl?: (path: string) => string;
  actions?: React.ReactNode;
  pdf?: {
    viewUrl?: string;
    downloadUrl?: string;
  };
}

export function XmlDocumentViewer(props: XmlDocumentViewerProps): JSX.Element {

  const isMobile = useIsMobile();

  const {
    xml,
    actions,
    pdf,
    getResourceUrl = () => '',
  } = props;

  const [currentResourceVisible, setCurrentResourceVisible] = useState<ResourceVisible>({
    id: '',
    type: 'image',
  });

  const parsedData = useMemo(() => xmlParser({ xml }), [xml]);
  const data = formatArticleData(parsedData);
  
  const commonProps: CommonProps =  {
    currentResourceVisible,
    setCurrentResourceVisible,
    data,
    parsedData,
    pdf,
    actions,
  };

  return (
    <ActionsContext.Provider value={{ getResourceUrl, onFullScreen: setCurrentResourceVisible }}>
      {isMobile ? <MobileXmlDocumentViewer {...commonProps}  /> : <DeskTopXmlDocumentViewer {...commonProps} />}
    </ActionsContext.Provider>
  );
}