import React from "react";
import { Button } from "@vkontakte/vkui";
import bridge from "@vkontakte/vk-bridge";
import { encode } from "js-base64";

// import { ReactComponent as Hexagon } from "@/assets/story/hexagon.svg";
const Story = () => {
  const svgRef = React.useRef<SVGSVGElement>(null);

  let encodedData: string = "";

  if (svgRef.current) {
    const svgData = new XMLSerializer().serializeToString(svgRef.current);
    // encodedData = "data:image/svg+xml;base64," + window.btoa(svgData);
    encodedData = "data:image/svg+xml;base64," + encode(svgData);
  }

  const svgToDataURL = () => {
    const svg = svgRef.current;

    if (svg) {
      const svgData = new XMLSerializer().serializeToString(svg);
      const _encodedData =
        "data:image/svg+xml;base64," +
        window.btoa(unescape(encodeURIComponent(svgData)));
    }
  };

  async function showStory() {
    await bridge.send("VKWebAppShowStoryBox", {
      background_type: "image",

      stickers: [
        {
          sticker_type: "renderable",
          sticker: {
            can_delete: false,
            content_type: "image",
            url: "https://vk.com/sticker/1-73055-128",
            clickable_zones: [
              {
                action_type: "link",
                action: {
                  link: "https://vk.com/app51465205_142445306#/settings",
                  tooltip_text_key: "tooltip_open_default",
                },
              },
            ],
            transform: {
              relation_width: 0.5,
              gravity: "right_bottom",
            },
          },
        },
        {
          sticker_type: "renderable",
          sticker: {
            can_delete: false,
            content_type: "image",
            url: "https://vk.com/sticker/1-73055-128",
            clickable_zones: [
              {
                action_type: "link",
                action: {
                  link: "https://vk.com/app51465205_142445306#/settings",
                  tooltip_text_key: "tooltip_open_default",
                },
              },
            ],
            transform: {
              relation_width: 0.5,
              gravity: "right_bottom",
            },
          },
        },
      ],

      blob: encodedData,
    });
  }

  return (
    <div>
      <Button onClick={() => svgToDataURL()}>toDataURL</Button>
      <Button onClick={() => showStory()}>showStory</Button>
      {/*<Hexagon />*/}
      <svg
        ref={svgRef}
        width={720 / 2}
        height={1280 / 2}
        viewBox={`0 0 ${720 / 2} ${1280 / 2}`}
        preserveAspectRatio="xMidYMid meet"
        className={"border-purple-500 border-2"}
      >
        <switch>
          <foreignObject x="0" y="0" width="100%" height="690">
            <div
              style={{
                background:
                  "linear-gradient(to left top, #051937, #1e2c6d, #5439a1, #9a39cc, #eb12eb)",
              }}
            >
              <p style={{ width: "10%", height: 1280 / 2, color: "white" }}>
                Тест историй Тест историй{" "}
                <span>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit.
                  Dolore harum numquam quaerat repellendus rerum. Accusantium,
                  ad adipisci aliquam assumenda, aut cupiditate ea eum ipsam
                  nostrum perferendis provident qui repudiandae voluptas?
                </span>
                <span>
                  Alias architecto atque consequatur culpa dolore, doloremque ea
                  excepturi explicabo hic illo impedit labore minus molestias
                  nemo nihil non omnis quas recusandae repellendus tempora ullam
                  vitae voluptatum? Amet laboriosam, nobis!
                </span>
              </p>
            </div>
          </foreignObject>
        </switch>
      </svg>
    </div>
  );
};

export default Story;

// Вертикальное видео 9:16, минимум 720x1280, длительностью до 15 секунд, размер файла не больше 10 Мб;
// https://vk.com/faq11936
// 1440x2560
