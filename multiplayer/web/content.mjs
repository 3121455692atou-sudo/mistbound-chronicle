// All shipped content is data. Mods use the same small records as these examples.
export const TERRAIN_DEFINITIONS = [
  ['plains', '平原', '#8d9d73', '草', 1, 2, 0, true, '易于开垦，稳定提供粮草。'],
  ['meadow', '花原', '#a8ae79', '花', 0, 3, 0, true, '花草丰茂，最适合建立补给农庄。'],
  ['forest', '林地', '#537960', '林', 1, 1, 2, true, '密林为守军提供掩护。'],
  ['pine', '针叶林', '#45685c', '杉', 1, 1, 3, true, '幽深的针叶林易守难攻。'],
  ['jungle', '雨林', '#4f856d', '雨', 0, 2, 3, true, '雨林防御出色，但财政收入较少。'],
  ['hills', '丘陵', '#9b946e', '丘', 2, 0, 2, true, '山间矿脉带来额外金币。'],
  ['mountain', '山脉', '#88919a', '山', 2, 0, 4, true, '天然屏障，适合修筑边境要塞。'],
  ['desert', '沙漠', '#c7ad7c', '沙', 1, 0, 1, true, '贸易穿行沙海，补给需要外部供应。'],
  ['oasis', '绿洲', '#9faa79', '泉', 1, 3, 1, true, '沙海中的丰饶聚落。'],
  ['wetland', '湿地', '#6e938a', '泽', 0, 2, 2, true, '泥沼降低敌军的推进效率。'],
  ['tundra', '苔原', '#9cae9e', '苔', 1, 1, 1, true, '寒冷却仍有资源可供经营。'],
  ['snow', '雪原', '#b8c5c8', '雪', 1, 0, 2, true, '漫长冬季使本地补给匮乏。'],
  ['volcanic', '熔岩台地', '#9d756b', '岩', 3, 0, 2, true, '火山矿藏价值颇高。'],
  ['ruins', '古代遗迹', '#aaa087', '遗', 2, 1, 2, true, '首次开拓会发现额外的 6 枚金币。'],
  ['coast', '海岸', '#8baea8', '岸', 1, 2, 0, true, '海岸渔业支持军队远行。'],
  ['lake', '湖泊', '#628f9e', '湖', 0, 1, 0, false, '深水无法驻军；请沿湖岸绕行。'],
  ['salt', '盐滩', '#c5bea0', '盐', 3, 0, 0, true, '盐业繁盛，地形却缺乏防御。'],
  ['crystal', '晶原', '#9b91b2', '晶', 3, 0, 1, true, '稀有晶矿是重要的财政来源。'],
].map(([id, name, color, icon, gold, supply, defense, passable, description]) => ({
  id, name, color, icon, yield: { gold, supply }, defense, passable, description,
}));

