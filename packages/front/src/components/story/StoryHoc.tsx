import React, { FC } from "react";
import { useBridgeUser } from "../../hooks/use-bridge-user";
import { addPropsToChildren } from "../../utils/add-props-to-children";
import { encode } from "js-base64";

const question =
  "Смотря на мой профиль, было ли у тебя желание познакомиться со мной? Почему?";
const feedback2 = `Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos eveniet expedita perferendis placeat sunt?
  Error minima pariatur possimus quibusdam quos. Accusamus ad adipisci cum earum nobis quidem repellat reprehenderit
  vel! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos eveniet expedita perferendis placeat sunt?
  Error minima pariatur possimus quibusdam quos. Accusamus ad adipisci cum earum nobis quidem repellat reprehenderit
  vel! Lorem ipsum dolor sit amet, consectetur adipisicing elit. Dignissimos eveniet expedita perferendis placeat sunt?
  Error minima pariatur possimus quibusdam quos. Accusamus ad adipisci cum earum nobis quidem repellat reprehenderit
  vel!`;
const feedback = `Цвет текста в формате #000000. Если поле background_style имеет значение none, то значение поля будет определять цвет текста, иначе — будет означать цвет, применяемый к стилю.`;

const StoryHOC: FC<{ children: JSX.Element }> = ({ children }) => {
  const { bridgeUser } = useBridgeUser();
  const svgRef = React.useRef<SVGSVGElement>(null);
  let encodedData = "";
  if (svgRef.current) {
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    // encodedData = "data:image/svg+xml;base64," + window.btoa(svgData);
    encodedData = "data:image/svg+xml;base64," + encode(svgData);
    console.log({ svgData, encodedData });
  }
  const avatar = bridgeUser?.photo_max_orig;
  console.log("StoryHOC", { bridgeUser });
  if (!bridgeUser) return null;
  return (
    <div>
      {addPropsToChildren(children, { avatar, encodedData })}{" "}
      <svg
        ref={svgRef}
        width={720 / 2}
        height={1280 / 2}
        viewBox={`0 0 ${720 / 2} ${1280 / 2}`}
        preserveAspectRatio="xMidYMid meet"
        className={"border-purple-500 border-2 hidden"}
      >
        <switch>
          <foreignObject x="0" y="0" width="100%" height="690">
            <div
              style={{
                height: 1280 / 2,
                background:
                  "linear-gradient(to left top, #051937, #1e2c6d, #5439a1, #9a39cc, #eb12eb)",
              }}
            ></div>
          </foreignObject>
        </switch>
      </svg>
    </div>
  );
};

export default StoryHOC;
