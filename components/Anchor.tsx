import React, { useEffect, useState } from "react";
import { ParsedSectionTitle } from "../Parser/parseSectionTitles";

// 为ID添加唯一标识的函数
const generateId = (id: string) => {
  return `ANCHOR_${id}}`;
};

export interface AnchorProps {
  className?: string;
  items: ParsedSectionTitle[];
  offsetTop?: number; // 顶部偏移（例如导航栏高度）
  scrollContainer?: HTMLElement | Window | null; // 滚动容器，默认是 window
}

const RenderList = ({
  items,
  className,
  offsetTop = 0,
  scrollContainer,
  activeId,
  onClick,
}: {
  items: ParsedSectionTitle[];
  className?: string;
  offsetTop?: number;
  scrollContainer?: HTMLElement | Window | null;
  activeId: string | null;
  onClick: (e: React.MouseEvent<HTMLAnchorElement>, href: string) => void;
}) => {
  return (
    <ul className={`w-full ${className ?? ""}`}>
      {items.map((item) => {
        const isActive = activeId === item.id;
        const href = `#${item.id}`;
        return (
          <li key={item.id} className="w-full md:text-end text-start">
            <a
              href={href}
              id={generateId(item.id)}
              onClick={(e) => onClick(e, href)}
              className={`text-sm w-full whitespace-nowrap inline-block overflow-hidden text-ellipsis mb-2 transition-colors relative ${
                isActive
                  ? "text-blue-600 border-r-2 pr-4 border-blue-600 *:after:content-[''] *:after:bg-blue-600 *:after:absolute *:after:right-0 *:after:top-0"
                  : "text-[var(--kx-text-2)]"
              }`}
            >
              {item.title}
            </a>
            {item.children && item.children.length > 0 && (
              <RenderList
                items={item.children || []}
                className={className}
                offsetTop={offsetTop}
                scrollContainer={scrollContainer}
                activeId={activeId}
                onClick={onClick}
              />
            )}
          </li>
        );
      })}
    </ul>
  );
};

export const Anchor: React.FC<AnchorProps> = ({
  className,
  items,
  offsetTop = 0,
  scrollContainer = window,
}) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  // 处理点击跳转
  const handleClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string
  ) => {
    e.preventDefault();
    const id = href.replace("#", "");
    const el = document.getElementById(id);
    if (!el) return;

    if (scrollContainer && scrollContainer !== window) {
      const container = scrollContainer as HTMLElement;
      const containerRect = container.getBoundingClientRect();
      const targetRect = el.getBoundingClientRect();
      const scrollTop =
        container.scrollTop + (targetRect.top - containerRect.top) - offsetTop;

      container.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    } else {
      const rect = el.getBoundingClientRect();
      const scrollTop = window.scrollY + rect.top - offsetTop;

      window.scrollTo({
        top: scrollTop,
        behavior: "smooth",
      });
    }
  };

  // 监听滚动，高亮对应 Anchor
  useEffect(() => {
    const container: HTMLElement | Window =
      scrollContainer && scrollContainer !== window
        ? (scrollContainer as HTMLElement)
        : window;

    const handleScroll = () => {
      let currentId: string | null = null;

      const allIds: string[] = [];
      const collectIds = (items: ParsedSectionTitle[]) => {
        items.forEach((item) => {
          allIds.push(item.id);
          if (item.children?.length) collectIds(item.children);
        });
      };
      collectIds(items);

      for (const id of allIds) {
        const el = document.getElementById(id);
        if (el) {
          const rect = el.getBoundingClientRect();
          const top =
            rect.top -
            (container === window
              ? 0
              : (container as HTMLElement).getBoundingClientRect().top);

          if (top - offsetTop <= 0) {
            currentId = id;
          } else {
            break; // 找到第一个在视口下方的元素就停
          }
        }
      }

      if (currentId) {
        // 获取锚点元素
        const anchorElement = document.getElementById(generateId(currentId));
        if (anchorElement) {
          anchorElement.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
          });
        }
      }

      if (currentId !== activeId) {
        setActiveId(currentId);
      }
    };

    handleScroll(); // 初始化
    container.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      container.removeEventListener("scroll", handleScroll);
    };
  }, [items, offsetTop, scrollContainer, activeId]);

  return (
    <RenderList
      items={items}
      className={className}
      offsetTop={offsetTop}
      scrollContainer={scrollContainer}
      activeId={activeId}
      onClick={handleClick}
    />
  );
};
