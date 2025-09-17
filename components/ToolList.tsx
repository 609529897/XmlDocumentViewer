import { SvgIcon } from "@/components/SvgIcon";
import { Tooltip } from "antd";

export interface ToolListProps {
  items: {
    title: string;
    icon: string;
    onClick: (index: number) => void;
    disabled: boolean;
  }[];
  activeKey: number;
  className?: string;
}

export const ToolList: React.FC<ToolListProps> = ({ items, activeKey, className }) => {
  return (
    <div className={`border rounded-xl border-[var(--kx-border-2)] w-12 bg-white flex flex-col overflow-hidden ${className || ''}`}>
      {items.map((item, idx) => (
        <Tooltip key={idx} title={item.title} placement="left">
          <button
            className={`
              w-full h-12 flex justify-center items-center text-[var(--kx-fill-6)]
              ${item.disabled ? 'cursor-not-allowed opacity-50' : 'cursor-pointer hover:text-white hover:bg-blue-600'} 
              ${activeKey === idx ? 'bg-blue-600 text-white' : 'bg-white'}
            `}
            onClick={() => !item.disabled && item.onClick(idx)}
          >
            <SvgIcon icon={item.icon} className="w-5 h-5" />
          </button>
        </Tooltip>
      ))}
    </div>
  );
};