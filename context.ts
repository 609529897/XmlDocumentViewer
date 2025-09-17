import { createContext } from "react";

type ActionsContextType = {
  getResourceUrl: (path: string) => string;
  onFullScreen: (params: { id: string; type: "image" | "table" }) => void;
}

export const ActionsContext = createContext<ActionsContextType>({
  getResourceUrl(path) {
    return path;
  },
  onFullScreen(params) {},
});
