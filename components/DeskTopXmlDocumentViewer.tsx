import { SvgIcon } from "@/components/SvgIcon";
import {
  ArticleHeader,
  ArticleSummary,
  ArticleReferences,
  SideAnchor,
  ResourceReader,
  SideToolList,
} from ".";
import { CommonProps } from "..";
import { Renderer } from "../Renderer";
import { useEffect, useState, useCallback } from "react";

function useScrollToTop(scrollContainer?: CommonProps["scrollContainer"]) {
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    const handleScroll = () => {
      clearTimeout(timeoutId);
      
      timeoutId = setTimeout(() => {
        if (
          scrollContainer instanceof HTMLElement &&
          scrollContainer?.scrollTop &&
          scrollContainer.scrollTop > 300
        ) {
          setShowBackToTop(true);
        } else {
          setShowBackToTop(false);
        }
      }, 200);
    };

    scrollContainer?.addEventListener("scroll", handleScroll);
    return () => {
      scrollContainer?.removeEventListener("scroll", handleScroll);
      clearTimeout(timeoutId);
    };
  }, [scrollContainer]);

  const backToTop = useCallback(() => {
    scrollContainer?.scrollTo({ top: 0, behavior: "smooth" });
  }, [scrollContainer]);

  return { showBackToTop, backToTop };
}

interface BackToTopButtonProps {
  onClick: () => void;
  className?: string;
}

export function BackToTopButton({
  onClick,
  className = "",
}: BackToTopButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`fixed bottom-16 right-16 z-50 border p-3 rounded-full hover:opacity-90 transition-opacity ${className}`}
      aria-label="回到顶部"
    >
      <SvgIcon
        icon="icon-xiazai"
        className="w-5 h-5 rotate-180 text-[var(--kx-text-2)]"
      />
    </button>
  );
}

export function DeskTopXmlDocumentViewer(props: CommonProps): JSX.Element {
  const {
    fullScreen,
    onFullScreen,
    actions,
    pdf,
    data,
    parsedData,
    scrollContainer,
  } = props;

  const { showBackToTop, backToTop } = useScrollToTop(scrollContainer);

  return (
    <>
      <div className="flex items-start gap-[100px] py-12 w-[1200px] mx-auto">
        <div className="flex-1 flex gap-10 flex-col text-[var(--kx-text-1)]">
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

      <div className="fixed top-[128px] w-[226px] h-[calc(100vh-176px)] overflow-y-auto left-[calc((100vw-1200px)/2-260px)]">
        <SideAnchor data={data} scrollContainer={scrollContainer} />
      </div>
      {fullScreen.id && (
        <ResourceReader
          current={fullScreen}
          setCurrent={onFullScreen}
          data={data}
        />
      )}

      {showBackToTop && <BackToTopButton onClick={backToTop} />}
    </>
  );
}
