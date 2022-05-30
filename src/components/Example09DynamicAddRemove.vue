<template>
<div id="container">
    <div class="sideBar">
        <button @click="addItem">Add an item dynamically</button>
        <DraggableItem v-for="ball in availableBalls" :key="ball.id" :transferData="ball">
            <button :class="{btnActive: selectedChart.id === ball.id}"> {{ ball.name }}</button>
        </DraggableItem>
    </div>

    <grid-layout v-model:layout="layout" :col-num="colNum" :row-height="30" :is-draggable="draggable" :is-resizable="resizable" :vertical-compact="true" :use-css-transforms="true">
        <DroppableItem v-bind="{ onDragOver, onDragLeave, onDrop }">

            <grid-item v-for="item in layout" :key="item.id" :static="item.static" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
                <span :class="droppableItemClass">

                    <keep-alive key="selectedChart">
                        <component :is="selectedChart.name"></component>
                    </keep-alive>
                </span>
                <!-- <span class="remove" @click="removeItem(item.i)">x</span> -->
            </grid-item>
        </DroppableItem>
    </grid-layout>
</div>
</template>

<script>
import {
    GridLayout,
    GridItem
} from "vue-grid-layout"
import {
    differenceBy
} from 'lodash/fp'
import {
    computed,
    ref
} from 'vue'
import DraggableItem from './DraggableItem'
import DroppableItem from './DroppableItem'

import Chart from './Chart.vue'
import StockChart from './StockChart'
import MapChart from './MapChart'

export default {
    name: 'DraggableGridLayout',
    components: {
        GridLayout,
        GridItem,
        DraggableItem,
        DroppableItem,
        chart: Chart,
        stockChart: StockChart,
        mapChart: MapChart,
    },
    data() {
        const balls = [{
                id: 1,
                name: 'chart'
            },
            {
                id: 2,
                name: 'stockChart'
            },
            {
                id: 3,
                name: 'mapChart'
            }
        ]

        const selectedBalls = ref([])
        const selectedChart = ref({
            id: 1,
            name: 'chart'
        })

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
        return {
            layout: [{
                    x: 0,
                    y: 0,
                    w: 2,
                    h: 2,
                    i: "0"
                },
                { x: 2, y: 0, w: 2, h: 2, i: "1" },
                { x: 4, y: 0, w: 2, h: 2, i: "2" },
                { x: 6, y: 0, w: 2, h: 2, i: "3" },
                { x: 8, y: 0, w: 2, h: 2, i: "4" },
            ],
            draggable: true,
            resizable: true,
            colNum: 12,
            index: 0,
            availableBalls,
            selectedBalls,
            selectedChart,
            droppableItemClass,
            onDragOver,
            onDragLeave,
            onDrop
        }
    },
    mounted() {
        // this.$gridlayout.load();
        this.index = this.layout.length;
    },
    methods: {
        addItem: function () {
            // Add a new item. It must have a unique key!
            this.layout.push({
                x: (this.layout.length * 2) % (this.colNum || 12),
                y: this.layout.length + (this.colNum || 12),
                // y: this.index % 6 == 0 ?
                //  this.layout[this.index-1].y +2 :
                //   this.layout[this.index-1].y, // puts it at the bottom
                w: 2,
                h: 2,
                i: this.index,
            });
            // Increment the counter to ensure key is always unique.
            this.index++;
        },
        removeItem: function (val) {
            const index = this.layout.map(item => item.i).indexOf(val);
            this.layout.splice(index, 1);
        },
    }
}
</script>

<style>
#container {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin: 0 auto;
    /* margin-top: 60px; */
    width: 100%;
    display: flex;
    flex-direction: row;
}

.layoutJSON {
    background: #ddd;
    border: 1px solid black;
    margin-top: 10px;
    padding: 10px;
}

.columns {
    -moz-columns: 120px;
    -webkit-columns: 120px;
    columns: 120px;
}

/*************************************/
.remove {
    position: absolute;
    right: 2px;
    top: 0;
    cursor: pointer;
}
.sideBar {
    width: 10vw;
    background-color: lightblue;
}

.vue-grid-layout {
    background: #eee;
    width: 90vw;
}

.vue-grid-item:not(.vue-grid-placeholder) {
    background: #ccc;
    border: 1px solid black;
    min-width: 50px;

    overflow-x: hidden;
}

.vue-grid-item .resizing {
    opacity: 0.9;
}

.vue-grid-item .static {
    background: #cce;
}

.vue-grid-item .text {
    font-size: 24px;
    text-align: center;
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
    margin: auto;
    height: 100%;
    width: 100%;
}

.vue-grid-item .no-drag {
    height: 100%;
    width: 100%;
}

.vue-grid-item .minMax {
    font-size: 12px;
}

.vue-grid-item .add {
    cursor: pointer;
}

.vue-draggable-handle {
    position: absolute;
    width: 20px;
    height: 20px;
    top: 0;
    left: 0;
    background: url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='10' height='10'><circle cx='5' cy='5' r='5' fill='#999999'/></svg>") no-repeat;
    background-position: bottom right;
    padding: 0 8px 8px 0;
    background-repeat: no-repeat;
    background-origin: content-box;
    box-sizing: border-box;
    cursor: pointer;
}

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
