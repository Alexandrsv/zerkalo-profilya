import { addWrapsToString } from "./add-wraps-to-string";
import { ShowStoryBoxOptions } from "@vkontakte/vk-bridge";

export interface GetFeedbackStoryInput {
  ownerId: number;
  questionId: string;
  feedbackId: string;
  questionText: string;
  feedbackText: string;
}

export const getFeedbackStoryOptions = ({
  feedbackId,
  ownerId,
  questionId,
  questionText,
  feedbackText,
}: GetFeedbackStoryInput): ShowStoryBoxOptions => ({
  background_type: "image",
  attachment: {
    text: "signup", //для аб теста more vote
    type: "url",
    url: `https://vk.com/app51465205#/question/${questionId}`,
    owner_id: ownerId,
    id: +feedbackId.replace(/[^0-9]/g, "").slice(0, 6),
  },
  stickers: [
    {
      sticker_type: "native",
      sticker: {
        action_type: "text",
        can_delete: false,
        action: {
          text: "Я спросил:",
          style: "retro",
        },
        transform: {
          relation_width: 0.7,
          gravity: "center_top",
          translation_y: 0.05,
        },
      },
    },

    {
      sticker_type: "native",
      sticker: {
        action_type: "text",
        can_delete: false,
        action: {
          text: addWrapsToString(questionText, 35),
          style: "italics",
        },
        transform: {
          relation_width: 0.9,
          gravity: "center_top",
          translation_y: 0.15,
        },
      },
    },
    {
      sticker_type: "native",
      sticker: {
        action_type: "text",
        can_delete: false,
        action: {
          text: "А аноним мне ответил:",
          style: "retro",
        },
        transform: {
          relation_width: 0.7,
          gravity: "center",
          translation_y: -0.15,
        },
      },
    },
    {
      sticker_type: "native",
      sticker: {
        action_type: "text",
        can_delete: false,
        action: {
          text: addWrapsToString(feedbackText, 40),
          style: "italics",
        },
        transform: {
          relation_width: 0.8,
          gravity: "center_top",
          translation_y: 0.38,
        },
      },
    },
    {
      sticker_type: "native",
      sticker: {
        action_type: "text",
        can_delete: false,
        action: {
          text: "Посмотреть полный текст\n\n\n⬇️⬇️⬇️",
          style: "retro",
        },
        transform: {
          relation_width: 0.5,
          gravity: "center_bottom",
          translation_y: -0.1,
        },
      },
    },
  ],
  // blob: storyBg,
  url: "https://sun9-east.userapi.com/sun9-20/s/v1/ig2/scut-vloq8V34VL1qw09-AemeYLhfBbKG6NPyZGLhVjAE3j23JnjVqDxaPXvG31P_yVdY2F9ePmeRAzY0qGWL2TX.jpg?size=720x1280&quality=95&type=album",
});

// {
//       background_type: "image",
//       attachment: {
//         text: "signup", //для аб теста more vote
//         type: "url",
//         url: "https://vk.com/app51465205#/question/7a145f7a-bb24-46d4-8d9e-de56ac06d335",
//         owner_id: 142445306,
//         id: 457241109,
//       },
//       stickers: [
//         {
//           sticker_type: "native",
//           sticker: {
//             action_type: "text",
//             can_delete: false,
//             action: {
//               text: "Я спросил:",
//               style: "retro",
//             },
//             transform: {
//               relation_width: 0.7,
//               gravity: "center_top",
//               translation_y: 0.05,
//             },
//           },
//         },
//
//         {
//           sticker_type: "native",
//           sticker: {
//             action_type: "text",
//             can_delete: false,
//             action: {
//               text: addWrapsToString(question, Math.floor(question.length / 2)),
//               style: "italics",
//             },
//             transform: {
//               relation_width: 1,
//               gravity: "center_top",
//               translation_y: 0.15,
//             },
//           },
//         },
//         {
//           sticker_type: "native",
//           sticker: {
//             action_type: "text",
//             can_delete: false,
//             action: {
//               text: "А аноним мне ответил:",
//               style: "retro",
//             },
//             transform: {
//               relation_width: 0.7,
//               gravity: "center",
//               translation_y: -0.15,
//             },
//           },
//         },
//         {
//           sticker_type: "native",
//           sticker: {
//             action_type: "text",
//             can_delete: false,
//             action: {
//               text: addWrapsToString(
//                 feedback2,
//                 Math.floor(question.length / 2)
//               ),
//               style: "italics",
//             },
//             transform: {
//               relation_width: 1,
//               gravity: "center_top",
//               translation_y: 0.38,
//             },
//           },
//         },
//         {
//           sticker_type: "native",
//           sticker: {
//             action_type: "text",
//             can_delete: false,
//             action: {
//               text: "Посмотреть полный текст\n\n\n⬇️⬇️⬇️",
//               style: "retro",
//             },
//             transform: {
//               relation_width: 0.5,
//               gravity: "center_bottom",
//               translation_y: -0.1,
//             },
//           },
//         },
//         // {
//         //   sticker_type: "renderable",
//         //   sticker: {
//         //     can_delete: false,
//         //     content_type: "image",
//         //     url: "https://vk.com/sticker/1-73055-128",
//         //     clickable_zones: [
//         //       {
//         //         action_type: "link",
//         //         action: {
//         //           link: "https://vk.com/app51465205_142445306#/settings",
//         //           tooltip_text_key: "tooltip_open_default",
//         //         },
//         //       },
//         //     ],
//         //     transform: {
//         //       relation_width: 0.5,
//         //       gravity: "right_bottom",
//         //     },
//         //   },
//         // },
//       ],
//       // url: "https://sun9-west.userapi.com/sun9-14/s/v1/ig2/xXvwbTmPEhSv5NuHaiF0mTHjiyygIZfZl8W_pI_j7ITbWNyGWWjpEwm4MqVgIQDini7LY7L3EmUj-mSmRuyKLK2i.jpg?size=1620x2160&quality=96&type=album",
//       blob: storyBg,
//     }
