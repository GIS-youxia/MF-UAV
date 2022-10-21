<template>
  <BasePanel title="实时数据">
    <div class="base-flight-params">
      <div class="params-item" v-for="{ label, value } in list">
        <span class="label">{{ label }}:</span>
        <span class="value">{{ value }}</span>
      </div>
    </div>
  </BasePanel>
</template>
<script setup lang="ts">
  import BasePanel from "@/components/BasePanel.vue"
  import { computed } from "@vue/reactivity"
  interface PropsType {
    data: {
      lat: number
      lng: number
      altitude: number
      heading: number
      pitch: number
      roll: number
      correction: number
      speed: number
    }
  }
  const props = defineProps<PropsType>()

  const list = computed(() => {
    return [
      {
        label: "纬度",
        value: props.data.lat.toFixed(3) + "°",
      },
      {
        label: "经度",
        value: props.data.lng.toFixed(3) + "°",
      },
      {
        label: "海拔",
        value: props.data.altitude.toFixed(3),
      },
      {
        label: "航向角",
        value: props.data.heading.toFixed(3) + "°",
      },
      {
        label: "俯视角",
        value: props.data.pitch.toFixed(3) + "°",
      },
      {
        label: "翻滚角",
        value: props.data.roll.toFixed(3) + "°",
      },
      {
        label: "航速",
        value: props.data.speed.toFixed(0) + "km/h",
      },
    ]
  })
</script>
<style lang="scss" scoped>
  .base-flight-params {
    display: grid;
    grid-gap: 10px;
    grid-template-columns: repeat(2, 1fr);
    padding-top: 4px;
  }

  .params-item {
    display: flex;
    align-items: center;
    font-size: 14px;

    .label {
      margin-right: 4px;
      padding: 2px 10px;
      font-size: 12px;
      background-color: #f0f2f3;
    }

    .value {
      font-size: 12px;

      // color: #1823d4;
      // font-weight: bold;
    }
  }
</style>
