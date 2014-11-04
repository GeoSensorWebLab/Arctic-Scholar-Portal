#= require 'autosize'
#= require 'arcticscholar'
#= require 'control.searchbar'
#= require 'control.datatable'
#= require 'control.search'
#= require_self

$(->
  Autosize.enable()
  window.pMap = polarMap('app')

  search = ArcticScholar.search()
  search.addTo(pMap.map, {
    layersControl: pMap.layersControl
  })
)