export const CHARACTER_DEFINITIONS = [
{
"id": "tomori",
"name": "高松灯",
"color": "#9fb6cf",
"portrait": "tomori",
"group": "mygo",
"specialty": "主唱",
"role": "support",
"description": "平时爱捡石头和创可贴，一旦逼急了就会在台上哭着念小作文。",
"wander": "",
"stats": {
"attack": 1,
"defense": 3,
"scout": 2,
"economy": 2,
"charm": 2
}
},
{
"id": "anon",
"name": "千早爱音",
"color": "#ff8fa8",
"portrait": "anon",
"group": "mygo",
"specialty": "吉他手",
"role": "vanguard",
"description": "满脑子想当核心出风头，吉他水平一般但社交能力和抗压拉满。",
"wander": "留学逃回来又迷路了，正到处打听哪能让她当核心。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 1,
"economy": 3,
"charm": 5
}
},
{
"id": "raana",
"name": "要乐奈",
"color": "#cfd6dd",
"portrait": "raana",
"group": "mygo",
"specialty": "吉他手",
"role": "vanguard",
"description": "像野猫一样来去自如的吉他天才，只要给好吃的抹茶芭菲就听话。",
"wander": "闻着抹茶芭菲的香味到处晃悠，玩腻了自然会回家。",
"stats": {
"attack": 5,
"defense": 1,
"scout": 2,
"economy": 0,
"charm": 1
}
},
{
"id": "soyo",
"name": "长崎素世",
"color": "#e9c98f",
"portrait": "soyo",
"group": "mygo",
"specialty": "贝斯手",
"role": "guard",
"description": "表面温和体贴的大小姐，背地里执念极重，随时可能说出沉重发言。",
"wander": "",
"stats": {
"attack": 1,
"defense": 4,
"scout": 1,
"economy": 2,
"charm": 4
}
},
{
"id": "taki",
"name": "椎名立希",
"color": "#8d7fb8",
"portrait": "taki",
"group": "mygo",
"specialty": "鼓手",
"role": "ranger",
"description": "脾气很冲的打工狂人，虽然日常黑脸嘴臭，但对灯的事情格外护短。",
"wander": "",
"stats": {
"attack": 4,
"defense": 2,
"scout": 1,
"economy": 1,
"charm": 1
}
},
{
"id": "sakiko",
"name": "丰川祥子",
"color": "#7fb4e0",
"portrait": "sakiko",
"group": "mujica",
"specialty": "键盘手兼主唱",
"role": "support",
"description": "昔日大小姐沦为兼职客服，为了赚钱出道把一切算计得冷酷无情。",
"wander": "",
"stats": {
"attack": 2,
"defense": 2,
"scout": 1,
"economy": 3,
"charm": 4
}
},
{
"id": "mutsumi",
"name": "若叶睦",
"color": "#a5cf9e",
"portrait": "mutsumi",
"group": "mujica",
"specialty": "吉他手",
"role": "vanguard",
"description": "沉默寡言的面瘫少女，喜欢种黄瓜送人，一句真心话能憋死全队。",
"wander": "",
"stats": {
"attack": 3,
"defense": 4,
"scout": 1,
"economy": 0,
"charm": 1
}
},
{
"id": "uika",
"name": "三角初华",
"color": "#e8dc9a",
"portrait": "uika",
"group": "mujica",
"specialty": "主唱兼吉他手",
"role": "support",
"description": "人气偶像组合成员，私下喜欢看星星，对祥子几乎有求必应。",
"wander": "通告跑累了翘班出来看星星，顺便打听发小的下落。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 2,
"economy": 2,
"charm": 5
}
},
{
"id": "umiri",
"name": "八幡海铃",
"color": "#4f8f96",
"portrait": "umiri",
"group": "mujica",
"specialty": "贝斯手",
"role": "guard",
"description": "手里同时接三十支乐队兼职的贝斯打工人，极度守时且莫得感情。",
"wander": "",
"stats": {
"attack": 3,
"defense": 3,
"scout": 1,
"economy": 1,
"charm": 2
}
},
{
"id": "nyamu",
"name": "祐天寺若麦",
"color": "#b18fd8",
"portrait": "nyamu",
"group": "mujica",
"specialty": "鼓手",
"role": "ranger",
"description": "算计流量的视频博主，戴着猫耳打鼓，谁红就凑上去跟谁搞关系。",
"wander": "举着手机到处找网红打卡点，想拍爆款视频涨粉丝。",
"stats": {
"attack": 1,
"defense": 1,
"scout": 2,
"economy": 4,
"charm": 5
}
},
{
"id": "mana",
"name": "纯田真奈",
"color": "#f2a65a",
"portrait": "mana",
"group": "sumimi",
"specialty": "主唱",
"role": "support",
"description": "元气十足的偶像搭档，爱笑又爱吃，总是全力配合初华的步调。",
"wander": "",
"stats": {
"attack": 1,
"defense": 2,
"scout": 1,
"economy": 4,
"charm": 5
}
},
{
"id": "bocchi",
"name": "后藤一里",
"color": "#ff8fb0",
"portrait": "bocchi",
"group": "kessoku",
"specialty": "主音吉他手",
"role": "vanguard",
"description": "网络吉他大神兼晚期社恐，稍微被搭话就会当场灰化或变成烂泥。",
"wander": "躲在纸箱里不敢见人，不知不觉就被踢到了大马路上。",
"stats": {
"attack": 5,
"defense": 1,
"scout": 0,
"economy": 2,
"charm": 0
}
},
{
"id": "nijika",
"name": "伊地知虹夏",
"color": "#ffd257",
"portrait": "nijika",
"group": "kessoku",
"specialty": "鼓手",
"role": "ranger",
"description": "像小太阳一样的元气鼓手，照顾全队的大脑，拔掉呆毛会失去活力。",
"wander": "",
"stats": {
"attack": 2,
"defense": 3,
"scout": 1,
"economy": 2,
"charm": 4
}
},
{
"id": "ryo",
"name": "山田凉",
"color": "#5b86d6",
"portrait": "ryo",
"group": "kessoku",
"specialty": "贝斯手",
"role": "guard",
"description": "钱全拿去买二手乐器的怪人贝斯手，穷到天天吃草还到处借钱。",
"wander": "",
"stats": {
"attack": 3,
"defense": 2,
"scout": 2,
"economy": 1,
"charm": 2
}
},
{
"id": "kita",
"name": "喜多郁代",
"color": "#ef6a5a",
"portrait": "kita",
"group": "kessoku",
"specialty": "吉他手兼主唱",
"role": "support",
"description": "浑身散发刺眼光芒的超级现充，虽然跑过路，但为了前辈拼命练琴。",
"wander": "",
"stats": {
"attack": 2,
"defense": 2,
"scout": 1,
"economy": 3,
"charm": 6
}
},
{
"id": "nina",
"name": "井芹仁菜",
"color": "#c9503c",
"portrait": "nina",
"group": "togenashi",
"specialty": "主唱",
"role": "support",
"description": "随身带路灯模型的倔强狂犬，动不动就竖小指，认准的事绝不服输。",
"wander": "",
"stats": {
"attack": 4,
"defense": 2,
"scout": 1,
"economy": 1,
"charm": 2
}
},
{
"id": "momoka",
"name": "河原木桃香",
"color": "#b8b2a8",
"portrait": "momoka",
"group": "togenashi",
"specialty": "吉他手",
"role": "vanguard",
"description": "喝着啤酒开小破车的前职业吉他手，嘴上说放弃实际比谁都放不下。",
"wander": "",
"stats": {
"attack": 4,
"defense": 2,
"scout": 1,
"economy": 1,
"charm": 3
}
},
{
"id": "subaru",
"name": "安和昴",
"color": "#6f6a9c",
"portrait": "subaru",
"group": "togenashi",
"specialty": "鼓手",
"role": "ranger",
"description": "谎话张口就来的演艺世家大小姐，表面轻浮爱调侃，打鼓却极认真。",
"wander": "瞒着奶奶偷偷溜出来吹风，随口扯了个谎在街上闲逛。",
"stats": {
"attack": 2,
"defense": 3,
"scout": 1,
"economy": 2,
"charm": 4
}
},
{
"id": "tomo",
"name": "海老塚智",
"color": "#c9a5a5",
"portrait": "tomo",
"group": "togenashi",
"specialty": "键盘手",
"role": "support",
"description": "键盘技术顶尖的傲娇矮个子，离家出走中，嘴毒但对同伴很心软。",
"wander": "",
"stats": {
"attack": 2,
"defense": 2,
"scout": 1,
"economy": 3,
"charm": 1
}
},
{
"id": "rupa",
"name": "Rupa",
"color": "#8fa88f",
"portrait": "rupa",
"group": "togenashi",
"specialty": "贝斯手",
"role": "guard",
"description": "总是带着温柔微笑的混血贝斯手，酒量惊人，说话补刀最为致命。",
"wander": "喝得微醺在外面散步吹风，顺便醒醒酒再考虑去哪。",
"stats": {
"attack": 3,
"defense": 3,
"scout": 1,
"economy": 1,
"charm": 3
}
},
{
"id": "kasumi",
"name": "户山香澄",
"color": "#b16859",
"portrait": "kasumi",
"group": "poppin",
"specialty": "主唱兼吉他",
"role": "support",
"description": "整天追着星之鼓动跑的元气少女，把招募士兵当成找乐队伙伴。",
"wander": "追着一颗会发光的流星一路跑进了迷雾深处。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 2,
"economy": 1,
"charm": 6
}
},
{
"id": "tae",
"name": "花园多惠",
"color": "#ce9c83",
"portrait": "tae",
"group": "poppin",
"specialty": "吉他",
"role": "vanguard",
"description": "思维跳跃在异次元的天然电波吉他手，常把敌人当兔子溜。",
"wander": "为了寻找走失的第二十一只兔子迷路在雾海。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 1,
"economy": 1,
"charm": 4
}
},
{
"id": "rimi",
"name": "牛込里美",
"color": "#d69691",
"portrait": "rimi",
"group": "poppin",
"specialty": "贝斯",
"role": "guard",
"description": "极度内向害羞的贝斯手，只要有巧克力螺面包就能爆发勇气。",
"wander": "跟着刚出炉巧克力螺的香味走，结果回不去了。",
"stats": {
"attack": 2,
"defense": 3,
"scout": 1,
"economy": 2,
"charm": 4
}
},
{
"id": "saaya",
"name": "山吹沙绫",
"color": "#b36a67",
"portrait": "saaya",
"group": "poppin",
"specialty": "鼓",
"role": "ranger",
"description": "温柔可靠的烘焙坊长女，不仅能敲鼓统领战线还能管好后勤。",
"wander": "为了推销山吹面包房的新品面包而误入异界。",
"stats": {
"attack": 2,
"defense": 3,
"scout": 1,
"economy": 2,
"charm": 5
}
},
{
"id": "arisa",
"name": "市谷有咲",
"color": "#c99667",
"portrait": "arisa",
"group": "poppin",
"specialty": "键盘",
"role": "support",
"description": "嘴硬心软的重度傲娇大小姐，表面抱怨却把基地账目算得极精。",
"wander": "为了把乱跑的户山香澄抓回去，结果跟着掉进雾里。",
"stats": {
"attack": 1,
"defense": 4,
"scout": 1,
"economy": 2,
"charm": 3
}
},
{
"id": "ran",
"name": "美竹兰",
"color": "#c6383b",
"portrait": "ran",
"group": "afterglow",
"specialty": "主唱兼吉他",
"role": "support",
"description": "性格别扭不服输的主唱吉他手，总是把“跟平时一样”挂在嘴边。",
"wander": "为了寻找染红整片天空的绝佳夕阳而走入迷雾。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 1,
"economy": 1,
"charm": 4
}
},
{
"id": "moca",
"name": "青叶摩卡",
"color": "#bb8772",
"portrait": "moca",
"group": "afterglow",
"specialty": "吉他",
"role": "vanguard",
"description": "嗜面包如命的电波系天才吉他手，看似懒散实则大智若愚掌控全场。",
"wander": "跟着山吹面包房和羽泽咖啡店的面包香气飘过来的。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 2,
"economy": 2,
"charm": 5
}
},
{
"id": "himari",
"name": "上原绯玛丽",
"color": "#e49486",
"portrait": "himari",
"group": "afterglow",
"specialty": "贝斯",
"role": "guard",
"description": "Afterglow名义上的元气队长，爱哭又爱吃甜食，常被同伴捉弄。",
"wander": "为了买限定发售的巨型草莓芭菲而追过了头误入迷雾。",
"stats": {
"attack": 1,
"defense": 3,
"scout": 1,
"economy": 3,
"charm": 4
}
},
{
"id": "tomoe",
"name": "宇田川巴",
"color": "#c8364e",
"portrait": "tomoe",
"group": "afterglow",
"specialty": "鼓",
"role": "ranger",
"description": "豪爽义气的大姐头鼓手，擅长祭典太鼓，以刚猛豪放的节奏统御战局。",
"wander": "为了追寻传说中回荡在雾海里的豪迈大太鼓声。",
"stats": {
"attack": 4,
"defense": 3,
"scout": 0,
"economy": 1,
"charm": 5
}
},
{
"id": "tsugumi",
"name": "羽泽鸫",
"color": "#af644f",
"portrait": "tsugumi",
"group": "afterglow",
"specialty": "键盘",
"role": "support",
"description": "羽泽咖啡店的勤勉看板娘，自称平凡却有着支撑全队的惊人韧性。",
"wander": "为了把咖啡外卖送到迷雾中的顾客手上而走失。",
"stats": {
"attack": 1,
"defense": 3,
"scout": 1,
"economy": 3,
"charm": 4
}
},
{
"id": "aya",
"name": "丸山彩",
"color": "#e48387",
"portrait": "aya",
"group": "pastel",
"specialty": "主唱",
"role": "support",
"description": "努力型爱哭鬼偶像，笨拙但拼命想带给罪袋们笑容与希望。",
"wander": "为了寻找走散的PasPale成员，边哭边在雾里发传单。",
"stats": {
"attack": 1,
"defense": 2,
"scout": 1,
"economy": 4,
"charm": 5
}
},
{
"id": "hina",
"name": "冰川日菜",
"color": "#8ec3b9",
"portrait": "hina",
"group": "pastel",
"specialty": "吉他",
"role": "vanguard",
"description": "凭直觉行动的天才少女，把战场经营当成鲁邦邦的有趣游戏。",
"wander": "听说雾海里有超噜棒棒的不可思议现象，一路瞬移过来。",
"stats": {
"attack": 4,
"defense": 1,
"scout": 2,
"economy": 1,
"charm": 4
}
},
{
"id": "chisato",
"name": "白鹭千圣",
"color": "#e0af8d",
"portrait": "chisato",
"group": "pastel",
"specialty": "贝斯",
"role": "guard",
"description": "冷静现实的前童星，用严谨的手腕打理领地并维持完美微笑。",
"wander": "为了寻找走散的同伴，独自冷静地在各方势力间周旋。",
"stats": {
"attack": 2,
"defense": 3,
"scout": 0,
"economy": 3,
"charm": 5
}
},
{
"id": "maya",
"name": "大和麻弥",
"color": "#ad6756",
"portrait": "maya",
"group": "pastel",
"specialty": "鼓",
"role": "ranger",
"description": "热衷器材与战术分析的鼓手，把阵地当成巨型演播室来调试。",
"wander": "为了寻找丢失的精密调音台和鼓棒，在迷雾中追随声波。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 1,
"economy": 2,
"charm": 2
}
},
{
"id": "eve",
"name": "若宫伊芙",
"color": "#dca092",
"portrait": "eve",
"group": "pastel",
"specialty": "键盘",
"role": "support",
"description": "崇尚武士道的芬兰混血少女，挥舞模型刀在战场践行正义。",
"wander": "听说雾海中有追求真正大义的强者，独自踏上武者修行。",
"stats": {
"attack": 4,
"defense": 3,
"scout": 1,
"economy": 0,
"charm": 4
}
},
{
"id": "yukina",
"name": "凑友希那",
"color": "#a8567f",
"portrait": "yukina",
"group": "roselia",
"specialty": "主唱",
"role": "support",
"description": "追求顶点的孤高歌姬，视战争为必须全力以赴的严酷舞台。",
"wander": "为了寻找能让歌声刺穿迷雾的极致之音，独自巡视边境。",
"stats": {
"attack": 5,
"defense": 1,
"scout": 0,
"economy": 2,
"charm": 6
}
},
{
"id": "sayo",
"name": "冰川纱夜",
"color": "#8cc6ba",
"portrait": "sayo",
"group": "roselia",
"specialty": "吉他",
"role": "vanguard",
"description": "极度自律的认真风纪官，将阵地管理与作战纪律视作生命。",
"wander": "为了严查迷雾中滋生的纪律败坏与敌对斥候，单枪巡逻。",
"stats": {
"attack": 4,
"defense": 3,
"scout": 1,
"economy": 0,
"charm": 3
}
},
{
"id": "lisa",
"name": "今井莉莎",
"color": "#ba684d",
"portrait": "lisa",
"group": "roselia",
"specialty": "贝斯",
"role": "guard",
"description": "体贴热心的辣妹贝斯手，担任军队的大姐姐，靠烤饼干凝聚人心。",
"wander": "为了给陷入苦战的伙伴们采摘食材与物资，孤身穿梭密林。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 0,
"economy": 4,
"charm": 6
}
},
{
"id": "ako",
"name": "宇田川亚子",
"color": "#ab73b5",
"portrait": "ako",
"group": "roselia",
"specialty": "鼓",
"role": "ranger",
"description": "中二病全开的暗黑魔王鼓手，把阵地战视为深渊邪气的大决战。",
"wander": "为了寻找蕴藏堕天之力的黑魔导秘宝，在迷雾中独自探险。",
"stats": {
"attack": 4,
"defense": 1,
"scout": 2,
"economy": 1,
"charm": 3
}
},
{
"id": "rinko",
"name": "白金燐子",
"color": "#d19c90",
"portrait": "rinko",
"group": "roselia",
"specialty": "键盘",
"role": "support",
"description": "极度内向的网游高玩键盘手，将沙盒战争当作大型MMO来统筹。",
"wander": "为了寻找安稳无人的安静角落，误打误撞走进迷雾深处。",
"stats": {
"attack": 2,
"defense": 3,
"scout": 0,
"economy": 3,
"charm": 3
}
},
{
"id": "kokoro",
"name": "弦卷心",
"color": "#e3c78b",
"portrait": "kokoro",
"group": "hhw",
"specialty": "主唱",
"role": "support",
"description": "天真烂漫的富家大小姐，立志要把笑容带给整片大陆。",
"wander": "听说迷雾那边有不可思议的马戏团，就直接翻墙跑出来了。",
"stats": {
"attack": 2,
"defense": 1,
"scout": 1,
"economy": 4,
"charm": 6
}
},
{
"id": "kaoru",
"name": "濑田薰",
"color": "#a35b8d",
"portrait": "kaoru",
"group": "hhw",
"specialty": "吉他",
"role": "vanguard",
"description": "举手投足皆如舞台剧的帅气少女，日常称呼大家为小猫咪。",
"wander": "追寻莎士比亚的诗篇与无垠的迷雾，不幸在荒野迷路。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 1,
"economy": 2,
"charm": 6
}
},
{
"id": "hagumi",
"name": "北泽育美",
"color": "#d9732c",
"portrait": "hagumi",
"group": "hhw",
"specialty": "贝斯",
"role": "guard",
"description": "元气充沛的运动少女，把战场当作开心的垒球大赛。",
"wander": "追着一颗打飞的垒球跑进浓雾，回过神来就到了这里。",
"stats": {
"attack": 3,
"defense": 3,
"scout": 1,
"economy": 1,
"charm": 4
}
},
{
"id": "kanon",
"name": "松原花音",
"color": "#85aadb",
"portrait": "kanon",
"group": "hhw",
"specialty": "鼓",
"role": "ranger",
"description": "性格内向容易慌张的鼓手，虽然害怕但一直在努力支撑同伴。",
"wander": "本想去水族馆看水母，一不小心在迷雾大道上彻底迷路。",
"stats": {
"attack": 1,
"defense": 4,
"scout": 1,
"economy": 2,
"charm": 4
}
},
{
"id": "misaki",
"name": "奥泽美咲",
"color": "#dca292",
"portrait": "misaki",
"group": "hhw",
"specialty": "DJ",
"role": "support",
"description": "唯一的常识人，常年被迫套上熊皮套维持全队的和平与运转。",
"wander": "为了追回乱跑的弦卷心，不知不觉就跟到了这个荒唐的大陆。",
"stats": {
"attack": 2,
"defense": 3,
"scout": 1,
"economy": 2,
"charm": 3
}
},
{
"id": "layer",
"name": "和奏瑞依",
"color": "#ac6852",
"portrait": "layer",
"group": "ras",
"specialty": "主唱兼贝斯",
"role": "guard",
"description": "稳重可靠的灵魂主唱，拥有压倒性的唱功与大姐姐般的包容力。",
"wander": "为了寻找走散的青梅竹马多惠，背着贝斯踏入了未知的迷雾。",
"stats": {
"attack": 3,
"defense": 3,
"scout": 1,
"economy": 1,
"charm": 4
}
},
{
"id": "lock",
"name": "朝日六花",
"color": "#627db1",
"portrait": "lock",
"group": "ras",
"specialty": "吉他",
"role": "vanguard",
"description": "平日畏缩怯懦，一旦拿起吉他就会陷入狂暴暴走状态的少女。",
"wander": "为了追赶大家的脚步，一边弹着吉他一边跌跌撞撞地迷路至此。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 1,
"economy": 1,
"charm": 3
}
},
{
"id": "masking",
"name": "佐藤益木",
"color": "#da9a4e",
"portrait": "masking",
"group": "ras",
"specialty": "鼓",
"role": "ranger",
"description": "外表凶狠如不良少女，实际上超爱甜食且非常重情义的鼓手。",
"wander": "店里的拉面原料断货了，骑着重型机车进迷雾搜寻时迷路。",
"stats": {
"attack": 5,
"defense": 2,
"scout": 0,
"economy": 1,
"charm": 3
}
},
{
"id": "pareo",
"name": "鳰原令王那",
"color": "#bb80ba",
"portrait": "pareo",
"group": "ras",
"specialty": "键盘",
"role": "support",
"description": "全心全意侍奉CHU²的彩发键盘手，兼备超凡演奏力与家务万能。",
"wander": "为了寻找CHU²大人最爱吃的高级肉干，只身在雾海中跋涉。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 2,
"economy": 2,
"charm": 4
}
},
{
"id": "chu2",
"name": "珠手知由",
"color": "#d46a70",
"portrait": "chu2",
"group": "ras",
"specialty": "DJ",
"role": "support",
"description": "极具才华的傲娇制作人，身材娇小却一心想要用音乐支配世界。",
"wander": "为了把自己的最强音乐扩散到整片大陆，踩着高跟鞋踏入雾中。",
"stats": {
"attack": 3,
"defense": 1,
"scout": 1,
"economy": 3,
"charm": 5
}
},
{
"id": "mashiro",
"name": "仓田真白",
"color": "#898ebf",
"portrait": "mashiro",
"group": "morfonica",
"specialty": "主唱",
"role": "support",
"description": "常常自卑怯懦的Morfonica主唱，在领主与同伴鼓励下正笨拙地展翅。",
"wander": "在迷雾里被罪袋吓跑，以为自己派不上用场便躲了起来。",
"stats": {
"attack": 1,
"defense": 2,
"scout": 2,
"economy": 3,
"charm": 4
}
},
{
"id": "toko",
"name": "桐谷透子",
"color": "#dba876",
"portrait": "toko",
"group": "morfonica",
"specialty": "吉他",
"role": "vanguard",
"description": "走在流行尖端的社交红人，活力四射地用超绝辣妹步调带兵打仗。",
"wander": "为了寻找雾海大陆最适合打卡拍照的奇景而独自狂奔。",
"stats": {
"attack": 3,
"defense": 1,
"scout": 1,
"economy": 3,
"charm": 5
}
},
{
"id": "nanami",
"name": "广町七深",
"color": "#e99785",
"portrait": "nanami",
"group": "morfonica",
"specialty": "贝斯",
"role": "guard",
"description": "极度天才却只想当个“普通少女”，常语出惊人地以平凡逻辑建国。",
"wander": "为了寻找普通的独角仙，一路搜集奇怪战利品迷失在雾中。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 2,
"economy": 2,
"charm": 3
}
},
{
"id": "tsukushi",
"name": "二叶筑紫",
"color": "#bc7b75",
"portrait": "tsukushi",
"group": "morfonica",
"specialty": "鼓",
"role": "ranger",
"description": "自封的靠谱领导者，Morfonica队长，关键时刻却总容易慌张。",
"wander": "为了展示身为队长的独立可靠，结果自告奋勇探路掉队了。",
"stats": {
"attack": 2,
"defense": 3,
"scout": 1,
"economy": 2,
"charm": 4
}
},
{
"id": "rui",
"name": "八潮瑠唯",
"color": "#bb8093",
"portrait": "rui",
"group": "morfonica",
"specialty": "小提琴",
"role": "support",
"description": "追求极致理性的Morfonica小提琴手，以精密计算规划领地战术。",
"wander": "为测量雾海的地形落差与迷雾折射率，独自深入无人荒野。",
"stats": {
"attack": 3,
"defense": 3,
"scout": 1,
"economy": 1,
"charm": 2
}
},
{
"id": "marina",
"name": "月岛真里奈",
"color": "#b46454",
"portrait": "marina",
"group": "circle",
"specialty": "CiRCLE 工作人员",
"role": "support",
"description": "CiRCLE LiveHouse的可靠看板娘，统筹管理物资与人际的大师。",
"wander": "为了寻找在外失联的少女乐队们，独自开着补给车深入。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 1,
"economy": 3,
"charm": 5
}
},
{
"id": "ichika",
"name": "星乃一歌",
"color": "#5874a6",
"portrait": "ichika",
"group": "leoneed",
"specialty": "主唱兼吉他",
"role": "vanguard",
"description": "Leo/need的主唱兼吉他，外冷内热，为了青梅竹马誓要斩破迷雾。",
"wander": "为了寻找分散的青梅竹马们，追寻着异界的初音歌声前行。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 1,
"economy": 2,
"charm": 4
}
},
{
"id": "saki",
"name": "天马咲希",
"color": "#ebb184",
"portrait": "saki",
"group": "leoneed",
"specialty": "键盘",
"role": "support",
"description": "Leo/need的元气键盘手，病弱过去已成历史，如今满腔热血大闹前线。",
"wander": "因为重获自由太兴奋四处乱逛，追逐异界发光蝴蝶而迷路。",
"stats": {
"attack": 2,
"defense": 1,
"scout": 2,
"economy": 3,
"charm": 5
}
},
{
"id": "honami",
"name": "望月穗波",
"color": "#c5797b",
"portrait": "honami",
"group": "leoneed",
"specialty": "鼓",
"role": "ranger",
"description": "包容一切的鼓手与领地内政贤内助，虽有选择困难但极度体贴同伴。",
"wander": "为了寻找制作异界苹果派的稀有甜苹果，走入了雾气浓处。",
"stats": {
"attack": 1,
"defense": 4,
"scout": 1,
"economy": 2,
"charm": 4
}
},
{
"id": "shiho",
"name": "日野森志步",
"color": "#cda189",
"portrait": "shiho",
"group": "leoneed",
"specialty": "贝斯",
"role": "guard",
"description": "严格冷峻的职业级贝斯手，外表冷酷实则极其重情义，暗中偏爱兔兔玩偶。",
"wander": "为了寻找不受打扰的荒野特训低音独奏，独自踏进迷雾深处。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 1,
"economy": 1,
"charm": 2
}
},
{
"id": "minori",
"name": "花里实乃理",
"color": "#d17759",
"portrait": "minori",
"group": "mmj",
"specialty": "偶像",
"role": "support",
"description": "虽然总是倒霉平地摔，但为了传递希望永不放弃的努力派偶像。",
"wander": "跟着遥的应援旗跑太急，一不小心在雾里摔倒迷路了。",
"stats": {
"attack": 1,
"defense": 2,
"scout": 1,
"economy": 4,
"charm": 5
}
},
{
"id": "haruka",
"name": "桐谷遥",
"color": "#2f7acf",
"portrait": "haruka",
"group": "mmj",
"specialty": "偶像",
"role": "vanguard",
"description": "冷静沉稳的元祖国民偶像，对企鹅周边有着异乎寻常的执念与狂热。",
"wander": "为了搜寻传闻中雾海里出没的稀有企鹅群而脱离了队伍。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 1,
"economy": 3,
"charm": 6
}
},
{
"id": "airi",
"name": "桃井爱莉",
"color": "#ed6f7a",
"portrait": "airi",
"group": "mmj",
"specialty": "偶像",
"role": "ranger",
"description": "刀子嘴豆腐心的粉发偶像，对工作要求极高，极度受不了敷衍与偷懒。",
"wander": "为了找寻失散的队友，一边暴躁吐槽一边在迷雾里到处搜寻。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 1,
"economy": 2,
"charm": 5
}
},
{
"id": "shizuku",
"name": "日野森雫",
"color": "#7fa9bf",
"portrait": "shizuku",
"group": "mmj",
"specialty": "偶像",
"role": "guard",
"description": "优雅端庄的前知名偶像，但在认路和摆弄机械上是不折不扣的天灾。",
"wander": "本想出门散步，结果不知为何转个弯就彻底迷失在迷雾中了。",
"stats": {
"attack": 1,
"defense": 3,
"scout": 0,
"economy": 4,
"charm": 6
}
},
{
"id": "kohane",
"name": "小豆泽心羽",
"color": "#d5b68b",
"portrait": "kohane",
"group": "vbs",
"specialty": "歌手",
"role": "support",
"description": "虽然外表像怯生生的小仓鼠，但一旦握住麦克风就会展现惊人爆发力。",
"wander": "跟着迷路的小鸟越走越远，回过神来四周已经全都是浓雾了。",
"stats": {
"attack": 3,
"defense": 1,
"scout": 1,
"economy": 3,
"charm": 4
}
},
{
"id": "an",
"name": "白石杏",
"color": "#ad7777",
"portrait": "an",
"group": "vbs",
"specialty": "歌手",
"role": "vanguard",
"description": "阳光豪爽的街头音乐家，周末车库的当家看板娘，极度害怕幽灵鬼怪。",
"wander": "为了寻找能做出最顶尖咖啡和松饼的食材，一路闯入了浓雾区。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 1,
"economy": 2,
"charm": 5
}
},
{
"id": "emu",
"name": "凤笑梦",
"color": "#ee7eaa",
"portrait": "emu",
"group": "wxs",
"specialty": "演员",
"role": "vanguard",
"description": "拥有超绝体能与天真烂漫性格的凤家大小姐，终极目标是全宇宙大笑。",
"wander": "为了追赶一只长得像棉花糖的奇怪迷雾生物，一蹦一跳跑丢了。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 2,
"economy": 1,
"charm": 6
}
},
{
"id": "nene",
"name": "草薙宁宁",
"color": "#d29f87",
"portrait": "nene",
"group": "wxs",
"specialty": "歌手",
"role": "support",
"description": "毒舌社恐的天才歌姬，习惯藏在远程遥控的机械人偶身后进行火力覆盖。",
"wander": "为了寻找能给宁宁Robo充电的高性能能源，不慎迷失在废墟中。",
"stats": {
"attack": 4,
"defense": 1,
"scout": 1,
"economy": 2,
"charm": 3
}
},
{
"id": "kanade",
"name": "宵崎奏",
"color": "#8874ab",
"portrait": "kanade",
"group": "n25",
"specialty": "作曲",
"role": "support",
"description": "25时的作曲担当。整天窝在据点吃泡面写歌，走两步路就会喘粗气。",
"wander": "为了寻找能拯救别人的旋律，不知不觉走进了雾里。",
"stats": {
"attack": 1,
"defense": 1,
"scout": 0,
"economy": 6,
"charm": 4
}
},
{
"id": "mafuyu",
"name": "朝比奈真冬",
"color": "#794cb2",
"portrait": "mafuyu",
"group": "n25",
"specialty": "作词",
"role": "ranger",
"description": "25时的作词担当。表面是模范优等生，内心感受不到温度与味道。",
"wander": "为了逃离母亲窒息的期待，不知不觉走入了深邃迷雾。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 1,
"economy": 1,
"charm": 4
}
},
{
"id": "ena",
"name": "东云绘名",
"color": "#d2908e",
"portrait": "ena",
"group": "n25",
"specialty": "插画",
"role": "guard",
"description": "25时的插画担当。自尊心极强，热爱自拍和甜点，容易炸毛的傲娇。",
"wander": "画作被父亲否定后气不过离家出走，误入白茫茫的雾气。",
"stats": {
"attack": 2,
"defense": 3,
"scout": 1,
"economy": 2,
"charm": 4
}
},
{
"id": "mizuki",
"name": "晓山瑞希",
"color": "#e68b88",
"portrait": "mizuki",
"group": "n25",
"specialty": "视频制作",
"role": "vanguard",
"description": "25时的视频担当。热爱可爱服饰与自由，善于察言观色的气氛调节者。",
"wander": "为了寻找能容纳自己真实模样的乐园，微笑着踏入雾境。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 2,
"economy": 2,
"charm": 5
}
},
{
"id": "miku",
"name": "初音未来",
"color": "#5db6b6",
"portrait": "miku",
"group": "vsinger",
"specialty": "虚拟歌手",
"role": "support",
"description": "连接所有歌声的世界第一歌姬。只要握住麦克风就能带来无限奇迹。",
"wander": "顺着未知的心愿指引，跨越数据的界限降临在这片大地。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 1,
"economy": 3,
"charm": 6
}
},
{
"id": "rin",
"name": "镜音铃",
"color": "#efd26f",
"portrait": "rin",
"group": "vsinger",
"specialty": "虚拟歌手",
"role": "vanguard",
"description": "充满元气的镜音双子妹妹。性格活泼好动，容易冲动但极其重情义。",
"wander": "和连走散了，一边四处寻找一边把路上看不顺眼的敌人轰飞。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 2,
"economy": 1,
"charm": 5
}
},
{
"id": "luka",
"name": "巡音流歌",
"color": "#db8aa1",
"portrait": "luka",
"group": "vsinger",
"specialty": "虚拟歌手",
"role": "ranger",
"description": "沉稳从容的大姐姐虚拟歌手。表面温柔成熟，偶尔会露出腹黑小恶魔一面。",
"wander": "抱着优雅旅行的心态漫游，丝毫不把身边的迷雾当回事。",
"stats": {
"attack": 2,
"defense": 3,
"scout": 1,
"economy": 2,
"charm": 5
}
},
{
"id": "meiko",
"name": "MEIKO",
"color": "#b87146",
"portrait": "meiko",
"group": "vsinger",
"specialty": "虚拟歌手",
"role": "guard",
"description": "豪迈可靠的虚拟歌手大姐头。拳脚功夫一流，嗜酒如命但深得人心。",
"wander": "喝着美酒四处流浪，顺手解决沿途遇到的各类麻烦人物。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 1,
"economy": 1,
"charm": 4
}
},
{
"id": "emilia",
"name": "爱蜜莉雅",
"color": "#cf8995",
"portrait": "emilia",
"group": "rezero",
"specialty": "精灵魔法使",
"role": "support",
"description": "老实善良的半精灵，虽常被当成麻烦制造者，仍拼命想建设公平的国家。",
"wander": "和帕克走散后在雾里迷路，正急得团团转。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 1,
"economy": 1,
"charm": 5
}
},
{
"id": "rem",
"name": "蕾姆",
"color": "#72a9e8",
"portrait": "rem",
"group": "rezero",
"specialty": "鬼族女仆",
"role": "vanguard",
"description": "罗兹瓦尔宅邸的全能女仆，为了守护重要之人能化身鬼神撕碎一切。",
"wander": "为了寻找下落不明的重要之人而在雾海中奋战。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 1,
"economy": 1,
"charm": 4
}
},
{
"id": "ram",
"name": "拉姆",
"color": "#ee6f8a",
"portrait": "ram",
"group": "rezero",
"specialty": "鬼族女仆",
"role": "ranger",
"description": "毒舌傲慢的粉发女仆，虽失去角却拥有敏锐千里眼和统御全局的气场。",
"wander": "为了寻找走失的妹妹和供奉的烤地瓜而四处巡视。",
"stats": {
"attack": 2,
"defense": 1,
"scout": 2,
"economy": 3,
"charm": 3
}
},
{
"id": "beatrice",
"name": "碧翠丝",
"color": "#e2998c",
"portrait": "beatrice",
"group": "rezero",
"specialty": "禁书库管理者",
"role": "support",
"description": "看守禁书库四百年的幼女精灵，嘴硬心软，精通古老阴属性魔法。",
"wander": "书库的门在雾海中不知连到了何处，气呼呼地寻找出口。",
"stats": {
"attack": 3,
"defense": 4,
"scout": 0,
"economy": 1,
"charm": 3
}
},
{
"id": "felt",
"name": "菲鲁特",
"color": "#facb74",
"portrait": "felt",
"group": "rezero",
"specialty": "王选候补",
"role": "vanguard",
"description": "贫民窟出身的顽劣野丫头，拥有风之加护与摧毁腐朽贵族制度的野心。",
"wander": "偷来的财宝在雾里摔丢了，正满地找宝贝兼巡逻。",
"stats": {
"attack": 3,
"defense": 1,
"scout": 2,
"economy": 2,
"charm": 4
}
},
{
"id": "crusch",
"name": "库珥修",
"color": "#47b76f",
"portrait": "crusch",
"group": "rezero",
"specialty": "王选候补",
"role": "vanguard",
"description": "卡尔斯腾家当家，兼具英武之气与正直信义的将领，一心报效国家。",
"wander": "率部在雾海巡查时与大部队脱节，正在寻找重整旗鼓的据点。",
"stats": {
"attack": 3,
"defense": 3,
"scout": 1,
"economy": 1,
"charm": 5
}
},
{
"id": "priscilla",
"name": "普莉希拉",
"color": "#f4a166",
"portrait": "priscilla",
"group": "rezero",
"specialty": "王选候补",
"role": "ranger",
"description": "极度傲慢尊贵的红之公爵夫人，坚信天地万物皆为顺从自己的愉悦而运转。",
"wander": "觉得宅邸无趣，特意步入雾海寻找能取悦自己的消遣。",
"stats": {
"attack": 5,
"defense": 1,
"scout": 0,
"economy": 2,
"charm": 4
}
},
{
"id": "anastasia",
"name": "安娜塔西亚",
"color": "#d698d5",
"portrait": "anastasia",
"group": "rezero",
"specialty": "王选候补",
"role": "support",
"description": "合辛商会会长，操着一口柔和关西腔的贪婪商人，商战与内政的天才。",
"wander": "为了开辟雾海里垄断贸易的新商路，亲自带队行商考察。",
"stats": {
"attack": 0,
"defense": 1,
"scout": 1,
"economy": 6,
"charm": 4
}
},
{
"id": "echidna",
"name": "艾姬多娜",
"color": "#8ca35b",
"portrait": "echidna",
"group": "rezero",
"specialty": "强欲魔女",
"role": "support",
"description": "求知欲病态且无底线的强欲魔女，以研究与契约为乐，知晓世间万象。",
"wander": "为了收集这个未知异世界的全新知识而从梦境踱步而出。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 1,
"economy": 1,
"charm": 2
}
},
{
"id": "frederica",
"name": "芙蕾德莉卡",
"color": "#f4d07a",
"portrait": "frederica",
"group": "rezero",
"specialty": "女仆长",
"role": "guard",
"description": "罗兹瓦尔宅邸的女仆长，举止优雅但露出尖牙就会吓哭罪袋。",
"wander": "为寻找散落异界的宅邸同伴，独自顺着迷雾搜寻痕迹。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 1,
"economy": 2,
"charm": 3
}
},
{
"id": "elsa",
"name": "艾尔莎",
"color": "#ac5296",
"portrait": "elsa",
"group": "rezero",
"specialty": "杀手",
"role": "vanguard",
"description": "被称为猎肠者的危险杀手，偏爱切开腹部抚摸温暖之物。",
"wander": "追逐着异界散发的新鲜血腥味，悠然寻找猎物。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 2,
"economy": 0,
"charm": 2
}
},
{
"id": "satella",
"name": "莎缇拉",
"color": "#a45a64",
"portrait": "satella",
"group": "rezero",
"specialty": "嫉妒魔女",
"role": "ranger",
"description": "带来毁灭的嫉妒魔女，对某人怀揣无尽的爱，言语偏执而温柔。",
"wander": "在无尽的黑暗与爱意中游荡，试图找寻那一抹熟悉的气息。",
"stats": {
"attack": 5,
"defense": 2,
"scout": 1,
"economy": 0,
"charm": 1
}
},
{
"id": "minerva",
"name": "米涅瓦",
"color": "#f5d279",
"portrait": "minerva",
"group": "rezero",
"specialty": "愤怒魔女",
"role": "guard",
"description": "愤怒魔女，痛恨一切流血与伤害，用重拳治愈万物的热血笨蛋。",
"wander": "为了阻止世上所有的争斗与哭泣，狂奔在迷雾大地之上。",
"stats": {
"attack": 3,
"defense": 4,
"scout": 0,
"economy": 1,
"charm": 4
}
},
{
"id": "carmilla",
"name": "卡蜜拉",
"color": "#b3c8a6",
"portrait": "carmilla",
"group": "rezero",
"specialty": "色欲魔女",
"role": "support",
"description": "色欲魔女，极度自卑怯弱，无意识间却能散发剥夺呼吸的狂热魔力。",
"wander": "害怕被大家讨厌，缩在迷雾的残垣断壁后瑟瑟发抖。",
"stats": {
"attack": 1,
"defense": 4,
"scout": 1,
"economy": 2,
"charm": 6
}
},
{
"id": "daphne",
"name": "达芙妮",
"color": "#af5be4",
"portrait": "daphne",
"group": "rezero",
"specialty": "暴食魔女",
"role": "guard",
"description": "暴食魔女，坐在百足棺材上的眼罩少女，满脑子只有饥饿与进食。",
"wander": "为了寻找怎么吃也吃不完的究极食材，让棺材漫步在荒野。",
"stats": {
"attack": 4,
"defense": 3,
"scout": 0,
"economy": 1,
"charm": 2
}
},
{
"id": "sekhmet",
"name": "赛赫麦特",
"color": "#de258a",
"portrait": "sekhmet",
"group": "rezero",
"specialty": "怠惰魔女",
"role": "ranger",
"description": "怠惰魔女，连呼吸都觉得极其麻烦，能以无形力量随意弹飞强敌。",
"wander": "嫌走路太麻烦顺水漂流，直到卡在异界的石头缝里动弹不得。",
"stats": {
"attack": 5,
"defense": 3,
"scout": 0,
"economy": 0,
"charm": 1
}
},
{
"id": "liliana",
"name": "莉莉安娜",
"color": "#ffc470",
"portrait": "liliana",
"group": "rezero",
"specialty": "吟游诗人",
"role": "support",
"description": "水门都市的吟游诗人，性格张扬自信过剩，用歌声与诗琴引发奇迹。",
"wander": "为了寻找流传千古的传世素材，在迷雾中放声高歌弹奏。",
"stats": {
"attack": 1,
"defense": 1,
"scout": 2,
"economy": 4,
"charm": 5
}
},
{
"id": "theresia",
"name": "特蕾西亚",
"color": "#e4403d",
"portrait": "theresia",
"group": "rezero",
"specialty": "剑圣",
"role": "vanguard",
"description": "前代剑圣，虽背负无双剑技却心怀慈爱，比起拔剑更喜欢赏花。",
"wander": "顺着花香漫步在雾海边缘，寻找能安然绽放的花田。",
"stats": {
"attack": 5,
"defense": 2,
"scout": 1,
"economy": 0,
"charm": 5
}
},
{
"id": "tooka",
"name": "夜刀神十香",
"color": "#a96c93",
"portrait": "tooka",
"group": "date",
"specialty": "精灵",
"role": "vanguard",
"description": "天真单纯的大胃王剑士，只要给足黄豆粉面包就会全力挥舞大剑战斗。",
"wander": "闻到远处传来的食物香气，不知不觉走进了大雾里。",
"stats": {
"attack": 5,
"defense": 2,
"scout": 1,
"economy": 0,
"charm": 5
}
},
{
"id": "origami",
"name": "鸢一折纸",
"color": "#dbae93",
"portrait": "origami",
"group": "date",
"specialty": "巫师",
"role": "ranger",
"description": "冷静果决的前AST天才巫师，执行领主命令时手段极其精准激进。",
"wander": "追查识别目标的微弱信号，在迷雾中独自展开全地形搜索。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 2,
"economy": 0,
"charm": 2
}
},
{
"id": "yoshino",
"name": "四糸乃",
"color": "#78ae96",
"portrait": "yoshino",
"group": "date",
"specialty": "精灵",
"role": "guard",
"description": "温柔内向的冰系少女，手上的毒舌玩偶四糸奈常替她大声出头。",
"wander": "在暴风雪迷雾中走失，抱着四糸奈小心翼翼地四处寻找同伴。",
"stats": {
"attack": 1,
"defense": 5,
"scout": 1,
"economy": 1,
"charm": 5
}
},
{
"id": "kurumi",
"name": "时崎狂三",
"color": "#b06156",
"portrait": "kurumi",
"group": "date",
"specialty": "精灵",
"role": "ranger",
"description": "掌控时间的危险狂气少女，带着优雅与神秘在暗处协助领主扩张。",
"wander": "为了收集充沛的战时时间与灵力，微笑着漫步踏入迷雾大陆。",
"stats": {
"attack": 4,
"defense": 1,
"scout": 2,
"economy": 1,
"charm": 4
}
},
{
"id": "kotori",
"name": "五河琴里",
"color": "#d7575e",
"portrait": "kotori",
"group": "date",
"specialty": "司令",
"role": "support",
"description": "嘴叼珍宝珠的红发毒舌司令官，战术指挥与炮火轰炸的绝对核心。",
"wander": "为了寻找迷失在异界的大陆法则与伙伴，率军在雾海中开辟基地。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 1,
"economy": 2,
"charm": 5
}
},
{
"id": "kaguya",
"name": "八舞耶俱矢",
"color": "#f7a96b",
"portrait": "kaguya",
"group": "date",
"specialty": "精灵",
"role": "vanguard",
"description": "自诩高傲霸道的狂妄飓风中二少女，实则极度依赖夕弦且容易害羞。",
"wander": "为了寻找与夕弦宿命对决的终极决斗舞台，顺着风暴来到此地。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 2,
"economy": 0,
"charm": 3
}
},
{
"id": "yuzuru",
"name": "八舞夕弦",
"color": "#f1b17b",
"portrait": "yuzuru",
"group": "date",
"specialty": "精灵",
"role": "ranger",
"description": "言行冷静、句首带有特定名词口癖的风之精灵，默默守护耶俱矢。",
"wander": "跟随耶俱矢的脚步追寻暴风，一同流落到这片神秘的割据大陆。",
"stats": {
"attack": 3,
"defense": 3,
"scout": 2,
"economy": 0,
"charm": 3
}
},
{
"id": "izayoi",
"name": "诱宵美九",
"color": "#9599d2",
"portrait": "izayoi",
"group": "date",
"specialty": "偶像精灵",
"role": "support",
"description": "极具魅力的天才歌姬精灵，擅长以美妙歌声鼓舞全军与操纵心智。",
"wander": "为了寻找最可爱的女孩子们，搭乘属于自己的舞台大篷车巡游异界。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 1,
"economy": 3,
"charm": 6
}
},
{
"id": "natsumi",
"name": "七罪",
"color": "#7a6896",
"portrait": "natsumi",
"group": "date",
"specialty": "精灵",
"role": "support",
"description": "极度自卑的伪装大师，总怀疑别人在嘲笑自己，变身能力极佳。",
"wander": "觉得自己阴暗丑陋配不上大家，悄悄躲进山林。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 2,
"economy": 2,
"charm": 3
}
},
{
"id": "nia",
"name": "本条二亚",
"color": "#e3b38b",
"portrait": "nia",
"group": "date",
"specialty": "漫画家精灵",
"role": "support",
"description": "沉迷二次元的漫画家精灵，喜欢戏弄后辈，对截稿日极其敏感。",
"wander": "为了寻找新连载的灵感，扛着画板到处采风取材。",
"stats": {
"attack": 1,
"defense": 1,
"scout": 2,
"economy": 4,
"charm": 4
}
},
{
"id": "mukuro",
"name": "星宫六喰",
"color": "#ddb169",
"portrait": "mukuro",
"group": "date",
"specialty": "精灵",
"role": "guard",
"description": "古风口癖的冷艳少女，手握封解主，渴望被唯一的情感包容。",
"wander": "用钥匙封锁了心门，独自在星空与荒野间漫游漂泊。",
"stats": {
"attack": 4,
"defense": 3,
"scout": 1,
"economy": 0,
"charm": 3
}
},
{
"id": "mana_t",
"name": "崇宫真那",
"color": "#7a78b7",
"portrait": "mana_t",
"group": "date",
"specialty": "巫师",
"role": "vanguard",
"description": "实力顶尖的傲娇巫师，把士道当最爱的兄长，身体经过残酷调整。",
"wander": "为了寻找下落不明的兄长大人，手握战刃搜寻整片雾海。",
"stats": {
"attack": 5,
"defense": 2,
"scout": 1,
"economy": 0,
"charm": 2
}
},
{
"id": "mio",
"name": "崇宫澪",
"color": "#b58a92",
"portrait": "mio",
"group": "date",
"specialty": "始源精灵",
"role": "support",
"description": "所有精灵的源头与圣母，怀揣悲伤与深爱，力量凌驾于常理之上。",
"wander": "为了重聚所爱之人的灵魂碎片，在虚妄的雾海中沉静前行。",
"stats": {
"attack": 5,
"defense": 2,
"scout": 1,
"economy": 0,
"charm": 5
}
},
{
"id": "reine",
"name": "村雨令音",
"color": "#b791ad",
"portrait": "reine",
"group": "date",
"specialty": "分析官",
"role": "support",
"description": "拉塔托斯克解析官，常年缺乏睡眠带浓厚黑眼圈，稳重可靠。",
"wander": "口袋里装着缝补小熊，为搜集空间震数据熬夜调查。",
"stats": {
"attack": 1,
"defense": 2,
"scout": 2,
"economy": 3,
"charm": 3
}
},
{
"id": "ellen",
"name": "艾莲",
"color": "#d6b298",
"portrait": "ellen",
"group": "date",
"specialty": "巫师",
"role": "vanguard",
"description": "DEM社最强魔导士，战力绝顶，私下却是天然呆且极易平地摔。",
"wander": "执行讨伐任务时又被小石子绊倒，与随从部队失联。",
"stats": {
"attack": 5,
"defense": 2,
"scout": 1,
"economy": 0,
"charm": 1
}
},
{
"id": "shaula",
"name": "夏乌拉",
"color": "#ad5951",
"portrait": "shaula",
"group": "rezero",
"specialty": "塔的看门人",
"role": "ranger",
"description": "守在塔顶数四百年的热心蝎子，误把领主当成久别重逢的师傅死缠烂打。",
"wander": "在沙海里找师傅找迷路了，顺着雾气一路狂奔至此。",
"stats": {
"attack": 5,
"defense": 1,
"scout": 2,
"economy": 0,
"charm": 4
}
},
{
"id": "meili",
"name": "梅莉",
"color": "#8e7db9",
"portrait": "meili",
"group": "rezero",
"specialty": "魔兽使",
"role": "support",
"description": "驱使无数魔兽的危险少女，把雾海乱斗当成收集新宠物的游乐场。",
"wander": "艾尔莎不在身边，百无聊赖地带着魔兽群到处找乐子。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 2,
"economy": 1,
"charm": 3
}
},
{
"id": "petra",
"name": "佩特拉",
"color": "#f29b5f",
"portrait": "petra",
"group": "rezero",
"specialty": "见习女仆",
"role": "support",
"description": "年纪虽小却极为可靠的见习女仆，将后勤与账目打理得井井有条。",
"wander": "去集市采买食材却意外穿过雾海，迫切想要找到回去的路。",
"stats": {
"attack": 1,
"defense": 2,
"scout": 1,
"economy": 4,
"charm": 5
}
},
{
"id": "pandora",
"name": "潘多拉",
"color": "#867fba",
"portrait": "pandora",
"group": "rezero",
"specialty": "虚饰魔女",
"role": "support",
"description": "以恬静微笑颠覆现实的虚饰魔女，随心所欲摆布战局与人心。",
"wander": "为了寻找能够填补虚饰缝隙的奇迹，轻移莲步漫步于迷雾。",
"stats": {
"attack": 3,
"defense": 4,
"scout": 1,
"economy": 0,
"charm": 6
}
},
{
"id": "mimi",
"name": "米米",
"color": "#ffa570",
"portrait": "mimi",
"group": "rezero",
"specialty": "铁之牙副团长",
"role": "vanguard",
"description": "铁之牙佣兵团副团长，精力过剩的大嗓门猫耳兽人，吵闹又强横。",
"wander": "跟着佣兵团走散了，到处找肉吃结果溜达进了奇怪的大陆。",
"stats": {
"attack": 5,
"defense": 1,
"scout": 1,
"economy": 1,
"charm": 4
}
},
{
"id": "typhon",
"name": "堤丰",
"color": "#7d9866",
"portrait": "typhon",
"group": "rezero",
"specialty": "傲慢魔女",
"role": "ranger",
"description": "纯真又残酷的傲慢魔女，总是笑着问别人有没有罪，然后认真审判。",
"wander": "为了找到有罪的坏人并加以惩罚，迈着小短腿四处游荡。",
"stats": {
"attack": 5,
"defense": 2,
"scout": 1,
"economy": 0,
"charm": 3
}
},
{
"id": "rinne",
"name": "园神凛祢",
"color": "#df9b8f",
"portrait": "rinne",
"group": "date",
"specialty": "神秘少女",
"role": "support",
"description": "以温婉包容一切的神秘少女，构筑平稳乐园守护着同伴与日常。",
"wander": "为了寻找让所有人都能欢笑的安稳之所，漫步于迷雾深处。",
"stats": {
"attack": 1,
"defense": 4,
"scout": 1,
"economy": 2,
"charm": 5
}
},
{
"id": "mayuri",
"name": "万由里",
"color": "#e7b07c",
"portrait": "mayuri",
"group": "date",
"specialty": "精灵",
"role": "support",
"description": "伴随裁决雷霆而生的审判精灵，静默守望着这片迷雾大地的因果。",
"wander": "完成观测使命后本该消散，却在雾海的渴望中重获形骸。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 2,
"economy": 0,
"charm": 4
}
},
{
"id": "whitequeen",
"name": "白女王",
"color": "#c99a9f",
"portrait": "whitequeen",
"group": "date",
"specialty": "第三领域女王",
"role": "vanguard",
"description": "统治第三领域的狂妄女王，以军团霸权和玩弄敌意为乐的支配者。",
"wander": "为了将整片雾海纳入自己裙下，带着无尽野心漫步巡视。",
"stats": {
"attack": 4,
"defense": 2,
"scout": 0,
"economy": 2,
"charm": 5
}
},
{
"id": "hinatsuru",
"name": "雏鹤爱",
"color": "#a96455",
"portrait": "hinatsuru",
"group": "ryuuou",
"specialty": "棋士",
"role": "vanguard",
"description": "把将棋当命的小小棋士，输了一盘就要复盘到天亮。",
"wander": "抱着一副磨旧的棋盘，在雾里找肯坐下来陪她下棋的人。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 1,
"economy": 2,
"charm": 4
}
},
{
"id": "yashajin",
"name": "夜叉神天衣",
"color": "#c27f75",
"portrait": "yashajin",
"group": "ryuuou",
"specialty": "棋士",
"role": "ranger",
"description": "金汤匙里长大的大小姐棋士，嘴上不饶人，落子比谁都狠。",
"wander": "带着随从和棋盘走进雾里，说是要亲自挑对手。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 2,
"economy": 2,
"charm": 5
}
},
{
"id": "ginko",
"name": "空银子",
"color": "#8197ba",
"portrait": "ginko",
"group": "ryuuou",
"specialty": "棋士",
"role": "vanguard",
"description": "银发的女流棋士，冷静得像棋盘上的一枚冰子。",
"wander": "一个人走在雾里，手里转着一枚白子。",
"stats": {
"attack": 4,
"defense": 1,
"scout": 1,
"economy": 2,
"charm": 3
}
},
{
"id": "mizukoshi",
"name": "水越澪",
"color": "#c7806c",
"portrait": "mizukoshi",
"group": "ryuuou",
"specialty": "棋士",
"role": "ranger",
"description": "泡茶比布阵还上心的棋士，输赢都能笑着把棋子收好。",
"wander": "拎着茶壶和棋盘，在雾边坐下等有人路过。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 2,
"economy": 2,
"charm": 4
}
},
{
"id": "ayano",
"name": "贞任绫乃",
"color": "#dcb692",
"portrait": "ayano",
"group": "ryuuou",
"specialty": "棋士",
"role": "guard",
"description": "把规矩刻进骨头的女棋士，坐下了就再不肯挪半步。",
"wander": "守着一段旧界碑，说是职责未尽不肯走。",
"stats": {
"attack": 2,
"defense": 4,
"scout": 1,
"economy": 1,
"charm": 2
}
},
{
"id": "charlotte",
"name": "夏洛特·伊索阿尔",
"color": "#e0b67c",
"portrait": "charlotte",
"group": "ryuuou",
"specialty": "棋士",
"role": "support",
"description": "金发卷卷的异国棋士，语尾总带着一点异乡腔调。",
"wander": "沿着灯火的痕迹一路走来，说是要找会下棋的领主。",
"stats": {
"attack": 1,
"defense": 2,
"scout": 2,
"economy": 3,
"charm": 5
}
},
{
"id": "hana",
"name": "白咲花",
"color": "#d7979a",
"portrait": "hana",
"group": "wataten",
"specialty": "甜点爱好者",
"role": "support",
"description": "沉稳冷静的甜点狂热者，只要提供美味点心就会展现出惊人战力。",
"wander": "顺着刚出炉泡芙的香气，一路溜达到了迷雾外围。",
"stats": {
"attack": 3,
"defense": 2,
"scout": 1,
"economy": 2,
"charm": 4
}
},
{
"id": "hinata",
"name": "星野日向",
"color": "#e69381",
"portrait": "hinata",
"group": "wataten",
"specialty": "姐姐控",
"role": "vanguard",
"description": "嗓门洪亮、活力无限的先锋小队长，把罪袋们训得服服帖帖。",
"wander": "为了寻找喵姐喜欢的稀有纽扣，一路精神满满地跑过头了。",
"stats": {
"attack": 3,
"defense": 1,
"scout": 2,
"economy": 2,
"charm": 5
}
},
{
"id": "noa",
"name": "姬坂乃爱",
"color": "#f2c17c",
"portrait": "noa",
"group": "wataten",
"specialty": "自称最可爱",
"role": "support",
"description": "自封世界第一可爱的开朗少女，时刻都在维护自己的偶像形象。",
"wander": "为了寻找全天下最漂亮的镜子，优雅地步入了迷雾之中。",
"stats": {
"attack": 2,
"defense": 2,
"scout": 1,
"economy": 3,
"charm": 6
}
},
{
"id": "konomori",
"name": "小之森夏音",
"color": "#e4a98a",
"portrait": "konomori",
"group": "wataten",
"specialty": "和事佬",
"role": "guard",
"description": "性格温和的大姐姐型和事佬，擅长调解纠纷与稳健整备防线。",
"wander": "跟着迷路的小依一路追出来，结果顺理成章地一起迷路了。",
"stats": {
"attack": 1,
"defense": 3,
"scout": 1,
"economy": 3,
"charm": 4
}
},
{
"id": "koyori",
"name": "种村小依",
"color": "#eb8385",
"portrait": "koyori",
"group": "wataten",
"specialty": "自封的老大",
"role": "vanguard",
"description": "自封统领全军的老大，虽爱逞强但责任心极强，经常平地摔跤。",
"wander": "为了寻找能配得上老大身份的威风权杖，误入未开辟荒野。",
"stats": {
"attack": 4,
"defense": 1,
"scout": 1,
"economy": 2,
"charm": 3
}
}
];

