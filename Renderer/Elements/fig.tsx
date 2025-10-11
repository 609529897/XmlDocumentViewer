import { parseFigure } from "../../Parser/parseFigures";
import React from 'react';
import { useActions, useGraphicUrl } from "../../hooks";
import { SvgIcon } from "@/components/SvgIcon";

interface FigProps {
  node: Element;
}

interface InlineGraphicProps {
  href: string;
}

const InlineGraphic: React.FC<InlineGraphicProps> = ({ href }) => {
  const { getResourceUrl } = useActions();
  const src = getResourceUrl(href);
  return (
    <img src={src} alt="inline-graphic" className="max-w-full h-auto" />
  );
};

export const Fig: React.FC<FigProps> = ({ node }): JSX.Element => {
  const { id, label, caption, graphics, inlineGraphics } = parseFigure(node);

  const { onFullScreen } = useActions();

  const url = useGraphicUrl(graphics);

  return (
    <div 
      data-role="fig" 
      className="flex flex-col border border-[var(--kx-border-2)] rounded-lg overflow-hidden my-6" 
      id={id}
    >
      <div className="h-[54px] bg-[var(--kx-fill-1)] flex justify-between items-center px-4 group">
        <span className="text-sm font-semibold">{label}</span>
        <button 
          onClick={() => onFullScreen({ id, type: "image" })} 
          className="bg-blue-600 rounded h-[30px] px-2 group-hover:bg-blue-500 active:bg-blue-700 text-sm text-white flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
          type="button"
        >
          <SvgIcon icon="icon-quanpingzhankai" /> 
          全屏查看
        </button>
      </div>
      <div className="p-4">
        {caption && (
          <div className="text-sm mb-4">{caption}</div>
        )}
        {inlineGraphics.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {inlineGraphics.map((item: string, index: number) => (
              <InlineGraphic 
                key={`${id}-inline-${index}`} 
                href={item} 
              />
            ))}
          </div>
        )}
        <div className="flex justify-center">
          <img src={url} alt={label} className="max-w-[35%] h-auto" />
        </div>
      </div>
    </div>
  );
};
