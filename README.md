# 2048 AI Game - AI算法教学平台

一个交互式的AI算法教学平台，通过经典的2048游戏展示5种不同AI算法的决策逻辑和性能表现。

## ✨ 功能特性

### 🎮 游戏模式
- **手动模式**: 使用键盘方向键控制游戏
- **AI模式**: 选择AI算法自动游戏

### 🤖 5种AI算法
1. **随机算法 (Random)**: 从所有合法移动中随机选择
2. **贪心算法 (Greedy)**: 选择能获得最高即时收益的移动
3. **Minimax算法**: 使用博弈树搜索，考虑未来几步
4. **Alpha-Beta剪枝**: Minimax优化版本，提高搜索效率
5. **蒙特卡洛树搜索 (MCTS)**: 通过随机模拟评估移动质量

### 📊 可视化展示
- 实时AI决策过程展示
- 各方向评估分数对比
- 算法性能统计数据
- 搜索节点数和剪枝效率

### ⚙️ 高级配置
- 可调节AI执行速度（慢速/正常/快速/极速）
- 搜索深度配置（Minimax）
- MCTS迭代次数配置
- 剪枝优化开关

## 🚀 快速开始

### 前置要求
- Node.js 16+
- npm 或 yarn

### 安装和运行

#### Windows 系统
双击运行 `start.bat` 文件，或在命令行中执行：
```bash
start.bat
```

#### macOS/Linux 系统
在终端中执行：
```bash
chmod +x start.sh
./start.sh
```

#### 手动启动
```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev
```

服务器启动后，在浏览器中访问: `http://localhost:5173`

## 🎯 使用说明

### 手动游戏
1. 选择"手动模式"
2. 使用键盘方向键 (↑↓←→) 控制游戏
3. 合并相同数字，目标达到2048

### AI自动游戏
1. 选择"AI模式"
2. 从下拉菜单选择AI算法
3. 调整速度和参数（可选）
4. 点击"开始AI"按钮
5. 观察AI的决策过程和游戏进行

### 快捷键
- **方向键**: 移动方块（手动模式）
- **R**: 重新开始
- **Space**: 暂停/继续（AI模式）

## 📁 项目结构

```
project/
├── src/
│   ├── components/          # React组件
│   │   ├── Game/           # 游戏相关组件
│   │   ├── AI/             # AI控制面板组件
│   │   └── Statistics/     # 统计展示组件
│   ├── core/               # 核心逻辑
│   │   ├── game/          # 游戏逻辑
│   │   └── ai/            # AI算法实现
│   ├── hooks/             # React Hooks
│   ├── types/             # TypeScript类型定义
│   ├── utils/             # 工具函数
│   └── styles/            # 样式文件
├── package.json
├── tsconfig.json
├── vite.config.ts
├── start.sh              # Linux/macOS启动脚本
├── start.bat             # Windows启动脚本
└── README.md
```

## 🎨 技术栈

- **框架**: React 18 + TypeScript 5
- **构建工具**: Vite
- **样式**: CSS3 (响应式设计)
- **算法**:
  - Minimax with Alpha-Beta Pruning
  - Monte Carlo Tree Search (MCTS)
  - Greedy Search
  - Random Strategy

## 📊 AI算法详解

### 随机算法
- 作为基准对照算法
- 随机选择合法移动
- 展示无策略的游戏表现

### 贪心算法
- 评估每个移动的即时收益
- 选择当前最优解
- 展示短视策略的局限性

### Minimax算法
- 搜索深度: 2-3层
- 考虑玩家和对手回合
- 使用评估函数评分棋盘状态

### Alpha-Beta剪枝
- Minimax的优化版本
- 剪枝减少搜索节点
- 可达更深的搜索深度（4-5层）

### MCTS蒙特卡洛
- 通过随机模拟评估移动
- 平衡探索与利用
- 迭代次数可配置（100-2000次）

## 📈 评估函数

AI算法使用的棋盘评估考虑以下因素：
- **空格数量**: 权重 2.7
- **最大方块**: 权重 1.0
- **单调性**: 数字递减排列，权重 1.0
- **平滑度**: 相邻方块接近程度，权重 0.1

## 🎓 教学价值

本项目适合用于：
- AI算法教学演示
- 游戏AI开发学习
- 搜索算法对比研究
- 前端技术栈实践

## 🔧 开发命令

```bash
# 安装依赖
npm install

# 启动开发服务器
npm run dev

# 构建生产版本
npm run build

# 预览生产版本
npm run preview
```

## 📝 许可证

MIT License

## 👨‍💻 作者

B站AI算法教学项目

---

**享受游戏，学习AI！** 🎮🤖
