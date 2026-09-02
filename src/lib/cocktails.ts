export type Method =
  | "stir"
  | "shake"
  | "build"
  | "blend"
  | "swizzle"
  | "throw";

export type Glass =
  | "rocks"
  | "coupe"
  | "martini"
  | "highball"
  | "collins"
  | "hurricane"
  | "flute"
  | "mug"
  | "julep"
  | "wine"
  | "nick";

export type CategoryId =
  | "whiskey"
  | "gin"
  | "vodka"
  | "rum"
  | "tequila"
  | "brandy"
  | "aperitif"
  | "na";

export type Ingredient = {
  name: string;
  qty: number;
  unit: string;
  optional?: boolean;
};

export type Cocktail = {
  id: string;
  name: string;
  nameEn: string;
  category: CategoryId;
  base: string;
  glass: Glass;
  method: Method;
  ice: string;
  garnish: string;
  minutes: number;
  /** 成品近似酒精度（%vol）；无酒精为 0。仅供选酒参考，不是精确值 */
  abv: number;
  /** 甜度 1~5，1 最干 */
  sweet: number;
  level: "入门" | "进阶" | "讲究";
  ingredients: Ingredient[];
  steps: string[];
  note: string;
};

export type Category = {
  id: CategoryId;
  mark: string;
  name: string;
  nameEn: string;
  blurb: string;
};

export const CATEGORIES: Category[] = [
  {
    id: "whiskey",
    mark: "威",
    name: "威士忌",
    nameEn: "Whiskey",
    blurb: "谷物蒸馏，适合搅拌短饮与威士忌酸。",
  },
  {
    id: "gin",
    mark: "金",
    name: "金酒",
    nameEn: "Gin",
    blurb: "杜松主导，马天尼、内格罗尼与长饮的骨架。",
  },
  {
    id: "vodka",
    mark: "伏",
    name: "伏特加",
    nameEn: "Vodka",
    blurb: "中性酒体，承接咖啡、番茄与姜味。",
  },
  {
    id: "rum",
    mark: "朗",
    name: "朗姆",
    nameEn: "Rum",
    blurb: "甘蔗风味，从戴吉利到热带特调。",
  },
  {
    id: "tequila",
    mark: "龙",
    name: "龙舌兰",
    nameEn: "Tequila",
    blurb: "龙舌兰与梅斯卡尔，酸、盐、葡萄柚。",
  },
  {
    id: "brandy",
    mark: "白",
    name: "白兰地",
    nameEn: "Brandy",
    blurb: "葡萄蒸馏，边车、皮斯科酸与餐后酒。",
  },
  {
    id: "aperitif",
    mark: "开",
    name: "开胃酒",
    nameEn: "Aperitif",
    blurb: "苦甜与气泡，餐前一杯。",
  },
  {
    id: "na",
    mark: "无",
    name: "无酒精",
    nameEn: "Zero Proof",
    blurb: "同样讲比例与手法，不含烈酒。",
  },
];

export const METHOD_LABEL: Record<Method, string> = {
  stir: "搅拌",
  shake: "摇荡",
  build: "直调",
  blend: "搅打",
  swizzle: "旋搅",
  throw: "抛调",
};

export const GLASS_LABEL: Record<Glass, string> = {
  rocks: "古典杯",
  coupe: "碟形杯",
  martini: "马天尼杯",
  highball: "高球杯",
  collins: "柯林杯",
  hurricane: "飓风杯",
  flute: "笛形杯",
  mug: "铜杯",
  julep: "朱利普杯",
  wine: "葡萄酒杯",
  nick: "尼克诺拉",
};

