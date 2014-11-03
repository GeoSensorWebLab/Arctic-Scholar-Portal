#= require 'autosize'
#= require 'control.searchbar'
#= require_self

$(->
  Autosize.enable()
  window.pMap = polarMap('app')
  searchBar = ArcticScholar.Control.searchbar({
    onSearch: (query, searchbar) ->
      console.log("search requested:", query)
  })
  searchBar.addTo(pMap.map)
)
