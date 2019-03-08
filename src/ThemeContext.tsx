import { createContext, SetStateAction, Dispatch } from "react";

const ThemeContext = createContext<[string, Dispatch<SetStateAction<string>>]>([
  "green",
  theme => theme
]);

export default ThemeContext;
