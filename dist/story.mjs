// Written with Gemini (agy), reviewed by hand. Events are self-contained sandbox vignettes, so new ones can be added freely.
export const STORY_EVENTS = [
  {
    "id": "mana_tea",
    "title": "晨间热茶",
    "requires": [
      "mana"
    ],
    "minTurn": 2,
    "lines": [
      {
        "speaker": "mana",
        "expr": "smile",
        "text": "领主，早安！今天也是雾气蒙蒙呢，巡视前先喝杯热茶吧。"
      },
      {
        "speaker": null,
        "text": "身旁的罪袋卫兵默默递上刚泡好的粗茶，头顶的袋子微微晃动。"
      },
      {
        "speaker": "mana",
        "expr": "happy",
        "text": "作为副官，我会打理好内政的，请您放心调度！"
      }
    ],
    "choices": [
      {
        "label": "犒劳卫兵一杯",
        "reply": {
          "speaker": "mana",
          "expr": "happy",
          "text": "罪袋们感动得直点头呢！士气上升啦。"
        },
        "effect": {
          "supply": -2,
          "troops": 1
        }
      },
      {
        "label": "专心省思政务",
        "reply": {
          "speaker": "mana",
          "expr": "smile",
          "text": "嗯，财政账本我都整理好了，随时请过目。"
        },
        "effect": {
          "gold": 8,
          "supply": -1
        }
      }
    ]
  },
  {
    "id": "mana_funds",
    "title": "金库盘点",
    "requires": [
      "mana"
    ],
    "minTurn": 3,
    "lines": [
      {
        "speaker": "mana",
        "expr": "pout",
        "text": "领主，城堡修缮费超支了，罪袋搬砖虽然不要工钱，但饭量很大……"
      },
      {
        "speaker": null,
        "text": "几名壮硕的罪袋在金库门外整齐地原地踏步，发出沉闷的脚步声。"
      },
      {
        "speaker": "mana",
        "expr": "smile",
        "text": "要节约开支，还是把多余建材拿去和雾海商人换金币？"
      }
    ],
    "choices": [
      {
        "label": "变卖建材",
        "reply": {
          "speaker": "mana",
          "expr": "happy",
          "text": "太好了，金库总算见底回升啦！"
        },
        "effect": {
          "gold": 15,
          "supply": -5
        }
      },
      {
        "label": "缩减口粮配额",
        "reply": {
          "speaker": "mana",
          "expr": "pout",
          "text": "罪袋们垂下了头……但存粮保住了。"
        },
        "effect": {
          "supply": 10,
          "gold": -3
        }
      }
    ]
  },
  {
    "id": "mana_poster",
    "title": "招募海报",
    "requires": [
      "mana"
    ],
    "minTurn": 4,
    "lines": [
      {
        "speaker": "mana",
        "expr": "blush",
        "text": "领主，我画了新的募兵海报，画的是初华……啊，是我以前的风格！"
      },
      {
        "speaker": "mana",
        "expr": "smile",
        "text": "上面写着‘管吃管住，有乐器伴奏’，贴在雾海关隘行不行？"
      },
      {
        "speaker": null,
        "text": "路过的巡逻罪袋停下脚步，对着海报用力竖起大拇指。"
      }
    ],
    "choices": [
      {
        "label": "立刻张贴张罗",
        "reply": {
          "speaker": "mana",
          "expr": "happy",
          "text": "有新流民被吸引来了！我这就去登记。"
        },
        "effect": {
          "gold": -5,
          "troops": 3,
          "sazai": "R"
        }
      },
      {
        "label": "低调张贴省钱",
        "reply": {
          "speaker": "mana",
          "expr": "smile",
          "text": "也是呢，招摇可能会引来别国耳目。"
        },
        "effect": {
          "gold": 5,
          "supply": 2
        }
      }
    ]
  },
  {
    "id": "mana_patrol",
    "title": "城墙巡哨",
    "requires": [
      "mana"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "mana",
        "expr": "surprised",
        "text": "领主快看，雾海边缘好像有其他乐队国度的斥候在窥探！"
      },
      {
        "speaker": null,
        "text": "城头的防守罪袋立刻举起生锈的长矛，摆出严阵以待的姿态。"
      },
      {
        "speaker": "mana",
        "expr": "smile",
        "text": "别紧张，只要我们吹响号角展示军容，他们应该不敢轻举妄动。"
      }
    ],
    "choices": [
      {
        "label": "鸣号展现威慑",
        "reply": {
          "speaker": "mana",
          "expr": "happy",
          "text": "斥候吓退了！士兵们的防务更熟练了。"
        },
        "effect": {
          "supply": -4,
          "troops": 2
        }
      },
      {
        "label": "按兵不动省气",
        "reply": {
          "speaker": "mana",
          "expr": "smile",
          "text": "以静制动也很稳妥，节约了号角损耗。"
        },
        "effect": {
          "gold": 6,
          "supply": -2
        }
      }
    ]
  },
  {
    "id": "mana_ration",
    "title": "干粮发配",
    "requires": [
      "mana"
    ],
    "minTurn": 6,
    "lines": [
      {
        "speaker": "mana",
        "expr": "pout",
        "text": "仓库运来了一批硬邦邦的黑麦面包，咬下去牙齿都要抗议了。"
      },
      {
        "speaker": null,
        "text": "罪袋搬运工拿起面包在石头上一敲，石头居然碎了半截。"
      },
      {
        "speaker": "mana",
        "expr": "surprised",
        "text": "哇啊！这到底算防守物资还是口粮啊，领主您怎么看？"
      }
    ],
    "choices": [
      {
        "label": "煮成浓汤分发",
        "reply": {
          "speaker": "mana",
          "expr": "happy",
          "text": "热乎乎的很好喝呢！大家都吃饱了。"
        },
        "effect": {
          "supply": -6,
          "troops": 3
        }
      },
      {
        "label": "风干当备用粮",
        "reply": {
          "speaker": "mana",
          "expr": "smile",
          "text": "储备库充实了，以备不时之需！"
        },
        "effect": {
          "supply": 12,
          "gold": -4
        }
      }
    ]
  },
  {
    "id": "mana_singing",
    "title": "驱雾之歌",
    "requires": [
      "mana"
    ],
    "minTurn": 7,
    "lines": [
      {
        "speaker": "mana",
        "expr": "smile",
        "text": "城外雾气太浓了，领主，我试着用歌声凝聚一下大家的向心力吧。"
      },
      {
        "speaker": "mana",
        "expr": "happy",
        "text": "‘不论雾有多大，我们的双手紧紧相连——’"
      },
      {
        "speaker": null,
        "text": "校场上的罪袋们跟着节奏笨拙地挥手，迷雾似乎散开了些许。"
      }
    ],
    "choices": [
      {
        "label": "赞赏歌声鼓舞",
        "reply": {
          "speaker": "mana",
          "expr": "blush",
          "text": "嘿嘿，能帮上领主和大家就太好啦！"
        },
        "effect": {
          "gold": 8,
          "supply": 4
        }
      },
      {
        "label": "趁散雾去搜寻",
        "reply": {
          "speaker": "mana",
          "expr": "surprised",
          "text": "在雾散的地方捡到了野外遗留的物资！"
        },
        "effect": {
          "supply": 14,
          "gold": -2
        }
      }
    ]
  },
  {
    "id": "mana_zuidai",
    "title": "猛男操练",
    "requires": [
      "mana"
    ],
    "minTurn": 8,
    "lines": [
      {
        "speaker": "mana",
        "expr": "surprised",
        "text": "领主！后院的罪袋们在举办俯卧撑大赛，肌肉碰撞的声音太吓人了！"
      },
      {
        "speaker": null,
        "text": "一名泛着微弱白光的罪袋一口气做到了五百个，头套剧烈起伏。"
      },
      {
        "speaker": "mana",
        "expr": "pout",
        "text": "虽说是为了提升防守硬度，但地砖都要被他们压裂啦……"
      }
    ],
    "choices": [
      {
        "label": "挑出强者编队",
        "reply": {
          "speaker": "mana",
          "expr": "happy",
          "text": "那名罪袋被任命为伍长了，战力提升！"
        },
        "effect": {
          "troops": 2,
          "gold": -6,
          "sazai": "R"
        }
      },
      {
        "label": "罚他们修地砖",
        "reply": {
          "speaker": "mana",
          "expr": "smile",
          "text": "他们老老实实去搬石料了，省下一笔维护费。"
        },
        "effect": {
          "gold": 10,
          "supply": -3
        }
      }
    ]
  },
  {
    "id": "mana_scout",
    "title": "雾边行商",
    "requires": [
      "mana"
    ],
    "minTurn": 10,
    "lines": [
      {
        "speaker": "mana",
        "expr": "smile",
        "text": "领主，外围岗哨放行了一位流浪乐器商，带了不少奇特弦线。"
      },
      {
        "speaker": "mana",
        "expr": "pout",
        "text": "不过对方开价很高，说雾海贸易关卡重重，进货不易。"
      },
      {
        "speaker": null,
        "text": "门旁的罪袋警卫死死盯着商人的货箱，生怕里面藏着奸细。"
      }
    ],
    "choices": [
      {
        "label": "全额买下琴弦",
        "reply": {
          "speaker": "mana",
          "expr": "happy",
          "text": "乐器保养好了，将来招募乐手更方便呢。"
        },
        "effect": {
          "gold": -10,
          "supply": 8
        }
      },
      {
        "label": "以粮换货讲价",
        "reply": {
          "speaker": "mana",
          "expr": "smile",
          "text": "商人收下干粮满意地走了，金币保住啦。"
        },
        "effect": {
          "supply": -8,
          "gold": 12
        }
      }
    ]
  },
  {
    "id": "anon_pr",
    "title": "招牌门面",
    "requires": [
      "anon"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "anon",
        "expr": "smile",
        "text": "领主大人！这城门的旗帜也太朴素了吧？一点都不闪亮！"
      },
      {
        "speaker": "anon",
        "expr": "happy",
        "text": "要我说，挂上粉红带金边的徽章，路过的游侠绝对一眼看中我！"
      },
      {
        "speaker": null,
        "text": "罪袋卫兵拿着针线，头上冒着问号，手足无措。"
      }
    ],
    "choices": [
      {
        "label": "拨给爱音装修",
        "reply": {
          "speaker": "anon",
          "expr": "happy",
          "text": "交给我吧！立刻让全大陆都知道爱音大人的威名！"
        },
        "effect": {
          "gold": -8,
          "troops": 3
        }
      },
      {
        "label": "以实用为主撤",
        "reply": {
          "speaker": "anon",
          "expr": "pout",
          "text": "呜……领主不懂潮流！不过确实省钱了啦。"
        },
        "effect": {
          "gold": 10,
          "supply": -2
        }
      }
    ]
  },
  {
    "id": "anon_tomori",
    "title": "城垣怪石",
    "requires": [
      "anon",
      "tomori"
    ],
    "minTurn": 12,
    "lines": [
      {
        "speaker": "tomori",
        "expr": "happy",
        "text": "领主……看，城墙缝里……捡到了像泪滴一样的青苔石……"
      },
      {
        "speaker": "anon",
        "expr": "surprised",
        "text": "等等灯酱！那是刚运来的防城滚石吧？！别装进兜里啊好重！"
      },
      {
        "speaker": "tomori",
        "expr": "blush",
        "text": "可是……这块石头很温暖……像在努力呼吸一样……"
      }
    ],
    "choices": [
      {
        "label": "帮灯收集妥善",
        "reply": {
          "speaker": "tomori",
          "expr": "happy",
          "text": "谢谢领主……我会做成护身符的……"
        },
        "effect": {
          "gold": -4,
          "troops": 2
        }
      },
      {
        "label": "让爱音搬回去",
        "reply": {
          "speaker": "anon",
          "expr": "cry",
          "text": "诶？！为什么是我搬啊！罪袋先生快帮我！"
        },
        "effect": {
          "supply": 6,
          "gold": 4
        }
      }
    ]
  },
  {
    "id": "raana_matcha",
    "title": "猫的索求",
    "requires": [
      "raana"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "raana",
        "expr": "sleepy",
        "text": "……肚子饿了。抹茶芭菲。"
      },
      {
        "speaker": null,
        "text": "乐奈坐在粮仓顶上晃着腿，嘴里嚼着不知从哪薅来的干茶树叶。"
      },
      {
        "speaker": "raana",
        "expr": "pout",
        "text": "没有甜点……就不弹吉他。罪袋……去拿。"
      }
    ],
    "choices": [
      {
        "label": "用蜂蜜做甜点",
        "reply": {
          "speaker": "raana",
          "expr": "happy",
          "text": "好吃……今天巡逻，我会稍微挥一下琴。"
        },
        "effect": {
          "supply": -6,
          "troops": 3
        }
      },
      {
        "label": "拿普通茶糊弄",
        "reply": {
          "speaker": "raana",
          "expr": "angry",
          "text": "苦的……小气领主。我去屋顶睡觉了。"
        },
        "effect": {
          "supply": 4,
          "gold": 2
        }
      }
    ]
  },
  {
    "id": "raana_taki",
    "title": "营地骚动",
    "requires": [
      "raana",
      "taki"
    ],
    "minTurn": 14,
    "lines": [
      {
        "speaker": "taki",
        "expr": "angry",
        "text": "要乐奈！谁让你把行军军鼓当成猫窝睡觉的？！快下来！"
      },
      {
        "speaker": "raana",
        "expr": "sleepy",
        "text": "这里……晒太阳正好。立希，太吵了。"
      },
      {
        "speaker": "taki",
        "expr": "pout",
        "text": "领主你评评理！要是今晚有敌袭，鼓皮被她压坏了怎么办？"
      }
    ],
    "choices": [
      {
        "label": "给乐奈垫软垫",
        "reply": {
          "speaker": "raana",
          "expr": "happy",
          "text": "喵……舒服。鼓借给你们用。"
        },
        "effect": {
          "supply": -4,
          "troops": 2
        }
      },
      {
        "label": "支持立希管教",
        "reply": {
          "speaker": "taki",
          "expr": "smile",
          "text": "看吧！军纪就要严肃，我立刻去加固哨所。"
        },
        "effect": {
          "gold": 6,
          "supply": -2
        }
      }
    ]
  },
  {
    "id": "uika_mana",
    "title": "久别合奏",
    "requires": [
      "uika",
      "mana"
    ],
    "minTurn": 8,
    "lines": [
      {
        "speaker": "uika",
        "expr": "smile",
        "text": "真奈，没想到穿过这片雾海，还能在这里和你聚在一起。"
      },
      {
        "speaker": "mana",
        "expr": "happy",
        "text": "初华！有你在真是太安心了，领主的领地现在越来越繁荣了哦。"
      },
      {
        "speaker": "uika",
        "expr": "happy",
        "text": "那今晚在校场开一场迷你演出吧，当做给卫兵们的犒劳？"
      }
    ],
    "choices": [
      {
        "label": "筹备演出舞台",
        "reply": {
          "speaker": "uika",
          "expr": "smile",
          "text": "感谢领主，今夜星光属于诸位。"
        },
        "effect": {
          "gold": -6,
          "troops": 4
        }
      },
      {
        "label": "出售观演门票",
        "reply": {
          "speaker": "mana",
          "expr": "blush",
          "text": "门票收入不少！领主还真有商业头脑呢。"
        },
        "effect": {
          "gold": 16,
          "supply": -4
        }
      }
    ]
  },
  {
    "id": "uika_stars",
    "title": "望雾怀星",
    "requires": [
      "uika"
    ],
    "minTurn": 10,
    "lines": [
      {
        "speaker": "uika",
        "expr": "smile",
        "text": "领主，夜晚的雾海很静，偶尔露出的星光像碎落的水晶。"
      },
      {
        "speaker": null,
        "text": "站岗的罪袋双手拄剑，沉默地仰头望天，肌肉线条在月下泛光。"
      },
      {
        "speaker": "uika",
        "expr": "happy",
        "text": "若是把星辰运转编入阵型，弓箭手的命中率会不会更高呢？"
      }
    ],
    "choices": [
      {
        "label": "采纳观星战阵",
        "reply": {
          "speaker": "uika",
          "expr": "smile",
          "text": "呵呵，那就由我来引导诸军的箭矢吧。"
        },
        "effect": {
          "gold": -4,
          "troops": 3
        }
      },
      {
        "label": "安静赏星休整",
        "reply": {
          "speaker": "uika",
          "expr": "happy",
          "text": "嗯，今夜难得平静，好好休息吧。"
        },
        "effect": {
          "supply": 8,
          "gold": 2
        }
      }
    ]
  },
  {
    "id": "nyamu_stream",
    "title": "水晶映影",
    "requires": [
      "nyamu"
    ],
    "minTurn": 6,
    "lines": [
      {
        "speaker": "nyamu",
        "expr": "happy",
        "text": "哈喽大家好~这里是喵梦！今天带大家探访神秘领主的军营！"
      },
      {
        "speaker": "nyamu",
        "expr": "smile",
        "text": "看！后方是挥汗如雨的罪袋卫兵！弹幕里的赞赏水晶快刷起来！"
      },
      {
        "speaker": null,
        "text": "罪袋们笨拙地在投影水晶前比起剪刀手，引来领外民众热烈打赏。"
      }
    ],
    "choices": [
      {
        "label": "平分打赏金币",
        "reply": {
          "speaker": "nyamu",
          "expr": "happy",
          "text": "领主真懂分成规矩！合作愉快哟！"
        },
        "effect": {
          "gold": 14,
          "supply": -3
        }
      },
      {
        "label": "用于添置妆发",
        "reply": {
          "speaker": "nyamu",
          "expr": "blush",
          "text": "诶？给我买饰品吗？算你识相啦！"
        },
        "effect": {
          "gold": -6,
          "troops": 2,
          "sazai": "R"
        }
      }
    ]
  },
  {
    "id": "nyamu_sakiko",
    "title": "商业企划",
    "requires": [
      "nyamu",
      "sakiko"
    ],
    "minTurn": 15,
    "lines": [
      {
        "speaker": "nyamu",
        "expr": "smile",
        "text": "祥子大人~看看这个军需周边方案嘛！挂上你的名号绝对爆卖！"
      },
      {
        "speaker": "sakiko",
        "expr": "pout",
        "text": "若麦，我早已不是评议会的千金。不过……利润分成怎么算？"
      },
      {
        "speaker": "nyamu",
        "expr": "surprised",
        "text": "哇，一谈到钱祥子大人眼神立刻犀利起来了！领主救命！"
      }
    ],
    "choices": [
      {
        "label": "由祥子全权算",
        "reply": {
          "speaker": "sakiko",
          "expr": "smile",
          "text": "很好，每一枚银币的流向我都将严格管控。"
        },
        "effect": {
          "gold": 18,
          "supply": -6
        }
      },
      {
        "label": "拨给喵梦宣传",
        "reply": {
          "speaker": "nyamu",
          "expr": "happy",
          "text": "包在我身上！名声和士兵都会涌过来的！"
        },
        "effect": {
          "gold": -5,
          "troops": 4
        }
      }
    ]
  },
  {
    "id": "bocchi_box",
    "title": "芒果纸箱",
    "requires": [
      "bocchi"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": null,
        "text": "军械库的角落里有一只微微颤抖的废弃水果纸箱。"
      },
      {
        "speaker": "bocchi",
        "expr": "cry",
        "text": "咿……！领主大人……别踩……我只是、想融入阴影里……"
      },
      {
        "speaker": "bocchi",
        "expr": "blush",
        "text": "外面的世界太耀眼了……罪袋先生们的肌肉……好有压迫感……"
      }
    ],
    "choices": [
      {
        "label": "把箱子漆成草色",
        "reply": {
          "speaker": "bocchi",
          "expr": "happy",
          "text": "呜哇伪装度变高了……安心感大增……"
        },
        "effect": {
          "supply": -3,
          "troops": 2
        }
      },
      {
        "label": "买下箱子当斥候",
        "reply": {
          "speaker": "bocchi",
          "expr": "surprised",
          "text": "纸箱潜伏任务吗……我、我努力不尖叫……"
        },
        "effect": {
          "gold": 6,
          "supply": 4
        }
      }
    ]
  },
  {
    "id": "bocchi_nijika",
    "title": "推门而出",
    "requires": [
      "bocchi",
      "nijika"
    ],
    "minTurn": 12,
    "lines": [
      {
        "speaker": "nijika",
        "expr": "smile",
        "text": "波奇酱！不能一直缩在防空洞里弹吉他啦，今天天气很适合练兵哦！"
      },
      {
        "speaker": "bocchi",
        "expr": "cry",
        "text": "虹、虹夏酱……外面有三十个罪袋在排队……会融化掉的！"
      },
      {
        "speaker": "nijika",
        "expr": "happy",
        "text": "领主也来帮忙劝劝嘛，波奇酱的重奏战吼可是全营最强的秘密武器！"
      }
    ],
    "choices": [
      {
        "label": "答应单人演奏",
        "reply": {
          "speaker": "bocchi",
          "expr": "smile",
          "text": "如、如果隔着帘子的话……我可以弹……"
        },
        "effect": {
          "gold": -4,
          "troops": 3
        }
      },
      {
        "label": "发给虹夏管理",
        "reply": {
          "speaker": "nijika",
          "expr": "smile",
          "text": "交给我就行！后勤调度顺便也理清啦。"
        },
        "effect": {
          "supply": 10,
          "gold": 2
        }
      }
    ]
  },
  {
    "id": "subaru_acting",
    "title": "外交假笑",
    "requires": [
      "subaru"
    ],
    "minTurn": 7,
    "lines": [
      {
        "speaker": "subaru",
        "expr": "smile",
        "text": "领主大人，邻邦使节送来的国书真是有够傲慢呢~不过完全没问题！"
      },
      {
        "speaker": "subaru",
        "expr": "happy",
        "text": "看我用‘天真无邪的亲善大使’表情把他们忽悠得团团转吧！"
      },
      {
        "speaker": null,
        "text": "安和昴秒速换上纯洁无瑕的笑容，连罪袋护卫都忍不住退后两步。"
      }
    ],
    "choices": [
      {
        "label": "赞赏昴的演技",
        "reply": {
          "speaker": "subaru",
          "expr": "happy",
          "text": "哼哼，多拿下了三成通商配额哦！"
        },
        "effect": {
          "gold": 16,
          "supply": -3
        }
      },
      {
        "label": "提醒别演过头",
        "reply": {
          "speaker": "subaru",
          "expr": "pout",
          "text": "真是的，领主太较真了，但安全第一嘛。"
        },
        "effect": {
          "supply": 8,
          "gold": 2
        }
      }
    ]
  },
  {
    "id": "subaru_tomo",
    "title": "战术分歧",
    "requires": [
      "subaru",
      "tomo"
    ],
    "minTurn": 15,
    "lines": [
      {
        "speaker": "tomo",
        "expr": "angry",
        "text": "安和昴，你那套花里胡哨的外交辞令除了浪费墨水还有什么用？"
      },
      {
        "speaker": "subaru",
        "expr": "smile",
        "text": "智酱才是一开嘴就像弩炮发射一样呢，吓跑了商队你负责吗？"
      },
      {
        "speaker": "tomo",
        "expr": "pout",
        "text": "领主，把城防弩机键盘交给我调试，保证火力比她的话术管用。"
      }
    ],
    "choices": [
      {
        "label": "支持智改器械",
        "reply": {
          "speaker": "tomo",
          "expr": "smile",
          "text": "哼，明智的判断，防御阵地加固完毕。"
        },
        "effect": {
          "gold": -6,
          "troops": 3
        }
      },
      {
        "label": "让昴去跑商贸",
        "reply": {
          "speaker": "subaru",
          "expr": "happy",
          "text": "看吧智酱，金币才是最实在的防御力！"
        },
        "effect": {
          "gold": 12,
          "supply": 4
        }
      }
    ]
  },
  {
    "id": "rupa_drinks",
    "title": "暖身辛汤",
    "requires": [
      "rupa"
    ],
    "minTurn": 6,
    "lines": [
      {
        "speaker": "rupa",
        "expr": "smile",
        "text": "雾气寒冷入骨，领主大人，我熬了南洋配方的香料热汤。"
      },
      {
        "speaker": null,
        "text": "罪袋守卫们排着整齐长队，双手捧碗，喝下一口后肌肉通红冒热气。"
      },
      {
        "speaker": "rupa",
        "expr": "happy",
        "text": "呵呵，看着大家精神饱满，站岗也就不觉得苦了呢。"
      }
    ],
    "choices": [
      {
        "label": "添置名贵香料",
        "reply": {
          "speaker": "rupa",
          "expr": "happy",
          "text": "多谢领主，士兵们能熬过寒潮了。"
        },
        "effect": {
          "gold": -7,
          "supply": 12,
          "troops": 1
        }
      },
      {
        "label": "酿成药酒售卖",
        "reply": {
          "speaker": "rupa",
          "expr": "smile",
          "text": "好主意，雾海行商很喜欢这种烈酒。"
        },
        "effect": {
          "gold": 14,
          "supply": -5
        }
      }
    ]
  },
  {
    "id": "rupa_momoka",
    "title": "酒肆清谈",
    "requires": [
      "rupa",
      "momoka"
    ],
    "minTurn": 14,
    "lines": [
      {
        "speaker": "momoka",
        "expr": "pout",
        "text": "哈啊……军营配给的酒简直淡得像涮锅水，领主这扣门劲跟谁学的？"
      },
      {
        "speaker": "rupa",
        "expr": "smile",
        "text": "桃香小姐，再喝下去明天晨练又要被仁菜抱怨了哦。"
      },
      {
        "speaker": "momoka",
        "expr": "smile",
        "text": "切，醉着才能弹出撕裂迷雾的扫弦嘛！领主，再批两桶烈酒！"
      }
    ],
    "choices": [
      {
        "label": "特批上好佳酿",
        "reply": {
          "speaker": "momoka",
          "expr": "happy",
          "text": "够意思！今晚守夜的巡逻交给我了！"
        },
        "effect": {
          "gold": -6,
          "troops": 3
        }
      },
      {
        "label": "换成热茶醒脑",
        "reply": {
          "speaker": "rupa",
          "expr": "smile",
          "text": "领主英明，节约了酒税还保全了纪律。"
        },
        "effect": {
          "gold": 8,
          "supply": 6
        }
      }
    ]
  },
  {
    "id": "tomori_stone",
    "title": "晶石共鸣",
    "requires": [
      "tomori"
    ],
    "minTurn": 8,
    "lines": [
      {
        "speaker": "tomori",
        "expr": "happy",
        "text": "领主……看，我在护城河底捞出了发光的石子，会唱歌……"
      },
      {
        "speaker": "tomori",
        "expr": "blush",
        "text": "只要轻轻敲击……心里的不安……好像就会慢慢平复……"
      },
      {
        "speaker": null,
        "text": "高松灯小心翼翼地把石头贴上创可贴，递到了领主面前。"
      }
    ],
    "choices": [
      {
        "label": "嵌在城门当阵眼",
        "reply": {
          "speaker": "tomori",
          "expr": "happy",
          "text": "石子……能保护大家的话，它一定很高兴。"
        },
        "effect": {
          "gold": -3,
          "troops": 3
        }
      },
      {
        "label": "好好珍藏起来",
        "reply": {
          "speaker": "tomori",
          "expr": "blush",
          "text": "嗯……和领主共享这块石头的秘密。"
        },
        "effect": {
          "supply": 6,
          "gold": 3
        }
      }
    ]
  },
  {
    "id": "taki_coffee",
    "title": "黑咖巡夜",
    "requires": [
      "taki"
    ],
    "minTurn": 10,
    "lines": [
      {
        "speaker": "taki",
        "expr": "pout",
        "text": "领主，这是今晚特调的特浓黑咖啡，别喝睡着了。"
      },
      {
        "speaker": "taki",
        "expr": "angry",
        "text": "外面雾气里有可疑声响，我已经让罪袋巡逻队交叉防守了。"
      },
      {
        "speaker": null,
        "text": "椎名立希虽然嘴上抱怨，手里的鼓棒却始终没有松开。"
      }
    ],
    "choices": [
      {
        "label": "带队亲自排查",
        "reply": {
          "speaker": "taki",
          "expr": "smile",
          "text": "哼，还挺有胆色。我跟在你后面掩护。"
        },
        "effect": {
          "supply": -5,
          "troops": 3
        }
      },
      {
        "label": "加派固定暗哨",
        "reply": {
          "speaker": "taki",
          "expr": "smile",
          "text": "稳健的做法。省下体力应付明天吧。"
        },
        "effect": {
          "gold": 8,
          "supply": 2
        }
      }
    ]
  },
  {
    "id": "soyo_tea",
    "title": "贵客茶叙",
    "requires": [
      "soyo"
    ],
    "minTurn": 12,
    "lines": [
      {
        "speaker": "soyo",
        "expr": "smile",
        "text": "领主大人，外务府的待客茶具我已经换成细白瓷了，得体吧？"
      },
      {
        "speaker": "soyo",
        "expr": "blush",
        "text": "不论来的是哪国使节，只要坐在这里，步调就会被我们掌控呢。"
      },
      {
        "speaker": null,
        "text": "罪袋侍从端庄地端着茶托，连肌肉都紧绷出优雅的弧度。"
      }
    ],
    "choices": [
      {
        "label": "由素世主导谈判",
        "reply": {
          "speaker": "soyo",
          "expr": "smile",
          "text": "呵呵，定不辱命，条约会让我们大赚一笔。"
        },
        "effect": {
          "gold": 16,
          "supply": -4
        }
      },
      {
        "label": "节约排场开支",
        "reply": {
          "speaker": "soyo",
          "expr": "pout",
          "text": "既然您坚持朴素……那就算在杂支里吧。"
        },
        "effect": {
          "gold": 6,
          "supply": 6
        }
      }
    ]
  },
  {
    "id": "soyo_mutsumi",
    "title": "菜圃黄瓜",
    "requires": [
      "soyo",
      "mutsumi"
    ],
    "minTurn": 16,
    "lines": [
      {
        "speaker": "mutsumi",
        "expr": "smile",
        "text": "……黄瓜。收获了。"
      },
      {
        "speaker": null,
        "text": "若叶睦默默递上一根碧绿的黄瓜，放在领主与素世之间的石桌上。"
      },
      {
        "speaker": "soyo",
        "expr": "angry",
        "text": "睦……为什么要在外交会议上递黄瓜啊？！领主请您别看她！"
      }
    ],
    "choices": [
      {
        "label": "收下当作军粮",
        "reply": {
          "speaker": "mutsumi",
          "expr": "happy",
          "text": "……清脆。很有营养。"
        },
        "effect": {
          "supply": 14,
          "gold": -3
        }
      },
      {
        "label": "让素世收下",
        "reply": {
          "speaker": "soyo",
          "expr": "pout",
          "text": "真拿你们没办法……切成冷盘分了吧！"
        },
        "effect": {
          "gold": 6,
          "supply": 4
        }
      }
    ]
  },
  {
    "id": "sakiko_budget",
    "title": "严苛审计",
    "requires": [
      "sakiko"
    ],
    "minTurn": 12,
    "lines": [
      {
        "speaker": "sakiko",
        "expr": "angry",
        "text": "领主，我重新核算了后勤账单，浪费严重到令人发指！"
      },
      {
        "speaker": "sakiko",
        "expr": "pout",
        "text": "为什么罪袋的腰带要用真皮？普通粗麻绳完全能承受防御力！"
      },
      {
        "speaker": null,
        "text": "负责采买的罪袋缩紧腹肌，委屈得头套直晃。"
      }
    ],
    "choices": [
      {
        "label": "采纳祥子方案",
        "reply": {
          "speaker": "sakiko",
          "expr": "smile",
          "text": "效率就是生存。截留资金转入国库。"
        },
        "effect": {
          "gold": 18,
          "supply": -6
        }
      },
      {
        "label": "保留基础体面",
        "reply": {
          "speaker": "sakiko",
          "expr": "pout",
          "text": "随您的便，军饷超支可别找我预支。"
        },
        "effect": {
          "supply": 6,
          "troops": 2
        }
      }
    ]
  },
  {
    "id": "sakiko_mutsumi",
    "title": "默契无言",
    "requires": [
      "sakiko",
      "mutsumi"
    ],
    "minTurn": 14,
    "lines": [
      {
        "speaker": "sakiko",
        "expr": "pout",
        "text": "呼……批完这叠战备文书，手腕都僵了。"
      },
      {
        "speaker": "mutsumi",
        "expr": "smile",
        "text": "……给。薄荷茶。温的。"
      },
      {
        "speaker": "sakiko",
        "expr": "blush",
        "text": "……谢谢睦。领主，下月防御工程的进度可以提前三天完成。"
      }
    ],
    "choices": [
      {
        "label": "加筑前线工事",
        "reply": {
          "speaker": "sakiko",
          "expr": "smile",
          "text": "Ave Mujica的阵线绝不容许退让半步。"
        },
        "effect": {
          "gold": -6,
          "troops": 4
        }
      },
      {
        "label": "犒劳二位休息",
        "reply": {
          "speaker": "mutsumi",
          "expr": "happy",
          "text": "……睦，去给菜园浇水。"
        },
        "effect": {
          "supply": 8,
          "gold": 4
        }
      }
    ]
  },
  {
    "id": "umiri_contract",
    "title": "佣兵契约",
    "requires": [
      "umiri"
    ],
    "minTurn": 10,
    "lines": [
      {
        "speaker": "umiri",
        "expr": "smile",
        "text": "领主，本周的支援合约到期了。如果要续约，单场战役报酬不变。"
      },
      {
        "speaker": "umiri",
        "expr": "smile",
        "text": "兼职三十支队伍的我，对各方阵型弱点都一清二楚哦。"
      },
      {
        "speaker": null,
        "text": "八幡海铃利落地收起五弦贝斯，静静等待领主的决定。"
      }
    ],
    "choices": [
      {
        "label": "按标准续长约",
        "reply": {
          "speaker": "umiri",
          "expr": "smile",
          "text": "合同成立。哨卡守备我会按时到岗。"
        },
        "effect": {
          "gold": -8,
          "troops": 4
        }
      },
      {
        "label": "折换成物资付款",
        "reply": {
          "speaker": "umiri",
          "expr": "smile",
          "text": "实物抵扣也可以，合作愉快。"
        },
        "effect": {
          "supply": -10,
          "gold": 10
        }
      }
    ]
  },
  {
    "id": "umiri_ryo",
    "title": "低音交集",
    "requires": [
      "umiri",
      "ryo"
    ],
    "minTurn": 18,
    "lines": [
      {
        "speaker": "ryo",
        "expr": "smile",
        "text": "海铃……接了三十份兼职？那不是很有钱吗，借我一点买草药……"
      },
      {
        "speaker": "umiri",
        "expr": "pout",
        "text": "山田小姐，契约之外的借贷免谈。而且你吃草真的没问题吗？"
      },
      {
        "speaker": null,
        "text": "山田凉默默把刚采摘的山野菜递过去抵债，海铃退后了一步。"
      }
    ],
    "choices": [
      {
        "label": "借粮给凉救急",
        "reply": {
          "speaker": "ryo",
          "expr": "happy",
          "text": "领主大好人，这片毒草送给你当陷阱。"
        },
        "effect": {
          "supply": -5,
          "troops": 3
        }
      },
      {
        "label": "让海铃记公账",
        "reply": {
          "speaker": "umiri",
          "expr": "smile",
          "text": "记入领地杂费，两清了。"
        },
        "effect": {
          "gold": -4,
          "supply": 8
        }
      }
    ]
  },
  {
    "id": "ryo_weeds",
    "title": "野草佳肴",
    "requires": [
      "ryo"
    ],
    "minTurn": 9,
    "lines": [
      {
        "speaker": "ryo",
        "expr": "happy",
        "text": "领主……看，城墙脚下这丛蒲公英，焯水撒盐，顶级美味。"
      },
      {
        "speaker": null,
        "text": "罪袋厨师在旁边端着空空如也的锅，陷入了深刻的哲学沉思。"
      },
      {
        "speaker": "ryo",
        "expr": "smile",
        "text": "只要把全军口粮换成路边野草，不仅零成本，还能锻炼肠胃。"
      }
    ],
    "choices": [
      {
        "label": "驳回草料建议",
        "reply": {
          "speaker": "ryo",
          "expr": "pout",
          "text": "可惜……那这一把我自己独享了。"
        },
        "effect": {
          "supply": -2,
          "gold": 6
        }
      },
      {
        "label": "挑能吃的加餐",
        "reply": {
          "speaker": "ryo",
          "expr": "happy",
          "text": "哼哼，补充维生素，士兵精神倍增。"
        },
        "effect": {
          "supply": 8,
          "gold": -3
        }
      }
    ]
  },
  {
    "id": "kita_aura",
    "title": "圣光耀城",
    "requires": [
      "kita"
    ],
    "minTurn": 8,
    "lines": [
      {
        "speaker": "kita",
        "expr": "happy",
        "text": "领主大人！今天由我来带队给巡逻的大家送温热的麦茶！"
      },
      {
        "speaker": null,
        "text": "喜多郁代周身散发着肉眼可见的高亮光芒，照亮了阴暗的哨塔。"
      },
      {
        "speaker": "kita",
        "expr": "smile",
        "text": "罪袋先生们，辛苦啦！大家都要元气满满地保卫领地哦！"
      }
    ],
    "choices": [
      {
        "label": "借光巡查暗角",
        "reply": {
          "speaker": "kita",
          "expr": "happy",
          "text": "喜多喜多发光！潜藏的雾怪全驱散了！"
        },
        "effect": {
          "gold": -3,
          "troops": 3
        }
      },
      {
        "label": "节约夜间火把",
        "reply": {
          "speaker": "kita",
          "expr": "blush",
          "text": "诶？把我当路灯吗？能省下灯油就好！"
        },
        "effect": {
          "supply": 10,
          "gold": 3
        }
      }
    ]
  },
  {
    "id": "kita_bocchi",
    "title": "战衣改造",
    "requires": [
      "kita",
      "bocchi"
    ],
    "minTurn": 13,
    "lines": [
      {
        "speaker": "kita",
        "expr": "happy",
        "text": "波奇酱！我给你缝制了带蕾丝边的战袍，战场上一定超耀眼！"
      },
      {
        "speaker": "bocchi",
        "expr": "cry",
        "text": "咿！太亮了……穿这个出去绝对会被当成靶子集火秒杀的！"
      },
      {
        "speaker": null,
        "text": "后藤一里试图把自己卷成毛毛虫，喜多拉着袖子不放。"
      }
    ],
    "choices": [
      {
        "label": "折中改成暗粉色",
        "reply": {
          "speaker": "bocchi",
          "expr": "smile",
          "text": "呼……这样的话勉强可以穿出门……"
        },
        "effect": {
          "gold": -5,
          "troops": 2,
          "sazai": "R"
        }
      },
      {
        "label": "卖给外贸商人",
        "reply": {
          "speaker": "kita",
          "expr": "surprised",
          "text": "哇！居然卖出高价，充实国库啦！"
        },
        "effect": {
          "gold": 16,
          "supply": -3
        }
      }
    ]
  },
  {
    "id": "nina_milk",
    "title": "烈性反抗",
    "requires": [
      "nina"
    ],
    "minTurn": 7,
    "lines": [
      {
        "speaker": "nina",
        "expr": "angry",
        "text": "我才没有无理取闹！这牛奶分明发酸了！我绝对不喝！"
      },
      {
        "speaker": null,
        "text": "井芹仁菜狠狠瞪着伙房罪袋，双手叉腰，死不妥协。"
      },
      {
        "speaker": "nina",
        "expr": "pout",
        "text": "领主！不对的事情就是不对！哪怕是后勤紧缺也不能糊弄大家！"
      }
    ],
    "choices": [
      {
        "label": "严查整顿伙房",
        "reply": {
          "speaker": "nina",
          "expr": "happy",
          "text": "看吧！我就知道我是对的！"
        },
        "effect": {
          "supply": -6,
          "troops": 3
        }
      },
      {
        "label": "发加倍新鲜蜜糖",
        "reply": {
          "speaker": "nina",
          "expr": "blush",
          "text": "哼……算你还有点诚意，我勉强收下。"
        },
        "effect": {
          "gold": -4,
          "supply": 8
        }
      }
    ]
  },
  {
    "id": "nina_momoka",
    "title": "屋顶咆哮",
    "requires": [
      "nina",
      "momoka"
    ],
    "minTurn": 11,
    "lines": [
      {
        "speaker": "momoka",
        "expr": "smile",
        "text": "仁菜，嗓门挺大嘛。但在这片雾海里，光靠大喊大叫可退不了敌。"
      },
      {
        "speaker": "nina",
        "expr": "angry",
        "text": "桃香小姐少说教！我的歌声哪怕传不过这片雾，我也要全力吼出来！"
      },
      {
        "speaker": null,
        "text": "两人的吉他声与嘶吼在夜空回荡，营地里的罪袋们热血沸腾。"
      }
    ],
    "choices": [
      {
        "label": "组织全营拉练",
        "reply": {
          "speaker": "nina",
          "expr": "happy",
          "text": "跑就跑！我绝对不会输给桃香小姐！"
        },
        "effect": {
          "supply": -8,
          "troops": 4
        }
      },
      {
        "label": "录音制成战歌",
        "reply": {
          "speaker": "momoka",
          "expr": "smile",
          "text": "呵，领主还挺会利用我们的声浪赚钱。"
        },
        "effect": {
          "gold": 15,
          "supply": -2
        }
      }
    ]
  },
  {
    "id": "tomo_keyboard",
    "title": "键盘改造",
    "requires": [
      "tomo"
    ],
    "minTurn": 9,
    "lines": [
      {
        "speaker": "tomo",
        "expr": "smile",
        "text": "领主，我把城墙的八音联动机关改造好了，音律精准到毫秒。"
      },
      {
        "speaker": "tomo",
        "expr": "pout",
        "text": "某些笨蛋总是嫌复杂，其实只要照着乐谱按键，滚木就能准确定位。"
      },
      {
        "speaker": null,
        "text": "罪袋守兵试着按了下高音键，远处箭靶瞬间被击穿，引来欢呼。"
      }
    ],
    "choices": [
      {
        "label": "普及全城守备",
        "reply": {
          "speaker": "tomo",
          "expr": "happy",
          "text": "哼，我的设计从来不会出错，拿去用吧。"
        },
        "effect": {
          "gold": -8,
          "troops": 4
        }
      },
      {
        "label": "节省零件损耗",
        "reply": {
          "speaker": "tomo",
          "expr": "smile",
          "text": "也好，精密零件在雾海里可不好买。"
        },
        "effect": {
          "gold": 10,
          "supply": 4
        }
      }
    ]
  },
  {
    "id": "bocchi_kita_omurice",
    "title": "咒语加餐",
    "requires": [
      "bocchi",
      "kita"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "kita",
        "expr": "happy",
        "text": "波奇酱快看！今天轮到我们帮伙房给前线送蛋包饭，一起来念变好吃的咒语吧！"
      },
      {
        "speaker": "bocchi",
        "expr": "cry",
        "text": "咿——！喜、喜多酱，在五十个肌肉鼓鼓的罪袋面前比爱心念咒语……社死致死量超标了……！"
      },
      {
        "speaker": null,
        "text": "喜多郁代元气满满地比出爱心高喊“萌萌啾”，后藤一里当场石化成灰白色粉末，前排罪袋却感动得疯狂鼓掌。"
      }
    ],
    "choices": [
      {
        "label": "特批番茄酱画星",
        "reply": {
          "speaker": "kita",
          "expr": "happy",
          "text": "太好啦！波奇酱画的小吉他超可爱，全军士气爆棚哦！"
        },
        "effect": {
          "supply": -4,
          "troops": 4
        }
      },
      {
        "label": "给波奇搭屏风",
        "reply": {
          "speaker": "bocchi",
          "expr": "blush",
          "text": "呜……隔着木板念咒的话……小声一点勉强可以……"
        },
        "effect": {
          "gold": -3,
          "supply": 10,
          "troops": 1
        }
      }
    ]
  },
  {
    "id": "bocchi_kita_isosta",
    "title": "闪光留影",
    "requires": [
      "bocchi",
      "kita"
    ],
    "minTurn": 8,
    "lines": [
      {
        "speaker": "kita",
        "expr": "happy",
        "text": "领主大人！我想和波奇酱在城头拍一张‘双吉他守卫队’贴到募兵布告栏上！"
      },
      {
        "speaker": "bocchi",
        "expr": "surprised",
        "text": "等、等一下！如果我的脸印在告示上，连雾海对面的敌人都会嘲笑我这副阴暗嘴脸的！"
      },
      {
        "speaker": "kita",
        "expr": "smile",
        "text": "才不会呢！波奇酱抱着吉他的侧影超级帅气，我给你打三层星光滤镜！"
      }
    ],
    "choices": [
      {
        "label": "只拍背影与琴颈",
        "reply": {
          "speaker": "bocchi",
          "expr": "smile",
          "text": "呼……不用露脸的话，好像真的有点摇滚高手的氛围……"
        },
        "effect": {
          "gold": -4,
          "troops": 3,
          "sazai": "R"
        }
      },
      {
        "label": "印成闪卡卖行商",
        "reply": {
          "speaker": "kita",
          "expr": "happy",
          "text": "哇！第一批募兵纪念卡瞬间售罄，国库大丰收！"
        },
        "effect": {
          "gold": 16,
          "supply": -3
        }
      }
    ]
  },
  {
    "id": "ryo_nijika_debt",
    "title": "军饷借条",
    "requires": [
      "ryo",
      "nijika"
    ],
    "minTurn": 6,
    "lines": [
      {
        "speaker": "ryo",
        "expr": "smile",
        "text": "虹夏，你看这把从雾海旧货商手里淘来的七弦古贝斯，只要预支我三个月军饷……"
      },
      {
        "speaker": "nijika",
        "expr": "angry",
        "text": "驳回！你上周借去买泡菜坛子的银币还没还呢！领主，千万别再惯着这家伙了！"
      },
      {
        "speaker": "ryo",
        "expr": "pout",
        "text": "切……那我只好去城外拔蒲公英抵债了，顺便探探敌军暗哨。"
      }
    ],
    "choices": [
      {
        "label": "扣下乐器抵公账",
        "reply": {
          "speaker": "nijika",
          "expr": "happy",
          "text": "不愧是领主！账目一下子清爽多了！"
        },
        "effect": {
          "gold": 14,
          "supply": 4
        }
      },
      {
        "label": "派凉带队去侦察",
        "reply": {
          "speaker": "ryo",
          "expr": "happy",
          "text": "成交。路边的野蘑菇和敌军布防图一并带回来。"
        },
        "effect": {
          "gold": -5,
          "supply": 6,
          "troops": 2
        }
      }
    ]
  },
  {
    "id": "kessoku_quartet_live",
    "title": "破雾合奏",
    "requires": [
      "bocchi",
      "nijika",
      "ryo",
      "kita"
    ],
    "minTurn": 11,
    "lines": [
      {
        "speaker": "nijika",
        "expr": "happy",
        "text": "全员到齐！领主，今晚浓雾压城，就让结束乐队在钟楼顶上来一场久违的四人合奏吧！"
      },
      {
        "speaker": "ryo",
        "expr": "smile",
        "text": "音响回路用城防铜钟改装好了，低音能传出十里远。"
      },
      {
        "speaker": "kita",
        "expr": "happy",
        "text": "波奇酱，准备好了吗？大家都在等你的第一声滑棒哦！"
      },
      {
        "speaker": "bocchi",
        "expr": "smile",
        "text": "嗯……只要四个人在一起，哪怕在战场中央……我也弹得出来！"
      }
    ],
    "choices": [
      {
        "label": "点燃烽火全城狂欢",
        "reply": {
          "speaker": "nijika",
          "expr": "happy",
          "text": "听见了吗！连远处的哨所都在跟着节拍欢呼呢！"
        },
        "effect": {
          "gold": -8,
          "troops": 5,
          "sazai": "SR"
        }
      },
      {
        "label": "设下募捐门票箱",
        "reply": {
          "speaker": "ryo",
          "expr": "happy",
          "text": "哼哼，商队和驻军投进来的银币装满整整两箱。"
        },
        "effect": {
          "gold": 22,
          "supply": 6
        }
      }
    ]
  },
  {
    "id": "anon_soyo_pr",
    "title": "微笑营业",
    "requires": [
      "anon",
      "soyo"
    ],
    "minTurn": 6,
    "lines": [
      {
        "speaker": "anon",
        "expr": "happy",
        "text": "素世世快看！我设计了领地外交官双人徽章，名字就叫‘爱素亲善大使团’！"
      },
      {
        "speaker": "soyo",
        "expr": "smile",
        "text": "是‘长崎素世’。还有，谁允许你把我的头像画在正中间旁边的？"
      },
      {
        "speaker": null,
        "text": "素世嘴角挂着完美无瑕的淑女微笑，手里的羽根笔却发出了清脆的裂响。"
      }
    ],
    "choices": [
      {
        "label": "派两人出使邻邦",
        "reply": {
          "speaker": "soyo",
          "expr": "smile",
          "text": "呵呵，场面话由我来谈，爱音负责吸引火力正好。"
        },
        "effect": {
          "gold": 15,
          "supply": 3
        }
      },
      {
        "label": "印制招兵宣传册",
        "reply": {
          "speaker": "anon",
          "expr": "happy",
          "text": "大成功！好多流浪罪袋慕名来投奔爱音大人啦！"
        },
        "effect": {
          "gold": -5,
          "troops": 4
        }
      }
    ]
  },
  {
    "id": "tomori_sakiko_lyric",
    "title": "旧日残谱",
    "requires": [
      "tomori",
      "sakiko"
    ],
    "minTurn": 12,
    "lines": [
      {
        "speaker": "tomori",
        "expr": "surprised",
        "text": "小祥……这张被风吹到箭塔下的谱纸……是你写的守夜曲吗？"
      },
      {
        "speaker": "sakiko",
        "expr": "blush",
        "text": "……只是随手记下的行军号角罢了。既然被你捡到了，缺少的词就由你填上吧。"
      },
      {
        "speaker": "tomori",
        "expr": "smile",
        "text": "嗯……我会把大家不想走散的心情，全部写进去。"
      }
    ],
    "choices": [
      {
        "label": "定为全军夜巡曲",
        "reply": {
          "speaker": "sakiko",
          "expr": "smile",
          "text": "琴声所及之处，绝不让任何一名士兵迷失在雾里。"
        },
        "effect": {
          "supply": -4,
          "troops": 4,
          "sazai": "R"
        }
      },
      {
        "label": "抄录装订入书库",
        "reply": {
          "speaker": "tomori",
          "expr": "happy",
          "text": "太好了……这样这首歌就会一直留在这里了。"
        },
        "effect": {
          "gold": 10,
          "supply": 8
        }
      }
    ]
  },
  {
    "id": "taki_umiri_drill",
    "title": "奇数方阵",
    "requires": [
      "taki",
      "umiri"
    ],
    "minTurn": 10,
    "lines": [
      {
        "speaker": "taki",
        "expr": "angry",
        "text": "太慢了！第三排的罪袋，重拍踩在第七拍半上，连这都跟不上怎么上阵？！"
      },
      {
        "speaker": "umiri",
        "expr": "smile",
        "text": "立希，先从五拍子交替步练起吧。我已经按体能给他们分好声部了。"
      },
      {
        "speaker": null,
        "text": "罪袋步兵踏着诡异莫测的变拍子步伐整齐推进，连树上的斥候都看晕了头。"
      }
    ],
    "choices": [
      {
        "label": "编入主力突击营",
        "reply": {
          "speaker": "taki",
          "expr": "smile",
          "text": "哼，勉强像点样子了，下次实战见真章。"
        },
        "effect": {
          "supply": -7,
          "troops": 5
        }
      },
      {
        "label": "精简操典省体力",
        "reply": {
          "speaker": "umiri",
          "expr": "smile",
          "text": "合理的调整，留足耐力才能应对持久战。"
        },
        "effect": {
          "supply": 12,
          "gold": 4
        }
      }
    ]
  },
  {
    "id": "nina_subaru_hotpot",
    "title": "深夜暖锅",
    "requires": [
      "nina",
      "subaru"
    ],
    "minTurn": 6,
    "lines": [
      {
        "speaker": "subaru",
        "expr": "happy",
        "text": "当当～！巡夜辛苦啦，我从伙房顺来了牛杂和白萝卜，在岗亭煮热锅吃吧！"
      },
      {
        "speaker": "nina",
        "expr": "angry",
        "text": "谁要吃你顺来的东西啊！……咕噜……我、我只是替领主检查食材有没有毒！"
      },
      {
        "speaker": "subaru",
        "expr": "smile",
        "text": "是是是，仁菜大人最铁面无私了，快趁热把这碗汤喝了吧～"
      }
    ],
    "choices": [
      {
        "label": "与哨兵同享夜宵",
        "reply": {
          "speaker": "nina",
          "expr": "blush",
          "text": "哼……算大家今晚值哨勤快，分你们一半！"
        },
        "effect": {
          "supply": -5,
          "troops": 4
        }
      },
      {
        "label": "设立夜间热汤摊",
        "reply": {
          "speaker": "subaru",
          "expr": "happy",
          "text": "过路商队抢着付钱喝热汤，小赚一笔哦！"
        },
        "effect": {
          "gold": 14,
          "supply": -2
        }
      }
    ]
  },
  {
    "id": "momoka_tomo_rupa",
    "title": "篝火即兴",
    "requires": [
      "momoka",
      "tomo",
      "rupa"
    ],
    "minTurn": 9,
    "lines": [
      {
        "speaker": "momoka",
        "expr": "smile",
        "text": "喂，智、卢帕，今晚雾色这么浓，干坐着擦兵器也太无聊了吧？"
      },
      {
        "speaker": "tomo",
        "expr": "pout",
        "text": "我可事先声明，要是桃香你弹错和弦，我立刻收琴回屋。"
      },
      {
        "speaker": "rupa",
        "expr": "happy",
        "text": "呵呵，我已经把麦酒温好了，领主大人也坐下来听一曲吧。"
      }
    ],
    "choices": [
      {
        "label": "彻夜奏鸣振军心",
        "reply": {
          "speaker": "momoka",
          "expr": "happy",
          "text": "哈哈，这帮罪袋挥舞火把的劲头不赖嘛！"
        },
        "effect": {
          "gold": -6,
          "troops": 4,
          "sazai": "R"
        }
      },
      {
        "label": "点到为止蓄锐气",
        "reply": {
          "speaker": "tomo",
          "expr": "smile",
          "text": "难得领主懂分寸，明天行军状态绝对满分。"
        },
        "effect": {
          "supply": 12,
          "gold": 5
        }
      }
    ]
  },
  {
    "id": "kasumi_arisa_star",
    "title": "星标粮仓",
    "requires": [
      "kasumi",
      "arisa"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "kasumi",
        "expr": "happy",
        "text": "有咲有咲！我在城南旧仓库的天花板上贴满了夜光星星，超——级闪闪发光哦！"
      },
      {
        "speaker": "arisa",
        "expr": "angry",
        "text": "笨蛋香澄！那是领主的战略备用粮仓，不是你的秘密基地啊！"
      },
      {
        "speaker": null,
        "text": "搬粮的罪袋抬头看着满屋顶荧光星图，竟顺着星标把麻袋码得比平时整齐一倍。"
      }
    ],
    "choices": [
      {
        "label": "改成军中休整室",
        "reply": {
          "speaker": "kasumi",
          "expr": "happy",
          "text": "太棒啦！キラキラドキドキ作战室正式成立！"
        },
        "effect": {
          "gold": -4,
          "troops": 4
        }
      },
      {
        "label": "让有咲严格盘库",
        "reply": {
          "speaker": "arisa",
          "expr": "blush",
          "text": "真、真是的，既然领主都发话了，一粒麦子都不会少！"
        },
        "effect": {
          "supply": 14,
          "gold": 4
        }
      }
    ]
  },
  {
    "id": "saaya_rimi_bakery",
    "title": "螺雷出炉",
    "requires": [
      "saaya",
      "rimi"
    ],
    "minTurn": 7,
    "lines": [
      {
        "speaker": "saaya",
        "expr": "smile",
        "text": "领主，新砌的石窑火力正好，我和里美试烤了一炉行军面包。"
      },
      {
        "speaker": "rimi",
        "expr": "happy",
        "text": "里、里面灌满了特制浓可可酱！吃一口就能忘掉巡逻的疲惫哦！"
      },
      {
        "speaker": null,
        "text": "香甜热气飘过校场，连正在举石锁的罪袋都齐刷刷转过了头。"
      }
    ],
    "choices": [
      {
        "label": "配发前线慰劳军士",
        "reply": {
          "speaker": "saaya",
          "expr": "happy",
          "text": "看到大家吃得开心，揉面的辛苦就全值啦！"
        },
        "effect": {
          "gold": -5,
          "supply": 8,
          "troops": 3
        }
      },
      {
        "label": "开张山吹军粮铺",
        "reply": {
          "speaker": "rimi",
          "expr": "blush",
          "text": "哇，巧克力螺雷一下子成了全城最抢手的特产！"
        },
        "effect": {
          "gold": 16,
          "supply": -3
        }
      }
    ]
  },
  {
    "id": "yukina_lisa_cookies",
    "title": "蔷薇茶歇",
    "requires": [
      "yukina",
      "lisa",
      "sayo"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "yukina",
        "expr": "angry",
        "text": "合奏的精准度还差半成。在达到顶点之前，谁也不准离开演武厅。"
      },
      {
        "speaker": "lisa",
        "expr": "happy",
        "text": "好啦好啦友希那，弦绷太紧会断的～看，我烤了猫咪曲奇和红茶哦！"
      },
      {
        "speaker": "sayo",
        "expr": "blush",
        "text": "咳……既然是补充热量的战术配给，我就按规矩取用两块。"
      }
    ],
    "choices": [
      {
        "label": "茶歇后再练一轮",
        "reply": {
          "speaker": "yukina",
          "expr": "smile",
          "text": "……曲奇味道不错。接下来把气势推到最高峰吧。"
        },
        "effect": {
          "supply": -4,
          "troops": 4
        }
      },
      {
        "label": "准许今日提前休整",
        "reply": {
          "speaker": "lisa",
          "expr": "smile",
          "text": "不愧是领主，懂得劳逸结合才走得长远嘛！"
        },
        "effect": {
          "supply": 10,
          "gold": 6
        }
      }
    ]
  },
  {
    "id": "ako_rinko_quest",
    "title": "深渊战袍",
    "requires": [
      "ako",
      "rinko"
    ],
    "minTurn": 8,
    "lines": [
      {
        "speaker": "ako",
        "expr": "happy",
        "text": "库库库……领主！只要披上燐燐缝制的‘暗黑残响斗篷’，全军魔力就会暴涨百倍！"
      },
      {
        "speaker": "rinko",
        "expr": "blush",
        "text": "那、那个……其实只是加厚了防寒内衬和反光银线……在雾里不容易走丢……"
      },
      {
        "speaker": null,
        "text": "试穿斗篷的罪袋队长顺着亚子的口号摆出霸气手势，防寒效果意外出色。"
      }
    ],
    "choices": [
      {
        "label": "列装夜战斥候队",
        "reply": {
          "speaker": "ako",
          "expr": "happy",
          "text": "帅呆啦！漆黑之翼军团，向迷雾进发！"
        },
        "effect": {
          "gold": -6,
          "troops": 3,
          "sazai": "R"
        }
      },
      {
        "label": "改良成常备冬衣",
        "reply": {
          "speaker": "rinko",
          "expr": "smile",
          "text": "太好了……能帮大家挡住寒风就好……"
        },
        "effect": {
          "supply": 12,
          "gold": 3
        }
      }
    ]
  },
  {
    "id": "ran_moca_buns",
    "title": "夕景面包",
    "requires": [
      "ran",
      "moca",
      "himari"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "himari",
        "expr": "angry",
        "text": "等一下摩卡！那筐炒面面包是今天傍晚守城队的口粮，你怎么先吃上了！"
      },
      {
        "speaker": "moca",
        "expr": "smile",
        "text": "摩卡酱正在替大家做神圣的毒味检测哦～兰也想来一口对吧～？"
      },
      {
        "speaker": "ran",
        "expr": "blush",
        "text": "……别把我也拖下水。领主，巡防任务我们会加倍完成的。"
      }
    ],
    "choices": [
      {
        "label": "追加双倍面包配给",
        "reply": {
          "speaker": "moca",
          "expr": "happy",
          "text": "噢噢～领主大人就是传说中的面包之神是也～"
        },
        "effect": {
          "gold": -5,
          "troops": 4
        }
      },
      {
        "label": "罚三人清点军械",
        "reply": {
          "speaker": "himari",
          "expr": "happy",
          "text": "包在我身上！Hey-Hey-Hoh，一口气整理干净！"
        },
        "effect": {
          "supply": 10,
          "gold": 6
        }
      }
    ]
  },
  {
    "id": "aya_chisato_stage",
    "title": "慰问彩排",
    "requires": [
      "aya",
      "chisato",
      "hina"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "aya",
        "expr": "cry",
        "text": "呜呜……一看到台下黑压压的罪袋方阵，我的开场词又咬到舌头了……！"
      },
      {
        "speaker": "hina",
        "expr": "happy",
        "text": "没关系啦小彩！刚才那个噗噜噗噜的发音超鲁邦邦的，再来一次嘛！"
      },
      {
        "speaker": "chisato",
        "expr": "smile",
        "text": "呵呵，领主，趁现在观众热情高涨，前排贵宾席还可以卖给外邦商团呢。"
      }
    ],
    "choices": [
      {
        "label": "为彩鼓掌打气",
        "reply": {
          "speaker": "aya",
          "expr": "happy",
          "text": "谢、谢谢领主！丸山彩，全力献唱开始！"
        },
        "effect": {
          "gold": -4,
          "troops": 4
        }
      },
      {
        "label": "听千圣发售贵宾票",
        "reply": {
          "speaker": "chisato",
          "expr": "smile",
          "text": "演出收入已全数入库，账目分毫不差。"
        },
        "effect": {
          "gold": 18,
          "supply": -2
        }
      }
    ]
  },
  {
    "id": "kokoro_misaki_balloon",
    "title": "飞船奇想",
    "requires": [
      "kokoro",
      "misaki",
      "kaoru"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "kokoro",
        "expr": "happy",
        "text": "领主！我们把粉红色的米歇尔巨型热气球升上天空吧！这样连雾海尽头都能笑着看见！"
      },
      {
        "speaker": "misaki",
        "expr": "pout",
        "text": "先不说燃料从哪来，为什么热气球一定要做成我的布偶头造型啊……"
      },
      {
        "speaker": "kaoru",
        "expr": "smile",
        "text": "啊啦，乘风俯瞰大地，真是何等虚幻而浪漫的远征！"
      }
    ],
    "choices": [
      {
        "label": "批准升空测绘雾区",
        "reply": {
          "speaker": "kokoro",
          "expr": "happy",
          "text": "太棒啦！全速升空，把微笑洒满整片天空！"
        },
        "effect": {
          "gold": -7,
          "troops": 4,
          "sazai": "R"
        }
      },
      {
        "label": "改成城门庆典气球",
        "reply": {
          "speaker": "misaki",
          "expr": "smile",
          "text": "呼……拴在地面招揽商旅，总比飘进风暴里强多了。"
        },
        "effect": {
          "gold": 15,
          "supply": 4
        }
      }
    ]
  },
  {
    "id": "chu2_layer_pareo",
    "title": "最强音响",
    "requires": [
      "chu2",
      "layer",
      "pareo"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "chu2",
        "expr": "happy",
        "text": "Listen！你这破城的号角声简直Unacceptable！本制作人已经改造成了重低音电音矩阵！"
      },
      {
        "speaker": "pareo",
        "expr": "happy",
        "text": "哇啊～！不愧是CHU²大人，连城墙砖缝都在闪七彩霓虹光呢！"
      },
      {
        "speaker": "layer",
        "expr": "smile",
        "text": "声压确实惊人，只要控制好共振频率，能把潜伏在雾里的敌哨直接震出来。"
      }
    ],
    "choices": [
      {
        "label": "开启全功率震慑",
        "reply": {
          "speaker": "chu2",
          "expr": "happy",
          "text": "哼哼，见识到世界级制作人的压倒性实力了吧！"
        },
        "effect": {
          "gold": -6,
          "troops": 5
        }
      },
      {
        "label": "调至节能巡防档",
        "reply": {
          "speaker": "layer",
          "expr": "smile",
          "text": "稳妥的选择，既能警戒边防也不会扰民。"
        },
        "effect": {
          "supply": 10,
          "gold": 6
        }
      }
    ]
  },
  {
    "id": "mashiro_tsukushi_rui",
    "title": "蝶翼夜巡",
    "requires": [
      "mashiro",
      "tsukushi",
      "rui"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "mashiro",
        "expr": "cry",
        "text": "呜哇……那团白雾的影子，怎么看都像是长着八只触手的吞城巨兽……！"
      },
      {
        "speaker": "tsukushi",
        "expr": "happy",
        "text": "别怕真白！有我这个可靠队长带路……咦，地图是不是拿反了？"
      },
      {
        "speaker": "rui",
        "expr": "smile",
        "text": "北偏东十五度，那是己方风车的轮廓。按拉弦回声走就不会迷路。"
      }
    ],
    "choices": [
      {
        "label": "按瑠唯音波图布哨",
        "reply": {
          "speaker": "rui",
          "expr": "smile",
          "text": "合理。巡逻路线缩短了三成，效率显著提升。"
        },
        "effect": {
          "supply": 8,
          "troops": 3
        }
      },
      {
        "label": "把真白幻想写成画册",
        "reply": {
          "speaker": "mashiro",
          "expr": "blush",
          "text": "诶？我的妄想笔记……居然受酒馆大家欢迎吗……"
        },
        "effect": {
          "gold": 14,
          "supply": 3
        }
      }
    ]
  },
  {
    "id": "sayo_hina_fries",
    "title": "双子薯条",
    "requires": [
      "sayo",
      "hina"
    ],
    "minTurn": 11,
    "lines": [
      {
        "speaker": "hina",
        "expr": "happy",
        "text": "姐姐～！我带了刚炸好的大份脆薯条来夜袭你的值班室咯！"
      },
      {
        "speaker": "sayo",
        "expr": "pout",
        "text": "日菜，军务期间禁止携带高热量零食……为什么连番茄酱都挤好了？"
      },
      {
        "speaker": "hina",
        "expr": "smile",
        "text": "因为姐姐批完防务公文的时候，最喜欢偷偷吃脆脆的那几根嘛！"
      }
    ],
    "choices": [
      {
        "label": "准许姐妹同班值守",
        "reply": {
          "speaker": "sayo",
          "expr": "blush",
          "text": "既然是领主的命令……下不为例，坐端正一起审图吧。"
        },
        "effect": {
          "supply": -3,
          "troops": 4
        }
      },
      {
        "label": "推广炸薯条作军饷点心",
        "reply": {
          "speaker": "hina",
          "expr": "happy",
          "text": "太鲁邦邦啦！全城都飘着香喷喷的味道呢！"
        },
        "effect": {
          "gold": 12,
          "supply": 6
        }
      }
    ]
  },
  {
    "id": "tomoe_ako_drums",
    "title": "双鼓擂天",
    "requires": [
      "tomoe",
      "ako"
    ],
    "minTurn": 11,
    "lines": [
      {
        "speaker": "ako",
        "expr": "happy",
        "text": "姐姐快看！我把两套大太鼓搬上北门箭楼了，今天一定要比出谁的鼓点更帅！"
      },
      {
        "speaker": "tomoe",
        "expr": "happy",
        "text": "哈哈！口气不小嘛亚子！领主，就让你见识一下宇田川家的祭典战鼓！"
      },
      {
        "speaker": null,
        "text": "双鼓齐鸣如闷雷滚过城垣，校场上的罪袋全员斗志昂扬。"
      }
    ],
    "choices": [
      {
        "label": "擂鼓集结新募兵员",
        "reply": {
          "speaker": "tomoe",
          "expr": "happy",
          "text": "痛快！这一通鼓敲完，浑身力气都涌上来了！"
        },
        "effect": {
          "supply": -5,
          "troops": 4,
          "sazai": "R"
        }
      },
      {
        "label": "办宇田川夜市祭典",
        "reply": {
          "speaker": "ako",
          "expr": "happy",
          "text": "祭典摊位人山人海，姐姐的太鼓超受欢迎！"
        },
        "effect": {
          "gold": 16,
          "supply": -2
        }
      }
    ]
  },
  {
    "id": "ichika_saki_honami",
    "title": "观星甜派",
    "requires": [
      "ichika",
      "saki",
      "honami"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "saki",
        "expr": "happy",
        "text": "快看快看！今晚城楼顶上的雾散开了，能看见整条银河哦！"
      },
      {
        "speaker": "honami",
        "expr": "smile",
        "text": "我烤了热腾腾的肉桂苹果派，一歌和领主也趁热吃一块吧。"
      },
      {
        "speaker": "ichika",
        "expr": "blush",
        "text": "在星空下吃着穗波的苹果派弹吉他……就像回到了大家常去的天台一样。"
      }
    ],
    "choices": [
      {
        "label": "办城头星空弹唱",
        "reply": {
          "speaker": "ichika",
          "expr": "smile",
          "text": "愿这首歌，能传到每一个守夜同伴的耳边。"
        },
        "effect": {
          "gold": -4,
          "troops": 4
        }
      },
      {
        "label": "增设高台观星哨",
        "reply": {
          "speaker": "honami",
          "expr": "happy",
          "text": "剩下的苹果派也分给值夜哨兵，后勤补给充足！"
        },
        "effect": {
          "supply": 12,
          "gold": 4
        }
      }
    ]
  },
  {
    "id": "minori_haruka_airi",
    "title": "应援方阵",
    "requires": [
      "minori",
      "haruka",
      "airi"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "minori",
        "expr": "happy",
        "text": "把希望传递给前线的大家——预备，MORE MORE JUMP！"
      },
      {
        "speaker": "airi",
        "expr": "angry",
        "text": "第三排的罪袋跳早了半拍！手肘再抬高十度，偶像应援也是要拼命的！"
      },
      {
        "speaker": "haruka",
        "expr": "smile",
        "text": "领主请看，经过晨间体能操训练，士兵们的步伐轻快了许多。"
      }
    ],
    "choices": [
      {
        "label": "编练全军晨间应援操",
        "reply": {
          "speaker": "haruka",
          "expr": "happy",
          "text": "只要大家心怀希望，再漫长的行军也不会倒下。"
        },
        "effect": {
          "supply": -4,
          "troops": 4
        }
      },
      {
        "label": "巡回各镇义演募捐",
        "reply": {
          "speaker": "minori",
          "expr": "happy",
          "text": "呜哇！乡亲们送来了好多粮草和应援扇！"
        },
        "effect": {
          "gold": 12,
          "supply": 8
        }
      }
    ]
  },
  {
    "id": "shizuku_shiho_sisters",
    "title": "迷途热面",
    "requires": [
      "shizuku",
      "shiho"
    ],
    "minTurn": 10,
    "lines": [
      {
        "speaker": "shizuku",
        "expr": "smile",
        "text": "哎呀，明明想去练兵场给志步酱送热乌冬面，怎么走到马厩后面来了呢……"
      },
      {
        "speaker": "shiho",
        "expr": "blush",
        "text": "姐、姐姐！我就猜到你会迷路才出来找你的……别在领主面前摸我的头啦！"
      },
      {
        "speaker": "shizuku",
        "expr": "happy",
        "text": "呵呵，因为志步酱急匆匆跑过来的样子实在太可爱了嘛～"
      }
    ],
    "choices": [
      {
        "label": "给营区全挂指路牌",
        "reply": {
          "speaker": "shiho",
          "expr": "smile",
          "text": "……多谢领主，这下总算不用每天担心她走到城外去了。"
        },
        "effect": {
          "gold": -4,
          "supply": 8,
          "troops": 2
        }
      },
      {
        "label": "请姐妹同掌伙食配给",
        "reply": {
          "speaker": "shizuku",
          "expr": "happy",
          "text": "乌冬面汤头熬得刚刚好，大家都吃得暖洋洋的呢！"
        },
        "effect": {
          "supply": 14,
          "gold": 2
        }
      }
    ]
  },
  {
    "id": "kohane_an_coffee",
    "title": "街角战歌",
    "requires": [
      "kohane",
      "an"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "an",
        "expr": "happy",
        "text": "领主快来尝尝！我在军营广场搭起了特调咖啡车，今晚来办街头歌会！"
      },
      {
        "speaker": "kohane",
        "expr": "blush",
        "text": "那、那个……要在这么多老兵面前即兴对唱吗？我有点紧张……"
      },
      {
        "speaker": null,
        "text": "伴奏响起的瞬间，小豆泽心羽眼神骤然锐利，清亮高音与白石杏完美咬合，震翻全场！"
      }
    ],
    "choices": [
      {
        "label": "把广场定为自由擂台",
        "reply": {
          "speaker": "an",
          "expr": "happy",
          "text": "太酷了！我们的传说就要从这座城池超越一切！"
        },
        "effect": {
          "gold": -5,
          "troops": 4,
          "sazai": "R"
        }
      },
      {
        "label": "售卖手冲行军咖啡",
        "reply": {
          "speaker": "kohane",
          "expr": "happy",
          "text": "大家喝了咖啡都精神百倍，还攒下了不少经费呢！"
        },
        "effect": {
          "gold": 15,
          "supply": 4
        }
      }
    ]
  },
  {
    "id": "emu_nene_cannon",
    "title": "奇想礼炮",
    "requires": [
      "emu",
      "nene"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "emu",
        "expr": "happy",
        "text": "Wonderhoy——！领主领主，我们往城防大炮里塞满亮晶晶的彩带砰地发射出去吧！"
      },
      {
        "speaker": "nene",
        "expr": "pout",
        "text": "笨蛋笑梦，随便改火药配比会炸膛的……算了，仰角和风速还是由我来算吧。"
      },
      {
        "speaker": null,
        "text": "漫天闪光纸花在浓雾上方炸开，竟意外照出了三支潜伏的雾海游兵。"
      }
    ],
    "choices": [
      {
        "label": "量产照明礼花弹",
        "reply": {
          "speaker": "nene",
          "expr": "smile",
          "text": "作为夜间侦察照明弹的话……战术价值倒是意外及格。"
        },
        "effect": {
          "gold": -5,
          "troops": 4
        }
      },
      {
        "label": "在集市办马戏巡游",
        "reply": {
          "speaker": "emu",
          "expr": "happy",
          "text": "哇啊～！全城的小孩和罪袋都在一起蹦蹦跳跳！"
        },
        "effect": {
          "gold": 16,
          "supply": 2
        }
      }
    ]
  },
  {
    "id": "kanade_mafuyu_ramen",
    "title": "深夜热汤",
    "requires": [
      "kanade",
      "mafuyu"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "kanade",
        "expr": "sleepy",
        "text": "这段安魂副歌再改两个小节……嗯，天怎么已经亮了……杯面放哪里了……"
      },
      {
        "speaker": "mafuyu",
        "expr": "pout",
        "text": "奏，杯面我已经没收了。把这碗蔬菜鸡肉粥喝完再睡。"
      },
      {
        "speaker": "kanade",
        "expr": "smile",
        "text": "谢谢真冬……热乎乎的，感觉还能再写一首行军曲……"
      }
    ],
    "choices": [
      {
        "label": "强制奏休息半日",
        "reply": {
          "speaker": "mafuyu",
          "expr": "smile",
          "text": "领主明断。剩下的防务文书我来替她处理。"
        },
        "effect": {
          "supply": 10,
          "gold": 6
        }
      },
      {
        "label": "将新曲配给前线医疗营",
        "reply": {
          "speaker": "kanade",
          "expr": "smile",
          "text": "如果我的曲子能救哪怕一个人……那就值得了。"
        },
        "effect": {
          "supply": -4,
          "troops": 4
        }
      }
    ]
  },
  {
    "id": "ena_mizuki_ribbon",
    "title": "夜半工坊",
    "requires": [
      "ena",
      "mizuki"
    ],
    "minTurn": 7,
    "lines": [
      {
        "speaker": "mizuki",
        "expr": "happy",
        "text": "锵锵～！看我给罪袋守卫的麻布头套缝上了粉白蕾丝蝴蝶结，超可爱的对吧！"
      },
      {
        "speaker": "ena",
        "expr": "angry",
        "text": "瑞希你别闹了！配色和领地军旗完全撞色好吗，拿过来我重新调色！"
      },
      {
        "speaker": null,
        "text": "两人吵吵闹闹改到半夜，出来的军装徽记兼具美感与夜视辨识度。"
      }
    ],
    "choices": [
      {
        "label": "采用新版军团徽章",
        "reply": {
          "speaker": "ena",
          "expr": "blush",
          "text": "哼，既然领主有眼光，本画师就再给你画一面帅气主旗吧！"
        },
        "effect": {
          "gold": -5,
          "troops": 4
        }
      },
      {
        "label": "定制礼服外销邻国",
        "reply": {
          "speaker": "mizuki",
          "expr": "happy",
          "text": "呀吼～订单排到下个月啦，大赚一笔！"
        },
        "effect": {
          "gold": 18,
          "supply": -3
        }
      }
    ]
  },
  {
    "id": "n25_nightcord_all",
    "title": "二十五时",
    "requires": [
      "kanade",
      "mafuyu",
      "ena",
      "mizuki"
    ],
    "minTurn": 12,
    "lines": [
      {
        "speaker": "mizuki",
        "expr": "smile",
        "text": "钟楼敲过子夜十二下——现在正式进入我们的‘二十五时’作战会议咯！"
      },
      {
        "speaker": "ena",
        "expr": "pout",
        "text": "哈啊……虽说习惯熬夜了，但在议事厅点烛火合创还是头一回。"
      },
      {
        "speaker": "mafuyu",
        "expr": "smile",
        "text": "在这里……好像不用勉强摆出笑容也没关系。"
      },
      {
        "speaker": "kanade",
        "expr": "smile",
        "text": "嗯。领主，今晚完成的这首夜曲，一定能守住大家的黎明。"
      }
    ],
    "choices": [
      {
        "label": "奏响黎明守城曲",
        "reply": {
          "speaker": "kanade",
          "expr": "happy",
          "text": "微弱的光汇聚在一起，浓雾开始散开了。"
        },
        "effect": {
          "gold": -6,
          "troops": 5,
          "sazai": "SR"
        }
      },
      {
        "label": "准备热宵夜犒劳四人",
        "reply": {
          "speaker": "ena",
          "expr": "happy",
          "text": "算你贴心！先自拍一张纪念今晚的合创！"
        },
        "effect": {
          "supply": 12,
          "gold": 8
        }
      }
    ]
  },
  {
    "id": "miku_rin_luka_meiko",
    "title": "电子圣咏",
    "requires": [
      "miku",
      "rin",
      "luka",
      "meiko"
    ],
    "minTurn": 6,
    "lines": [
      {
        "speaker": "miku",
        "expr": "happy",
        "text": "领主！高塔的共鸣阵已经调好音准，今晚我们四个人一起为全境歌唱吧！"
      },
      {
        "speaker": "rin",
        "expr": "happy",
        "text": "本小姐的高音绝对能穿透最厚的黑雾！大姐，庆功橘子汁冰好了吗？"
      },
      {
        "speaker": "meiko",
        "expr": "happy",
        "text": "哈哈，果汁和庆功麦酒都管够！流歌，前奏交给你了！"
      },
      {
        "speaker": "luka",
        "expr": "smile",
        "text": "呵呵，那就用最温柔也最响亮的旋律，替领主唤醒整片大地吧。"
      }
    ],
    "choices": [
      {
        "label": "四声部全境广播",
        "reply": {
          "speaker": "miku",
          "expr": "happy",
          "text": "歌声传到了每一座哨塔，新的伙伴正在赶来！"
        },
        "effect": {
          "gold": -8,
          "troops": 5,
          "sazai": "SR"
        }
      },
      {
        "label": "举办丰收歌谣祭",
        "reply": {
          "speaker": "meiko",
          "expr": "happy",
          "text": "干杯！商旅云集、粮满仓廪，这才叫好日子！"
        },
        "effect": {
          "gold": 16,
          "supply": 10
        }
      }
    ]
  },
  {
    "id": "emilia_rem_ram",
    "title": "宅邸晨务",
    "requires": [
      "emilia",
      "rem",
      "ram"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "rem",
        "expr": "smile",
        "text": "领主大人早安。营房清扫、早餐熬煮和城门拒马加固，蕾姆已全部完成了。"
      },
      {
        "speaker": "ram",
        "expr": "pout",
        "text": "哈，领主居然睡到日上三竿才起，没有拉姆督促的话这国家三天就散架了吧。"
      },
      {
        "speaker": "emilia",
        "expr": "happy",
        "text": "拉姆别这么说嘛！领主昨晚看地图到很晚，早上的粮仓盘点我也和微精灵一起核对好咯！"
      }
    ],
    "choices": [
      {
        "label": "嘉奖女仆姐妹整军",
        "reply": {
          "speaker": "rem",
          "expr": "happy",
          "text": "能帮上爱蜜莉雅大人与领主大人的忙，是蕾姆的荣幸！"
        },
        "effect": {
          "gold": -5,
          "troops": 4,
          "supply": 4
        }
      },
      {
        "label": "批蒸白薯作午间茶点",
        "reply": {
          "speaker": "ram",
          "expr": "smile",
          "text": "哼……算你还有几分领主的器量，拉姆就勉强收下了。"
        },
        "effect": {
          "supply": 12,
          "gold": 5
        }
      }
    ]
  },
  {
    "id": "emilia_beatrice_book",
    "title": "禁书午后",
    "requires": [
      "emilia",
      "beatrice"
    ],
    "minTurn": 7,
    "lines": [
      {
        "speaker": "beatrice",
        "expr": "pout",
        "text": "贝蒂才不是担心领地的结界漏洞，才特地把这卷古籍搬出来的，的说！"
      },
      {
        "speaker": "emilia",
        "expr": "smile",
        "text": "是是，贝蒂最温柔最可靠了～来，坐到膝盖上，我帮你把卷发梳顺吧？"
      },
      {
        "speaker": "beatrice",
        "expr": "blush",
        "text": "真、真拿莉雅没办法……只能梳一刻钟哦，的说。"
      }
    ],
    "choices": [
      {
        "label": "照古籍加固城防术式",
        "reply": {
          "speaker": "beatrice",
          "expr": "smile",
          "text": "哼，有贝蒂亲自修正阵眼，宵小之辈休想越雷池一步，的说！"
        },
        "effect": {
          "gold": -6,
          "troops": 4,
          "sazai": "R"
        }
      },
      {
        "label": "扩建领地安静书库",
        "reply": {
          "speaker": "emilia",
          "expr": "happy",
          "text": "太好了，以后每天午后都能来这里和贝蒂一起看书呢！"
        },
        "effect": {
          "gold": 8,
          "supply": 8
        }
      }
    ]
  },
  {
    "id": "crusch_priscilla_ana",
    "title": "诸侯军议",
    "requires": [
      "crusch",
      "priscilla",
      "anastasia"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "crusch",
        "expr": "smile",
        "text": "领主，风向已变。我建议集中精锐正面推进，以堂堂正正之师震慑四邻。"
      },
      {
        "speaker": "priscilla",
        "expr": "happy",
        "text": "呵，何须如此繁琐？凡俗只要仰望妾身如烈日般的威仪，自会纳头来降。"
      },
      {
        "speaker": "anastasia",
        "expr": "smile",
        "text": "哎呀呀，打仗之前先算账嘛～咱已经把周边铁矿期货买断了，怎么打咱都稳赚不赔！"
      }
    ],
    "choices": [
      {
        "label": "采纳库珥修整军方案",
        "reply": {
          "speaker": "crusch",
          "expr": "happy",
          "text": "军心如风，必不负阁下重托！"
        },
        "effect": {
          "gold": -6,
          "troops": 5
        }
      },
      {
        "label": "授权安娜垄断商路",
        "reply": {
          "speaker": "anastasia",
          "expr": "happy",
          "text": "好眼光！金币叮当响的声音最动听啦～"
        },
        "effect": {
          "gold": 20,
          "supply": -3
        }
      }
    ]
  },
  {
    "id": "felt_theresia_wind",
    "title": "疾风花田",
    "requires": [
      "felt",
      "theresia"
    ],
    "minTurn": 8,
    "lines": [
      {
        "speaker": "felt",
        "expr": "happy",
        "text": "喂领主！我借着风势翻上钟楼顶看了一圈，东边雾道藏着两车无主物资！"
      },
      {
        "speaker": "theresia",
        "expr": "smile",
        "text": "菲鲁特大人身手真轻巧呢。不过从屋顶跳下来时要当心别踩到城根刚开的黄花哦。"
      },
      {
        "speaker": "felt",
        "expr": "blush",
        "text": "知、知道啦！我已经特意绕开半丈远落地了！"
      }
    ],
    "choices": [
      {
        "label": "派轻骑收回无主物资",
        "reply": {
          "speaker": "felt",
          "expr": "happy",
          "text": "嘿嘿，手快有手慢无，大丰收！"
        },
        "effect": {
          "gold": 12,
          "supply": 10
        }
      },
      {
        "label": "请特蕾西亚指导剑术",
        "reply": {
          "speaker": "theresia",
          "expr": "smile",
          "text": "为了守护这些花朵与同伴，我会倾囊相授。"
        },
        "effect": {
          "supply": -4,
          "troops": 4
        }
      }
    ]
  },
  {
    "id": "echidna_witch_tea",
    "title": "魔女茶会",
    "requires": [
      "echidna",
      "minerva",
      "daphne"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "echidna",
        "expr": "smile",
        "text": "欢迎来到茶会，领主。在探讨三百种破敌推演之前，不妨先饮下这杯知识红茶。"
      },
      {
        "speaker": "minerva",
        "expr": "angry",
        "text": "少灌别人奇怪的茶水啦！那边的罪袋搬石头磨破皮了，站住别动吃我一记治愈重拳！"
      },
      {
        "speaker": "daphne",
        "expr": "happy",
        "text": "嗅嗅……比起红茶，达芙妮闻到伙房炖肉的香味了，可以把整口锅连盖子一起吃掉吗？"
      }
    ],
    "choices": [
      {
        "label": "听艾姬多娜推演战局",
        "reply": {
          "speaker": "echidna",
          "expr": "happy",
          "text": "明智的求知欲。敌军的补给盲点已经为你标出来了。"
        },
        "effect": {
          "gold": 12,
          "troops": 3
        }
      },
      {
        "label": "开锅管饱换全营疗伤",
        "reply": {
          "speaker": "minerva",
          "expr": "happy",
          "text": "哼！全营擦伤扭伤全部揍得完好如初，一个伤兵都不留！"
        },
        "effect": {
          "supply": -8,
          "troops": 5
        }
      }
    ]
  },
  {
    "id": "carmilla_sekhmet_typhon",
    "title": "怠惰午睡",
    "requires": [
      "carmilla",
      "sekhmet",
      "typhon"
    ],
    "minTurn": 8,
    "lines": [
      {
        "speaker": "sekhmet",
        "expr": "sleepy",
        "text": "哈啊……呼……既然把我搬到关隘晒太阳……顺手拍飞几个偷摸过来的斥候……好累……"
      },
      {
        "speaker": "typhon",
        "expr": "happy",
        "text": "领主领主！刚才逃跑的那些人手心都在抖，肯定是有罪的坏蛋对吧！"
      },
      {
        "speaker": "carmilla",
        "expr": "cry",
        "text": "那、那个……大家别打架……我帮看门的士兵缝好了破掉的披风……"
      }
    ],
    "choices": [
      {
        "label": "在关口铺软垫留镇守",
        "reply": {
          "speaker": "sekhmet",
          "expr": "sleepy",
          "text": "呼……软绵绵的……这片关口没人过得去……"
        },
        "effect": {
          "gold": -5,
          "troops": 4
        }
      },
      {
        "label": "收缴斥候丢下的辎重",
        "reply": {
          "speaker": "carmilla",
          "expr": "smile",
          "text": "没、没有流血就捡到了这么多粮草……太好了……"
        },
        "effect": {
          "supply": 14,
          "gold": 6
        }
      }
    ]
  },
  {
    "id": "tooka_origami_duel",
    "title": "护卫竞逐",
    "requires": [
      "tooka",
      "origami"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "tooka",
        "expr": "angry",
        "text": "折纸！今天领主贴身护卫的位置归我！黄豆粉面包第一份也归我！"
      },
      {
        "speaker": "origami",
        "expr": "smile",
        "text": "否定。根据风速、体温与步幅计算，我站在领主右侧半步的防御效率高出百分之十七。"
      },
      {
        "speaker": null,
        "text": "两人一言不合在校场比拼了十项全能，顺手把整排破损箭靶劈成了标准柴火。"
      }
    ],
    "choices": [
      {
        "label": "左右各设一名近卫",
        "reply": {
          "speaker": "tooka",
          "expr": "happy",
          "text": "唔姆！领主真公平，那我就吃双份面包出双份力！"
        },
        "effect": {
          "supply": -5,
          "troops": 5
        }
      },
      {
        "label": "派两人合劈山林开路",
        "reply": {
          "speaker": "origami",
          "expr": "smile",
          "text": "指令确认。障碍已彻底清除，木材全部归仓。"
        },
        "effect": {
          "gold": 12,
          "supply": 8
        }
      }
    ]
  },
  {
    "id": "kotori_kurumi_clock",
    "title": "刻刻博弈",
    "requires": [
      "kotori",
      "kurumi"
    ],
    "minTurn": 6,
    "lines": [
      {
        "speaker": "kotori",
        "expr": "angry",
        "text": "梦魇，别以为我没发现你的分身混进了侦察队。把你摸到的情报交出来！"
      },
      {
        "speaker": "kurumi",
        "expr": "smile",
        "text": "啊啦啊啦，司令官小姐说话真不客气～人家可是特地替领主大人送敌军换防时刻表来的呢。"
      },
      {
        "speaker": null,
        "text": "五河琴里咬碎嘴里的棒棒糖，在沙盘上迅速核验出三处暗哨空当。"
      }
    ],
    "choices": [
      {
        "label": "按时刻表奇袭补给线",
        "reply": {
          "speaker": "kotori",
          "expr": "happy",
          "text": "哼，计算无误！兵不血刃截下了整支运输队！"
        },
        "effect": {
          "gold": 14,
          "supply": 8,
          "troops": 1
        }
      },
      {
        "label": "编组夜影敌后斥候",
        "reply": {
          "speaker": "kurumi",
          "expr": "happy",
          "text": "呵呵呵，那就让我们尽情享受这美妙的狩猎时光吧～"
        },
        "effect": {
          "gold": -6,
          "troops": 4,
          "sazai": "R"
        }
      }
    ]
  },
  {
    "id": "kaguya_yuzuru_storm",
    "title": "八舞竞风",
    "requires": [
      "kaguya",
      "yuzuru"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "kaguya",
        "expr": "happy",
        "text": "库库库！看吾这一记飓风斩，瞬间便能驱动城外五座磨坊风车！"
      },
      {
        "speaker": "yuzuru",
        "expr": "smile",
        "text": "挑衅。夕弦认为精准稳定的气流才能磨出最细的面粉，提议展开第一百零九回胜负。"
      },
      {
        "speaker": null,
        "text": "姐妹俩在风车坡上追逐竞速，领地积压了一整周的麦谷半个时辰便磨完了。"
      }
    ],
    "choices": [
      {
        "label": "全速研磨储备精粮",
        "reply": {
          "speaker": "yuzuru",
          "expr": "happy",
          "text": "赞赏。面粉产量翻倍，夕弦与耶俱矢平分头功。"
        },
        "effect": {
          "supply": 18,
          "gold": 4
        }
      },
      {
        "label": "借疾风演练弓骑齐射",
        "reply": {
          "speaker": "kaguya",
          "expr": "happy",
          "text": "哈哈！乘上八舞之风，箭矢射程足足翻了一番！"
        },
        "effect": {
          "supply": -4,
          "troops": 4
        }
      }
    ]
  },
  {
    "id": "nia_natsumi_manga",
    "title": "赶稿之夜",
    "requires": [
      "nia",
      "natsumi"
    ],
    "minTurn": 7,
    "lines": [
      {
        "speaker": "nia",
        "expr": "happy",
        "text": "少年救命～！《雾海领主战记》明天就要截稿印成募兵画册了，网点还没贴完！"
      },
      {
        "speaker": "natsumi",
        "expr": "angry",
        "text": "明明是你自己喝着麦酒摸鱼到半夜！为什么又要我用赝造魔女变出十支羽毛笔陪你通宵啊！"
      },
      {
        "speaker": null,
        "text": "罪袋助手们排成流水线负责擦橡皮屑，天亮时画册奇迹般准时杀青。"
      }
    ],
    "choices": [
      {
        "label": "全境发行赚取版税",
        "reply": {
          "speaker": "nia",
          "expr": "happy",
          "text": "耶～！首印一抢而空，版税够发半个月军饷咯！"
        },
        "effect": {
          "gold": 18,
          "supply": -2
        }
      },
      {
        "label": "附赠入伍报名表",
        "reply": {
          "speaker": "natsumi",
          "expr": "blush",
          "text": "哼……既然大家都夸插画好看，再帮你画一期也不是不行……"
        },
        "effect": {
          "gold": -4,
          "troops": 4
        }
      }
    ]
  },
  {
    "id": "mukuro_yoshino_snow",
    "title": "封寒护苗",
    "requires": [
      "mukuro",
      "yoshino"
    ],
    "minTurn": 8,
    "lines": [
      {
        "speaker": "yoshino",
        "expr": "cry",
        "text": "呜……我不小心打了个喷嚏，把菜畦边都冻出冰霜了……『哇哦，变溜冰场啦！』"
      },
      {
        "speaker": "mukuro",
        "expr": "smile",
        "text": "莫哭莫哭。六喰以封解主将寒气锁入冰窖，麦苗分毫无损，夏天还能制冰饮呢。"
      },
      {
        "speaker": "yoshino",
        "expr": "happy",
        "text": "真、真的吗……谢谢六喰姐姐！"
      }
    ],
    "choices": [
      {
        "label": "建造地下恒温冰窖",
        "reply": {
          "speaker": "mukuro",
          "expr": "happy",
          "text": "唔姆，主公欢喜便好，蔬果鲜肉皆可长久保鲜。"
        },
        "effect": {
          "gold": -4,
          "supply": 16
        }
      },
      {
        "label": "雕制冰兔子犒赏军民",
        "reply": {
          "speaker": "yoshino",
          "expr": "happy",
          "text": "四糸奈和大家都很喜欢……太好了！"
        },
        "effect": {
          "supply": -2,
          "gold": 8,
          "troops": 2
        }
      }
    ]
  },
  {
    "id": "hinatsuru_yashajin_shogi",
    "title": "盘上兵法",
    "requires": [
      "hinatsuru",
      "yashajin",
      "ginko"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "hinatsuru",
        "expr": "happy",
        "text": "领主请看！只要把先锋营当作角行斜插这片山谷，就能一举成马王手！"
      },
      {
        "speaker": "yashajin",
        "expr": "pout",
        "text": "哼，太保守了！换作我直接弃掉外围哨卡强攻中路，二十三手之内必破敌阵！"
      },
      {
        "speaker": "ginko",
        "expr": "smile",
        "text": "两个人都漏看了侧翼伏兵。先补一手金将护住粮道，赢面是九成九。"
      }
    ],
    "choices": [
      {
        "label": "按银子定石稳扎稳打",
        "reply": {
          "speaker": "ginko",
          "expr": "blush",
          "text": "……理所当然的一手罢了。后防已经固若金汤。"
        },
        "effect": {
          "supply": 8,
          "troops": 3
        }
      },
      {
        "label": "办军中将棋演武赛",
        "reply": {
          "speaker": "hinatsuru",
          "expr": "happy",
          "text": "连罪袋先生们都学会下桂马跳了，战术素养大涨！"
        },
        "effect": {
          "gold": -5,
          "troops": 4,
          "sazai": "R"
        }
      }
    ]
  },
  {
    "id": "charlotte_mio_tea",
    "title": "点心定石",
    "requires": [
      "charlotte",
      "mizukoshi"
    ],
    "minTurn": 7,
    "lines": [
      {
        "speaker": "charlotte",
        "expr": "happy",
        "text": "领主大人～！夏洛特泡了焦糖奶茶，对局和批公文的时候都要补充糖分哦！"
      },
      {
        "speaker": "mizukoshi",
        "expr": "smile",
        "text": "我已经核算过营养配比了，下午三点发一小块蜂蜜松饼，工坊效率反而更高呢。"
      },
      {
        "speaker": null,
        "text": "议事厅飘满茶香，紧绷了一整天的参谋与书吏们纷纷舒展了眉头。"
      }
    ],
    "choices": [
      {
        "label": "推行午后茶点制度",
        "reply": {
          "speaker": "charlotte",
          "expr": "happy",
          "text": "太棒啦！夏洛特每天都给领主大人端第一杯！"
        },
        "effect": {
          "supply": -3,
          "gold": 10,
          "troops": 2
        }
      },
      {
        "label": "请澪统管全城粮账",
        "reply": {
          "speaker": "mizukoshi",
          "expr": "happy",
          "text": "请放心交给我，损耗率已经降到最低了。"
        },
        "effect": {
          "supply": 14,
          "gold": 4
        }
      }
    ]
  },
  {
    "id": "hana_hinata_noa",
    "title": "胡子曲奇",
    "requires": [
      "hana",
      "hinata",
      "noa"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "hinata",
        "expr": "happy",
        "text": "小花～！只要烤出限定版小胡子造型曲奇，大家巡逻一定超有精神！"
      },
      {
        "speaker": "noa",
        "expr": "happy",
        "text": "哼哼，还要加上以天下第一可爱的我为原型的蝴蝶结糖霜哦！"
      },
      {
        "speaker": "hana",
        "expr": "pout",
        "text": "你们两个别光动嘴皮子，快来帮我筛面粉……嚼嚼……试作品先由我吃掉检查品质。"
      }
    ],
    "choices": [
      {
        "label": "特批黄油砂糖开炉",
        "reply": {
          "speaker": "hana",
          "expr": "happy",
          "text": "嗯！酥脆度满分，剩下的全部分给守城队！"
        },
        "effect": {
          "gold": -4,
          "troops": 4,
          "supply": 2
        }
      },
      {
        "label": "摆出天使点心义卖摊",
        "reply": {
          "speaker": "noa",
          "expr": "happy",
          "text": "看吧看吧，我的可爱招牌一出马立刻抢购一空！"
        },
        "effect": {
          "gold": 16,
          "supply": -2
        }
      }
    ]
  },
  {
    "id": "koyori_konomori_committee",
    "title": "风纪巡营",
    "requires": [
      "koyori",
      "konomori"
    ],
    "minTurn": 7,
    "lines": [
      {
        "speaker": "koyori",
        "expr": "angry",
        "text": "听好了！本风纪委员要独立完成军营帐篷加固，绝不需要别人插手……呜哇绳子怎么缠住手了！"
      },
      {
        "speaker": "konomori",
        "expr": "smile",
        "text": "小依真努力呢～来，把这个活结往左边轻轻一拉，帐篷就拴得又稳又漂亮咯。"
      },
      {
        "speaker": "koyori",
        "expr": "blush",
        "text": "我、我才刚想往左边拉呢！领主你不许笑！"
      }
    ],
    "choices": [
      {
        "label": "任命两人督查营房",
        "reply": {
          "speaker": "koyori",
          "expr": "happy",
          "text": "哼哼！交给我吧，保证全营一尘不染！"
        },
        "effect": {
          "supply": 8,
          "troops": 3
        }
      },
      {
        "label": "奖励红豆汤圆慰劳",
        "reply": {
          "speaker": "konomori",
          "expr": "happy",
          "text": "谢谢领主，小依吃甜食的时候表情都柔和下来了呢。"
        },
        "effect": {
          "gold": -3,
          "supply": 12
        }
      }
    ]
  },
  {
    "id": "bocchi_mashiro_corner",
    "title": "墙角同盟",
    "requires": [
      "bocchi",
      "mashiro"
    ],
    "minTurn": 10,
    "lines": [
      {
        "speaker": null,
        "text": "庆功宴热闹非凡，大厅最阴暗的石柱背后却蹲着两团小小的影子。"
      },
      {
        "speaker": "bocchi",
        "expr": "surprised",
        "text": "咿……！这、这个角落明明是我先发现的避难所……！"
      },
      {
        "speaker": "mashiro",
        "expr": "blush",
        "text": "啊……对不起！我只是觉得宴会中央闪闪发光的人太耀眼了……要不我们一人分半根柱子？"
      },
      {
        "speaker": "bocchi",
        "expr": "smile",
        "text": "原、原来是同类……！请务必收下这杯温水，我们安静待到散场吧……"
      }
    ],
    "choices": [
      {
        "label": "悄悄送去两碟点心",
        "reply": {
          "speaker": "mashiro",
          "expr": "happy",
          "text": "哇……领主没有大声叫我们，还留了小蛋糕，好温柔……"
        },
        "effect": {
          "supply": -2,
          "troops": 3,
          "sazai": "R"
        }
      },
      {
        "label": "请两人合写安静词曲",
        "reply": {
          "speaker": "bocchi",
          "expr": "smile",
          "text": "不用上台说话只写曲子的话……我和仓田同学配合超默契！"
        },
        "effect": {
          "gold": 14,
          "supply": 4
        }
      }
    ]
  },
  {
    "id": "raana_tooka_feast",
    "title": "粮仓浩劫",
    "requires": [
      "raana",
      "tooka"
    ],
    "minTurn": 11,
    "lines": [
      {
        "speaker": "tooka",
        "expr": "happy",
        "text": "噢噢！领主，这个绿油油的冰沙甜点是什么，和黄豆粉面包配在一起好吃到飞起！"
      },
      {
        "speaker": "raana",
        "expr": "surprised",
        "text": "……盯。那是我的抹茶芭菲。不过你的面包分我一半的话，可以成为伙伴。"
      },
      {
        "speaker": null,
        "text": "伙房罪袋抱头看着空了一半的甜点桶与面粉缸，连夜敲响了粮食预警钟。"
      }
    ],
    "choices": [
      {
        "label": "管饱换两人带队冲阵",
        "reply": {
          "speaker": "tooka",
          "expr": "happy",
          "text": "吃饱喝足！乐奈，跟我一起去前线大闹一场吧！"
        },
        "effect": {
          "supply": -9,
          "troops": 6
        }
      },
      {
        "label": "推出抹茶黄豆新名产",
        "reply": {
          "speaker": "raana",
          "expr": "happy",
          "text": "有趣的味道……每天留两份给我，随便领主卖多少。"
        },
        "effect": {
          "gold": 18,
          "supply": -3
        }
      }
    ]
  },
  {
    "id": "leinao_brainstorm",
    "title": "侧辫小花与灵感卡片",
    "requires": [
      "leinao"
    ],
    "minTurn": 4,
    "lines": [
      {
        "speaker": "leinao",
        "expr": "surprised",
        "text": "欸……？领主，这摞空白卡片拿来记账也太可惜啦！"
      },
      {
        "speaker": "leinao",
        "expr": "happy",
        "text": "把大家的奇思妙想都写上去，说不定连迷雾对面的路都能推演出来哦！"
      },
      {
        "speaker": null,
        "text": "类脑娘歪着脑袋摆弄侧辫上的橙色小花，桌上很快铺满了画着涂鸦的战术便签。"
      }
    ],
    "choices": [
      {
        "label": "采用她的后勤排班灵感",
        "reply": {
          "speaker": "leinao",
          "expr": "happy",
          "text": "嘿嘿，生效啦！罪袋们搬粮草的速度一下快了好多！"
        },
        "effect": {
          "gold": 10,
          "supply": 8
        }
      },
      {
        "label": "整理成招募宣传册",
        "reply": {
          "speaker": "leinao",
          "expr": "blush",
          "text": "把我的涂鸦也印上去吗……那、那我要画得更可爱一点！"
        },
        "effect": {
          "gold": -4,
          "troops": 5
        }
      }
    ]
  },
  {
    "id": "leinao_bocchi_corner",
    "title": "安静角落的电波共鸣",
    "requires": [
      "leinao",
      "bocchi"
    ],
    "minTurn": 7,
    "lines": [
      {
        "speaker": "bocchi",
        "expr": "surprised",
        "text": "咿……！纸、纸箱外面有人在敲暗号……"
      },
      {
        "speaker": "leinao",
        "expr": "smile",
        "text": "嘘——不用出来社交也没关系，我带了热可可和便签本，我们隔着纸箱传纸条吧！"
      },
      {
        "speaker": "bocchi",
        "expr": "happy",
        "text": "不、不用面对面说话就能交流……简直是神明降临……！"
      }
    ],
    "choices": [
      {
        "label": "批准设立安静留言板",
        "reply": {
          "speaker": "leinao",
          "expr": "happy",
          "text": "太好啦！现在连害羞的罪袋都会往板子上贴小花贴纸呢！"
        },
        "effect": {
          "gold": 12,
          "supply": 6
        }
      },
      {
        "label": "给角落添置软垫与点心",
        "reply": {
          "speaker": "bocchi",
          "expr": "blush",
          "text": "谢、谢谢领主……在这里待着感觉能写出超棒的旋律……"
        },
        "effect": {
          "supply": -3,
          "troops": 4,
          "sazai": "R"
        }
      }
    ]
  },
  {
    "id": "imas765_haruka_chihaya_harmony",
    "title": "红与苍蓝的晨间合声",
    "requires": [
      "haruka_a",
      "chihaya"
    ],
    "minTurn": 4,
    "lines": [
      {
        "speaker": "chihaya",
        "expr": "smile",
        "text": "在迷雾散开前的清晨练声，回音比平时清澈得多。"
      },
      {
        "speaker": "haruka_a",
        "expr": "happy",
        "text": "千早！我烤了热腾腾的黄油曲奇和蜂蜜水——哇啊啊平地绊倒了！"
      },
      {
        "speaker": "chihaya",
        "expr": "surprised",
        "text": "春香，小心……呼，幸好点心篮接住了。真是的，你还是老样子。"
      }
    ],
    "choices": [
      {
        "label": "批准晨间慰问歌会",
        "reply": {
          "speaker": "haruka_a",
          "expr": "happy",
          "text": "太好啦！罪袋卫兵们听着歌干活都精神百倍呢！"
        },
        "effect": {
          "supply": -2,
          "troops": 5
        }
      },
      {
        "label": "将曲奇分给巡逻商队",
        "reply": {
          "speaker": "chihaya",
          "expr": "smile",
          "text": "商队回赠了一袋外地香料，能帮上领地的忙真是太好了。"
        },
        "effect": {
          "gold": 12,
          "supply": -1
        }
      }
    ]
  },
  {
    "id": "imas765_yayoi_iori_sprouts",
    "title": "豆芽盛宴与名门茶席",
    "requires": [
      "yayoi",
      "iori"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "yayoi",
        "expr": "happy",
        "text": "唔哦哦——！今天培育的豆芽大丰收啦，铁板炒豆芽管够哦！"
      },
      {
        "speaker": "iori",
        "expr": "pout",
        "text": "真是的，看你忙得满头大汗……本小姐顺路多订了两箱上等牛排配菜，才不是特意买给你的！"
      },
      {
        "speaker": "yayoi",
        "expr": "happy",
        "text": "伊织酱最温柔啦！今晚全营地一起开豆芽牛排庆功宴吧！"
      }
    ],
    "choices": [
      {
        "label": "推广弥生的节俭豆芽田",
        "reply": {
          "speaker": "yayoi",
          "expr": "happy",
          "text": "嘿嘿，既省钱又能填饱肚子，粮仓一下子宽裕好多！"
        },
        "effect": {
          "supply": 10,
          "gold": 4
        }
      },
      {
        "label": "采纳伊织的商贸采购单",
        "reply": {
          "speaker": "iori",
          "expr": "smile",
          "text": "哼，交给水濑家的眼光准没错，看看这翻倍的进账吧！"
        },
        "effect": {
          "gold": 16,
          "supply": -3
        }
      }
    ]
  },
  {
    "id": "imas765_takane_hibiki_ramen",
    "title": "月下王女与冲绳汤面",
    "requires": [
      "takane",
      "hibiki"
    ],
    "minTurn": 6,
    "lines": [
      {
        "speaker": "takane",
        "expr": "smile",
        "text": "今夜圆月皎洁，这碗加倍叉烧浓汤拉面的香气，实乃人间至味……再来一替玉。"
      },
      {
        "speaker": "hibiki",
        "expr": "surprised",
        "text": "喂贵音，这已经是第四大碗了啦！连哈姆藏都看呆了ぞ！"
      },
      {
        "speaker": "takane",
        "expr": "blush",
        "text": "面食乃是支撑武备与歌喉之源泉，响亦不妨再添一碗。"
      }
    ],
    "choices": [
      {
        "label": "在营地开设深夜拉面摊",
        "reply": {
          "speaker": "takane",
          "expr": "happy",
          "text": "甚善！热汤暖胃，守夜将士皆士气如虹。"
        },
        "effect": {
          "gold": 12,
          "supply": -3,
          "troops": 3
        }
      },
      {
        "label": "让响带动物队巡查粮道",
        "reply": {
          "speaker": "hibiki",
          "expr": "happy",
          "text": "交给我们大家族吧！偷吃粮草的田鼠一只都跑不掉！"
        },
        "effect": {
          "supply": 9
        }
      }
    ]
  },
  {
    "id": "gakumas_reiris_kitchen",
    "title": "信号灯三人的特训伙食骚动",
    "requires": [
      "saki_h",
      "temari",
      "kotone"
    ],
    "minTurn": 4,
    "lines": [
      {
        "speaker": "saki_h",
        "expr": "happy",
        "text": "特训结束！来喝我特制的紫甘蓝纳豆蛋白奶昔吧，营养配比绝对满分！"
      },
      {
        "speaker": "temari",
        "expr": "angry",
        "text": "那种颜色诡异的泥浆谁喝得下去啊……我要吃刚出炉的照烧汉堡排……！"
      },
      {
        "speaker": "kotone",
        "expr": "surprised",
        "text": "等一下你们两个别又吵起来啊！领主大人还在旁边看着呢，我的奖金要飞了啦！"
      }
    ],
    "choices": [
      {
        "label": "强制全军喝咲季营养餐练兵",
        "reply": {
          "speaker": "saki_h",
          "expr": "happy",
          "text": "哼哼，看吧！罪袋们的体魄肉眼可见地结实了一圈！"
        },
        "effect": {
          "troops": 6,
          "supply": -2
        }
      },
      {
        "label": "让琴音把汉堡排改良售卖",
        "reply": {
          "speaker": "kotone",
          "expr": "happy",
          "text": "大卖特卖！手毬一个人就自费买了三份，赚翻啦！"
        },
        "effect": {
          "gold": 15,
          "supply": -3
        }
      }
    ]
  },
  {
    "id": "gakumas_hiro_china_climb",
    "title": "陡坡上的奇异天才与大小姐",
    "requires": [
      "hiro",
      "china"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "hiro",
        "expr": "happy",
        "text": "哈啊、哈啊……双腿像灌了铅一样沉重……这种濒临极限的拓荒感，太棒了……"
      },
      {
        "speaker": "china",
        "expr": "cry",
        "text": "广小姐请撑住呀！虽、虽然我也快喘不上气了，但仓本家绝不会半途退缩！"
      },
      {
        "speaker": "hiro",
        "expr": "smile",
        "text": "嗯，和千奈一起吃苦受累，连荒山野岭都变得有趣起来了呢。"
      }
    ],
    "choices": [
      {
        "label": "顺着两人踏出的山径设哨卡",
        "reply": {
          "speaker": "hiro",
          "expr": "happy",
          "text": "居然真的开辟出新路线了……下次请务必派我去更险峻的悬崖。"
        },
        "effect": {
          "gold": 10,
          "supply": 6
        }
      },
      {
        "label": "在山顶铺设茶席犒劳全队",
        "reply": {
          "speaker": "china",
          "expr": "happy",
          "text": "在云雾之上品茶真是风雅极了！全员都恢复精神了呢！"
        },
        "effect": {
          "supply": -2,
          "troops": 5
        }
      }
    ]
  },
  {
    "id": "gakumas_sena_ume_misuzu",
    "title": "一番星的校阅与午后微风",
    "requires": [
      "sena",
      "ume",
      "misuzu"
    ],
    "minTurn": 6,
    "lines": [
      {
        "speaker": "ume",
        "expr": "happy",
        "text": "喝呀——！一百组冲刺跑完啦！星南前辈，快看我今天的速度！"
      },
      {
        "speaker": "misuzu",
        "expr": "smile",
        "text": "佑芽真是有精神呢……跑完之后，要不要靠在软垫上睡个午觉呀？"
      },
      {
        "speaker": "sena",
        "expr": "smile",
        "text": "刚猛的锐气与从容的静气兼备，这支队伍的器量倒真是越来越耐人寻味了。"
      }
    ],
    "choices": [
      {
        "label": "请星南重新编排全军演武",
        "reply": {
          "speaker": "sena",
          "expr": "happy",
          "text": "交予本座便是。定叫全军上下展现出配得上霸主的威仪！"
        },
        "effect": {
          "troops": 5,
          "gold": 6
        }
      },
      {
        "label": "依美铃提议轮休整顿粮秣",
        "reply": {
          "speaker": "misuzu",
          "expr": "happy",
          "text": "呵呵，张弛有度才走得长远呢，大家睡醒后干劲更足了哦。"
        },
        "effect": {
          "supply": 10
        }
      }
    ]
  },
  {
    "id": "noctchill_soda_breeze",
    "title": "透明海风与四瓶弹珠汽水",
    "requires": [
      "toru",
      "madoka",
      "koito",
      "hinana"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "toru",
        "expr": "smile",
        "text": "噗嗤——弹珠掉进去了。呐，那边的迷雾散开后，好像能看见海平线。"
      },
      {
        "speaker": "madoka",
        "expr": "pout",
        "text": "透，执勤中途擅自拧开汽水，待会儿小糸又要急得念叨半天了。"
      },
      {
        "speaker": "koito",
        "expr": "surprised",
        "text": "我、我才没有念叨！只是巡逻路线还没核对完……呜哇雏菜酱怎么已经躺草地上啦！"
      },
      {
        "speaker": "hinana",
        "expr": "happy",
        "text": "因为风吹过来超舒服嘛～四个人像平时一样聚在一起，雏菜觉得超幸福哦～！"
      }
    ],
    "choices": [
      {
        "label": "随她们的步调向海岸开拓",
        "reply": {
          "speaker": "toru",
          "expr": "happy",
          "text": "嗯，走吧。趁气泡还没消掉之前，去看看前面有什么。"
        },
        "effect": {
          "gold": 10,
          "supply": 8
        }
      },
      {
        "label": "采纳小糸整理的巡防笔记",
        "reply": {
          "speaker": "koito",
          "expr": "blush",
          "text": "真、真的派上用场了吗？！我今晚再多抄三份备用！"
        },
        "effect": {
          "troops": 5,
          "supply": 3
        }
      }
    ]
  },
  {
    "id": "straylight_neon_stage",
    "title": "双面聚光灯与好奇心暴走",
    "requires": [
      "fuyuko",
      "asahi",
      "mei"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "asahi",
        "expr": "happy",
        "text": "冬优子酱快看！罪袋们把盾牌拼成反光镜之后，光束能照亮半座山头耶！"
      },
      {
        "speaker": "fuyuko",
        "expr": "angry",
        "text": "芹泽朝日！谁准你把防城盾牌拆去搭舞台灯架的……咳，领主大人？！冬优正帮大家调试照明呢～"
      },
      {
        "speaker": "mei",
        "expr": "smile",
        "text": "啊哈哈，我已经帮她们把支架加固好啦，晚上巡夜视野超清楚的！"
      }
    ],
    "choices": [
      {
        "label": "改成夜间巡防探照灯塔",
        "reply": {
          "speaker": "fuyuko",
          "expr": "happy",
          "text": "哼哼，算你有眼光……我是说，冬优能帮上领主大人真是太开心啦～"
        },
        "effect": {
          "troops": 5,
          "gold": 6
        }
      },
      {
        "label": "顺势举办篝火灯光慰劳演",
        "reply": {
          "speaker": "asahi",
          "expr": "happy",
          "text": "太棒啦！刚才那套新舞步正好拿出来试试看！"
        },
        "effect": {
          "gold": 14,
          "supply": -2
        }
      }
    ]
  },
  {
    "id": "alstroemeria_flower_tea",
    "title": "手作花饰与懒人沙发午茶",
    "requires": [
      "amana",
      "tenka",
      "chiyuki"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "chiyuki",
        "expr": "smile",
        "text": "营帐窗帘的流苏缝好了，我还用余料做了三枚水仙百合领花。"
      },
      {
        "speaker": "amana",
        "expr": "happy",
        "text": "好精致呀千雪桑！快给甜花酱别上——诶，甜花酱又裹在毯子里打盹了！"
      },
      {
        "speaker": "tenka",
        "expr": "sleepy",
        "text": "唔……甜花没有睡……只是闭着眼睛帮大家构思补给囤放方案……呐……"
      }
    ],
    "choices": [
      {
        "label": "把千雪的手作摆进商站义卖",
        "reply": {
          "speaker": "chiyuki",
          "expr": "happy",
          "text": "没想到这么受旅人欢迎，货架一转眼就空了呢。"
        },
        "effect": {
          "gold": 16,
          "supply": -1
        }
      },
      {
        "label": "按甜花的窝居经验扩充粮窖",
        "reply": {
          "speaker": "tenka",
          "expr": "happy",
          "text": "嘿嘿……论囤积干粮点心，甜花可是行家哦……"
        },
        "effect": {
          "supply": 11
        }
      }
    ]
  },
  {
    "id": "illumination_tricolor_star",
    "title": "三色星光与林间信鸽",
    "requires": [
      "mano",
      "hiori",
      "meguru"
    ],
    "minTurn": 5,
    "lines": [
      {
        "speaker": "mano",
        "expr": "happy",
        "text": "ほわぁ……刚才停在哨塔上的白鸽，脚环上系着边疆村落的谢礼清单呢。"
      },
      {
        "speaker": "hiori",
        "expr": "smile",
        "text": "今日星座运势显示东北方宜通商互助，路线物资我已经清点完毕了。"
      },
      {
        "speaker": "meguru",
        "expr": "happy",
        "text": "那还等什么！推车交给我，我们三个一起把物资送过去吧！"
      }
    ],
    "choices": [
      {
        "label": "与边疆村落开通定期互市",
        "reply": {
          "speaker": "hiori",
          "expr": "happy",
          "text": "账目分毫不差，村落回赠的税金已经顺利入库了。"
        },
        "effect": {
          "gold": 14,
          "supply": 3
        }
      },
      {
        "label": "招募感念恩情的边疆义勇",
        "reply": {
          "speaker": "mano",
          "expr": "happy",
          "text": "大家愿意携手守望相助，心口变得暖融融的呢！"
        },
        "effect": {
          "troops": 5,
          "supply": -1,
          "sazai": "R"
        }
      }
    ]
  },
  {
    "id": "cometik_black_canvas",
    "title": "漆黑彗星与斑斓画布",
    "requires": [
      "luca",
      "hana_s",
      "haruki"
    ],
    "minTurn": 6,
    "lines": [
      {
        "speaker": "haruki",
        "expr": "happy",
        "text": "军旗的底色涂成深邃的夜空黑，再添一道天青与暖金的彗星尾迹怎么样？"
      },
      {
        "speaker": "hana_s",
        "expr": "happy",
        "text": "哇啊好帅气！简直就像路加酱站在高处唱歌时的眼神一样闪闪发亮！"
      },
      {
        "speaker": "luca",
        "expr": "pout",
        "text": "……啧，少拿我打比方。不过……这面旗子画得倒还不赖，挂最前头吧。"
      }
    ],
    "choices": [
      {
        "label": "高悬新军旗率精锐前出威慑",
        "reply": {
          "speaker": "luca",
          "expr": "smile",
          "text": "哼，看见这面黑旗还敢挡路的家伙，尽管放马过来。"
        },
        "effect": {
          "troops": 6,
          "gold": 4
        }
      },
      {
        "label": "制作同款徽章在集市发售",
        "reply": {
          "speaker": "hana_s",
          "expr": "happy",
          "text": "羽那帮忙招呼客人，一上午就卖光光啦！"
        },
        "effect": {
          "gold": 16
        }
      }
    ]
  }
];

