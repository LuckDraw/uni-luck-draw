<template>
  <view v-if="isShow" class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
    <canvas
      id="lucky-wheel"
      canvas-id="lucky-wheel"
      v-show="showCanvas"
      :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
    ></canvas>
    <image
      v-show="luckyImg"
      class="lucky-img"
      :src="luckyImg"
      mode="scaleToFill"
      @load="luckyImgLoad"
      :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"
    ></image>
    <!-- #ifdef APP-PLUS -->
    <view class="lucky-wheel-btn" @click="toPlay" :style="{ width: btnWidth + 'px', height: btnHeight + 'px' }"></view>
    <!-- #endif -->
    <!-- #ifndef APP-PLUS -->
    <cover-view class="lucky-wheel-btn" @click="toPlay" :style="{ width: btnWidth + 'px', height: btnHeight + 'px' }"></cover-view>
    <!-- #endif -->
    <div class="lucky-imgs">
      <div v-for="(block, index) in blocks" :key="index">
        <div v-if="block.imgs">
          <image v-for="(img, i) in block.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'blocks', index, i)"></image>
        </div>
      </div>
    </div>
    <div class="lucky-imgs">
      <div v-for="(prize, index) in prizes" :key="index">
        <div v-if="prize.imgs">
          <image v-for="(img, i) in prize.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'prizes', index, i)"></image>
        </div>
      </div>
    </div>
    <div class="lucky-imgs">
      <div v-for="(btn, index) in buttons" :key="index">
        <div v-if="btn.imgs">
          <image v-for="(img, i) in btn.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'buttons', index, i)"></image>
        </div>
      </div>
    </div>
  </view>
</template>

<script>
  import { changeUnits, resolveImage, getImage } from './utils.js'
  import { LuckyWheel } from '../lucky-canvas'
  export default {
    name: 'lucky-wheel',
    data () {
      return {
        isShow: false,
        boxWidth: 100,
        boxHeight: 100,
        btnWidth: 0,
        btnHeight: 0,
        dpr: 1,
        transformStyle: '',
        luckyImg: '',
        showCanvas: true,
      }
    },
    props: {
      width: {
        type: String,
        default: '600rpx'
      },
      height: {
        type: String,
        default: '600rpx'
      },
      blocks: {
        type: Array,
        default: () => []
      },
      prizes: {
        type: Array,
        default: () => []
      },
      buttons: {
        type: Array,
        default: () => []
      },
      defaultConfig: {
        type: Object,
        default: () => {
          return {}
        }
      },
      defaultStyle: {
        type: Object,
        default: () => {
          return {}
        }
      },
    },
    mounted () {
      this.initLucky()
    },
    watch: {
      blocks (newData) {
        this.$lucky && (this.$lucky.blocks = newData)
      },
      prizes (newData) {
        this.$lucky && (this.$lucky.prizes = newData)
      },
      buttons (newData) {
        this.$lucky && (this.$lucky.buttons = newData)
      },
      defaultStyle (newData) {
        this.$lucky && (this.$lucky.defaultStyle = newData)
      },
      defaultConfig (newData) {
        this.$lucky && (this.$lucky.defaultConfig = newData)
      },
    },
    methods: {
      async imgBindload (res, name, index, i) {
        const img = this[name][index].imgs[i]
        resolveImage(res, img)
      },
      initLucky () {
        const dpr = this.dpr = uni.getSystemInfoSync().pixelRatio
        this.boxWidth = changeUnits(this.width)
        this.boxHeight = changeUnits(this.height)
        const compute = (len) => (len * dpr - len) / (len * dpr) * (dpr / 2) * 100
        this.transformStyle = `scale(${1 / dpr}) translate(
          ${-compute(this.boxWidth * dpr)}%, ${-compute(this.boxHeight * dpr)}%
        )`
        this.isShow = true
        this.$nextTick(() => {
          this.draw()
        })
      },
      draw () {
        const _this = this
        const ctx = this.ctx = uni.createCanvasContext('lucky-wheel', this)
        const $lucky = this.$lucky = new LuckyWheel({
          // #ifdef H5 || APP-PLUS
          flag: 'UNI-H5',
          // #endif
          // #ifdef MP
          flag: 'UNI-MP',
          // #endif
          dpr: 1,
          ctx: this.ctx,
          width: this.width,
          height: this.height,
          // #ifdef H5
          rAF: requestAnimationFrame,
          // #endif
          setTimeout: setTimeout,
          clearTimeout: clearTimeout,
          setInterval: setInterval,
          clearInterval: clearInterval,
          unitFunc: (num, unit) => changeUnits(num + unit),
          beforeInit: function () {
            const Radius = Math.min(this.config.width, this.config.height) / 2
            ctx.translate(-Radius, -Radius)
          },
          afterInit: function () {
            // 动态设置按钮
            _this.btnWidth = this.maxBtnRadius * 2
            _this.btnHeight = this.maxBtnRadius * 2
            _this.$forceUpdate()
          },
          beforeDraw: function () {
            ctx.translate(this.Radius, this.Radius)
          },
          afterDraw: function () {
            ctx.draw()
          },
        }, {
          ...this.$props,
          start: (...rest) => {
            this.$emit('start', ...rest)
          },
          end: (...rest) => {
            this.$emit('end', ...rest)
            getImage.call(this, 'lucky-wheel').then(res => {
              this.luckyImg = res.tempFilePath
            })
          },
        })
      },
      luckyImgLoad () {
        this.showCanvas = false
      },
      toPlay (e) {
        // 隐藏图片并显示canvas
        this.showCanvas = true
        this.luckyImg = ''
        // 触发抽奖逻辑
        this.$lucky.startCallback()
      },
      init () {
        this.$lucky.init({})
      },
      play (...rest) {
        this.$lucky.play(...rest)
      },
      stop (...rest) {
        this.$lucky.stop(...rest)
      },
    },
  }
</script>

<style scoped>
  .lucky-box {
    position: relative;
    overflow: hidden;
  }
  .lucky-box canvas {
    position: absolute;
    pointer-events: none;
    z-index: 99;
  }
  .lucky-wheel-btn {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    background: rgba(0, 0, 0, 0);
    border-radius: 50%;
    z-index: 101;
  }
  .lucky-img {
    position: absolute;
    top: 0;
    left: 0;
    z-index: 100;
  }
  .lucky-imgs {
    width: 0;
    height: 0;
    visibility: hidden;
  }
</style>
