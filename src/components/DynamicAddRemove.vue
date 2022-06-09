<template>
<div class="sideBar">
    <span>PAGES</span>
    <div v-for="page in pages" v-bind:key="page.id">
        <button :class="[selectedPage.id == page.id ? 'sideBar-item selected-page': 'sideBar-item' ]" @click="selectPage(page)">
            {{ page.name }}
        </button>
    </div>

</div>
<div class="sideBar" v-show="isShowingComponentsMenu" style="background-color:rgb(73, 90, 106); position:absolute;">
    <button @click="addColumn">Add new column</button>
    <draggable class="dragArea list-group" :list="list1" :group="{ name: 'people', pull: 'clone', put: false }" @change="log" item-key="name">
        <template #item="{ element }">
            <div class="list-group-item sideBar-item">
                {{ element.name }}
            </div>
        </template>
    </draggable>
</div>

<div style="display:flex; flex-direction:column; width: 100vw">

    <div class="header">
        <span>{{selectedPage.name}}</span>
        <div>
            <button @click="changeEditMode">{{isShowingComponentsMenu ? 'Close Edit Mode' : 'Edit'}}</button>
            <button @click="saveFile">Save</button>
        </div>
    </div>
    <div id="page" :style="{opacity: isShowingComponentsMenu ? 0.7 : 1 }">

        <div class="container" v-for="item in columns" v-bind:key="item.id">

            <draggable class="dragArea list-group" :list="item.components" group="people" item-key="name" style="margin:0 5px; min-width:200px; min-height:200px; width:auto; height:auto;  position:relative ">
                <template #item="{ element }">
                    <div>

                        <component class="resize" v-resize="onResize" :is="element.name" @mouseenter="testFunction(item,element)"></component>
                        <span class="remove" @click="removeItem(item.id,element.id)">x</span>
                    </div>

                </template>
            </draggable>
        </div>
    </div>
</div>
</template>

<script>
import Chart from './Chart.vue'
import StockChart from './StockChart'
import MapChart from './MapChart'
import draggable from "vuedraggable";

export default {
    name: 'DraggableGridLayout',
    components: {
        chart: Chart,
        stockChart: StockChart,
        mapChart: MapChart,
        draggable
    },
    data() {
        const pages = [{
                id: 1,
                name: 'Home'
            },
            {
                id: 2,
                name: 'Summary'
            },
            {
                id: 3,
                name: 'Training'
            }
        ]
        const selectedPage = pages[0]
        const selectedItem = null
        const selectedList = null
        const changedItem = null
        const isShowingComponentsMenu = false

        return {
            layout: [],
            columns: [],
            index: 0,
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
            selectedItem,
            selectedList,
            changedItem,
            isShowingComponentsMenu,
            pages,
            selectedPage
        }
    },
    mounted() {
        this.index = this.columns.length;

        this.width = this.$el.offsetWidth;
        this.height = this.$el.offsetHeight;

        this.columns = this.selectedPage && JSON.parse(window.localStorage.getItem(`${this.selectedPage.name}_page`)) ?
            JSON.parse(window.localStorage.getItem(`${this.selectedPage.name}_page`)) : []

    },
    methods: {
        addColumn: function () {
            this.columns.push({
                id: this.columns.length + 1,
                name: 'list' + (this.columns.length + 2),
                components: [

                ],
            })
        },
        log: function (evt) {
            window.console.log(evt);
        },
        removeItem: function (listId, componentId) {
            let tempArr = this.columns.find(item => item.id == listId).components.filter(item => item.id == componentId)

            this.columns.find(item => item.id == listId).components = tempArr

            this.saveFile()
        },
        onResize({
            width,
            height
        }) {
            this.width = width;
            this.height = height;

            var tempArray = []
            var tempArrayComponents = []

            this.columns.forEach(list => {
                if (list.id == this.selectedList) {
                    list.components.forEach(item => {
                        item.id == this.selectedItem ?
                            item = {
                                ...item,
                                width: width,
                                height: height
                            } : item

                        tempArrayComponents.push(item)
                    })
                    list.components = tempArrayComponents
                }
                tempArray.push(list)
            })

        },
        testFunction(list, element) {
            this.selectedItem = element.id
            this.selectedList = list.id
        },
        saveFile: function () {
            const data = JSON.stringify(this.columns)
            window.localStorage.setItem(`${this.selectedPage.name}_page`, data);
            this.isShowingComponentsMenu = false
        },
        selectPage: function (page) {
            this.selectedPage = page
            this.columns = this.selectedPage && JSON.parse(window.localStorage.getItem(`${this.selectedPage.name}_page`)) ?
                JSON.parse(window.localStorage.getItem(`${this.selectedPage.name}_page`)) : []
        },
        changeEditMode: function () {
            this.isShowingComponentsMenu = !this.isShowingComponentsMenu
            this.columns = this.selectedPage && JSON.parse(window.localStorage.getItem(`${this.selectedPage.name}_page`)) ?
                JSON.parse(window.localStorage.getItem(`${this.selectedPage.name}_page`)) : []
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
    width: 100%;
    display: flex;
    flex-direction: row;
    height: auto;
}

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

    padding-top: 20px;

    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 48px;
}

.sideBar-item {
    height: 40px;
    width: 200px;
    font-size: 20px;
    color: #152755;
    margin-top: 8px !important;
    padding-left: 8px;

    display: flex;
    align-items: center;
    background-color: #FFFFFF;
    border-radius: 4px;

}

.sideBar-item:hover {
    background: linear-gradient(118deg, #7367f020, rgba(115, 103, 240, .7));
}

.selected-page {
    background: linear-gradient(118deg, #7367f0, rgba(115, 103, 240, .7));
    box-shadow: 0 0 10px 1px rgb(115 103 240 / 40%);
}

.container {
    flex-direction: row;
    position: relative;
}

.header {
    min-height: 72px;
    height: 72px;
    width: 90%;
    margin-bottom: 24px !important;
    background: #FFFFFF;
    border-radius: 5px;

    font-family: 'Lucida Sans', 'Lucida Sans Regular', 'Lucida Grande', 'Lucida Sans Unicode', Geneva, Verdana, sans-serif;
    font-style: normal;
    font-weight: 600;
    font-size: 18px;
    line-height: 48px;

    display: flex;
    align-items: center;
    justify-content: space-between;

    color: #152755;

    padding: 0px 56px;

    box-shadow: 0px 1px 5px 0px rgba(35, 76, 162, 0.15);
}

.resize {
    margin: 10px 0px;
    resize: both;
    overflow: auto;
    display: flex;
    justify-content: center;
    align-items: center;
}
</style>
