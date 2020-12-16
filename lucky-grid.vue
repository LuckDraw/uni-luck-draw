<template>
	<view v-if="isShow" class="lucky-box" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }">
    <canvas id="lucky-grid" canvas-id="lucky-grid" :style="{ width: boxWidth + 'px', height: boxHeight + 'px' }"></canvas>
    <view class="lucky-grid-btn" @click="toPlay" :style="{ left: btnLeft + 'px', top: btnTop + 'px', width: btnWidth + 'px', height: btnHeight + 'px' }"></view>
    <div class="lucky-imgs">
      <div v-for="(prize, index) in prizes" :key="index">
        <span v-if="prize.imgs">
          <image v-for="(img, i) in prize.imgs" :key="i" :src="img.src" @load="e => imgBindload(e, 'prizes', index, i)"></image>
        </span>
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
  import { changeUnits, base64src } from './utils.js'
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
      button: {
        type: Object,
        default: () => {
          return {}
        }
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
      prizes: {
        handler (newData, oldData) {
          this.$lucky && (this.$lucky.prizes = newData)
        },
        deep: true
      },
      button: {
        handler (newData, oldData) {
          this.$lucky && (this.$lucky.button = newData)
        },
        deep: true
      }
    },
    methods: {
      async imgBindload (res, name, index, i) {
        const img = this[name][index].imgs[i]
        if (img && img.$resolve) {
          const path = await base64src(img.src)
          img.$resolve({ ...res.detail, path })
        }
      },
      async imgBindloadBtn (res, name, i) {
        const img = this[name].imgs[i]
        if (img && img.$resolve) {
          const path = await base64src(img.src)
          img.$resolve({ ...res.detail, path })
        }
      },
      init () {
        this.boxWidth = changeUnits(this.width)
        this.boxHeight = changeUnits(this.height)
        this.isShow = true
        this.$nextTick(() => {
          this.draw()
        })
      },
      draw () {
        this.ctx = uni.createCanvasContext('lucky-grid', this)
        this.dpr = uni.getSystemInfoSync().pixelRatio
        const $lucky = this.$lucky = new LuckyGrid({
          // #ifdef H5
          flag: 'UNI-H5',
          // #endif
          // #ifdef MP
          flag: 'UNI-MINI-WX',
          // #endif
          ctx: this.ctx,
          dpr: this.dpr,
          width: this.width,
          height: this.height,
          setTimeout: setTimeout,
          clearTimeout: clearTimeout,
          setInterval: setInterval,
          clearInterval: clearInterval,
        }, {
          ...this.$props,
          start: (...rest) => {
            this.$emit('start', ...rest)
          },
          end: (...rest) => {
            this.$emit('end', ...rest)
          },
        }) 
        // 动态设置按钮大小
        const button = this.$props.button
        if (button) [
          this.btnLeft,
          this.btnTop,
          this.btnWidth,
          this.btnHeight
        ] = $lucky.getGeometricProperty([
          button.x,
          button.y,
          button.col || 1,
          button.row || 1
        ])
      },
      toPlay (e) {
        this.$lucky.startCallback()
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
    margin: 0 auto;
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
