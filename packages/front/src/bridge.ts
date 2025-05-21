import bridge, { VKBridgeEvent } from "@vkontakte/vk-bridge";

const consoleStyle = [
  "color: #fff",
  "background-color: #777",
  "padding: 2px 6px",
  "border-radius: 20px",
].join(";");

export const initBridge = (): void => {
  // const root: HTMLElement = document.getElementById("root")!;
  // root.style.opacity = "0";

  bridge.subscribe((e: VKBridgeEvent<any>) => {
    switch (e.detail.type) {
      case "VKWebAppUpdateConfig": {
        const scheme: string = e.detail.data.scheme || "client_light";

        // для темной темы tailwind
        const appearance: string = e.detail.data.appearance || "light";
        document.body.setAttribute("scheme", scheme);
        document.body.setAttribute("appearance", appearance);
        // root.style.opacity = "1";

        console.log("%cBridge", consoleStyle, e.detail);

        break;
      }
      default:
        console.log("%cBridge", consoleStyle, e.detail);
        return;
    }
  });
  void bridge.send("VKWebAppInit");
};
