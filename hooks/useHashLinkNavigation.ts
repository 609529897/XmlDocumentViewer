import { useEffect } from "react";

type HashHandler = (id: string, fullHash: string) => void;

interface UseHashLinkNavigationConfig {
  [hashPrefix: string]: HashHandler; // key: hash 前缀，value: 对应回调
}

/**
 * 全局 a 标签点击，根据 hash 前缀触发对应回调
 */
export function useHashLinkNavigation(config: UseHashLinkNavigationConfig) {
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (target.tagName !== "A") return;

      const anchor = target as HTMLAnchorElement;
      const hash = new URL(anchor.href).hash;
      const type = anchor.dataset.type;
      if (!type) return;

      // 遍历配置，根据 hash 前缀匹配回调
      for (const prefix in config) {
        if (type.includes(prefix)) {
          const id = hash.replace(`#`, "");
          config[prefix](id, hash);
          break; // 匹配到第一个就停止
        }
      }
    };

    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [config]);
}
