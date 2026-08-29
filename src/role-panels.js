const ROLE_SCOPE = "character-color";

const characterLabels = {
  miku: "\u521d\u97f3\u672a\u6765",
  rin: "\u955c\u97f3\u94c3",
  len: "\u955c\u97f3\u8fde",
  luka: "\u5de1\u97f3\u6d41\u6b4c",
  meiko: "MEIKO",
  kaito: "KAITO",
  ichika: "\u661f\u4e43\u4e00\u6b4c",
  saki: "\u5929\u9a6c\u54b2\u5e0c",
  honami: "\u671b\u6708\u7a57\u6ce2",
  shiho: "\u65e5\u91ce\u68ee\u5fd7\u6b65",
  minori: "\u82b1\u91cc\u5b9e\u4e43\u7406",
  haruka: "\u6850\u8c37\u9065",
  airi: "\u6843\u4e95\u7231\u8389",
  shizuku: "\u65e5\u91ce\u68ee\u96eb",
  kohane: "\u5c0f\u8c46\u6cfd\u5fc3\u7fbd",
  an: "\u767d\u77f3\u674f",
  akito: "\u4e1c\u4e91\u5f70\u4eba",
  toya: "\u9752\u67f3\u51ac\u5f25",
  tsukasa: "\u5929\u9a6c\u53f8",
  emu: "\u51e4\u7b11\u68a6",
  nene: "\u8349\u8599\u5b81\u5b81",
  rui: "\u795e\u4ee3\u7c7b",
  kanade: "\u5bb5\u5d0e\u594f",
  mafuyu: "\u671d\u6bd4\u5948\u771f\u51ac",
  ena: "\u4e1c\u4e91\u7ed8\u540d",
  mizuki: "\u6653\u5c71\u745e\u5e0c",
  hanna: "\u8fdc\u91ce\u6c49\u5a1c",
  margo: "\u5b9d\u751f\u739b\u6208",
  coco: "\u6cfd\u6e21\u53ef\u53ef",
  miria: "\u4f50\u4f2f\u7c73\u8389\u4e9a",
  meruru: "\u51b0\u4e0a\u6885\u9732\u9732",
  nanoka: "\u9ed1\u90e8\u5948\u53f6\u9999",
  hiro: "\u4e8c\u9636\u5802\u5e0c\u7f57",
  alisa: "\u7d2b\u85e4\u4e9a\u91cc\u6c99",
  noah: "\u57ce\u5d0e\u8bfa\u4e9a",
  leia: "\u83b2\u89c1\u857e\u96c5",
  sherry: "\u6a58\u96ea\u8389",
  "an-an": "\u590f\u76ee\u5b89\u5b89",
  ema: "\u6a31\u7fbd\u827e\u739b",
  yuki: "\u6708\u4ee3\u96ea"
};

function character(id, roleLabel, color, rolePrefix) {
  const label = characterLabels[id] ?? roleLabel;

  return {
    id,
    label,
    description: `\u9009\u62e9 ${label} \u5bf9\u5e94\u7684\u89d2\u8272\u989c\u8272\u8eab\u4efd\u7ec4\u3002`,
    roleName: `${rolePrefix} | ${roleLabel}`,
    color
  };
}

function panel(id, title, rolePrefix, entries) {
  return {
    id,
    title,
    color: "#5865F2",
    description:
      "\u9009\u62e9\u4e00\u4f4d\u89d2\u8272\u3002\u9009\u62e9\u65b0\u89d2\u8272\u4f1a\u66ff\u6362\u5df2\u9009\u7684\u89d2\u8272\u989c\u8272\u8eab\u4efd\u7ec4\u3002",
    placeholder: "\u9009\u62e9\u89d2\u8272",
    exclusiveScope: ROLE_SCOPE,
    options: [
      ...entries.map(([optionId, label, color]) =>
        character(optionId, label, color, rolePrefix)
      ),
      {
        id: "clear",
        label: "\u6e05\u9664\u6211\u7684\u89d2\u8272\u8eab\u4efd\u7ec4",
        description: "\u79fb\u9664\u5f53\u524d\u7684\u89d2\u8272\u989c\u8272\u8eab\u4efd\u7ec4\u3002"
      }
    ]
  };
}

