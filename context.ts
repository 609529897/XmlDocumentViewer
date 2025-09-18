import { createContext } from "react";

export type FullScreenParams = {
  id: string; 
  type: "image" | "table"
}

type ActionsContextType = {
  getResourceUrl: (path: string) => string;
  onFullScreen: (params: FullScreenParams) => void;
}

export const ActionsContext = createContext<ActionsContextType>({
  getResourceUrl(path) {
    return path;
  },
  onFullScreen(params) {},
});
