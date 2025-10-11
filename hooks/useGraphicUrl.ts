import { findBySize } from "../utils";
import { useActions } from "./useActions";

/**
 * 返回指定 size 的图形资源 URL
 * @param {Array} graphics - 图形资源数组
 * @param {string} use - 属性名
 * @returns {string | undefined} - 资源 URL
 */
export function useGraphicUrl<T extends { href?: string }>(
  graphics: T[],
  use: keyof T = 'use' as keyof T
): string | undefined {
  const { getResourceUrl } = useActions();

  const href = findBySize(graphics, use)?.href;
  const src = href ? getResourceUrl(href) : undefined;

  return src;
}
