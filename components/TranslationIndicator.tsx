import { Dropdown, message, Modal } from "antd";
import { Divider } from "./Divider";
import { useState } from "react";
import { SvgIcon } from "@/components/SvgIcon";
import { useIsMobile } from "@/hooks";

interface TranslationIndicatorProps {
  title: string;
  showTranslation?: boolean;
}

export const TranslationIndicator: React.FC<TranslationIndicatorProps> = ({
  title,
  showTranslation = true,
}) => {
  const isMobile = useIsMobile();
  const [open, setOpen] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText('666');
      message.success("复制成功");
    } catch (err) {
      message.error("复制失败");
    }
  };

  // 翻译弹窗内容组件
  const TranslationPopup = (
    <div className="shadow-lg rounded-xl bg-white border border-[var(--kx-border-2)] max-w-[1000px] py-4 px-6">
      <div className="text-[var(--kx-text-1)] leading-[22px] text-xs">
        {title}
        <span
          className="text-[var(--kx-text-2)] inline-flex items-center cursor-pointer relative top-0.5 left-2"
          onClick={handleCopy}
        >
          <SvgIcon
            icon="icon-fuzhi"
            className="w-[14px] h-[14px] text-[var(--kx-fill-5)] mr-[2px]"
          />
          复制
        </span>
      </div>
      <Divider className="!my-4" />
      <div className="text-[var(--kx-text-3)] text-xs leading-5">
        以上内容由大模型翻译自动生成，翻译内容仅供参考。对于因使用本网站翻译内容产生的相关后果，本网站不承担任何商业和法律责任。
        <br />
        {666}
      </div>
    </div>
  );


  return (
    <div className="flex items-center gap-1.5">
      <span className="text-xl font-semibold">{title}</span>
      {showTranslation && (
        isMobile ? (
        <>
           <button onClick={() => {
                setOpen(true);
              }}>
              <SvgIcon
                icon="icon-yi"
                className="w-5 h-5 text-blue-600"
              />
            </button>
          <Modal
            open={open}
            centered
            styles={{ content: { padding: 0 } }}
            footer={null}
            onCancel={() => setOpen(false)}
          >
            {TranslationPopup}
          </Modal>
        </>
        ) : (
          <Dropdown
            trigger={["click"]}
            placement="topRight"
            open={open}
            popupRender={() => TranslationPopup}
            onOpenChange={(open) => {
                setOpen(open);
            }}
          >
            <button>
              <SvgIcon
                icon="icon-yi"
                className="w-5 h-5 text-blue-600"
              />
            </button>
          </Dropdown>
        )
      )}
    </div>
  );
};
