<template>
<div style="display:flex; flex-direction:column; width: 100vw">

    <div class="header">
        <span>title</span>
    </div>
    <div id="page">

        <div class="sideBar">
            <!-- <input type="text" placeholder="number of columns in a row" v-model="colNumber"> -->

            <button @click="addColumn">Add new column</button>
            <!-- <button @click="showModal = true">Add new row</button> -->

            <!-- <DraggableItem v-for="ball in availableBalls" :key="ball.id" :transferData="ball">
                <button> {{ ball.name }}</button>
            </DraggableItem> -->
            <draggable class="dragArea list-group" :list="list1" :group="{ name: 'people', pull: 'clone', put: false }" @change="log" item-key="name">
                <template #item="{ element }">
                    <div class="list-group-item">
                        {{ element.name }}
                    </div>
                </template>
            </draggable>
        </div>

        <div class="container" v-for="item in columns" v-bind:key="item.id">

            <draggable class="dragArea list-group" :list="item.components" group="people" item-key="name" style="background-color:pink;" v-bind:style="{ 'width': item.components.length != 0 ?
             Math.max(...item.components.map(item => item.width)) : item.width, 'height': item.height }">
                <template #item="{ element }">
                    <component class="resize" v-resize="onResize" :is="element.name"></component>

                </template>
            </draggable>

        </div>

        <!-- <grid-layout v-model:layout="layout" :col-num="colNum" :row-height="30" :is-draggable="draggable" :is-resizable="resizable" :vertical-compact="true" :use-css-transforms="true">
        <DroppableItem v-bind="{ onDragOver, onDragLeave, onDrop }">

            <grid-item v-for="item in layout" :key="item.i" :static="item.static" :x="item.x" :y="item.y" :w="item.w" :h="item.h" :i="item.i">
                <span :class="droppableItemClass">

                    <keep-alive key="selectedChart">
                        <component :is="selectedChart.name"></component>
                    </keep-alive>
                </span>
                 <span class="remove" @click="removeItem(item.i)">x</span>
            </grid-item>
        </DroppableItem>
    </grid-layout> -->

        <SavedModal v-show="showModal" @close-modal="showModal = false" @addRow="addRow" />

    </div>
</div>
</template>

<script>
// import {
//     GridLayout,
//     GridItem
// } from "vue-grid-layout"
import {
    differenceBy
} from 'lodash/fp'
import {
    computed,
    ref
} from 'vue'
// import DraggableItem from './DraggableItem'
// import DroppableItem from './DroppableItem'

import Chart from './Chart.vue'
import StockChart from './StockChart'
import MapChart from './MapChart'

import SavedModal from './SavedModal.vue'

import draggable from "vuedraggable";

