// 训练主体配置，顺序决定日历下方标记的先后顺序
const PARTS = [
  {
    key: 'chest',
    label: '胸',
    mark: 'X',
    items: [
      { key: 'whole', label: '胸整体' },
      { key: 'upper', label: '上胸' },
      { key: 'lower', label: '下胸' },
      { key: 'fly', label: '夹胸' }
    ]
  },
  {
    key: 'shoulder',
    label: '肩',
    mark: 'J',
    items: [
      { key: 'press', label: '推' },
      { key: 'mid', label: '中束' },
      { key: 'rear', label: '后束' },
      { key: 'facePull', label: '面拉' }
    ]
  },
  {
    key: 'back',
    label: '背',
    mark: 'B',
    items: [
      { key: 'pullDown', label: '引体/下拉' },
      { key: 'horizontalRow', label: '水平划' },
      { key: 'highRow', label: '高位划' },
      { key: 'wideRow', label: '开肘划' },
      { key: 'straightArm', label: '直臂下压' },
      { key: 'facePull', label: '面拉' }
    ]
  },
  {
    key: 'leg',
    label: '腿',
    mark: 'T',
    items: [
      { key: 'whole', label: '腿整体' },
      { key: 'quads', label: '股四' },
      { key: 'hamstrings', label: '腘绳肌' },
      { key: 'adductors', label: '内收肌' }
    ]
  },
  {
    key: 'arm',
    label: '手臂',
    mark: 'S',
    items: [
      { key: 'triceps', label: '三头' },
      { key: 'biceps', label: '二头' }
    ]
  },
  {
    key: 'core',
    label: '核心',
    mark: 'H',
    bold: true,
    items: [
      { key: 'upperAbs', label: '上腹' },
      { key: 'lowerAbs', label: '下腹' },
      { key: 'erector', label: '竖脊肌' },
      { key: 'oblique', label: '侧腹/腰方肌' }
    ]
  },
  {
    key: 'rehab',
    label: '康复',
    mark: 'K',
    bold: true,
    groups: [
      {
        group: '肩',
        items: [
          { key: 'shoulder_rot', label: '弹力带/木棍饶头' },
          { key: 'ytw', label: '弹力带YTW/旋肩' }
        ]
      },
      {
        group: '腰',
        items: [
          { key: 'foam_roller', label: '滚泡沫轴' },
          { key: 'ql_stretch', label: '腰方肌拉伸' },
          { key: 'torso_twist', label: '转体拉伸' },
          { key: 'cat_cow', label: '猫咪伸懒腰' },
          { key: 'bird_dog', label: '鸟狗式' },
          { key: 'mckenzie', label: '麦肯基' },
          { key: 'glute_bridge', label: '臀桥' }
        ]
      },
      {
        group: '髋',
        items: [
          { key: 'frog', label: '青蛙趴' },
          { key: 'clam', label: '蚌式开合' },
          { key: 'ninety_ninety', label: '九零九零' },
          { key: 'hip_walk', label: '臀走' }
        ]
      },
      {
        group: '手腕',
        items: [
          { key: 'wrist_six', label: '六向阻力训练' }
        ]
      },
      {
        group: '腹',
        items: [
          { key: 'dead_bug', label: '死虫' }
        ]
      },
      {
        group: '足',
        items: [
          { key: 'foot_arch', label: '压脚背' }
        ]
      },
      {
        group: '全身',
        items: [
          { key: 'greatest_stretch', label: '最伟大拉伸' }
        ]
      }
    ]
  }
]

function getPart(key) {
  return PARTS.find(p => p.key === key) || null
}
