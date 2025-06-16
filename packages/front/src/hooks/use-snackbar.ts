import SnackbarContext from "../context/SnackbarContext";
import { useContext } from "react";

export const useSnackbar = () => {
  const { showSnackbar } = useContext(SnackbarContext);

  return showSnackbar;
};
