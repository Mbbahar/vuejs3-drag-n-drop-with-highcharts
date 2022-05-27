<template>
  <div id="GridLayout">
  Columns: <input v-model.number="numberOfColumns" >
  <ul :style="gridStyle" class="card-list">
    <li v-for="(card, index) in cards" :key="index" class="card-item">
      {{ index + 1 }}
    </li>
  </ul>
  <button @click="addCard">
    Add card
  </button>
</div>
</template>

<script>

export default {
  name: '#GridLayout',
//   components: {
//     DraggableItem,
//     DroppableItem,
//     chart: Chart,
//     stockChart: StockChart,
//     mapChart: MapChart,
//   },
  setup() {
    return {
      cards: [1, 2, 3, 4],
      numberOfColumns: 3,
    }
  },
   computed: {
    gridStyle() {
        console.log('this.numberOfColumns', this.numberOfColumns)
      return {
        gridTemplateColumns: `repeat(${this.numberOfColumns}, minmax(100px, 1fr))`
      }
    },
  },
  methods: {
    addCard() {
      this.cards.push(this.cards[this.cards.length -1]+1)
    },
  },
}
</script>

<style>
.card-list {
  display: grid;
  grid-gap: 1em;
}

.card-item {
  background-color: dodgerblue;
  padding: 2em;
}

body {
  background: #20262E;
  padding: 20px;
  font-family: Helvetica;
}

#GridLayout {
  background: #fff;
  border-radius: 4px;
  padding: 20px;
  transition: all 0.2s;
}

ul {
  list-style-type: none;
}
</style>