export const FACTION_DEFINITIONS = [
 {
  "id": "lord",
  "name": "我的领地",
  "color": "#f2b84b",
  "leaderId": "rupa",
  "personality": "balanced",
  "isPlayer": true
 },
 {
  "id": "mygo",
  "name": "MyGO!!!!!",
  "color": "#7fb7e6",
  "leaderId": "tomori",
  "personality": "balanced",
  "isPlayer": false
 },
 {
  "id": "mujica",
  "name": "Ave Mujica",
  "color": "#a45bd6",
  "leaderId": "sakiko",
  "personality": "aggressive",
  "isPlayer": false
 },
 {
  "id": "kessoku",
  "name": "结束乐队",
  "color": "#ff7fa8",
  "leaderId": "nijika",
  "personality": "builder",
  "isPlayer": false
 },
 {
  "id": "togenashi",
  "name": "无刺有刺",
  "color": "#ef6a3c",
  "leaderId": "nina",
  "personality": "aggressive",
  "isPlayer": false
 }
];

/** Bands and works the player can start with, and who speaks for each. */
export const STARTER_BANDS = {
  togenashi: { leader: 'rupa', category: 'band' },
  mygo: { leader: 'tomori', category: 'band' },
  mujica: { leader: 'sakiko', category: 'band' },
  kessoku: { leader: 'nijika', category: 'band' },
  poppin: { leader: 'kasumi', category: 'band' },
  roselia: { leader: 'yukina', category: 'band' },
  afterglow: { leader: 'ran', category: 'band' },
  pastel: { leader: 'aya', category: 'band' },
  hhw: { leader: 'kokoro', category: 'band' },
  ras: { leader: 'layer', category: 'band' },
  morfonica: { leader: 'mashiro', category: 'band' },
  leoneed: { leader: 'ichika', category: 'sekai' },
  mmj: { leader: 'minori', category: 'sekai' },
  vbs: { leader: 'kohane', category: 'sekai' },
  wxs: { leader: 'emu', category: 'sekai' },
  n25: { leader: 'kanade', category: 'sekai' },
  vsinger: { leader: 'miku', category: 'sekai' },
  ryuuou: { leader: 'hinatsuru', category: 'anime' },
  wataten: { leader: 'hana', category: 'anime' },
  rezero: { leader: 'emilia', label: 'Re:从零 · 宅邸阵营', group: 'rezero', category: 'anime', members: ['emilia', 'rem', 'ram', 'beatrice', 'frederica'] },
  rezero_royal: { leader: 'crusch', label: 'Re:从零 · 王选诸侯', group: 'rezero', category: 'anime', members: ['crusch', 'priscilla', 'anastasia', 'felt'] },
  rezero_witch: { leader: 'echidna', label: 'Re:从零 · 大罪魔女', group: 'rezero', category: 'anime', members: ['echidna', 'satella', 'minerva', 'carmilla', 'daphne', 'sekhmet'] },
  date: { leader: 'tooka', label: '约会大作战 · 初始精灵', group: 'date', category: 'anime', members: ['tooka', 'origami', 'yoshino', 'kotori', 'kurumi'] },
  date_spirits: { leader: 'mukuro', label: '约会大作战 · 精灵众', group: 'date', category: 'anime', members: ['mukuro', 'kaguya', 'yuzuru', 'izayoi', 'natsumi', 'nia'] },
};