export const COCKTAILS: Cocktail[] = [
  {
    id: "old-fashioned",
    name: "古典鸡尾酒",
    nameEn: "Old Fashioned",
    category: "whiskey",
    base: "波本或黑麦",
    glass: "rocks",
    method: "stir",
    ice: "一颗大冰块",
    garnish: "橙皮喷油",
    minutes: 3,
    abv: 30,
    sweet: 2,
    level: "入门",
    ingredients: [
      { name: "波本或黑麦威士忌", qty: 60, unit: "ml" },
      { name: "糖浆（1:1）", qty: 7.5, unit: "ml" },
      { name: "安格斯特拉苦精", qty: 2, unit: "dash" },
      { name: "橙苦精", qty: 1, unit: "dash", optional: true },
    ],
    steps: [
      "古典杯放入大冰块预冷。",
      "搅拌杯加满冰块，按配方倒入全部材料。",
      "沿杯壁搅拌约 20 秒，至杯外起霜、酒液微稀释。",
      "滤入古典杯。橙皮在杯口上方拧出精油，擦沿后放入。",
    ],
    note: "方糖加少许水捣压可替代糖浆，口感更旧派。黑麦更干香，波本更圆润。",
  },
  {
    id: "manhattan",
    name: "曼哈顿",
    nameEn: "Manhattan",
    category: "whiskey",
    base: "黑麦威士忌",
    glass: "coupe",
    method: "stir",
    ice: "无（滤出）",
    garnish: "鸡尾酒樱桃",
    minutes: 3,
    abv: 28,
    sweet: 2,
    level: "入门",
    ingredients: [
      { name: "黑麦威士忌", qty: 50, unit: "ml" },
      { name: "甜苦艾酒", qty: 25, unit: "ml" },
      { name: "安格斯特拉苦精", qty: 2, unit: "dash" },
    ],
    steps: [
      "碟形杯预先冰镇。",
      "搅拌杯加满冰块，倒入威士忌、甜苦艾酒与苦精。",
      "搅拌约 25 秒至充分冷却。",
      "滤入碟形杯，点缀一颗樱桃。",
    ],
    note: "经典比例约 2:1。想更干，苦艾酒减至 20 ml。波本版更甜软。",
  },
  {
    id: "whiskey-sour",
    name: "威士忌酸",
    nameEn: "Whiskey Sour",
    category: "whiskey",
    base: "波本",
    glass: "rocks",
    method: "shake",
    ice: "方冰",
    garnish: "橙片与樱桃",
    minutes: 4,
    abv: 22,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "波本威士忌", qty: 50, unit: "ml" },
      { name: "新鲜柠檬汁", qty: 25, unit: "ml" },
      { name: "糖浆（1:1）", qty: 20, unit: "ml" },
      { name: "蛋白或 aquafaba", qty: 15, unit: "ml", optional: true },
    ],
    steps: [
      "若加蛋白：先无冰干摇 8–10 秒起泡。",
      "加入冰块，再摇 12 秒至杯壁结霜。",
      "双层滤入装有方冰的古典杯（无蛋白可直接滤入碟形杯）。",
      "点缀橙片与樱桃。",
    ],
    note: "酸甜平衡以柠檬为准：太尖加 2.5 ml 糖浆，太甜补柠檬。",
  },
  {
    id: "sazerac",
    name: "萨泽拉克",
    nameEn: "Sazerac",
    category: "whiskey",
    base: "黑麦威士忌",
    glass: "rocks",
    method: "stir",
    ice: "无（绝对干）",
    garnish: "柠檬皮喷油，不入杯",
    minutes: 4,
    abv: 32,
    sweet: 2,
    level: "讲究",
    ingredients: [
      { name: "黑麦威士忌", qty: 50, unit: "ml" },
      { name: "糖浆（1:1）", qty: 10, unit: "ml" },
      { name: "佩肖苦精", qty: 3, unit: "dash" },
      { name: "苦艾酒", qty: 0, unit: "润杯" },
    ],
    steps: [
      "古典杯用苦艾酒润壁，弃去余液，杯不放冰。",
      "搅拌杯加冰，倒入黑麦、糖浆、佩肖苦精，搅拌约 20 秒。",
      "滤入润过的空杯。",
      "柠檬皮喷油于液面，皮可弃去。",
    ],
    note: "新奥尔良经典。也可用干邑替代一半黑麦。杯必须无冰。",
  },
  {
    id: "penicillin",
    name: "青霉素",
    nameEn: "Penicillin",
    category: "whiskey",
    base: "调和苏格兰",
    glass: "rocks",
    method: "shake",
    ice: "大冰块",
    garnish: "姜片",
    minutes: 5,
    abv: 24,
    sweet: 3,
    level: "进阶",
    ingredients: [
      { name: "调和苏格兰威士忌", qty: 50, unit: "ml" },
      { name: "新鲜柠檬汁", qty: 22.5, unit: "ml" },
      { name: "蜂蜜姜糖浆", qty: 22.5, unit: "ml" },
      { name: "泥煤苏格兰", qty: 10, unit: "ml" },
    ],
    steps: [
      "调和苏格兰、柠檬汁、蜂蜜姜糖浆与冰块摇荡 12 秒。",
      "滤入装有大冰块的古典杯。",
      "泥煤苏格兰沿吧勺背漂在液面。",
      "点缀薄姜片。",
    ],
    note: "蜂蜜姜糖浆：蜂蜜 1、水 1、鲜姜片小火融匀，冷却备用。",
  },
  {
    id: "boulevardier",
    name: "林荫大道",
    nameEn: "Boulevardier",
    category: "whiskey",
    base: "波本",
    glass: "coupe",
    method: "stir",
    ice: "无（滤出）",
    garnish: "橙皮",
    minutes: 3,
    abv: 24,
    sweet: 2,
    level: "入门",
    ingredients: [
      { name: "波本威士忌", qty: 30, unit: "ml" },
      { name: "金巴利", qty: 30, unit: "ml" },
      { name: "甜苦艾酒", qty: 30, unit: "ml" },
    ],
    steps: [
      "搅拌杯加冰，三等份材料倒入。",
      "搅拌约 25 秒。",
      "滤入冰镇碟形杯（也可滤到古典杯加冰块）。",
      "橙皮喷油挂杯。",
    ],
    note: "内格罗尼的威士忌变体。波本可加到 40 ml，让酒体更暖。",
  },
  {
    id: "mint-julep",
    name: "薄荷朱利普",
    nameEn: "Mint Julep",
    category: "whiskey",
    base: "波本",
    glass: "julep",
    method: "build",
    ice: "碎冰",
    garnish: "薄荷束",
    minutes: 4,
    abv: 28,
    sweet: 2,
    level: "进阶",
    ingredients: [
      { name: "波本威士忌", qty: 60, unit: "ml" },
      { name: "糖浆（1:1）", qty: 12.5, unit: "ml" },
      { name: "薄荷叶", qty: 10, unit: "片" },
    ],
    steps: [
      "杯中放薄荷与糖浆，轻压叶面释放香气，不要捣烂。",
      "倒入波本，加满碎冰。",
      "用吧勺上下抽搅至杯壁结霜，再补碎冰成丘。",
      "薄荷束在手心拍醒后插入，吸管靠薄荷。",
    ],
    note: "银杯或锡杯导热快，霜面更明显。碎冰必须细。",
  },
  {
    id: "new-york-sour",
    name: "纽约酸",
    nameEn: "New York Sour",
    category: "whiskey",
    base: "波本",
    glass: "rocks",
    method: "shake",
    ice: "方冰",
    garnish: "红酒漂浮",
    minutes: 4,
    abv: 21,
    sweet: 3,
    level: "进阶",
    ingredients: [
      { name: "波本威士忌", qty: 50, unit: "ml" },
      { name: "新鲜柠檬汁", qty: 25, unit: "ml" },
      { name: "糖浆（1:1）", qty: 20, unit: "ml" },
      { name: "干红葡萄酒", qty: 15, unit: "ml" },
    ],
    steps: [
      "波本、柠檬、糖浆与冰块摇荡 12 秒。",
      "滤入装有方冰的古典杯。",
      "红酒沿吧勺背缓慢漂在液面，形成分层。",
    ],
    note: "红酒选单宁适中的赤霞珠或马尔贝克。倒得太快会混层。",
  },
  {
    id: "martini",
    name: "干马天尼",
    nameEn: "Dry Martini",
    category: "gin",
    base: "伦敦干金",
    glass: "nick",
    method: "stir",
    ice: "无（滤出）",
    garnish: "柠檬皮或橄榄",
    minutes: 3,
    abv: 30,
    sweet: 1,
    level: "讲究",
    ingredients: [
      { name: "伦敦干金酒", qty: 60, unit: "ml" },
      { name: "干苦艾酒", qty: 10, unit: "ml" },
    ],
    steps: [
      "马天尼杯或尼克诺拉杯充分冰镇。",
      "搅拌杯加满硬冰，倒入金酒与干苦艾酒。",
      "平稳搅拌 20–30 秒，至极冷、微稀释。",
      "滤入杯中。柠檬皮喷油，或点缀橄榄。",
    ],
    note: "不要摇。更干可把苦艾酒减到 5 ml，或先用苦艾酒润杯再弃去。",
  },
  {
    id: "negroni",
    name: "内格罗尼",
    nameEn: "Negroni",
    category: "gin",
    base: "金酒",
    glass: "rocks",
    method: "stir",
    ice: "大冰块",
    garnish: "橙皮",
    minutes: 2,
    abv: 24,
    sweet: 2,
    level: "入门",
    ingredients: [
      { name: "金酒", qty: 30, unit: "ml" },
      { name: "金巴利", qty: 30, unit: "ml" },
      { name: "甜苦艾酒", qty: 30, unit: "ml" },
    ],
    steps: [
      "古典杯放大冰块。",
      "可直接在杯中按等份倒入，也可搅拌后滤入。",
      "轻搅 8–10 秒混合。",
      "橙皮喷油挂杯。",
    ],
    note: "等份是铁律。金酒可选偏杜松的伦敦干。",
  },
  {
    id: "gin-tonic",
    name: "金汤力",
    nameEn: "Gin & Tonic",
    category: "gin",
    base: "金酒",
    glass: "highball",
    method: "build",
    ice: "满杯方冰",
    garnish: "青柠片，可加杜松果",
    minutes: 1,
    abv: 15,
    sweet: 1,
    level: "入门",
    ingredients: [
      { name: "金酒", qty: 50, unit: "ml" },
      { name: "汤力水", qty: 120, unit: "ml" },
    ],
    steps: [
      "高球杯加满冰块预冷，弃去融水。",
      "倒入金酒，再沿杯壁缓倒汤力水，保留气泡。",
      "轻搅一次。青柠片挤汁后入杯。",
    ],
    note: "汤力水要冰、要新开。金酒与汤力大约 1:2 到 1:3。",
  },
  {
    id: "tom-collins",
    name: "汤姆柯林斯",
    nameEn: "Tom Collins",
    category: "gin",
    base: "老汤姆或伦敦干金",
    glass: "collins",
    method: "build",
    ice: "长冰或方冰",
    garnish: "柠檬片与樱桃",
    minutes: 2,
    abv: 12,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "金酒", qty: 50, unit: "ml" },
      { name: "新鲜柠檬汁", qty: 25, unit: "ml" },
      { name: "糖浆（1:1）", qty: 15, unit: "ml" },
      { name: "苏打水", qty: 60, unit: "ml" },
    ],
    steps: [
      "柯林杯加冰，倒入金酒、柠檬汁、糖浆。",
      "短搅混合，补满苏打水。",
      "再轻搅一次，点缀柠檬片。",
    ],
    note: "本质是加了苏打的金酒酸。也可摇荡酸味部分再倒苏打。",
  },
  {
    id: "aviation",
    name: "航空",
    nameEn: "Aviation",
    category: "gin",
    base: "金酒",
    glass: "coupe",
    method: "shake",
    ice: "无（滤出）",
    garnish: "樱桃或紫罗兰",
    minutes: 3,
    abv: 24,
    sweet: 3,
    level: "进阶",
    ingredients: [
      { name: "金酒", qty: 45, unit: "ml" },
      { name: "新鲜柠檬汁", qty: 15, unit: "ml" },
      { name: "黑樱桃利口酒", qty: 10, unit: "ml" },
      { name: "紫罗兰利口酒", qty: 5, unit: "ml" },
    ],
    steps: [
      "全部材料与冰块摇荡 12 秒。",
      "双层滤入冰镇碟形杯。",
      "点缀樱桃。",
    ],
    note: "紫罗兰利口酒只起色与花香，多了会发皂。",
  },
  {
    id: "french-75",
    name: "法式 75",
    nameEn: "French 75",
    category: "gin",
    base: "金酒",
    glass: "flute",
    method: "shake",
    ice: "无（滤出）",
    garnish: "柠檬皮",
    minutes: 3,
    abv: 14,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "金酒", qty: 30, unit: "ml" },
      { name: "新鲜柠檬汁", qty: 15, unit: "ml" },
      { name: "糖浆（1:1）", qty: 10, unit: "ml" },
      { name: "香槟或卡瓦", qty: 60, unit: "ml" },
    ],
    steps: [
      "金酒、柠檬、糖浆与冰块摇荡 10 秒。",
      "滤入冰镇笛形杯。",
      "缓倒香槟，轻搅一次。柠檬皮喷油。",
    ],
    note: "先酸后气。气泡酒要冰，倒时贴杯壁以免溢。",
  },
  {
    id: "last-word",
    name: "最后的话",
    nameEn: "Last Word",
    category: "gin",
    base: "金酒",
    glass: "coupe",
    method: "shake",
    ice: "无（滤出）",
    garnish: "樱桃",
    minutes: 3,
    abv: 26,
    sweet: 3,
    level: "进阶",
    ingredients: [
      { name: "金酒", qty: 22.5, unit: "ml" },
      { name: "绿查特酒", qty: 22.5, unit: "ml" },
      { name: "黑樱桃利口酒", qty: 22.5, unit: "ml" },
      { name: "新鲜青柠汁", qty: 22.5, unit: "ml" },
    ],
    steps: [
      "四等份材料与冰块大力摇荡 12 秒。",
      "双层滤入碟形杯。",
    ],
    note: "等份鸡尾酒。绿查特酒草本强，务必用新鲜青柠。",
  },
  {
    id: "bees-knees",
    name: "蜂刺",
    nameEn: "Bee's Knees",
    category: "gin",
    base: "金酒",
    glass: "coupe",
    method: "shake",
    ice: "无（滤出）",
    garnish: "柠檬皮",
    minutes: 3,
    abv: 18,
    sweet: 4,
    level: "入门",
    ingredients: [
      { name: "金酒", qty: 50, unit: "ml" },
      { name: "新鲜柠檬汁", qty: 22.5, unit: "ml" },
      { name: "蜂蜜水（1:1）", qty: 22.5, unit: "ml" },
    ],
    steps: [
      "蜂蜜先与等量温水化开，冷却。",
      "三料与冰块摇荡 12 秒。",
      "滤入碟形杯，柠檬皮喷油。",
    ],
    note: "禁酒令时期经典。蜂蜜水比纯蜂蜜好摇、好控甜。",
  },
  {
    id: "sunset-grove",
    name: "落日椰林",
    nameEn: "Sunset Coconut Grove",
    category: "gin",
    base: "金酒",
    glass: "rocks",
    method: "shake",
    ice: "方冰",
    garnish: "干橙轮",
    minutes: 3,
    abv: 13,
    sweet: 4,
    level: "入门",
    ingredients: [
      { name: "金酒", qty: 50, unit: "ml" },
      { name: "君度橙酒", qty: 15, unit: "ml" },
      { name: "红石榴糖浆", qty: 10, unit: "ml" },
      { name: "椰浆", qty: 90, unit: "ml" },
    ],
    steps: [
      "四料与冰块一同摇荡 12 秒，摇到起霜。",
      "杯中补满方冰，连冰带酒滤入。",
      "放一片干橙轮在冰面上。",
    ],
    note: "椰奶版粉色特调。先摇匀再入杯是粉橘一色的关键；若想要落日分层，就把红石榴最后沿杯壁慢倒。",
  },
  {
    id: "moscow-mule",
    name: "莫斯科骡子",
    nameEn: "Moscow Mule",
    category: "vodka",
    base: "伏特加",
    glass: "mug",
    method: "build",
    ice: "方冰",
    garnish: "青柠角",
    minutes: 2,
    abv: 12,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "伏特加", qty: 50, unit: "ml" },
      { name: "新鲜青柠汁", qty: 20, unit: "ml" },
      { name: "姜汁啤酒", qty: 100, unit: "ml" },
    ],
    steps: [
      "铜杯加满冰块。",
      "倒入伏特加与青柠汁，再倒姜汁啤酒。",
      "轻搅一次，夹入青柠角。",
    ],
    note: "姜汁啤酒选辛辣款。铜杯非必须，高球杯同样成立。",
  },
  {
    id: "cosmopolitan",
    name: "大都会",
    nameEn: "Cosmopolitan",
    category: "vodka",
    base: "柑橘伏特加",
    glass: "coupe",
    method: "shake",
    ice: "无（滤出）",
    garnish: "橙皮",
    minutes: 3,
    abv: 18,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "柑橘伏特加", qty: 40, unit: "ml" },
      { name: "橙皮甜酒", qty: 20, unit: "ml" },
      { name: "新鲜青柠汁", qty: 20, unit: "ml" },
      { name: "蔓越莓汁", qty: 15, unit: "ml" },
    ],
    steps: [
      "全部材料与冰块摇荡 12 秒。",
      "双层滤入冰镇碟形杯。",
      "橙皮喷油。",
    ],
    note: "蔓越莓只调色与微酸，多了会变成果汁。普通伏特加也可。",
  },
  {
    id: "bloody-mary",
    name: "血腥玛丽",
    nameEn: "Bloody Mary",
    category: "vodka",
    base: "伏特加",
    glass: "highball",
    method: "build",
    ice: "方冰",
    garnish: "芹菜茎与柠檬",
    minutes: 5,
    abv: 11,
    sweet: 1,
    level: "进阶",
    ingredients: [
      { name: "伏特加", qty: 50, unit: "ml" },
      { name: "番茄汁", qty: 120, unit: "ml" },
      { name: "新鲜柠檬汁", qty: 15, unit: "ml" },
      { name: "伍斯特酱", qty: 2, unit: "dash" },
      { name: "塔巴斯科", qty: 2, unit: "dash" },
      { name: "盐与黑胡椒", qty: 1, unit: "撮" },
    ],
    steps: [
      "高球杯加冰，倒入伏特加与番茄汁。",
      "加入柠檬汁、伍斯特、塔巴斯科、盐与胡椒。",
      "用吧勺上下抽搅至均匀，不要摇出泡沫。",
      "插入芹菜茎，点缀柠檬。",
    ],
    note: "辣度按口味加减。可加一小撮芹菜盐抹杯口。",
  },
  {
    id: "espresso-martini",
    name: "浓缩马天尼",
    nameEn: "Espresso Martini",
    category: "vodka",
    base: "伏特加",
    glass: "coupe",
    method: "shake",
    ice: "无（滤出）",
    garnish: "三粒咖啡豆",
    minutes: 4,
    abv: 17,
    sweet: 3,
    level: "进阶",
    ingredients: [
      { name: "伏特加", qty: 50, unit: "ml" },
      { name: "新鲜浓缩咖啡", qty: 30, unit: "ml" },
      { name: "咖啡利口酒", qty: 20, unit: "ml" },
      { name: "糖浆（1:1）", qty: 10, unit: "ml" },
    ],
    steps: [
      "浓缩咖啡现做，仍热时入摇杯（泡沫更好）。",
      "加其余材料与硬冰，大力摇 15 秒。",
      "双层滤入碟形杯，待泡沫静置平整。",
      "点三粒咖啡豆。",
    ],
    note: "泡沫来自大力摇与新鲜浓缩。咖啡凉了泡沫会薄。",
  },
  {
    id: "white-russian",
    name: "白俄罗斯",
    nameEn: "White Russian",
    category: "vodka",
    base: "伏特加",
    glass: "rocks",
    method: "build",
    ice: "方冰",
    garnish: "无",
    minutes: 2,
    abv: 16,
    sweet: 4,
    level: "入门",
    ingredients: [
      { name: "伏特加", qty: 50, unit: "ml" },
      { name: "咖啡利口酒", qty: 25, unit: "ml" },
      { name: "淡奶油", qty: 25, unit: "ml" },
    ],
    steps: [
      "古典杯加冰，倒入伏特加与咖啡利口酒，短搅。",
      "淡奶油浮在液面，或轻搅成雾状。",
    ],
    note: "奶油不要打发。想更轻可用半奶油半牛奶。",
  },
  {
    id: "vodka-martini",
    name: "伏特加马天尼",
    nameEn: "Vodka Martini",
    category: "vodka",
    base: "伏特加",
    glass: "martini",
    method: "stir",
    ice: "无（滤出）",
    garnish: "柠檬皮或橄榄",
    minutes: 3,
    abv: 28,
    sweet: 1,
    level: "讲究",
    ingredients: [
      { name: "伏特加", qty: 60, unit: "ml" },
      { name: "干苦艾酒", qty: 10, unit: "ml" },
    ],
    steps: [
      "杯预先冰镇。",
      "搅拌杯加硬冰，倒入伏特加与干苦艾酒，搅拌 25 秒。",
      "滤入马天尼杯。柠檬皮喷油或点缀橄榄。",
    ],
    note: "伏特加版更干净、少香料。同样以搅拌为准。",
  },
  {
    id: "mojito",
    name: "莫吉托",
    nameEn: "Mojito",
    category: "rum",
    base: "白朗姆",
    glass: "highball",
    method: "build",
    ice: "碎冰或方冰",
    garnish: "薄荷束与青柠",
    minutes: 4,
    abv: 12,
    sweet: 4,
    level: "入门",
    ingredients: [
      { name: "白朗姆", qty: 50, unit: "ml" },
      { name: "新鲜青柠汁", qty: 25, unit: "ml" },
      { name: "糖浆（1:1）", qty: 15, unit: "ml" },
      { name: "薄荷叶", qty: 8, unit: "片" },
      { name: "苏打水", qty: 60, unit: "ml" },
    ],
    steps: [
      "杯中放薄荷与糖浆，轻压叶面，不要捣碎。",
      "倒入青柠汁与朗姆，加冰。",
      "抽搅混合，补苏打水，再补冰至满。",
      "拍醒薄荷束插入。",
    ],
    note: "捣过劲会出苦味。古巴做法常用方糖与青柠角同捣。",
  },
  {
    id: "daiquiri",
    name: "戴吉利",
    nameEn: "Daiquiri",
    category: "rum",
    base: "白朗姆",
    glass: "coupe",
    method: "shake",
    ice: "无（滤出）",
    garnish: "青柠片",
    minutes: 3,
    abv: 20,
    sweet: 3,
    level: "讲究",
    ingredients: [
      { name: "白朗姆", qty: 60, unit: "ml" },
      { name: "新鲜青柠汁", qty: 30, unit: "ml" },
      { name: "糖浆（1:1）", qty: 15, unit: "ml" },
    ],
    steps: [
      "三料与冰块摇荡 12 秒。",
      "双层滤入冰镇碟形杯。",
    ],
    note: "调酒基本功。比例约 4:2:1。糖随青柠酸度微调 2.5 ml。",
  },
  {
    id: "pina-colada",
    name: "椰林飘香",
    nameEn: "Piña Colada",
    category: "rum",
    base: "白朗姆",
    glass: "hurricane",
    method: "blend",
    ice: "碎冰",
    garnish: "菠萝叶与樱桃",
    minutes: 4,
    abv: 13,
    sweet: 5,
    level: "入门",
    ingredients: [
      { name: "白朗姆", qty: 50, unit: "ml" },
      { name: "菠萝汁", qty: 90, unit: "ml" },
      { name: "椰浆", qty: 30, unit: "ml" },
    ],
    steps: [
      "材料与约 120 ml 碎冰一同搅打至顺滑。",
      "倒入飓风杯。",
      "点缀菠萝与樱桃。",
    ],
    note: "无搅拌机：椰浆与菠萝汁先摇匀，加冰摇荡，口感更清。",
  },
  {
    id: "dark-n-stormy",
    name: "黑暗风暴",
    nameEn: "Dark 'n' Stormy",
    category: "rum",
    base: "深色朗姆",
    glass: "highball",
    method: "build",
    ice: "方冰",
    garnish: "青柠角",
    minutes: 2,
    abv: 15,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "深色朗姆", qty: 60, unit: "ml" },
      { name: "姜汁啤酒", qty: 100, unit: "ml" },
      { name: "新鲜青柠汁", qty: 10, unit: "ml" },
    ],
    steps: [
      "高球杯加冰，先倒姜汁啤酒与青柠汁。",
      "深色朗姆漂在上层，形成风暴云。",
      "饮用前可由客人自行搅开。",
    ],
    note: "百慕大经典，传统指定 Gosling's Black Seal。",
  },
  {
    id: "mai-tai",
    name: "迈泰",
    nameEn: "Mai Tai",
    category: "rum",
    base: "陈年朗姆",
    glass: "rocks",
    method: "shake",
    ice: "碎冰",
    garnish: "薄荷与用过的青柠壳",
    minutes: 4,
    abv: 22,
    sweet: 3,
    level: "进阶",
    ingredients: [
      { name: "牙买加朗姆", qty: 30, unit: "ml" },
      { name: "陈年朗姆", qty: 30, unit: "ml" },
      { name: "橙皮甜酒", qty: 15, unit: "ml" },
      { name: "新鲜青柠汁", qty: 15, unit: "ml" },
      { name: "杏仁糖浆", qty: 10, unit: "ml" },
      { name: "糖浆（1:1）", qty: 7.5, unit: "ml" },
    ],
    steps: [
      "全部材料与冰块摇荡 10 秒。",
      "倒入装有碎冰的古典杯，连冰一起倒入亦可。",
      "薄荷拍醒插入，青柠壳朝上。",
    ],
    note: "1944 年特拉达配方骨架。不要加菠萝汁——那是变体。",
  },
  {
    id: "cuba-libre",
    name: "自由古巴",
    nameEn: "Cuba Libre",
    category: "rum",
    base: "白朗姆或金朗姆",
    glass: "highball",
    method: "build",
    ice: "方冰",
    garnish: "青柠角",
    minutes: 1,
    abv: 12,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "朗姆酒", qty: 50, unit: "ml" },
      { name: "可乐", qty: 100, unit: "ml" },
      { name: "新鲜青柠汁", qty: 10, unit: "ml" },
    ],
    steps: [
      "高球杯加满冰，倒入朗姆与青柠汁。",
      "缓倒可乐，轻搅一次。",
      "挤入青柠角后放入。",
    ],
    note: "青柠是这杯酒成立的关键，不是单纯的朗姆可乐。",
  },
  {
    id: "hemingway",
    name: "海明威特调",
    nameEn: "Hemingway Daiquiri",
    category: "rum",
    base: "白朗姆",
    glass: "coupe",
    method: "shake",
    ice: "无（滤出）",
    garnish: "葡萄柚皮",
    minutes: 3,
    abv: 18,
    sweet: 3,
    level: "进阶",
    ingredients: [
      { name: "白朗姆", qty: 60, unit: "ml" },
      { name: "新鲜青柠汁", qty: 20, unit: "ml" },
      { name: "新鲜葡萄柚汁", qty: 15, unit: "ml" },
      { name: "黑樱桃利口酒", qty: 10, unit: "ml" },
    ],
    steps: [
      "全部材料与冰块摇荡 12 秒。",
      "双层滤入碟形杯。",
    ],
    note: "海明威要无糖、加倍朗姆。此为可饮用的酒吧平衡版。",
  },
  {
    id: "margarita",
    name: "玛格丽特",
    nameEn: "Margarita",
    category: "tequila",
    base: "银龙舌兰",
    glass: "rocks",
    method: "shake",
    ice: "方冰",
    garnish: "盐边与青柠",
    minutes: 3,
    abv: 20,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "银龙舌兰", qty: 50, unit: "ml" },
      { name: "橙皮甜酒", qty: 25, unit: "ml" },
      { name: "新鲜青柠汁", qty: 25, unit: "ml" },
      { name: "盐", qty: 0, unit: "半圈杯口" },
    ],
    steps: [
      "青柠擦半圈杯口，蘸盐。杯中加冰。",
      "三料与冰块摇荡 12 秒。",
      "滤入杯中，夹青柠角。",
    ],
    note: "盐只抹半圈，方便选择。100% 龙舌兰比混合酒干净。",
  },
  {
    id: "paloma",
    name: "帕洛玛",
    nameEn: "Paloma",
    category: "tequila",
    base: "银龙舌兰",
    glass: "highball",
    method: "build",
    ice: "方冰",
    garnish: "葡萄柚角与盐",
    minutes: 2,
    abv: 13,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "银龙舌兰", qty: 50, unit: "ml" },
      { name: "新鲜青柠汁", qty: 15, unit: "ml" },
      { name: "葡萄柚汽水", qty: 100, unit: "ml" },
      { name: "盐", qty: 1, unit: "撮" },
    ],
    steps: [
      "高球杯可抹浅盐边，加满冰。",
      "倒入龙舌兰、青柠汁、一小撮盐。",
      "补葡萄柚汽水，轻搅。",
    ],
    note: "墨西哥比玛格丽特更日常。无汽水可用葡萄柚汁 60 ml + 苏打 40 ml。",
  },
  {
    id: "tommys-margarita",
    name: "汤米玛格丽特",
    nameEn: "Tommy's Margarita",
    category: "tequila",
    base: "银龙舌兰",
    glass: "rocks",
    method: "shake",
    ice: "方冰",
    garnish: "青柠",
    minutes: 3,
    abv: 22,
    sweet: 2,
    level: "入门",
    ingredients: [
      { name: "银龙舌兰", qty: 60, unit: "ml" },
      { name: "新鲜青柠汁", qty: 30, unit: "ml" },
      { name: "龙舌兰糖浆", qty: 15, unit: "ml" },
    ],
    steps: [
      "三料与冰块摇荡 12 秒。",
      "滤入加冰的古典杯。不抹盐边。",
    ],
    note: "旧金山 Tommy's 做法：用龙舌兰糖浆代替橙皮甜酒，更突出酒体。",
  },
  {
    id: "tequila-sunrise",
    name: "龙舌兰日出",
    nameEn: "Tequila Sunrise",
    category: "tequila",
    base: "银龙舌兰",
    glass: "highball",
    method: "build",
    ice: "方冰",
    garnish: "橙片与樱桃",
    minutes: 2,
    abv: 12,
    sweet: 5,
    level: "入门",
    ingredients: [
      { name: "银龙舌兰", qty: 50, unit: "ml" },
      { name: "橙汁", qty: 120, unit: "ml" },
      { name: "红石榴糖浆", qty: 15, unit: "ml" },
    ],
    steps: [
      "高球杯加冰，倒入龙舌兰与橙汁，短搅。",
      "石榴糖浆沿杯壁沉底，形成日出分层。不要搅开。",
      "点缀橙片与樱桃。",
    ],
    note: "糖浆比重大才会沉底。搅匀就只是一杯甜橙酒。",
  },
  {
    id: "ranch-water",
    name: "牧场水",
    nameEn: "Ranch Water",
    category: "tequila",
    base: "银龙舌兰",
    glass: "collins",
    method: "build",
    ice: "方冰",
    garnish: "青柠",
    minutes: 1,
    abv: 11,
    sweet: 1,
    level: "入门",
    ingredients: [
      { name: "银龙舌兰", qty: 50, unit: "ml" },
      { name: "新鲜青柠汁", qty: 20, unit: "ml" },
      { name: "苏打水", qty: 100, unit: "ml" },
    ],
    steps: [
      "柯林杯加满冰。",
      "倒入龙舌兰与青柠汁，补苏打水。",
      "轻搅，夹入青柠。",
    ],
    note: "德州西式高球。要干、要冰、要有气泡。",
  },
  {
    id: "el-diablo",
    name: "恶魔",
    nameEn: "El Diablo",
    category: "tequila",
    base: "银龙舌兰",
    glass: "highball",
    method: "shake",
    ice: "方冰",
    garnish: "青柠与黑醋栗",
    minutes: 3,
    abv: 14,
    sweet: 4,
    level: "进阶",
    ingredients: [
      { name: "银龙舌兰", qty: 45, unit: "ml" },
      { name: "黑醋栗利口酒", qty: 15, unit: "ml" },
      { name: "新鲜青柠汁", qty: 15, unit: "ml" },
      { name: "姜汁啤酒", qty: 90, unit: "ml" },
    ],
    steps: [
      "龙舌兰、黑醋栗利口酒、青柠汁与冰块摇荡 8 秒。",
      "滤入加冰高球杯，补姜汁啤酒。",
      "轻搅一次。",
    ],
    note: "特拉达作品。黑醋栗给颜色与果香，姜提供辣感。",
  },
  {
    id: "sidecar",
    name: "边车",
    nameEn: "Sidecar",
    category: "brandy",
    base: "干邑",
    glass: "coupe",
    method: "shake",
    ice: "无（滤出）",
    garnish: "糖边与橙皮",
    minutes: 3,
    abv: 22,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "干邑", qty: 50, unit: "ml" },
      { name: "橙皮甜酒", qty: 20, unit: "ml" },
      { name: "新鲜柠檬汁", qty: 20, unit: "ml" },
      { name: "细砂糖", qty: 0, unit: "半圈杯口", optional: true },
    ],
    steps: [
      "碟形杯可抹半圈糖边并冰镇。",
      "三料与冰块摇荡 12 秒。",
      "双层滤入杯中，橙皮喷油。",
    ],
    note: "白兰地版玛格丽特。VSOP 足够，不必上 XO。",
  },
  {
    id: "brandy-alexander",
    name: "白兰地亚历山大",
    nameEn: "Brandy Alexander",
    category: "brandy",
    base: "干邑",
    glass: "coupe",
    method: "shake",
    ice: "无（滤出）",
    garnish: "碾碎肉豆蔻",
    minutes: 3,
    abv: 15,
    sweet: 5,
    level: "入门",
    ingredients: [
      { name: "干邑", qty: 30, unit: "ml" },
      { name: "深色可可利口酒", qty: 30, unit: "ml" },
      { name: "淡奶油", qty: 30, unit: "ml" },
    ],
    steps: [
      "三等份与冰块摇荡 12 秒。",
      "滤入碟形杯。",
      "表面擦新鲜肉豆蔻。",
    ],
    note: "餐后酒。奶油要冷，摇出细腻质地即可，不要成冰淇淋。",
  },
  {
    id: "pisco-sour",
    name: "皮斯科酸",
    nameEn: "Pisco Sour",
    category: "brandy",
    base: "皮斯科",
    glass: "coupe",
    method: "shake",
    ice: "无（滤出）",
    garnish: "安格斯特拉苦精点在泡沫上",
    minutes: 4,
    abv: 18,
    sweet: 3,
    level: "进阶",
    ingredients: [
      { name: "皮斯科", qty: 60, unit: "ml" },
      { name: "新鲜青柠汁", qty: 30, unit: "ml" },
      { name: "糖浆（1:1）", qty: 20, unit: "ml" },
      { name: "蛋白", qty: 15, unit: "ml" },
      { name: "安格斯特拉苦精", qty: 3, unit: "dash" },
    ],
    steps: [
      "先无冰干摇 10 秒起泡。",
      "加冰再摇 12 秒。",
      "双层滤入碟形杯，待泡沫平整。",
      "在泡沫上点苦精，可用牙签拉成图案。",
    ],
    note: "秘鲁用青柠，智利常用柠檬。蛋白也可用 aquafaba。",
  },
  {
    id: "vieux-carre",
    name: "老广场",
    nameEn: "Vieux Carré",
    category: "brandy",
    base: "干邑与黑麦",
    glass: "rocks",
    method: "stir",
    ice: "大冰块",
    garnish: "柠檬皮或樱桃",
    minutes: 4,
    abv: 26,
    sweet: 3,
    level: "讲究",
    ingredients: [
      { name: "干邑", qty: 22.5, unit: "ml" },
      { name: "黑麦威士忌", qty: 22.5, unit: "ml" },
      { name: "甜苦艾酒", qty: 22.5, unit: "ml" },
      { name: "贝内迪克丁", qty: 7.5, unit: "ml" },
      { name: "佩肖苦精", qty: 2, unit: "dash" },
      { name: "安格斯特拉苦精", qty: 2, unit: "dash" },
    ],
    steps: [
      "搅拌杯加冰，倒入全部材料。",
      "搅拌约 25 秒。",
      "滤入放大冰块的古典杯。",
    ],
    note: "新奥尔良法区鸡尾酒。贝内迪克丁是草本甜，不可省略。",
  },
  {
    id: "between-the-sheets",
    name: "纸间",
    nameEn: "Between the Sheets",
    category: "brandy",
    base: "干邑与朗姆",
    glass: "coupe",
    method: "shake",
    ice: "无（滤出）",
    garnish: "橙皮",
    minutes: 3,
    abv: 22,
    sweet: 3,
    level: "进阶",
    ingredients: [
      { name: "干邑", qty: 30, unit: "ml" },
      { name: "白朗姆", qty: 30, unit: "ml" },
      { name: "橙皮甜酒", qty: 15, unit: "ml" },
      { name: "新鲜柠檬汁", qty: 15, unit: "ml" },
    ],
    steps: [
      "全部材料与冰块摇荡 12 秒。",
      "滤入碟形杯，橙皮喷油。",
    ],
    note: "边车加上朗姆。酒体更冲，柠檬不要再加。",
  },
  {
    id: "aperol-spritz",
    name: "阿佩罗气泡",
    nameEn: "Aperol Spritz",
    category: "aperitif",
    base: "阿佩罗",
    glass: "wine",
    method: "build",
    ice: "大方冰",
    garnish: "橙片",
    minutes: 1,
    abv: 8,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "普罗塞克", qty: 90, unit: "ml" },
      { name: "阿佩罗", qty: 60, unit: "ml" },
      { name: "苏打水", qty: 30, unit: "ml" },
    ],
    steps: [
      "葡萄酒杯加满冰。",
      "按 3:2:1 倒入普罗塞克、阿佩罗、苏打水。",
      "轻搅一次，放入厚橙片。",
    ],
    note: "先酒后苦，气泡不易消。杯要大、冰要多。",
  },
  {
    id: "americano",
    name: "美洲诺",
    nameEn: "Americano",
    category: "aperitif",
    base: "金巴利",
    glass: "highball",
    method: "build",
    ice: "方冰",
    garnish: "橙片",
    minutes: 1,
    abv: 9,
    sweet: 2,
    level: "入门",
    ingredients: [
      { name: "金巴利", qty: 30, unit: "ml" },
      { name: "甜苦艾酒", qty: 30, unit: "ml" },
      { name: "苏打水", qty: 60, unit: "ml" },
    ],
    steps: [
      "高球杯加冰，倒入金巴利与甜苦艾酒。",
      "补苏打水，轻搅。",
      "点缀橙片。",
    ],
    note: "内格罗尼的前身，以苏打代替金酒。低酒精度开胃。",
  },
  {
    id: "sbagliato",
    name: "内格罗尼气泡",
    nameEn: "Negroni Sbagliato",
    category: "aperitif",
    base: "金巴利",
    glass: "rocks",
    method: "build",
    ice: "大冰块",
    garnish: "橙皮",
    minutes: 1,
    abv: 10,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "金巴利", qty: 30, unit: "ml" },
      { name: "甜苦艾酒", qty: 30, unit: "ml" },
      { name: "普罗塞克", qty: 30, unit: "ml" },
    ],
    steps: [
      "古典杯放大冰块，倒入金巴利与甜苦艾酒。",
      "补普罗塞克，轻搅。",
      "橙皮喷油。",
    ],
    note: "Sbagliato 即「倒错了」：用气泡酒代替金酒。",
  },
  {
    id: "amaretto-sour",
    name: "杏仁酸",
    nameEn: "Amaretto Sour",
    category: "aperitif",
    base: "杏仁利口酒",
    glass: "rocks",
    method: "shake",
    ice: "方冰",
    garnish: "橙片与樱桃",
    minutes: 4,
    abv: 15,
    sweet: 5,
    level: "入门",
    ingredients: [
      { name: "杏仁利口酒", qty: 45, unit: "ml" },
      { name: "波本威士忌", qty: 22.5, unit: "ml" },
      { name: "新鲜柠檬汁", qty: 30, unit: "ml" },
      { name: "糖浆（1:1）", qty: 7.5, unit: "ml" },
      { name: "蛋白", qty: 15, unit: "ml", optional: true },
    ],
    steps: [
      "若加蛋白，先干摇 8 秒。",
      "加冰再摇 12 秒。",
      "滤入加冰古典杯，点缀橙与樱桃。",
    ],
    note: "纯杏仁利口酒会过甜，加波本能撑起结构。",
  },
  {
    id: "kir-royale",
    name: "皇家基尔",
    nameEn: "Kir Royale",
    category: "aperitif",
    base: "黑醋栗利口酒",
    glass: "flute",
    method: "build",
    ice: "无",
    garnish: "黑莓或柠檬皮",
    minutes: 1,
    abv: 10,
    sweet: 3,
    level: "入门",
    ingredients: [
      { name: "黑醋栗利口酒", qty: 15, unit: "ml" },
      { name: "香槟", qty: 120, unit: "ml" },
    ],
    steps: [
      "冰镇笛形杯先倒利口酒。",
      "缓倒香槟至满，不要搅。",
    ],
    note: "基尔用白葡萄酒，皇家基尔用香槟。利口酒宜少。",
  },
  {
    id: "virgin-mojito",
    name: "处女莫吉托",
    nameEn: "Virgin Mojito",
    category: "na",
    base: "青柠与薄荷",
    glass: "highball",
    method: "build",
    ice: "碎冰",
    garnish: "薄荷束",
    minutes: 3,
    abv: 0,
    sweet: 4,
    level: "入门",
    ingredients: [
      { name: "新鲜青柠汁", qty: 30, unit: "ml" },
      { name: "糖浆（1:1）", qty: 20, unit: "ml" },
      { name: "薄荷叶", qty: 10, unit: "片" },
      { name: "苏打水", qty: 90, unit: "ml" },
    ],
    steps: [
      "轻压薄荷与糖浆。",
      "加入青柠汁与碎冰，抽搅。",
      "补苏打水，插入薄荷。",
    ],
    note: "可加 10 ml 苹果汁增加酒体，仍保持清爽。",
  },
  {
    id: "shirley-temple",
    name: "雪莉谭宝",
    nameEn: "Shirley Temple",
    category: "na",
    base: "姜汁汽水",
    glass: "highball",
    method: "build",
    ice: "方冰",
    garnish: "樱桃",
    minutes: 1,
    abv: 0,
    sweet: 5,
    level: "入门",
    ingredients: [
      { name: "姜汁汽水", qty: 120, unit: "ml" },
      { name: "红石榴糖浆", qty: 15, unit: "ml" },
      { name: "新鲜青柠汁", qty: 10, unit: "ml" },
    ],
    steps: [
      "高球杯加冰，倒入石榴糖浆与青柠汁。",
      "补姜汁汽水，轻搅。",
      "点缀樱桃。",
    ],
    note: "传统用姜汁汽水而非柠檬汽水，更有层次。",
  },
  {
    id: "citrus-highball",
    name: "柑橘高球",
    nameEn: "Citrus Highball",
    category: "na",
    base: "柑橘",
    glass: "highball",
    method: "build",
    ice: "方冰",
    garnish: "橙片",
    minutes: 2,
    abv: 0,
    sweet: 4,
    level: "入门",
    ingredients: [
      { name: "新鲜橙汁", qty: 60, unit: "ml" },
      { name: "新鲜柠檬汁", qty: 20, unit: "ml" },
      { name: "糖浆（1:1）", qty: 10, unit: "ml" },
      { name: "苏打水", qty: 80, unit: "ml" },
    ],
    steps: [
      "杯中加冰，倒入橙汁、柠檬汁、糖浆。",
      "短搅后补苏打水。",
      "橙片入杯。",
    ],
    note: "现榨果汁是关键。可加两滴苦精（含微量酒精，可省略）。",
  },
  {
    id: "cucumber-tonic",
    name: "黄瓜通宁",
    nameEn: "Cucumber Tonic",
    category: "na",
    base: "黄瓜",
    glass: "highball",
    method: "build",
    ice: "方冰",
    garnish: "黄瓜长片",
    minutes: 2,
    abv: 0,
    sweet: 2,
    level: "入门",
    ingredients: [
      { name: "黄瓜汁", qty: 40, unit: "ml" },
      { name: "新鲜青柠汁", qty: 15, unit: "ml" },
      { name: "糖浆（1:1）", qty: 10, unit: "ml" },
      { name: "汤力水", qty: 100, unit: "ml" },
    ],
    steps: [
      "黄瓜去皮榨汁或捣压后滤出 40 ml。",
      "与青柠、糖浆在杯中混合，加冰。",
      "补汤力水，沿杯壁插入黄瓜长片。",
    ],
    note: "汤力水的奎宁苦味代替了金酒的骨架。",
  },
  {
    id: "coconut-cooler",
    name: "椰菠萝",
    nameEn: "Coconut Cooler",
    category: "na",
    base: "椰浆与菠萝",
    glass: "hurricane",
    method: "shake",
    ice: "碎冰",
    garnish: "菠萝叶",
    minutes: 3,
    abv: 0,
    sweet: 5,
    level: "入门",
    ingredients: [
      { name: "菠萝汁", qty: 90, unit: "ml" },
      { name: "椰浆", qty: 30, unit: "ml" },
      { name: "新鲜青柠汁", qty: 15, unit: "ml" },
      { name: "糖浆（1:1）", qty: 10, unit: "ml" },
    ],
    steps: [
      "全部材料与冰块摇荡 12 秒。",
      "倒入装有碎冰的飓风杯。",
    ],
    note: "无酒精椰林飘香。椰浆要摇匀，避免结块。",
  },
];

