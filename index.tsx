import { useState, useMemo } from 'react';
import { xmlParser, XMLParserResult } from './Parser';
import { ActionsContext, FullScreenParams } from './context';
import { formatArticleData } from './utils';
import { MobileXmlDocumentViewer } from './components/MobileXmlDocumentViewer';
import { DeskTopXmlDocumentViewer } from './components/DeskTopXmlDocumentViewer';
import { FormatArticleDataResult } from './utils/map';
import { useIsMobile } from '@/hooks';
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
  fullScreen: FullScreenParams;
  setFullScreen: (fullScreen: FullScreenParams) => void;
}

export interface XmlDocumentViewerProps extends BaseViewerProps {
  xml: string;
  getResourceUrl?: (path: string) => string;
}

export function XmlDocumentViewer(props: XmlDocumentViewerProps): JSX.Element {
  const { xml, getResourceUrl = () => '', ...rest } = props;

  const isMobile = useIsMobile();

  const [fullScreen, setFullScreen] = useState<FullScreenParams>({
    id: '',
    type: 'image',
  });

  const parsedData = useMemo(() => xmlParser({ xml }), [xml]);
  const data = formatArticleData(parsedData);
  
  const commonProps: CommonProps =  {
    fullScreen,
    setFullScreen,
    data,
    parsedData,
    ...rest
  };

  return (
    <ActionsContext.Provider value={{ getResourceUrl, onFullScreen: setFullScreen }}>
      {isMobile ? <MobileXmlDocumentViewer {...commonProps}  /> : <DeskTopXmlDocumentViewer {...commonProps} />}
    </ActionsContext.Provider>
  );
}