#= require 'autosize'
#= require 'arcticscholar'
#= require 'icons'
#= require 'control.searchbar'
#= require 'control.datatable'
#= require 'control.search'
#= require_tree templates
#= require_self

L.Icon.Default.imagePath = "/images"

$(->
  Autosize.enable()
  window.pMap = polarMap('app')

  search = ArcticScholar.search()
  search.addTo(pMap.map, {
    layersControl: pMap.layersControl
  })
)
