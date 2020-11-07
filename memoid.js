var isRotate = false;
var timer;
var defLayerIndex = 10;
var osm_attr = '&copy; <a href="http://openstreetmap.org" target="_blank">OpenStreetMap</a> | <a href="https://www.jawg.io/en/" target="_blank">JawgMaps<a>';
var jawgmaps = L.tileLayer('https://tile.jawg.io/jawg-sunny/{z}/{x}/{y}.png?access-token=As2pQo4ZwpsqvWrp50BfEsgrY3HuwvPop4KJWhul88Y2wKof1QfYu5IOFOjSPSws', { maxZoom: 19, minZoom: 6, opacity: 1} );

function popUp(f,l){
	var desc = '';
	var p = f.properties;

	desc+="<b>"+p.title+"</b><br/>Тип: "+p.type+"<br/>Дата установки: "+p.open+"</br>Адрес: "+p.addr;
	if (p.fulltext){
		desc+="<div style=\"border: 2px solid black;padding: 5px;margin-top: 5px;\"><i>"+p.fulltext+"</i></div>";
	}
	if (p.init){
		desc+="</br>Установка инициирована: " + p.init;
	}
	l.bindPopup(desc);
}


var geojsonLayer = new L.GeoJSON.AJAX("export.json", {
	onEachFeature:popUp, 
	pointToLayer: function (feature, latlng) {
		return L.circleMarker(latlng, {
			radius: 4,
			fillColor: "black",
			color: "yellow",
			weight: 1,
			opacity: 1,
			fillOpacity: 0.4
		});
	}
});

var geojsonLayerHackathon = new L.GeoJSON.AJAX("data.json", {
	onEachFeature:popUp, 
	pointToLayer: function (feature, latlng) {		
		var clr  = "gray";
		var icon = 'university';

		if (feature.properties.ref !== "Нет"){
			clr  = "black";
		}
		if (feature.properties.scale === "индивидуальный"){
			icon  = "male";
		}

		var mk  = L.marker(latlng, {icon: L.VectorMarkers.icon({icon: icon, prefix: 'fa', markerColor: clr, spin: false}) }).addTo(map);
		var suf = clr !== "black"? "<br/>О репрессиях ничего не говорится." : "";
		mk.bindLabel(feature.properties.title+suf);
		return mk;
	}
});

var baseLayers2 = {			
	"JawgMaps": jawgmaps,
	"OSM":  L.tileLayer('https://{s}.tile.osm.org/{z}/{x}/{y}.png', { maxZoom: 19, minZoom: 6, opacity: 1} ),
	"OSM (no lbl)":  L.tileLayer('https://tiles.wmflabs.org/osm-no-labels/{z}/{x}/{y}.png', { maxZoom: 19, minZoom: 6, opacity: 1} ),
	"River (OSM)":  L.tileLayer('https://{s}.tile.openstreetmap.fr/openriverboatmap/{z}/{x}/{y}.png', { maxZoom: 19, minZoom: 6, opacity: 1} )
};

var overlays = {
	"Наш слой": geojsonLayerHackathon,
	"Все монументы (OSM)": geojsonLayer
};
  
var map = L.map('map', { 
	zoomControl:false, 
	center: [55.75, 37.616667], 
	zoom: 10, 
	layers: [jawgmaps, geojsonLayerHackathon],
	});
L.control.layers(Object.assign(baseLayers2), overlays).addTo(map);