export const CATEGORY_BY_ID = Object.fromEntries(
  CATEGORIES.map((c) => [c.id, c]),
) as Record<CategoryId, Category>;

export const COCKTAIL_BY_ID = Object.fromEntries(
  COCKTAILS.map((c) => [c.id, c]),
) as Record<string, Cocktail>;

export function cocktailsIn(category: CategoryId | "all" | "fav"): Cocktail[] {
  if (category === "all" || category === "fav") return COCKTAILS;
  return COCKTAILS.filter((c) => c.category === category);
}

/** 大类主色，用于列表杯型里的酒液与色带。 */
export const CATEGORY_COLOR: Record<CategoryId, string> = {
  whiskey: "#c98a3c",
  gin: "#7fa5b5",
  vodka: "#b9c3cc",
  rum: "#b4653c",
  tequila: "#c7a44a",
  brandy: "#a4653f",
  aperitif: "#d0563f",
  na: "#7f9c6b",
};

export function categoryColor(category: CategoryId): string {
  return CATEGORY_COLOR[category];
}

/** 可进“吧台库存”的配料：纯软料与装饰料不参与匹配，避免噪声。 */
const PANTRY_SKIP = new Set([
  "盐",
  "盐与黑胡椒",
  "伍斯特酱",
  "塔巴斯科",
  "安格斯特拉苦精",
  "佩肖苦精",
  "橙苦精",
]);

