<template>
  <div v-if="candles.length" class="h-full w-full relative">
    <div class="absolute top-0 left-0 text-gray-400" @click="saveCandles">
      {{ figi }} - {{ candles.length }}
    </div>
    <canvas :id="`${props.figi}-canvas`" class="h-full w-full"></canvas>
  </div>
</template>

<script setup lang="ts">
import { Candles } from ".prisma/client";
import * as THREE from "three";
import { IntervalKeys } from "~~/types/IntervalMap";
import { TradeShare } from "~~/classes/Share";
import { Widget } from "~~/classes/Widget";

const props = defineProps<{
  figi: string;
  date: string;
  interval: IntervalKeys;
  offset: string;
}>();

const candles =
  (
    await useFetch(
      `/api/candles/${props.figi}/${props.interval}/${props.date}/db?offset=${props.offset}`
    )
  ).data.value?.candles || [];
if (candles) {
  // TODO: figure out with SerializeObject type
  const tradeShare = new TradeShare(candles as unknown as Candles[]);
  tradeShare.addMA(60);
}
const saveCandles = async () => {
  await useFetch(`/api/candles?figi=${props.figi}&interval=${props.interval}`, {
    method: "POST",
    body: candles,
  });
};

const shaders = (await useFetch("/api/shaders")).data.value;

function main() {
  const canvas: HTMLElement | null = document.querySelector(
    `#${props.figi}-canvas`
  );
  if (!canvas) return;
  const widget = new Widget(canvas, {
    axisHelper: true,
    orbitControls: true,
  });
  const planeGeo = new THREE.PlaneGeometry();
  const planeMat = new THREE.ShaderMaterial({
    uniforms: {
      u_resolution: {
        value: new THREE.Vector2(canvas.clientWidth, canvas.clientHeight),
      },
      u_grid: { value: new THREE.Vector2(candles.length, 4) },
    },
    fragmentShader: shaders?.fragment || ``,
    vertexShader: shaders?.vertex || ``,
    transparent: true,
  });
  planeMat.side = THREE.DoubleSide;
  const planeMesh = new THREE.Mesh(planeGeo, planeMat);
  widget.scene.add(planeMesh);
  planeMesh.position.set(0.5, 0.5, 0);
}

onMounted(main);
</script>
