
/*		CREACIÓN DE MAPA */
var map = L.map('map').setView([36.6840, -6.1360], 15);
/*		CREACIÓN DE MAPA */

/*		MAPA DE OPEN STREET MAP		*/
var osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {attribution: 'Tiles courtesy of <a href="http://openstreetmap.es/" target="_blank">OpenStreetMap Spain</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'}).addTo(map);
/*		MAPA DE OPEN STREET MAP		*/


/*		CARGA DEL GEOJSON PATRIMONIO COGIENDO SOLO LOS BIC		*/
var patrimonioBIC = L.geoJson(patrimonio,{
	pointToLayer: estiloIcon,
	onEachFeature: popup,
	filter: function(feature, layer) {
                return feature.properties.figura == "BIC";
            }
}).addTo(map);
/*		CARGA DEL GEOJSON PATRIMONIO COGIENDO SOLO LOS BIC		*/

/*		CARGA DEL GEOJSON PATRIMONIO COGIENDO SOLO LOS CG		*/
var patrimonioCG = L.geoJson(patrimonio,{
  	pointToLayer: estiloIcon,
  	onEachFeature: popupDos,
  	filter: function(feature, layer) {
                return feature.properties.figura == "CG";
            }
}).addTo(map);
/*		CARGA DEL GEOJSON PATRIMONIO COGIENDO SOLO LOS CG		*/

/*		ESTILO DEL POLÍGONO		*/
var stylePolygon = {
    "weight": 4,
    "color": 'red',
    "opacity": 1.0,
    "fillColor": 'red',
    "fillOpacity": 0.2
};
/*		ESTILO DEL POLÍGONO		*/


/*		CARGA DEL GEOJSON CONJUNTO HISTÓRICO		*/
var conjunto = L.geoJson(conjunto,{
	style: stylePolygon
}).addTo(map);
/*		CARGA DEL GEOJSON CONJUNTO HISTÓRICO		*/

/*		SECCIÓN DE CAPAS CON LOS MAPAS BASES Y CAPAS GEOJSON CARGADAS		*/
var baseMaps = {
	"OSM" : osm
}
var overlayMaps = {
	"<i class='conjuntoHistorico'></i> Conjunto Histórico" : conjunto,
	"<i class='iconoBIC'></i> Bien de Interés Cultural" : patrimonioBIC,
	"<i class='iconoCG'></i> Bien de Catalogación General" : patrimonioCG
};

L.control.layers(baseMaps, overlayMaps,{
	position: 'topright',
	collapsed: true,
	hideSingleBase: true
}).addTo(map);
/*		SECCIÓN DE CAPAS CON LOS MAPAS BASES Y CAPAS GEOJSON CARGADAS		*/

/*		CREACIÓN DE UN GRUPO DE LAYERS		*/
var patrimonioInmueble = L.layerGroup([patrimonioCG, patrimonioBIC]);
/*		CREACIÓN DE UN GRUPO DE LAYERS		*/


/*		CREACIÓN DE UNA FUNCIÓN QUE DETERMINA EL COLOR DE LA CAPA SEGÚN EL CAMPO FIGURA		*/
function colorTipo(figura){
	return  figura == 'BIC' ? 'blue' :
			figura == 'CG' ? 'orange' :
							 'red'
}
/*		CREACIÓN DE UNA FUNCIÓN QUE DETERMINA EL COLOR DE LA CAPA SEGÚN EL CAMPO FIGURA		*/


/*		CREACIÓN DE UNA FUNCIÓN QUE CREA UN ESTILO		*/
function estiloIcon(feature, latlng) {
	return L.circleMarker(latlng, {
		"radius": 7.0,
		"fillColor": colorTipo(feature.properties.figura),
		"color": '#FFFFFF',
		"weight": 2,
		"opacity": 1.0,
		"fillOpacity": 1
	})
};
/*		CREACIÓN DE UNA FUNCIÓN QUE CREA UN ESTILO		*/

/*		CREACIÓN DE UN CONTROL DE BÚSQUEDA		*/
var searchControl = new L.control.search({
		layer: patrimonioInmueble,
		initial: false,
		propertyName: 'nombre',
		circleLocation:true,
		buildTip: function(text, val) {
			var tipo = val.layer.feature.properties.figura;
			return '<a href="#" class="'+tipo+'">'+text+'<b>&nbsp;'+tipo+'</b></a>';
		},
		moveToLocation: function(latlng, title, map) {
		//map.fitBounds( latlng.layer.getBounds() );
		var zoom = map.getBoundsZoom(latlng.layer.getBounds());
  		map.setView(latlng, zoom); // access the zoom
		}
}).addTo(map);

searchControl.on('search:locationfound', function(e) {
	//console.log('search:locationfound', )
	map.removeLayer(this._markerSearch);
	//e.layer.setStyle({fillColor: '#3f0', color: '#0f0'});
	if(e.layer._popup)
		e.layer.openPopup();
});
	
map.addControl(searchControl);  //inizialize search control
/*		CREACIÓN DE UN CONTROL DE BÚSQUEDA		*/

/*		FUNCIONES POP UP		*/
function popup(feature, layer) { 
	if (feature.properties && feature.properties.nombre) 
	{ 
		layer.bindPopup( "<span class='tituloPeña'>" + feature.properties.nombre + "</span><br/><span class='tituloMunicipio'>Bien de Interés Cultural</span>"); 
	} 
};
function popupDos(feature, layer) { 
	if (feature.properties && feature.properties.nombre) 
	{ 
		layer.bindPopup( "<span class='tituloPeña'>" + feature.properties.nombre + "</span><br/><span class='tituloMunicipio'>Bien de Catalogación General</span>"); 
	} 
};
/*		FUNCIONES POP UP		*/