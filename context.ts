import { createContext } from "react";

export type FullScreenParams = {
  id: string; 
  type: "image" | "table"
}

type ActionsContextType = {
  getResourceUrl: (path: string) => string;
  onFullScreen: (params: FullScreenParams) => void;
  translate?: (text: string) => Promise<string>;
}

export const ActionsContext = createContext<ActionsContextType>({
  getResourceUrl(path) {
    return path;
  },
  onFullScreen(params) {},
});
