import { SvgIcon } from "@/components/SvgIcon";
import { parseFigGroup } from "../../Parser/parseFigGroup";
import { useActions, useGraphicUrl } from "../../hooks";

// 图片尺寸常量

interface GraphicType {
  specificUse: string;
  href: string;
  width?: number;
  height?: number;
}

interface FigType {
  graphics: GraphicType[];
}

interface FigGroupProps {
  node: Element;
}


interface RenderGraphicProps {
  fig: FigType;
}

const RenderGraphic: React.FC<RenderGraphicProps> = ({ fig }) => {
  const src = useGraphicUrl(fig.graphics, 'specificUse');
  return <img src={src} className="max-w-[35%] h-auto" />;
}

export const FigGroup: React.FC<FigGroupProps> = ({ node }) => {
  const figGroup = parseFigGroup(node);

  const { onFullScreen } = useActions();

  if (!figGroup) {
    return null;
  }

  const { id, label, title, groupGraphics, figs } = figGroup;

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
          className="bg-blue-600 rounded h-[30px] px-2 hover:bg-blue-500 active:bg-blue-700 text-sm text-white flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <SvgIcon icon="icon-quanpingzhankai" />
          全屏查看
        </button>
      </div>
      
      <div className="p-4">
        <div className="text-sm mb-4">{title}</div>
        <div className="flex flex-col items-center">
          {figs.map((fig: FigType, index: number) => (
              <RenderGraphic fig={fig} key={index} />
          ))}
        </div>
        {/* <div>
          {filterBySize(groupGraphics).map(graphic => (
             <RenderGraphic key={graphic.href} graphic={graphic} getResourceUrl={getResourceUrl}/>
          ))}
        </div> */}
      </div>
    </div>
  );
};