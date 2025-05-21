import { createPortal } from "react-dom";
import { useState, useEffect } from "react";

export function usePortal(id: string = "root") {
  const [container, setContainer] = useState<Element | null>(null);

  useEffect(() => {
    setContainer(document.getElementById(id));
  }, [id]);

  return (children: React.ReactNode) =>
    container ? createPortal(children, container) : null;
}