module.exports = {
  channelName: "\u89d2\u8272\u8eab\u4efd\u7ec4",
  channelTopic:
    "\u4ece\u4e0b\u65b9\u83dc\u5355\u9009\u62e9\u89d2\u8272\u8eab\u4efd\u7ec4\u3002",
  panels: [
    panel("pjsk-virtual-singer", "\u4e16\u754c\u8ba1\u5212 | \u865a\u62df\u6b4c\u624b", "PJSK", [
      ["miku", "Hatsune Miku", "#33CCBB"],
      ["rin", "Kagamine Rin", "#FFCC11"],
      ["len", "Kagamine Len", "#FFEE11"],
      ["luka", "Megurine Luka", "#FFBBCC"],
      ["meiko", "MEIKO", "#DD4444"],
      ["kaito", "KAITO", "#3366CC"]
    ]),
    panel("pjsk-leo-need", "\u4e16\u754c\u8ba1\u5212 | Leo/need", "PJSK", [
      ["ichika", "Ichika Hoshino", "#33AAEE"],
      ["saki", "Saki Tenma", "#FFDD44"],
      ["honami", "Honami Mochizuki", "#EE6666"],
      ["shiho", "Shiho Hinomori", "#BBDD22"]
    ]),
    panel("pjsk-more-more-jump", "\u4e16\u754c\u8ba1\u5212 | MORE MORE JUMP!", "PJSK", [
      ["minori", "Minori Hanasato", "#FFCCAA"],
      ["haruka", "Haruka Kiritani", "#99CCFF"],
      ["airi", "Airi Momoi", "#FFAACC"],
      ["shizuku", "Shizuku Hinomori", "#99EEDD"]
    ]),
    panel("pjsk-vivid-bad-squad", "\u4e16\u754c\u8ba1\u5212 | Vivid BAD SQUAD", "PJSK", [
      ["kohane", "Kohane Azusawa", "#FF6699"],
      ["an", "An Shiraishi", "#00BBDD"],
      ["akito", "Akito Shinonome", "#FF7722"],
      ["toya", "Toya Aoyagi", "#0077DD"]
    ]),
    panel(
      "pjsk-wonderlands-showtime",
      "\u4e16\u754c\u8ba1\u5212 | Wonderlands x Showtime",
      "PJSK",
      [
        ["tsukasa", "Tsukasa Tenma", "#FFBB00"],
        ["emu", "Emu Otori", "#FF66BB"],
        ["nene", "Nene Kusanagi", "#33DD99"],
        ["rui", "Rui Kamishiro", "#BB88EE"]
      ]
    ),
    panel(
      "pjsk-nightcord",
      "\u4e16\u754c\u8ba1\u5212 | 25\u65f6\uff0c\u5728Nightcord\u3002",
      "PJSK",
      [
        ["kanade", "Kanade Yoisaki", "#BB6688"],
        ["mafuyu", "Mafuyu Asahina", "#8888CC"],
        ["ena", "Ena Shinonome", "#CCAA88"],
        ["mizuki", "Mizuki Akiyama", "#DDAACC"]
      ]
    ),
    panel(
      "mahosaba",
      "\u9b54\u6cd5\u5c11\u5973\u7684\u9b54\u5973\u5ba1\u5224",
      "MajoSaiban",
      [
        ["hanna", "Hanna Tono", "#A7B85C"],
        ["margo", "Margo Hoshou", "#7A4DE5"],
        ["coco", "Coco Sawatari", "#F0533F"],
        ["miria", "Miria Saeki", "#E8BD57"],
        ["meruru", "Meruru Hikami", "#BFCBE0"],
        ["nanoka", "Nanoka Kurobe", "#3D3F46"],
        ["hiro", "Hiro Nikaido", "#BB3142"],
        ["alisa", "Alisa Shito", "#993040"],
        ["noah", "Noah Jogasaki", "#73D6D5"],
        ["leia", "Leia Hasumi", "#FFB458"],
        ["sherry", "Sherry Tachibana", "#5298D7"],
        ["an-an", "An-An Natsume", "#8B77BF"],
        ["ema", "Ema Sakuraba", "#FF92B4"],
        ["yuki", "Yuki Tsukishiro", "#E8EAF4"]
      ]
    )
  ]
};
