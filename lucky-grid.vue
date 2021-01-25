<template>
	<view v-if="isShow" class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
    <canvas id="lucky-grid" canvas-id="lucky-grid" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }" @touchend="toPlay"></canvas>
    <div class="lucky-imgs">
      <div v-for="(prize, index) in prizes" :key="index">
        <div v-if="prize.imgs">
          <div v-for="(img, i) in prize.imgs" :key="i">
            <image :src="img.src" @load="e => imgBindload(e, 'prizes', index, i)"></image>
            <image :src="img.activeSrc" @load="e => imgBindloadActive(e, 'prizes', index, i)"></image>
          </div>
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
    <div class="lucky-imgs">
      <span v-if="button && button.imgs">
        <image v-for="(img, i) in button.imgs" :key="i" :src="img.src" @load="e => imgBindloadBtn(e, 'button', i)"></image>
      </span>
    </div>
  </view>
</template>

<script>
  import { changeUnits, resolveImage } from './utils.js'
  import { LuckyGrid } from '../lucky-canvas'
  export default {
    name: 'lucky-grid',
    data () {
      return {
        isShow: false,
        boxWidth: 100,
        boxHeight: 100,
        btnWidth: 0,
        btnHeight: 0,
        btnLeft: 0,
        btnTop: 0,
        dpr: 1,
        transformStyle: '',
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
      cols: {
        type: [String, Number],
        default: 3,
      },
      rows: {
        type: [String, Number],
        default: 3,
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
      button: {
        type: Object,
        default: undefined
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
      activeStyle: {
        type: Object,
        default: () => {
          return {}
        }
      }
    },
    mounted () {
      this.init()
    },
    watch: {
      cols (newData, oldData) {
        this.$lucky && (this.$lucky.cols = newData)
      },
      rows (newData, oldData) {
        this.$lucky && (this.$lucky.rows = newData)
      },
      blocks (newData, oldData) {
        this.$lucky && (this.$lucky.blocks = newData)
      },
      prizes (newData, oldData) {
        this.$lucky && (this.$lucky.prizes = newData)
      },
      buttons (newData, oldData) {
        this.$lucky && (this.$lucky.buttons = newData)
      },
      button (newData, oldData) {
        this.$lucky && (this.$lucky.button = newData)
      },
    },
    methods: {
      async imgBindload (res, name, index, i) {
        const img = this[name][index].imgs[i]
        resolveImage(res, img)
      },
      async imgBindloadActive (res, name, index, i) {
        const img = this[name][index].imgs[i]
        resolveImage(res, img, 'activeSrc', '$activeResolve')
      },
      async imgBindloadBtn (res, name, i) {
        const img = this[name].imgs[i]
        resolveImage(res, img)
      },
      init () {
        const dpr = this.dpr = uni.getSystemInfoSync().pixelRatio
        this.boxWidth = changeUnits(this.width)
        this.boxHeight = changeUnits(this.height)
        const compute = (len) => (len * dpr - len) / (len * dpr) * (dpr / 2) * 100
        this.transformStyle = `scale(${1 / dpr}) translate(
          ${-compute(this.boxWidth * dpr)}%, ${-compute(this.boxHeight * dpr)}%
        )`
        this.isShow = true
        this.$nextTick(() => this.draw())
      },
      draw () {
        const ctx = this.ctx = uni.createCanvasContext('lucky-grid', this)
        const $lucky = this.$lucky = new LuckyGrid({
          // #ifdef H5 || APP-PLUS
          flag: 'UNI-H5',
          // #endif
          // #ifdef MP
          flag: 'UNI-MINI-WX',
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
          beforeDraw: function () {
            // const { config } = this
            // ctx.scale(config.dpr, config.dpr)
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
          },
        })
      },
      toPlay (e) {
        const {x, y} = e.changedTouches[0]
        ;[
          ...this.$props.buttons,
          this.$props.button
        ].forEach(btn => {
          if (!btn) return
          const [xAxis, yAxis, w, h] = this.$lucky.getGeometricProperty([
            btn.x,
            btn.y,
            btn.col || 1,
            btn.row || 1
          ])
          if (x > xAxis && x < xAxis + w && y > yAxis && y < yAxis + h) {
            this.$lucky.startCallback(btn)
          }
        })
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
  }
  .lucky-grid-btn {
    position: absolute;
    background: rgba(0, 0, 0, 0);
    border-radius: 0;
  }
  .lucky-imgs {
    width: 0;
    height: 0;
    visibility: hidden;
  }
</style>
