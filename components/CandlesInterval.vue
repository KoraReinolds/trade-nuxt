<template>
  <div class="h-full w-full relative">
    <div class="absolute top-0 left-0 text-gray-400">
      {{ figi }} - {{ dataSize }}
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

const createCandleTexture = (data: Float32Array) => {
  const candleTexture = new THREE.DataTexture(
    data,
    data.length / 4,
    1,
    THREE.RGBAFormat,
    THREE.FloatType
  );
  candleTexture.needsUpdate = true;
  return candleTexture;
};

const shaders = (await useFetch("/api/shaders")).data.value;
const tradeShare = new TradeShare({
  interval: props.interval,
  figi: props.figi,
  date: props.date,
});

const dataSize = 20;
await tradeShare.getCandles(600);
tradeShare.addMA(60);

const candleTexture = ref(createCandleTexture(new Float32Array()));

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
      u_hl: { value: new THREE.Vector2(0, 0) },
      u_candles: { value: candleTexture.value },
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

  watch(candleTexture, (texture) => {
    planeMat.uniforms.u_candles.value = texture;
  });
  watch(tradeShare.endDate, () => tradeShare.getData(dataSize));
  watch(tradeShare.data, () => {
    const { high, low, data } = tradeShare.getTextureData();
    planeMat.uniforms.u_hl.value = new THREE.Vector2(high, low);
    candleTexture.value = createCandleTexture(data);
  });
  tradeShare.getData(dataSize);
}

onMounted(main);
</script>