/**
 * 同义配料归一：让“金酒 / 伦敦干金酒”这类叫法能互相匹配。
 * 键都用 trim + 去空格 + 全角括号转半角后的形式。
 *
 * 注意：`苦艾酒`（absinthe，萨泽拉克润杯用）与 `干/甜苦艾酒`（vermouth）
 * 是两种东西，不能合并。
 */
export const INGREDIENT_ALIAS: Record<string, string> = {
  伦敦干金酒: "金酒",
  干苦艾酒: "干味美辛",
  甜苦艾酒: "甜味美辛",
  波本或黑麦威士忌: "波本威士忌",
  调和苏格兰威士忌: "苏格兰威士忌",
  泥煤苏格兰: "苏格兰威士忌",
  银龙舌兰: "龙舌兰",
  柑橘伏特加: "伏特加",
  深色朗姆: "黑朗姆",
  陈年朗姆: "黑朗姆",
  牙买加朗姆: "黑朗姆",
  朗姆酒: "白朗姆",
  橙汁: "新鲜橙汁",
  葡萄柚汽水: "西柚汽水",
  姜汁汽水: "姜味汽水",
  苏打水: "气泡水",
  椰奶: "椰浆",
  红石榴糖浆: "红石榴",
  蛋白或aquafaba: "蛋白",
  杏仁糖浆: "杏仁利口酒",
  糖浆: "糖浆（1:1）",
};

