<template>
  <div :style="{ width, height }"></div>
</template>

<script>
import echarts from "echarts";
require("echarts/theme/azul");
import resize from "./mixins/resize";
export default {
  mixins: [resize],
  name: "LineCharts",
  data() {
    return {
      chart: null,
    };
  },
  props: {
    width: {
      type: String,
      default: "100%",
    },
    height: {
      type: String,
      default: "350px",
    },
    chartData: {
      type: Object,
      default: {},
    },
    yTittle: {
      type: String,
      default: "",
    },
  },
  methods: {
    initOptions({ expectedData = [], actualData = [] }) {
      this.chart = echarts.init(this.$el, "azul");
      this.chart.setOption({
        // 标题
        // title: {
        //   text: "ECharts 入门示例",
        // },
        // 提示
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
          },
        },

        grid: {
          left: 20,
          top: 30,
          right: 20,
          bottom: 20,
          containLabel: true,
        },

        // 图例
        legend: {
          data: ["期望", "实际"],
        },
        // x轴
        xAxis: {
          data: ["周一", "周二", "周三", "周四", "周五", "周六", "周日"],
          boundaryGap: false, //坐标轴两边留白策略
        },
        // y轴
        yAxis: {
          name: this.yTittle,
        },

        // 系列
        series: [
          {
            name: "期望",
            type: "line",
            data: expectedData,
            itemStyle: {
              color: "red",
            },
            lineStyle: {
              width: 4,
            },
          },
          {
            name: "实际",
            type: "line",
            data: actualData,
            itemStyle: {
              color: "blue",
            },
            lineStyle: {
              width: 4,
            },
            areaStyle: {
              color: "hotpink",
            },
          },
        ],
      });
    },
  },
  watch: {
    chartData(newVal) {
      this.initOptions(newVal);
    },
  },
  mounted() {
    this.initOptions(this.chartData);
  },
};
</script>

<style scoped lang="scss">
</style>
