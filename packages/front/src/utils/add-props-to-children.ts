import React, { ReactNode } from "react";

function addPropsToReactElement(
  element: ReactNode,
  props: Record<string, unknown>
) {
  if (React.isValidElement(element)) {
    return React.cloneElement(element, props);
  }
  return element;
}

export function addPropsToChildren(
  children: ReactNode,
  props: Record<string, unknown>
) {
  if (!Array.isArray(children)) {
    return addPropsToReactElement(children, props);
  }
  return children.map((childElement) =>
    addPropsToReactElement(childElement, props)
  );
}
