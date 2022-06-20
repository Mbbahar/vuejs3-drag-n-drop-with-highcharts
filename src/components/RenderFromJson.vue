<template>
<div class="sideBar">
    <span>PAGES</span>
    <div v-for="item in myJson.contents" v-bind:key="item.id">
        <button :class="[selectedIndex+1 == item.id ? 'sideBar-item selected-page': 'sideBar-item' ]" @click="selectedIndex = item.id-1">
            {{item.id}}
        </button>
    </div>

</div>

<div style="display:flex; flex-direction:column; width: 100vw">

    <div class="header">
        <span>{{'Content '+(selectedIndex+1)}}</span>
    </div>

      <Container :title='myJson.title' :children='myJson.children' />

    <!-- <div v-for="row in myJson.contents[selectedIndex].rows" v-bind:key="row.id">

        <div v-html="row.components" 
        style="display:flex; flex-direction:row;background-color:red"
         >
       
        </div>
    </div> -->

</div>
</template>

<script>
import json from '../json/data.json'

const Container = props => {
  return (
    <div class="container">
      <h1>{props.title}</h1>
      {renderChildren(props.children)}
    </div>
  )  
}

const Tabs = props => {
  return (
    <div class="tab">
      {renderChildren(props.children)}
    </div>
  )
}

const Row = props => {
  return (
    <div class="row">
      {renderChildren(props.children)}
    </div>
  )
}

const Column = props => {
  return (
    <div class="column">
      {renderChildren(props.children)}
    </div>
  )
}

const Common = props => {
  return (
    <div class="common">
      {renderChildren(props.children)}
    </div>
  )
}

const SelectGroup = props => {
  return (
    <div class="select-group">
      <label htmlFor={props.label.replace(" ","-")}>{props.label}</label>
      <select name={props.label.replace(" ","-")}>
        {
          props.options.map((option, ind)=>{
          
            return (
              <option key={`${option}-${ind}`} value={option}>
                {option}
              </option>
            )
          })
        }
      </select>
    </div>
  )
}

const InputGroup = props => {
  const types = { "Text": 'text', "Date": 'date', "Numeric": "number"}
  return (
    <div class="input-group">
      <label htmlFor={props.label.replace(" ","-")}>{props.label}</label>
      <input name={props.label.replace(" ","-")} type={types[props.type]}/>
    </div>
  )
}

const renderChildren = children => {

    return children ? children.map((child, ind) => {
      const newChildren = child.children ? [...child.children] : [];
      const {containerType, title, input, label, options} = child
      let key;
      if (newChildren.length) {
        key = `${containerType}-${ind}`;
        switch (containerType) {
          case "Tabs":
            return <Tabs 
                      key={key} 
                      title={title} 
                      children={newChildren}
                   />
          case "Column":
            return <Column 
                      key={key} 
                      title={title} 
                      children={newChildren}
                   />
          case "Row":
            return <Row 
                      key={key} 
                      title={title} 
                      children={newChildren}
                   /> 
          default:
            return <Common 
                      key={key} 
                      title={title} 
                      children={newChildren}
                   />    
        }
      } else {
        key=`${input}-${ind}`
        switch (input) {
          case "ComboBox":
            return <SelectGroup
                     key={key}
                     label={label}
                     options={options}
                   />
          case "Text":
          case "Date":
          case "Numeric":
            return <InputGroup
                     key={key}
                     label={label}
                     type={input}
                   />           
        }
      }
      
    }) : null
}


export default {
    name: 'DraggableGridLayout',
    components: { Container },
    data() {

        return {
            myJson: json,
            selectedIndex: 0,
        }
    },
    methods: {
    
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
    /* background: linear-gradient(118deg, #7367f020, rgba(115, 103, 240, .7)); */
    background-color: bisque;
}

.selected-page {
    background: linear-gradient(118deg, #7367f0, rgba(115, 103, 240, .7));
    box-shadow: 0 0 10px 1px rgb(115 103 240 / 40%);
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

.container {
  width: 90%;
  max-width: 1280px;
  margin: 30px auto;
  border: 1px solid #ccc;
  border-radius: 5px;
}

h1 {
  text-align: center;
}

.tab {
  padding: 30px;
}

.row {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.row + .row {
  margin-top: 20px;
}

.column {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.input-group, .select-group {
  display: flex;
  flex-direction: row;
  justify-content: left;
  align-items: center;
  height: 30px;
  width: 100%;
}

.input-group>input, .select-group>select {
  flex: 1;
  padding: 3px 7px;
  margin-left: 7px;
}

.input-group + .input-group, .input-group + .select-group, .select-group + .input-group, .select-group + .select-group {
  margin-left: 20px;
}
</style>
