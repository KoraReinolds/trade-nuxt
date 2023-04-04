<template>
  <div class="h-full w-full relative">
    <div class="absolute top-0 left-0 text-gray-400">
      {{ figi }} - {{ tradeShare.size }}
    </div>
    <canvas :id="`${props.figi}-canvas`" class="h-full w-full"></canvas>
  </div>
</template>

<script setup lang="ts">
import * as THREE from "three";
import { IntervalKeys } from "~~/types/IntervalMap";
import { TradeShare } from "~~/classes/Share";
import { Widget } from "~~/classes/Widget";

const props = defineProps<{
  figi: string;
  date: string;
  interval: IntervalKeys;
}>();

const shaders = (await useFetch("/api/shaders")).data.value;

const tradeShare = new TradeShare({
  interval: props.interval,
  figi: props.figi,
  startDate: props.date,
});

const dataSize = 300;
await tradeShare.getCandles(600);
tradeShare.addMA(60);
tradeShare.getData(dataSize);

const { high, low, data } = tradeShare.getTextureData();
const candleTexture = new THREE.DataTexture(
  data,
  tradeShare.size.value,
  1,
  THREE.RGBAFormat,
  THREE.FloatType
);
candleTexture.needsUpdate = true;

const wid: Ref<Widget | null> = ref(null);

function main() {
  const canvas: HTMLElement | null = document.querySelector(
    `#${props.figi}-canvas`
  );

  if (!canvas) return;

  const widget = new Widget(canvas);
  wid.value = widget;
  const planeGeo = new THREE.PlaneGeometry();
  const planeMat = new THREE.ShaderMaterial({
    uniforms: {
      u_resolution: { value: widget.getCanvasSize() },
      u_grid: { value: new THREE.Vector2(dataSize, 4) },
      u_grid_offset: { value: new THREE.Vector2(0, 0) },
      u_hl: { value: new THREE.Vector2(high, low) },
      u_candles: { value: candleTexture },
    },
    fragmentShader: shaders?.fragment || ``,
    vertexShader: shaders?.vertex || ``,
    transparent: true,
  });
  widget.addActionBeforeRender(() => {
    planeMat.uniforms.u_resolution.value = widget.getCanvasSize();
  });
  planeMat.side = THREE.DoubleSide;
  const planeMesh = new THREE.Mesh(planeGeo, planeMat);
  widget.scene.add(planeMesh);
  planeMesh.position.set(0.5, 0.5, 0);
}

onMounted(main);
</script>
