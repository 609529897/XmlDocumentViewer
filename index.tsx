import { useState, useMemo } from "react";
import { xmlParser, XMLParserResult } from "./Parser";
import { ActionsContext, FullScreenParams } from "./context";
import { formatArticleData } from "./utils";
import { MobileXmlDocumentViewer } from "./components/MobileXmlDocumentViewer";
import { DeskTopXmlDocumentViewer } from "./components/DeskTopXmlDocumentViewer";
import { FormatArticleDataResult } from "./utils/map";
import { useIsMobile } from "@/hooks";
interface BaseViewerProps {
  actions?: React.ReactNode;
  pdf?: {
    onPreview?: () => void;
    onDownload?: () => void;
  };
  scrollContainer?: HTMLElement | Window | null; // 滚动容器，默认是 window
}

export interface CommonProps extends BaseViewerProps {
  parsedData: XMLParserResult;
  data: FormatArticleDataResult;
  fullScreen: FullScreenParams;
  onFullScreen: (fullScreen: FullScreenParams) => void;
}

export interface XmlDocumentViewerProps extends BaseViewerProps {
  xml: string;
  getResourceUrl?: (path: string) => string;
  translate?: (text: string) => Promise<string>;
}

export function XmlDocumentViewer(props: XmlDocumentViewerProps): JSX.Element {
  const { xml, getResourceUrl = () => "", translate, ...rest } = props;

  const isMobile = useIsMobile();

  const [fullScreen, onFullScreen] = useState<FullScreenParams>({
    id: "",
    type: "image",
  });

  const parsedData = useMemo(() => xmlParser({ xml }), [xml]);
  const data = formatArticleData(parsedData);

  const commonProps: CommonProps = {
    fullScreen,
    onFullScreen,
    data,
    parsedData,
    ...rest,
  };

  return (
    <ActionsContext.Provider
      value={{ getResourceUrl, onFullScreen, translate }}
    >
      {isMobile ? (
        <MobileXmlDocumentViewer {...commonProps} />
      ) : (
        <DeskTopXmlDocumentViewer {...commonProps} />
      )}
    </ActionsContext.Provider>
  );
}