/** Who each nation starts with; everyone else wanders the mist and can only come through recruitment or capture. */
export const STARTING_OWNERS = { rupa: 'togenashi', tomori: 'mygo', taki: 'mygo', soyo: 'mygo', sakiko: 'mujica', umiri: 'mujica', mutsumi: 'mujica', nijika: 'kessoku', ryo: 'kessoku', kita: 'kessoku', nina: 'togenashi', momoka: 'togenashi', tomo: 'togenashi' };
/** Recruitment odds. A pull that lands on a girl with nobody left to meet becomes an SSR Sazai. */
export const GACHA = { girlCap: 0.04, cost: { ap: 1, gold: 12, supply: 0 }, tenCost: { ap: 1, gold: 100, supply: 0 }, troopsPerN: 3, rates: [['girl', 0.015], ['SSR', 0.02], ['SR', 0.085], ['R', 0.22], ['N', 0.66]] };

/** What each kind of land can hold. A building with no `terrains` list goes anywhere. */
export const BUILDINGS = {
  garden: { id: 'garden', name: '应急田圃', icon: '田', gold: 0, supply: 0, yield: { gold: 0, supply: 1 }, defense: 0, minHands: 1, maxLevel: 1, emergency: true, description: '1 人即可满产，补给 +1；零资源开垦，替换原建筑且不返还费用' },
  farm: { id: 'farm', name: '农庄', icon: '麦', gold: 8, supply: 0, yield: { gold: 0, supply: 3 }, defense: 0, terrains: ['plains', 'meadow', 'oasis', 'wetland'], description: '每回合补给 +3' },
  mine: { id: 'mine', name: '商站', icon: '商', gold: 10, supply: 0, yield: { gold: 3, supply: 0 }, defense: 0, terrains: ['plains', 'desert', 'salt', 'coast', 'tundra'], description: '每回合金币 +3' },
  quarry: { id: 'quarry', name: '矿场', icon: '矿', gold: 12, supply: 0, yield: { gold: 4, supply: 0 }, defense: 0, terrains: ['hills', 'mountain', 'crystal', 'volcanic'], description: '每回合金币 +4' },
  lumber: { id: 'lumber', name: '伐木场', icon: '木', gold: 9, supply: 0, yield: { gold: 1, supply: 2 }, defense: 0, terrains: ['forest', 'pine', 'jungle'], description: '每回合金币 +1、补给 +2' },
  port: { id: 'port', name: '渔港', icon: '渔', gold: 10, supply: 0, yield: { gold: 2, supply: 2 }, defense: 0, terrains: ['coast', 'oasis', 'wetland'], description: '每回合金币 +2、补给 +2' },
  camp: { id: 'camp', name: '考古营地', icon: '古', gold: 10, supply: 0, yield: { gold: 5, supply: 0 }, defense: 0, terrains: ['ruins'], description: '每回合金币 +5' },
  fort: { id: 'fort', name: '要塞', icon: '堡', gold: 10, supply: 2, yield: { gold: 0, supply: 0 }, defense: 3, description: '城防 +3；4 人驻守并完成整备后掩护相邻己方地块、接纳迁都；每回合支付维护，超额布防加价，可封存' },
};

