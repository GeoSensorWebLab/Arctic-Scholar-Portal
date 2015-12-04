import './autosize';
import './arcticscholar';
import './icons';
import './control.searchbar';
import './control.datatable';
import './control.legend';
import './control.search';

L.Icon.Default.imagePath = "/images";

$(function() {
  Autosize.enable();
  window.pMap = polarMap('app');

  var search = ArcticScholar.search();
  search.addTo(pMap.map, {
    layersControl: pMap.layersControl
  });

  var legend = ArcticScholar.Control.legend({
    elements: [{
      description: "Publications",
      src: ArcticScholar.Icons.Yellow.iconUrl
    },
    {
      description: "Research Projects",
      src: ArcticScholar.Icons.Orange.iconUrl
    },
    {
      description: "Other",
      src: "/images/marker-icon.png"
    }]
  });
  legend.addTo(pMap.map);
});