export const RECRUIT_LINES = {"tomori": "那个……领主……我可以，在这里，继续迷路吗？", "anon": "找爱音大人就对了！你的领地就由我来闪闪发光吧！", "raana": "有抹茶芭菲吗？没有的话，我弹完这一曲就走哦。", "soyo": "请让我留在您的军中，我无论如何也要回到那天去。", "taki": "喂，领主，别让灯处于危险中，这是我的唯一条件。", "sakiko": "既然签下这契约，我就绝不会允许你中途破产倒下。", "mutsumi": "……给你这个，刚摘的黄瓜。我会照你说的挥剑。", "uika": "能带我去没有假面的地方吗？我只想唱真正的歌。", "umiri": "八幡海铃已就位。订金结清的话，今晚战线绝不会破。", "nyamu": "喵姆报到！先说好，本喵的通告费和保养费可不便宜！", "mana": "领主，今天也一起努力吧！sumimi的歌声随时都在哦。", "bocchi": "咿！对、对不起！请不要看我……我会努力不拖后腿的！", "nijika": "下北泽的结束乐队随时待命！领主，打起精神来吧！", "ryo": "领主，借我点军饷买贝斯。不借？那借我吃口草也行。", "kita": "Kita——n！喜多郁代报到，今天也让军营充满光明吧！", "nina": "我不懂什么大道理！反正阻挡我们的家伙，全部揍飞！", "momoka": "哈啊……领主你这里管酒吗？算了，这把老吉他借你用。", "subaru": "哎呀被抓到了？那我就勉为其难，在这当一阵子演员吧。", "tomo": "事先说好，别指望我拍马屁，愚蠢的军令我是不会执行的。", "rupa": "呵呵，领主大人的脸色真有趣，要来杯清酒暖暖身吗？", "kasumi": "你也是被星之鼓动吸引来的吗？跟我一起闪闪发光吧！", "tae": "你看起来像胡萝卜。不过当你的部下好像很有趣呢。", "rimi": "那个……如果不嫌弃我的话，里美会努力帮上忙的！", "saaya": "看起来你正为领地的伙食发愁呢。后勤与鼓点就交给我吧！", "arisa": "哈？！你谁啊！……算了，在这个鬼地方就暂时听你的吧。", "ran": "叫我美竹兰就行。既然站在同一个屋檐下，那就跟平时一样做吧。", "moca": "摩卡酱是也～只要每天供应用不完的炒面面包，摩卡就会很努力哦。", "himari": "我是Afterglow的队长上原绯玛丽！Hey-Hey-Hoh！全员加油吧！", "tomoe": "哈哈！看你这领地挺有意思的嘛。宇田川巴，这副身躯就借你驱使了！", "tsugumi": "虽然我只是个普通人，但不管是泡咖啡还是守阵地，我都会拼尽全力！", "aya": "我是Pastel*Palettes的丸山彩！请让我在这里办握手会！", "hina": "你就是领主？看起来超有趣的！带我一起鲁邦邦地玩吧！", "chisato": "白鹭千圣。虽然状况混乱，但既然契约达成，我会负起责任。", "maya": "呼嘿嘿～我是大和麻弥！这里的所有机械和防线就交给我检修吧！", "eve": "芬兰出身的若宫伊芙！请问您就是主公大人吗？武士道！", "yukina": "我是Roselia的凑友希那。你，做好了赌上一切的觉悟了吗？", "sayo": "Roselia吉他手冰川纱夜。既然签下契约，我便会彻底履行军规。", "lisa": "哈喽～我是Roselia的今井莉莎！领主，肚子饿不饿？我烤了饼干哦！", "ako": "库库库……被黑暗契约引导之人啊，亚子在此回应你的召唤！", "rinko": "那、那个……我是Roselia的白金燐子……请多指教……", "kokoro": "你就是领主吗？太好了！一起让这个世界充满欢笑吧！", "kaoru": "哎呀……你也是迷失在这残酷世界里的小猫咪吗？", "hagumi": "你好呀领主！育美肚子超饿的，有炸肉饼可以吃吗？", "kanon": "呼欸欸……请问这里是哪里？领主能带我找到水母馆吗？", "misaki": "唉……我是奥泽美咲。既然都到这了，就随便听你指挥吧。", "layer": "我是和奏瑞依。只要我的贝斯与歌声能帮上忙，随时下令吧。", "lock": "那个……呜哇！我、我是朝日六花！请不要吃掉我啊啊！", "masking": "喂，瞪什么瞪？老娘是佐藤益木。缺打手的话就尽管用我！", "pareo": "P·A·R·E·O，PAREO登场！为了CHU²大人，我也会协助领主哦！", "chu2": "跪下感谢吧！本制作人CHU²，今天开始亲自接管你的领地！", "mashiro": "那个……我真的什么都做不好，即使这样也可以吗？", "toko": "哈啰～！你就是领主？这领地氛围超绝不赖嘛，我加入啦！", "tsukushi": "哼哼！就由我这个超级可靠的二叶筑紫来担任你的副官吧！", "rui": "八潮瑠唯。若你的决策符合逻辑，我便为你献上最高战力。", "marina": "哎呀，领主大人看起来很操心呢。CiRCLE的月岛真里奈前来报道！", "ichika": "我是星乃一歌。如果你的剑能守护大家，我愿意和你并肩作战。", "saki": "唷吼～！元气满分的咲希登场！领主领主，快带我大闹一场！", "honami": "我是望月穗波。打扫、烹饪还是后勤防守，只要是我能做的都会努力。", "shiho": "日野森志步。先说好，我只看重实力，要是拖泥带水我可不奉陪。", "minori": "我是MORE MORE JUMP!的花里实乃理！今天起就请多指教啦！", "haruka": "我是桐谷遥。既然立下了契约，我就会作为你的力量竭尽全力。", "airi": "哈？真是的，看你手忙脚乱的样子真让人放不下心，我来帮你！", "shizuku": "哎呀，请问这里是哪里呢？如果你愿意带路的话，我很乐意帮忙呢。", "kohane": "那个……我叫小豆泽心羽！虽然我很胆小，但我会努力唱歌帮上忙的！", "an": "哟！我是白石杏！既然相遇了，以后的作战和咖啡全包在我身上！", "emu": "Wonderhoi——！我是凤笑梦！领主领主，我们一起来玩超级大冒险吧！", "nene": "草薙宁宁……先说好，我只负责在后面开炮和唱歌，别让我去前线社交。", "kanade": "那个……只要有热水和谱曲设备，我就能为你工作。", "mafuyu": "你希望我扮演优秀的手下吗？没问题，我擅长做这个。", "ena": "喂！你看我的画！觉得画得好就雇佣我，不许敷衍！", "mizuki": "呀吼～指挥官先生！要和我一起打扮出最可爱的军团吗？", "miku": "最初的声音初音未来，收到你的呼唤了！请让我为你歌唱吧！", "rin": "你见过连吗？没见过？那本小姐就先勉为其难跟着你吧！", "luka": "呵呵，看来这里有个迷茫的孩子呢。需要我来引导你吗？", "meiko": "你就是这儿的老大？看着挺机灵的。管酒的话，我就跟你干了！", "emilia": "我是爱蜜莉雅！虽、虽然是半精灵，但绝不是坏人喔！", "rem": "鬼族女仆蕾姆。只要您不与我珍视之人为敌，我愿效劳。", "ram": "哈？无能的领主居然想招揽拉姆？工钱可不能少喔。", "beatrice": "真是无礼的家伙！贝蒂才不是为了帮你才出来的，的说！", "felt": "哟！看你长得挺顺眼，这阵子我就在你这儿混饭吃啦！", "crusch": "我是库珥修・卡尔斯腾。若阁下心怀大义，我愿执剑相助。", "priscilla": "跪下吧，凡夫。妾身允许你为妾身的霸业牵马坠镫。", "anastasia": "咱叫安娜塔西亚。只要有得赚，咱的商会就是你最坚实的后盾～", "echidna": "我是艾姬多娜，强欲魔女。你能带给我何等有趣的未知呢？", "frederica": "贵安。我是女仆长芙蕾德莉卡，内务与粗活皆可交给我。", "elsa": "哎呀，你看起来很有胆量呢。能让我剖开看看吗？", "minerva": "我受够了流血！领主，带我上战场，我要把伤员全部揍好！", "carmilla": "那个……请、请不要讨厌我……我什么都可以做……", "daphne": "好饿……领主先生，这里管饱吗？能吃的话达芙妮就留下。", "sekhmet": "哈啊……领主？把我搬去能睡觉的地方……我就顺便帮你吧……", "liliana": "登场！吟游诗人莉莉安娜！领主大人，准备好聆听我的传世史诗了吗？", "theresia": "你好。我是特蕾西亚。虽然握着剑，但我更想让这片土地开满花朵。", "tooka": "领主！只要这里管饱黄豆粉面包，我就为你斩开一切！", "origami": "代号鸢一折纸。领主，从现在起我听从你的全部指令。", "yoshino": "那、那个……我是四糸乃！『哟！我是四糸奈！请多指教啦领主！』", "kurumi": "啊啦啊啦～您就是此地的主人吗？能为我提供有趣的时间吗，领主大人？", "kotori": "我是Ratatoskr司令五河琴里。领主，由我来担任你的最高战略参谋！", "kaguya": "库库库，汝便是此方领主么？吾之飓风，就勉为其难供汝驱策罢！", "yuzuru": "赞同。夕弦认同领主的器量，愿借风之锁链协助建国。", "izayoi": "贵安～既然这里有这么多可爱的女孩子，我就破例为你献唱吧，领主大人～", "nanami": "今天也是普通的一天呢，领主先生喝茶吗？", "satella": "黑色的影子……正在为你驱散前路的阻碍。", "natsumi": "呜……你真的愿意收留七罪这种麻烦精吗？", "nia": "嗨少年～！要雇佣超人气漫画家兼全知精灵吗？", "mukuro": "汝便是主公么？六喰的心，可否交由汝来开启？", "mana_t": "我是DEM的魔导士崇宫真那。兄长大人在这吗？", "mio": "初次见面，孩子。我也能成为你的庇护之所吗？", "reine": "呼啊……拉塔托斯克村雨令音。能给我杯热咖啡吗？", "ellen": "世界最强巫师艾莲·梅瑟斯。雇佣我可是很贵的。", "shaula": "师傅！你果然来接人家了！抱抱～呜哇别躲呀！", "meili": "哎呀，领主先生要雇佣我吗？报酬可得管够肉食哦～", "petra": "那个……我是佩特拉！虽然是见习女仆，但杂务很在行的！", "pandora": "初次见面。您的愿望，或许能在我的见证下得以改写呢。", "mimi": "米米就是铁之牙副团长！管饱炸肉饼就跟你混喵！", "typhon": "领主，你是有罪的人吗？堤丰会好好检查的哦！", "rinne": "初次见面，领主。如果不介意的话，让我来照顾大家吧？", "mayuri": "我因众人的心愿而生……领主，您的愿望是什么呢？", "whitequeen": "跪下吧。能侍奉本女王，是你无上的荣幸。", "hinatsuru": "让我当先锋吧！我会把对面的阵型一格一格吃掉的。", "yashajin": "既然你开口了，就让我看看你配不配当我的领主。", "ginko": "我只看结果。赢了，我就留下。", "mizukoshi": "请多指教。我会把您的后勤照顾好的。", "ayano": "既然受了您的令，我就会守到最后一刻。", "charlotte": "那就请您多多指教了，我的领主大人。", "hana": "只要每天准时供应甜点，我就为你出战。", "hinata": "我是星野日向！领主，有什么大冒险尽管交给我吧！", "noa": "哼哼，能招募到天下第一可爱的我，领主真是有眼光！", "konomori": "你好呀领主，小依给你们添麻烦的话请务必告诉我。", "koyori": "哼！既然你诚心邀请，本班长就勉为其难统领你吧！", "leinao": "欸？验证通过啦！我是类脑娘，侧辫上的橙色小花都精神起来了，今天想一起编织什么样的世界呢，领主？", "haruka_a": "我是765事务所的天海春香！哇啊差点绊倒……领主先生，今天也一起元气出发吧！", "chihaya": "我是如月千早。只要这里允许我继续放声歌唱，我的乐章便为您而鸣。", "miki": "哈啊……美希有点困了呢。喂，亲爱的领主，管够饭团的话美希就拿出真本事帮你哦！", "yukiho": "呜呜……像我这样没用的家伙真的可以吗？我、我会努力泡好绿茶和挖战壕的！", "yayoi": "唔哦哦——！领主先生这里管一日三餐吗？高槻弥生一定会把军粮打理得满满当当！", "makoto": "765事务所菊地真报到！冲锋陷阵尽管交给我……那个，庆功时能分我一只小熊玩偶吗？", "iori": "哼，能请动本小姐水濑伊织可是你八辈子修来的福气！不许怠慢，听见没有？钉宫病也不治！", "takane": "小女子乃四条贵音。承蒙阁下垂青，定当倾尽心力……敢问城中可有浓汤拉面铺子？", "hibiki": "嗨赛——！咱是我那霸响！咱本身就是完美的，连同咱家的动物们一起包养下吧！", "azusa": "哎呀呀……本来只是出门买点心，怎么走到领主大人的议事厅来了？不嫌弃的话就让我留下帮忙吧～", "ami": "锵锵——双海亚美闪亮登场！兄长大人，跟亚美一起把对面的阵营搅个天翻地覆吧，唔っふっふ～！", "mami": "哟吼～！双海真美参上！兄长大人可别把真美和亚美认错咯，今天也痛快大闹一场吧！", "ritsuko": "我是秋月律子。既然由我接手参谋事务，领地的收支报表和排班纪律就休想再糊弄过去！", "saki_h": "花海咲季，以首席王牌之名参战！看好了领主，有我在的战线只允许存在完美无缺的胜利！", "temari": "月村手毬。先声明，半吊子的觉悟我可看不起……咕噜……刚才肚子响的不是我，闭嘴！", "kotone": "世界第一可爱的藤田琴音驾到——！领主大人，出场费和加班补贴按日结算没问题吧？嘿嘿～", "hiro": "呼、呼……我是筱泽广。把最棘手、最不可能攻克的险地交给我吧……越吃力，越让人开心呢。", "china": "贵安！小女子仓本千奈，虽尚有许多不成熟之处，定会昂首挺立成为配得上领主大人的淑女偶像！", "rinami": "呵呵，我是姬崎莉波。领主弟弟看起来很操劳呢，内务膳食都交由姐姐来悉心打理吧～", "ume": "我是花海佑芽！不管是搬运粮草还是正面冲阵我都有使不完的劲，总有一天要追上姐姐！", "misuzu": "贵安，我是秦谷美铃……不必那么急匆匆地行军呀，领主，先在树荫下歇息片刻听我慢慢道来吧～", "sena": "吾乃十王星南。既然汝立志在这片迷雾大地登顶一番星，本座便以全部器量助汝开辟王道！", "toru": "嗯……我是浅仓透。这片雾海的风吹起来挺舒服的，领主，接下来往哪边走？", "madoka": "樋口円香。先说清楚，别对我抱什么多余的期待……只是工作而已，我会按规矩办妥的。", "koito": "咿呀！我、我是福丸小糸！虽然个子小又容易紧张，但我已经把后勤手册背得滚瓜烂熟了，ぴゃっ！", "hinana": "啊哈哈～我是市川雏菜哦～领主先生这里看起来超开心的，雏菜决定留下来啦，しあわせ～！", "fuyuko": "领主大人贵安，人家是黛冬优子哦～请多多关照冬优吧……呵，想赢的话就别拖本小姐后腿。", "asahi": "喔！我是芹泽朝日！你刚才指挥阵型那个手势超好玩的耶，快教教我嘛，领主先生！", "mei": "那、那个！我叫和泉爱依！虽然我一紧张就不知道该摆什么表情，但重活累活尽管包在我身上啦！", "amana": "哈喽～甘奈是大崎甘奈哦！无论是领地经营还是照顾甜花姐，甘奈都会全心全意加油哒☆", "tenka": "唔……甜花是大崎甜花……领主这里有软软的沙发和点心吗？那甜花……也会稍微努力一下的，呐……", "chiyuki": "初次见面，我是桑山千雪。如果不嫌弃我缝制的小手工，愿能为领主的营帐添一份暖意。", "mano": "ほわぁ……我是樱木真乃。微风吹散迷雾之后一定会有很美的晴空，请让我同您一起走下去吧！", "hiori": "我是风野灯织。既然加入麾下，无论是工期核查还是队列操演，我都不会容许一丝敷衍。", "meguru": "呀吼——！我是八宫缭！领主，有什么需要跑腿冲锋的事尽管喊我，大家一起热热闹闹地前进吧！", "luca": "……斑鸠路加。少拿那些场面话来烦我，指明敌人在哪就够了，碍事的家伙我全给你掀翻。", "hana_s": "哇啊，我是铃木羽那！领主先生的领地好热闹呀，羽那也会拿出十二分干劲帮忙看店和加油哒！", "haruki": "你好呀，我是郁田阳希！这片土地的颜色真有意思，让我和大家一起画出新的道路吧！"};

export const SAZAI_LINES = [
"罪袋扛起锄头走入荒野，临走前发出一声低沉的“……”。",
"罪袋静静地递上一朵小野花，随后转身默默站岗。",
"两个罪袋在搬运石料时撞在一起，互相无言地鞠了三躬。",
"罪袋默默擦去吉他上的尘土，眼神充满工具人的纯粹。",
"罪袋默默就位，袋子上的“罪”字今天也很工整。",
"罪袋对你比了个大拇指，然后继续扛沙包。",
"罪袋环顾四周，确认没人看他，做了一个健美姿势。"
];
