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
  // {
  //   description: "Change input language with g + h (simple)",
  //   manipulators: [
  //     {
  //       type: "basic",
  //       from: {
  //         simultaneous: [{ key_code: "g" }, { key_code: "h" }],
  //         modifiers: {
  //           optional: ["any"],
  //         },
  //       },
  //       to: [
  //         {
  //           key_code: "spacebar",
  //           modifiers: ["left_command"],
  //         },
  //       ],
  //     },
  //   ],
  // },
  ...createHyperSubLayers({
    quote: hyperTo("escape"),
    // change input language (EN <-> TH)
    g: {
      description: "Change input language",
      to: [
        {
          key_code: "spacebar",
          modifiers: ["left_command"],
        },
      ],
    },
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
      b: app("Bitwarden"),
      c: app("Google Chrome"),
      d: app("Safari"),
      f: app("Finder"),
     // m: app("Microsoft Teams (PWA)"),
      p: app("Spotify"),
      s: app("Slack"),
      t: app("Ghostty"),
      v: app("Visual Studio Code"),
      z: app("Zed"),
    },
    // another layer of fast app switcher
    l: {
      c: app("Notion Calendar"),
    },

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