export const DEFAULT_TERRAINS = Object.fromEntries(TERRAIN_DEFINITIONS.map(x => [x.id, x]));
export const DEFAULT_CHARACTERS = Object.fromEntries(CHARACTER_DEFINITIONS.map(x => [x.id, x]));

/** Display names for character groups. Each franchise added later brings its own entry. */
export const GROUPS = {"mygo": "MyGO!!!!!", "mujica": "Ave Mujica", "kessoku": "结束乐队", "togenashi": "无刺有刺", "sumimi": "sumimi", "circle": "CiRCLE", "poppin": "Poppin'Party", "roselia": "Roselia", "afterglow": "Afterglow", "pastel": "Pastel*Palettes", "hhw": "Hello, Happy World!", "leoneed": "Leo/need", "n25": "25时，Nightcord见。", "mmj": "MORE MORE JUMP!", "vbs": "Vivid BAD SQUAD", "wxs": "Wonderlands×Showtime", "ras": "RAISE A SUILEN", "morfonica": "Morfonica", "vsinger": "虚拟歌手", "rezero": "Re:从零", "date": "约会大作战", "ryuuou": "龙王的工作！", "wataten": "天使降临到我身边！"};

/** Nations that land on the frontier later, in order. Filled when the second wave of characters is added. */
export const ARRIVAL_EVERY = 4;
export const ARRIVALS = [
{
"id": "poppin",
"name": "Poppin'Party",
"color": "#ff3b72",
"leaderId": "kasumi",
"personality": "balanced",
"wanderers": [
"tae"
]
},
{
"id": "roselia",
"name": "Roselia",
"color": "#3344aa",
"leaderId": "yukina",
"personality": "aggressive",
"wanderers": [
"ako"
]
},
{
"id": "afterglow",
"name": "Afterglow",
"color": "#e53344",
"leaderId": "ran",
"personality": "aggressive",
"wanderers": [
"moca"
]
},
{
"id": "pastel",
"name": "Pastel*Palettes",
"color": "#ffb7d5",
"leaderId": "aya",
"personality": "builder",
"wanderers": [
"hina"
]
},
{
"id": "hhw",
"name": "Hello, Happy World!",
"color": "#ffbb11",
"leaderId": "kokoro",
"personality": "balanced",
"wanderers": [
"misaki"
]
},
{
"id": "leoneed",
"name": "Leo/need",
"color": "#4455dd",
"leaderId": "ichika",
"personality": "balanced",
"wanderers": [
"shiho"
]
},
{
"id": "n25",
"name": "25时，Nightcord见。",
"color": "#884499",
"leaderId": "kanade",
"personality": "builder",
"wanderers": [
"mizuki"
]
},
{
"id": "mmj",
"name": "MORE MORE JUMP!",
"color": "#88dd44",
"leaderId": "minori",
"personality": "builder",
"wanderers": [
"shizuku"
]
},
{
"id": "vbs",
"name": "Vivid BAD SQUAD",
"color": "#ee1166",
"leaderId": "kohane",
"personality": "aggressive",
"wanderers": [
"an"
]
},
{
"id": "wxs",
"name": "Wonderlands×Showtime",
"color": "#ff9900",
"leaderId": "emu",
"personality": "balanced",
"wanderers": [
"nene"
]
},
{
"id": "ras",
"name": "RAISE A SUILEN",
"color": "#33cccc",
"leaderId": "layer",
"personality": "aggressive",
"wanderers": [
"chu2"
]
},
{
"id": "morfonica",
"name": "Morfonica",
"color": "#33aaee",
"leaderId": "mashiro",
"personality": "balanced",
"wanderers": [
"rui"
]
},
{
"id": "vsinger",
"name": "虚拟歌手",
"color": "#33ccbb",
"leaderId": "miku",
"personality": "builder",
"wanderers": [
"luka"
]
},
{
"id": "rezero",
"name": "Re:从零",
"color": "#b5c8f0",
"leaderId": "emilia",
"personality": "aggressive",
"wanderers": [
"beatrice",
"felt",
"echidna",
"elsa",
"meili",
"petra",
"pandora",
"shaula",
"mimi",
"theresia",
"typhon"
]
},
{
"id": "date",
"name": "约会大作战",
"color": "#d6336c",
"leaderId": "tooka",
"personality": "aggressive",
"wanderers": [
"kurumi",
"natsumi",
"nia",
"rinne",
"mayuri",
"ellen",
"whitequeen"
]
},
{
"id": "ryuuou",
"name": "龙王的工作！",
"color": "#8197ba",
"leaderId": "hinatsuru",
"personality": "balanced",
"wanderers": [
"charlotte"
]
},
{
"id": "wataten",
"name": "天使降临到我身边！",
"color": "#e69381",
"leaderId": "hana",
"personality": "builder",
"wanderers": [
"koyori"
]
}
];
