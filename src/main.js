import 'core-js/stable'
import 'regenerator-runtime/runtime'
import { createApp } from 'vue'
import App from './App.vue'

import HighchartsVue from 'highcharts-vue'
import Highcharts from 'highcharts'
import stockInit from 'highcharts/modules/stock'
import mapInit from 'highcharts/modules/map'
import addWorldMap from './js/worldmap'

import VueGridLayout from "vue-grid-layout";
const VueResizeObserver = require("vue-resize-observer");
import VueDraggable from "vuedraggable";

stockInit(Highcharts)
mapInit(Highcharts)
addWorldMap(Highcharts)

const app = createApp(App);

app.use(VueGridLayout);
app.use(HighchartsVue);
app.use(VueResizeObserver) ;
app.use(VueDraggable);

app.mount("#app");

