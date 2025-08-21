import fs from "fs";
import { KarabinerRules } from "./types";
import { createHyperSubLayers, app, open, hyperTo } from "./utils";

const rules: KarabinerRules[] = [
  // Define the Hyper key itself
  {
    description: "Hyper Key (⌃⌥⇧⌘)",
    manipulators: [
      {
        description: "Caps Lock -> Hyper Key",
        from: {
          key_code: "caps_lock",
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            set_variable: {
              name: "hyper",
              value: 1,
            },
          },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0,
            },
          },
        ],
        // to_if_alone: [
        //   {
        //     key_code: "escape",
        //   },
        // ],
        type: "basic",
      },
      {
        description: "Ctrl + Option + LShift + Cmd -> Hyper Key",
        from: {
          simultaneous: [
            { key_code: "left_control" },
            { key_code: "left_option" },
            { key_code: "left_shift" },
            { key_code: "left_command" },
          ],
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            set_variable: {
              name: "hyper",
              value: 1,
            },
          },
        ],
        to_after_key_up: [
          {
            set_variable: {
              name: "hyper",
              value: 0,
            },
          },
        ],
        type: "basic",
      },
    ],
  },
  {
    description: "Change input language with g + h (simple)",
    manipulators: [
      {
        type: "basic",
        from: {
          simultaneous: [{ key_code: "g" }, { key_code: "h" }],
          modifiers: {
            optional: ["any"],
          },
        },
        to: [
          {
            key_code: "spacebar",
            modifiers: ["left_command"],
          },
        ],
      },
    ],
  },
  ...createHyperSubLayers({
    quote: hyperTo("escape"),
    // move top row down for my Corne keyboard to make typing in TH easier
    q: hyperTo("1"),
    w: hyperTo("2"),
    e: hyperTo("3"),
    r: hyperTo("4"),
    t: hyperTo("5"),
    y: hyperTo("6"),
    u: hyperTo("7"),
    i: hyperTo("8"),
    o: hyperTo("9"),
    p: hyperTo("0"),
    h: hyperTo("open_bracket"),
    j: hyperTo("close_bracket"),
    period: hyperTo("backslash"),
    n: hyperTo("hyphen"),
    m: hyperTo("equal_sign"),
    comma: hyperTo("grave_accent_and_tilde"),
    // fast app switcher
    k: {
      // b: app("Arc"),
      c: app("Google Chrome"),
      d: app("Dia"),
      v: app("Cursor"),
      s: app("Slack"),
      t: app("Ghostty"),
      // m: app("Microsoft Teams"),
      f: app("Finder"),
      p: app("Spotify"),
    },

    // s = "System"
    // s: {
    //   u: {
    //     to: [
    //       {
    //         key_code: "volume_increment",
    //       },
    //     ],
    //   },
    //   j: {
    //     to: [
    //       {
    //         key_code: "volume_decrement",
    //       },
    //     ],
    //   },
    //   i: {
    //     to: [
    //       {
    //         key_code: "display_brightness_increment",
    //       },
    //     ],
    //   },
    //   k: {
    //     to: [
    //       {
    //         key_code: "display_brightness_decrement",
    //       },
    //     ],
    //   },
    //   l: {
    //     to: [
    //       {
    //         key_code: "q",
    //         modifiers: ["right_control", "right_command"],
    //       },
    //     ],
    //   },
    //   p: {
    //     to: [
    //       {
    //         key_code: "play_or_pause",
    //       },
    //     ],
    //   },
    //   semicolon: {
    //     to: [
    //       {
    //         key_code: "fastforward",
    //       },
    //     ],
    //   },
    //   // "D"o not disturb toggle
    //   d: open(
    //     `raycast://extensions/yakitrak/do-not-disturb/toggle?launchType=background`
    //   ),
    //   // "T"heme
    //   t: open(`raycast://extensions/raycast/system/toggle-system-appearance`),
    //   c: open("raycast://extensions/raycast/system/open-camera"),
    // },

    // v = "moVe" which isn't "m" because we want it to be on the left hand
    // so that hjkl work like they do in vim
    v: {
      h: {
        to: [{ key_code: "left_arrow" }],
      },
      j: {
        to: [{ key_code: "down_arrow" }],
      },
      k: {
        to: [{ key_code: "up_arrow" }],
      },
      l: {
        to: [{ key_code: "right_arrow" }],
      },
    },
    // r = "Raycast"
    // r: {
    //   c: open("raycast://extensions/thomas/color-picker/pick-color"),
    //   n: open("raycast://script-commands/dismiss-notifications"),
    //   l: open(
    //     "raycast://extensions/stellate/mxstbr-commands/create-mxs-is-shortlink"
    //   ),
    // e: open(
    //   "raycast://extensions/raycast/emoji-symbols/search-emoji-symbols"
    // ),
    //   p: open("raycast://extensions/raycast/raycast/confetti"),
    //   a: open("raycast://extensions/raycast/raycast-ai/ai-chat"),
    //   s: open("raycast://extensions/peduarte/silent-mention/index"),
    //   h: open(
    //     "raycast://extensions/raycast/clipboard-history/clipboard-history"
    //   ),
    //   1: open(
    //     "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-1"
    //   ),
    //   2: open(
    //     "raycast://extensions/VladCuciureanu/toothpick/connect-favorite-device-2"
    //   ),
  }),
];

fs.writeFileSync(
  "karabiner.json",
  JSON.stringify(
    {
      global: {
        show_in_menu_bar: false,
      },
      profiles: [
        {
          name: "Default",
          complex_modifications: {
            rules,
          },
        },
      ],
    },
    null,
    2
  )
);
