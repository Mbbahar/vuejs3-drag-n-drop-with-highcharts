<template>
  <div>
    <DraggableItem v-for="ball in availableBalls" :key="ball.id" :transferData="ball">
       <button :class="{btnActive: selectedChart.id === ball.id}">   {{ ball.name }}</button>
    </DraggableItem>
    <hr />
    <DroppableItem v-bind="{ onDragOver, onDragLeave, onDrop }">
      <span :class="droppableItemClass">
   
           <keep-alive key="selectedChart">
      <component :is="selectedChart.name"></component>
    </keep-alive> 
      </span>
    </DroppableItem>
  </div>
</template>

<script>
import { differenceBy } from 'lodash/fp'
import { computed, ref } from 'vue'
import DraggableItem from './DraggableItem'
import DroppableItem from './DroppableItem'

import Chart from './Chart.vue'
import StockChart from './StockChart'
import MapChart from './MapChart'

export default {
  name: 'DraggableBalls',
  components: {
    DraggableItem,
    DroppableItem,
    chart: Chart,
    stockChart: StockChart,
    mapChart: MapChart,
  },
  setup() {
    const balls = [ { id: 1, name: 'chart' },
     { id: 2, name: 'stockChart' },
      { id: 3, name: 'mapChart' } ]

    const selectedBalls = ref([])
    const selectedChart = ref({ id: 1, name: 'chart' })

    const isDroppableItemActive = ref(false)
    const availableBalls = computed(() => differenceBy('id', balls, selectedBalls.value))
    const droppableItemClass = computed(() => ['square', isDroppableItemActive.value && 'hover'])
     const onDragOver = () => {
       isDroppableItemActive.value = true
     }
     const onDragLeave = () => isDroppableItemActive.value = false
     const onDrop = event => {
        const ball = JSON.parse(event.dataTransfer.getData('value'))
        selectedChart.value = ball
        isDroppableItemActive.value = false
     }
     return { availableBalls, selectedBalls, selectedChart, droppableItemClass, onDragOver, onDragLeave, onDrop }
  }
}
</script>

<style>
.circle {
  width: 50px;
  height: 50px;
  border-radius: 50%; 
  border: 1px solid red;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  margin-right: 5px;
}
.square {
  display: inline-block;
  width: 750px;
  min-height: 300px;
  height: auto;
  /* height: 550px; */
  border: 1px dashed black;
  padding: 10px;
  margin-bottom: 100px;
}
.hover {
  background-color: rgb(172, 255, 158);
}
</style>