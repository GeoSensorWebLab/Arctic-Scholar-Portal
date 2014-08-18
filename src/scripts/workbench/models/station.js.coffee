class Workbench.Models.Feature extends Backbone.Model
  initialize: (attributes, options) ->
    @set "latitude", attributes.geometry.coordinates[1]
    @set "longitude", attributes.geometry.coordinates[0]
    @set "height", attributes.geometry.coordinates[2]

class Workbench.Models.Station extends HAL.Model
  initialize: (attributes, options) ->
    @geometry = new Workbench.Models.Feature(attributes.geo)
    @unset("geo")
    @sensors = new Workbench.Collections.SensorsCollection(@embedded.sensors)

    links = _.collect(@links, (value, key) ->
      {
        name: key,
        title: value["description"],
        href: value["href"]
      }
    )
    @linksCollection = new Backbone.Collection(links)

  latlng: ->
    [@geometry.get("latitude"), @geometry.get("longitude")]

class Workbench.Collections.StationsCollection extends Backbone.Collection
  model: Workbench.Models.Station