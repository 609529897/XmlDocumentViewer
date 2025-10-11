
import { useContext } from "react";
import { ActionsContext } from "../context";

export const useActions = () => useContext(ActionsContext);