/** 配料名标准化：去空格、全角括号转半角、再查同义表。 */
export function normalizeIngredient(name: string): string {
  const base = name
    .trim()
    .replace(/\s+/g, "")
    .replace(/（/g, "(")
    .replace(/）/g, ")")
    .replace(/\(1:1\)$/u, "（1:1）")
    .replace(/[·、]/g, "")
    .replace(/\(.*$/u, "");
  return INGREDIENT_ALIAS[base] ?? base;
}

/** 可作为“我家有什么”选项的配料清单（已归一、去重、按类别排序）。 */
export const PANTRY_OPTIONS: string[] = [...new Set(
  COCKTAILS.flatMap((c) => c.ingredients)
    .filter((i) => !i.optional && !PANTRY_SKIP.has(normalizeIngredient(i.name)))
    .map((i) => normalizeIngredient(i.name)),
)].sort((a, b) => a.localeCompare(b, "zh-Hans-CN"));

export type MatchResult = {
  cocktail: Cocktail;
  /** 库存里缺的配料（必选项） */
  missing: string[];
};

/**
 * 按库存筛酒：missing 为 0 表示现在就能调，为 1 表示只缺一样。
 * 可选配料与苦精/调味料（PANTRY_SKIP，吧台上没有对应勾选项）不计入缺口，
 * 否则那些酒永远“差一样”、永远进不了“现在就能调”。
 */
export function matchByPantry(
  stock: string[],
  list: Cocktail[] = COCKTAILS,
): MatchResult[] {
  const have = new Set(stock.map(normalizeIngredient));
  return list
    .map((cocktail) => {
      const missing = cocktail.ingredients
        .filter(
          (i) =>
            !i.optional &&
            !PANTRY_SKIP.has(normalizeIngredient(i.name)) &&
            !have.has(normalizeIngredient(i.name)),
        )
        .map((i) => i.name);
      return { cocktail, missing };
    })
    .sort((a, b) => a.missing.length - b.missing.length);
}

export type SortId = "menu" | "abv-desc" | "abv-asc" | "sweet-desc" | "time-asc";

export const SORT_LABEL: Record<SortId, string> = {
  menu: "默认",
  "abv-desc": "度数高→低",
  "abv-asc": "度数低→高",
  "sweet-desc": "偏甜→偏干",
  "time-asc": "省时优先",
};

export function sortCocktails(list: Cocktail[], sort: SortId): Cocktail[] {
  if (sort === "menu") return list;
  const out = [...list];
  switch (sort) {
    case "abv-desc":
      return out.sort((a, b) => b.abv - a.abv);
    case "abv-asc":
      return out.sort((a, b) => a.abv - b.abv);
    case "sweet-desc":
      return out.sort((a, b) => b.sweet - a.sweet);
    case "time-asc":
      return out.sort((a, b) => a.minutes - b.minutes);
  }
}

export function abvLabel(abv: number): string {
  if (abv === 0) return "无酒精";
  if (abv <= 10) return "微醺";
  if (abv <= 16) return "适中";
  if (abv <= 24) return "偏烈";
  return "很烈";
}

export const SWEET_LABEL = ["", "很干", "偏干", "平衡", "偏甜", "很甜"];

/** 计量单位切换：imperial 只换算 ml，dash/片/撮/润杯等原样保留。 */
export type Measure = "metric" | "imperial";

const FRAC: Record<string, string> = {
  "0.25": "¼",
  "0.5": "½",
  "0.75": "¾",
};

/**
 * ml → 盎司，按 ¼ oz 取整（调酒量酒器的常见刻度）。
 * 极小量（不足 ¼ oz）回退成 ml，避免显示成 0。
 */
export function toImperial(ml: number): string {
  const oz = Math.round((ml / 30) * 4) / 4;
  if (oz < 0.25) return `${Math.round(ml * 10) / 10} ml`;
  const whole = Math.floor(oz);
  const frac = FRAC[String(oz - whole)] ?? "";
  if (!whole) return `${frac} oz`;
  return `${whole}${frac} oz`;
}

export function formatQty(
  ing: Ingredient,
  servings: number,
  measure: Measure = "metric",
): string {
  if (ing.qty === 0) return ing.unit;
  const n = ing.qty * servings;
  if (measure === "imperial" && ing.unit === "ml") {
    return toImperial(n);
  }
  const shown = Number.isInteger(n) ? String(n) : n.toFixed(1).replace(/\.0$/, "");
  return `${shown} ${ing.unit}`;
}

export function searchCocktails(query: string, list: Cocktail[]): Cocktail[] {
  const q = query.trim().toLowerCase();
  if (!q) return list;
  return list.filter((c) => {
    const bag = [
      c.name,
      c.nameEn,
      c.base,
      c.garnish,
      ...c.ingredients.map((i) => i.name),
    ]
      .join(" ")
      .toLowerCase();
    return bag.includes(q);
  });
}

export function todaysCocktail(date = new Date()): Cocktail {
  const start = new Date(date.getFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start.getTime()) / 86_400_000);
  return COCKTAILS[day % COCKTAILS.length]!;
}
