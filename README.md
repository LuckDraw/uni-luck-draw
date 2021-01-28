
<div align="center">
  <img src="https://raw.githubusercontent.com/LuckDraw/lucky-canvas/master/logo.png" width="128" alt="logo" />
  <h1>uni-luck-draw 抽奖组件</h1>
  <p>一个基于 uni-app 的 ( 大转盘 / 九宫格 ) 抽奖插件</p>
  <p>
    <a href="https://github.com/buuing/uni-luck-draw/stargazers" target="_black">
      <img src="https://img.shields.io/github/stars/buuing/uni-luck-draw?color=%23ffca28&logo=github&style=flat-square" alt="stars" />
    </a>
    <a href="https://github.com/buuing/uni-luck-draw/network/members" target="_black">
      <img src="https://img.shields.io/github/forks/buuing/uni-luck-draw?color=%23ffca28&logo=github&style=flat-square" alt="forks" />
    </a>
    <a href="https://www.npmjs.com/package/uni-luck-draw" target="_black">
      <img src="https://img.shields.io/npm/v/uni-luck-draw?color=%23ffca28&logo=npm&style=flat-square" alt="version" />
    </a>
    <a href="https://www.npmjs.com/package/uni-luck-draw" target="_black">
      <img src="https://img.shields.io/npm/dm/uni-luck-draw?color=%23ffca28&logo=npm&style=flat-square" alt="downloads" />
    </a>
  </p>
  <p>
    <a href="https://github.com/buuing" target="_black">
      <img src="https://img.shields.io/badge/Author-%20buuing%20-7289da.svg?&logo=github&style=flat-square" alt="author" />
    </a>
    <a href="https://github.com/buuing/uni-luck-draw/blob/master/LICENSE" target="_black">
      <img src="https://img.shields.io/github/license/buuing/uni-luck-draw?color=%232DCE89&logo=github&style=flat-square" alt="license" />
    </a>
  </p>
</div>

<br />

## 官方文档 & Demo演示

> **中文**：[https://100px.net/document/uni-app.html](https://100px.net/document/uni-app.html)  

<br />

- **在 js / jq 中使用 [lucky-canvas](https://github.com/luckdraw/lucky-canvas)**

- **在 vue2.x / vue3.x 中使用 [vue-luck-draw](https://github.com/luckdraw/vue-luck-draw)**

- **在 react 中使用 [react-luck-draw](https://github.com/luckdraw/react-luck-draw)**

- **在 uni-app 中使用 [uni-luck-draw](https://github.com/luckdraw/uni-luck-draw)**

- **在 微信小程序 中使用 [mini-luck-draw](https://github.com/luckdraw/mini-luck-draw)**

<br />

## 在 uni-app 中使用

### 1. 安装插件

- **你可以选择通过 `HBuilderX` 导入插件：** [https://ext.dcloud.net.cn/plugin?id=3499](https://ext.dcloud.net.cn/plugin?id=3499)

- **也可以选择通过 `npm / yarn` 安装**

```shell
# npm 安装：
npm install uni-luck-draw

# yarn 安装：
yarn add uni-luck-draw
```

### 2. 引入并使用

```html
<view>
  <!-- 大转盘抽奖 -->
  <LuckyWheel
    width="600rpx"
    height="600rpx"
    ...你的配置
  />
  <!-- 九宫格抽奖 -->
  <LuckyGrid
    width="600rpx"
    height="600rpx"
    ...你的配置
  />
</view>
```

```js
// npm 下载会默认到 node_modules 里面，直接引入包名即可
import LuckyWheel from 'uni-luck-draw/lucky-wheel' // 大转盘
import LuckyGrid from 'uni-luck-draw/lucky-grid' // 九宫格

// 如果你是通过 HBuilderX 导入插件，那你需要指定一下路径
// import LuckyWheel from '@/components/uni-luck-draw/lucky-wheel' // 大转盘
// import LuckyGrid from '@/components/uni-luck-draw/lucky-grid' // 九宫格

export default {
  // 注册组件
  components: { LuckyWheel, LuckyGrid },
}
```

### 3. 我提供了一个最基本的 demo 供你用于尝试

由于 uni-app 渲染 md 的时候会出问题，所以我把 demo 代码放到了文档里

- [https://100px.net/document/uni-app.html](https://100px.net/document/uni-app.html)
