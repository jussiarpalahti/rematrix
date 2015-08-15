
React = require 'react'

lodash = require 'lodash'
_ = lodash


VizBase = React.createClass
  displayName: 'VizBase'
  render: ->
    data = if this.props.data then this.props.data else (i for i in [0..4] for j in [1..4])
    scale = build_scale(this.props.data)
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
        height: this.props.scale(datum)
        position: 'absolute'
        left: pos + 'em'
        bottom: 0
        border: '2px solid ' + colors[this.props.mover]
        display: 'block'

      <div style={place} title={datum} key={index} > </div>

    <div style={position:'absolute', height: '10em', width: '30em', top: '1em', left: '1em'}>{boxes}</div>

build_scale = (dataset) ->
  all = _.filter(_.map(_.flatten(dataset), (datum) ->
    num = parseInt datum
    if _.isNumber num then num else null
  ))
  min = _.min all
  max = _.max all
  distance = max - min
  (datum) ->
    Math.floor((datum + 1) * 20 * (Math.random() + 0.5), 1) + 'px'

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
