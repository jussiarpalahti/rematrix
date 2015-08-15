
React = require 'react'
d3 = require 'd3'
lodash = require 'lodash'
_ = lodash

HEIGTH = 10

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

build_scale = (dataset, height) ->
  all = _.filter(_.map(_.flatten(dataset), (datum) ->
    num = parseInt datum
    if _.isNumber num then num else null
  ))
  min = _.min all
  max = _.max all
  console.log("minmax", min, max)
  d3.scale.linear().domain([min, max]).range([0,10])


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
