#= require 'autosize'
#= require 'arcticscholar'
#= require 'control.searchbar'
#= require 'control.datatable'
#= require_self

$(->
  Autosize.enable()
  window.pMap = polarMap('app')

  searchBar = ArcticScholar.Control.searchbar({
    onSearch: (query, searchbar) ->
      console.log("search requested:", query)
  })
  searchBar.addTo(pMap.map)

  datatable = ArcticScholar.Control.dataTable()
  datatable.addTo(pMap.map)
)