export default {
    name: 'DraggableGridLayout',
    components: {
        // GridLayout,
        // GridItem,
        // DraggableItem,
        // DroppableItem,
        chart: Chart,
        stockChart: StockChart,
        mapChart: MapChart,
        SavedModal,
        draggable
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

        const isDroppableItemActive = ref(null)
        // const isDroppableItemActive = ref(false)
        const availableBalls = computed(() => differenceBy('id', balls, selectedBalls.value))
        const droppableItemClass = computed(() => ['square', isDroppableItemActive.value && 'hover'])
        // const droppableItemClass = computed(() => ['square', isDroppableItemActive.value && 'hover'])
        const onDragOver = (event) => {
            console.log('event.target.id hover', event.target.id)

            if (event.target && event.target.id) {
                let changedItem = this.layout.find(item => item.id == event.target.id)
                changedItem.isDroppableItemActive = true;
                isDroppableItemActive.value = changedItem.Id
            }
            // isDroppableItemActive.value = true
        }
        const onDragLeave = () => isDroppableItemActive.value = false
        const onDrop = (event) => {
            event.preventDefault();
            const ball = JSON.parse(event.dataTransfer.getData('value'))
            console.log('event id drop', event.target.id)

            if (event.target && event.target.id) {
                let changedItem = this.layout.find(item => item.id == event.target.id)
                console.log('changedItem', changedItem)
                changedItem.selectedChart = ball;
                changedItem.isDroppableItemActive = false;
            }
            // selectedChart.value = ball
            // isDroppableItemActive.value = false
        }
        return {
            layout: [],
            columns: [],
            //     layout: [{
            //         id:0,
            //         x:0,
            //         y:0,
            //         w:20,
            //         h: 10,
            //         i: 0,
            //         selectedChart: {
            //     id: 1,
            //     name: 'chart'
            // }
            //     }
            //     ],
            draggable: false,
            resizable: true,
            colNum: 12,
            index: 0,
            availableBalls,
            selectedBalls,
            selectedChart,
            droppableItemClass,
            onDragOver,
            onDragLeave,
            onDrop,
            colNumber: 1,
            showModal: false,
            rowNumber: 1,
            width: 0,
            height: 0,
            list1: [{
                    id: 1,
                    name: 'chart',
                    width: '300px',
                    height: '300px'
                },
                {
                    id: 2,
                    name: 'stockChart',
                    width: '300px',
                    height: '300px'
                },
                {
                    id: 3,
                    name: 'mapChart',
                    width: '300px',
                    height: '300px'
                }
            ],
            list2: [{
                    name: "Juan",
                    id: 5,
                    width: 100,
                    height: 5
                },
                {
                    name: "Edgard",
                    id: 6,
                    width: 100,
                    height: 5
                },
                {
                    name: "Johnson",
                    id: 7,
                    width: 100,
                    height: 5
                }
            ]
        }
    },
    mounted() {
        // this.$gridlayout.load();
        this.index = this.layout.length;

        this.width = this.$el.offsetWidth;
        this.height = this.$el.offsetHeight;
    },
    methods: {
        addRow: function () {
            for (let i = 0; i < this.colNumber; i++) {
                this.layout.push({
                    id: this.index + 1,
                    x: i == 0 ? 0 : (12 / this.colNumber) +
                        this.layout[i - 1].x,

                    y: this.rowNumber == 1 ?
                        (this.layout.filter(item => item.rowNum == this.rowNumber - 1)
                            .reduce((acc, shot) => acc = acc > shot.h ? acc : shot.h, 0)) : i == 0 ?
                        (this.layout.filter(item => item.rowNum == this.rowNumber - 1)
                            .reduce((acc, shot) => acc = acc > shot.h ? acc : shot.h, 0)) +
                        this.layout.find(item => item.rowNum == this.rowNumber - 1).y : this.layout.find(item => item.rowNum == this.rowNumber - 1).y,
                    w: 12 / this.colNumber,
                    h: 10,
                    rowNum: this.rowNumber,
                    selectedChart: {
                        id: 1,
                        name: 'chart'
                    },
                    i: this.index,
                    isDroppableItemActive: false
                });
                this.index++;
                this.rowNumber++;
            }
            this.showModal = false
            this.colNumber = 1

            console.log('this.layout', this.layout)
        },

        addColumn: function () {
            this.columns.push({
                id: this.columns.length + 1,
                name: 'list' + (this.columns.length + 2),
                components: [

                ],
                height: '100vh',
                width: '400px'
            })

            console.log('this.columns', this.columns)
        },
        log: function (evt) {
            window.console.log(evt);
        },
        removeItem: function (val) {
            const index = this.layout.map(item => item.id).indexOf(val);
            this.layout.splice(index, 1);
        },
        onResize({
            width,
            height
        }) {
            this.width = width;
            this.height = height;

            // console.log('this.columnsss', this.columns)
        }
    }
}
</script>

<style>
#page {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    /* margin: 0 auto; */
    /* margin-top: 60px; */
    width: 100%;
    display: flex;
    flex-direction: row;
    height: auto;
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
    height: 100vh;

    position: sticky;
    top: 0;
    z-index: 999;
    display: flex;
    flex-direction: column;
    align-items: center;

    min-width: 200px !important;
}

.container {
    width: 100%;
    flex-direction: row;
    /* justify-content: space-between; */
}

.header {
    min-height: 72px;
    height: 72px;
    width: 90%;
    margin-bottom: 24px !important;

    /* margin: 24px 16px; */
    background: #FFFFFF;
    border-radius: 5px;

    font-family: Poppins;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 48px;

    display: flex;
    align-items: center;

    color: #152755;

    padding: 0px 56px;

    box-shadow: 0px 1px 5px 0px rgba(35, 76, 162, 0.15);
}

.vue-grid-layout {
    background: #eee;
    width: 100%;
    height: auto;
    min-height: 80vh;
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
    width: 80%;
    /* min-height: 300px; */
    height: auto;
    /* height: 550px; */
    /* border: 1px dashed black; */
    padding: 40px;
    /* margin-bottom: 100px; */
}

.hover {
    background-color: rgb(172, 255, 158);
}

.resize {
    /* background-color: orange;
    width: 300px;
    height: 300px; */
    margin: 10px 0px;
    resize: both;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
