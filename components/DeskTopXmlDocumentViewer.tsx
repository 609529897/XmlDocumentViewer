import { ArticleHeader, ArticleSummary, ArticleReferences, SideAnchor, ResourceReader, SideToolList } from '.';
import { CommonProps } from '..';
import { Renderer } from '../Renderer';

export function DeskTopXmlDocumentViewer(props: CommonProps): JSX.Element {

  const {
    currentResourceVisible,
    setCurrentResourceVisible,
    actions,
    pdf,
    data,
    parsedData,
    scrollContainer,
  } = props;

  return (
      <>
        <div className="flex items-start gap-[100px] py-12 w-[1200px] mx-auto">
          <div className="flex-1 flex gap-10 flex-col">
            <ArticleHeader
              actions={actions}
              pdf={pdf}
              data={data}
              parsedData={parsedData}
              width="60%"
            />
            <ArticleSummary data={data} />
            {parsedData.bodyNode && <Renderer node={parsedData.bodyNode} />}
            <ArticleReferences data={data} />
          </div>
          <SideToolList data={data} />
        </div>

    <div className="fixed top-[128px] w-[226px] h-[calc(100vh-128px)] overflow-y-auto left-[calc((100vw-1200px)/2-260px)]">
        <SideAnchor data={data} scrollContainer={scrollContainer} />
    </div>
        {currentResourceVisible.id && (
          <ResourceReader
            current={currentResourceVisible}
            setCurrent={setCurrentResourceVisible}
            data={data}
          />
        )}
      </>
  );
}