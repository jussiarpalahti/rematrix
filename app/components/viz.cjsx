
React = require 'react'
d3 = require 'd3'
lodash = require 'lodash'
_ = lodash

HEIGTH = 30

VizBase = React.createClass
  displayName: 'VizBase'
  render: ->
    data = if this.props.data then this.props.data else (i for i in [0..4] for j in [1..4])
    scale = build_scale(this.props.data, HEIGTH)
    <div id="viz">{<Box key={index} mover={index} dataset={piece} scale={scale} /> for piece, index in data}</div>

colors =
  0: 'black'
  1: 'green'
  2: 'blue'
  3: 'red'

Box = React.createClass
  displayName: 'Box'
  render: ->
    boxes = for datum, index in this.props.dataset
      pos = index * 6 + this.props.mover * 1.3
      place =
        width: "0.8em"
        height: _.floor(this.props.scale(datum), 4) + 'em'
        position: 'absolute'
        left: pos + 'em'
        bottom: 0
        border: '2px solid ' + colors[this.props.mover]
        display: 'block'

      <div style={place} title={datum} key={index} > </div>

    <div style={position:'absolute', height: HEIGTH + 'em', width: '30em', top: '1em', left: '1em'}>{boxes}</div>

BoxContainer = React.createClass
  displayName: 'BoxContainer'
  render: ->
    selection = pick_axis(this.props.data, this.props.row, this.props.col)
    scale = build_scale(selection, HEIGTH)
    <Sparkline dataset={selection} scale={scale}/>

Sparkline = React.createClass
  displayName: 'Sparkline'
  render: ->
    boxes = for datum, index in this.props.dataset
      pos = index * 8
      if datum? and datum > 0
        height = _.floor(this.props.scale(datum), 0) + 'px'
      else
        height = 0
      place =
        width: '5px'
        height: height
        border: '1px solid lightblue'
        background: 'blue'
        position: 'absolute'
        left: pos + 'px'
        bottom: 0

      <span style={place} title={datum} key={index} ></span>

    <div style={position: 'relative', height: HEIGTH + 'px', width: this.props.dataset.length * 8 + 'px'}>{boxes}</div>

build_scale = (dataset, height) ->
  all = _.map(dataset, (datum) ->
    num = parseInt datum
    if _.isNumber num then num else null
  )
  min = _.min all
  max = _.max all
  d3.scale.linear().domain([min, max]).range([1,height])

pick_axis = (data, row, col) ->
  if row?
    data[row]
  else if col?
    (row_index[col] for row_index in data)
  else
    null

main = ->
  console.log 'app'
  if document.getElementById 'app'
    app = document.getElementById 'app'
  else
    app = document.createElement 'div'
    app.id = 'app'
  document.body.appendChild app;
  React.render <div><VizBase /></div>, app

module.exports =
    VizBase: VizBase
    Box: Box
    BoxContainer: BoxContainer
