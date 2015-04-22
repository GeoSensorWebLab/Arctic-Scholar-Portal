#= require 'autosize'
#= require 'arcticscholar'
#= require 'icons'
#= require 'control.searchbar'
#= require 'control.datatable'
#= require 'control.legend'
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

  legend = ArcticScholar.Control.legend({
    elements: [{
      description: "Publications"
      src: ArcticScholar.Icons.Yellow.iconUrl
    },
    {
      description: "Research Projects"
      src: ArcticScholar.Icons.Orange.iconUrl
    },
    {
      description: "Other"
      src: "/images/marker-icon.png"
    }]
  })
  legend.addTo(pMap.map)
)
