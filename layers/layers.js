var wms_layers = [];


        var lyr_GoogleSatellite_0 = new ol.layer.Tile({
            'title': 'Google Satellite',
            'type':'base',
            'opacity': 1.000000,
            
            
            source: new ol.source.XYZ({
            attributions: '<a href="https://www.google.at/permissions/geoguidelines/attr-guide.html">Map data ©2015 Google</a>',
                url: 'https://mt1.google.com/vt/lyrs=s&x={x}&y={y}&z={z}'
            })
        });

/* Peta difokuskan pada Desa Pandanmulyo saja.
   Layer yang tidak relevan (GADM Indonesia, batas Provinsi Jawa Timur,
   serta duplikat batas desa) sengaja dihilangkan agar konten hanya
   seputar Desa Pandanmulyo. */
var layersList = [lyr_GoogleSatellite_0];

var format_Pandanmulyocopy_4 = new ol.format.GeoJSON();
var features_Pandanmulyocopy_4 = format_Pandanmulyocopy_4.readFeatures(json_Pandanmulyocopy_4, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_Pandanmulyocopy_4 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_Pandanmulyocopy_4.addFeatures(features_Pandanmulyocopy_4);
var lyr_Pandanmulyocopy_4 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_Pandanmulyocopy_4, 
                style: style_Pandanmulyocopy_4,
                popuplayertitle: 'Batas Desa Pandanmulyo',
                interactive: true,
                title: '<img src="styles/legend/Pandanmulyocopy_4.png" /> Batas Desa Pandanmulyo'
            });
layersList.push(lyr_Pandanmulyocopy_4);
var format_output_jalan3lines_5 = new ol.format.GeoJSON();
var features_output_jalan3lines_5 = format_output_jalan3lines_5.readFeatures(json_output_jalan3lines_5, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_output_jalan3lines_5 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_output_jalan3lines_5.addFeatures(features_output_jalan3lines_5);
var lyr_output_jalan3lines_5 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_output_jalan3lines_5, 
                style: style_output_jalan3lines_5,
                popuplayertitle: 'Jaringan Jalan',
                interactive: true,
    title: 'Jaringan Jalan<br />\
    <img src="styles/legend/output_jalan3lines_5_0.png" /> living_street<br />\
    <img src="styles/legend/output_jalan3lines_5_1.png" /> residential<br />\
    <img src="styles/legend/output_jalan3lines_5_2.png" /> service<br />\
    <img src="styles/legend/output_jalan3lines_5_3.png" /> unclassified<br />' });
layersList.push(lyr_output_jalan3lines_5);
var format_fasilitas_6 = new ol.format.GeoJSON();
var features_fasilitas_6 = format_fasilitas_6.readFeatures(json_fasilitas_6, 
            {dataProjection: 'EPSG:4326', featureProjection: 'EPSG:3857'});
var jsonSource_fasilitas_6 = new ol.source.Vector({
    attributions: ' ',
});
jsonSource_fasilitas_6.addFeatures(features_fasilitas_6);
var lyr_fasilitas_6 = new ol.layer.Vector({
                declutter: false,
                source:jsonSource_fasilitas_6, 
                style: style_fasilitas_6,
                popuplayertitle: 'Fasilitas',
                interactive: true,
    title: 'Fasilitas<br />\
    <img src="styles/legend/fasilitas_6_0.png" /> Fasilitas Kesehatan<br />\
    <img src="styles/legend/fasilitas_6_1.png" /> Kantor Administrasi<br />\
    <img src="styles/legend/fasilitas_6_2.png" /> Kopdes Merah Putih<br />\
    <img src="styles/legend/fasilitas_6_3.png" /> Wisata<br />\
    <img src="styles/legend/fasilitas_6_4.png" /> Sekolah<br />\
    <img src="styles/legend/fasilitas_6_5.png" /> Tempat Ibadah<br />' });
layersList.push(lyr_fasilitas_6);

layersList.forEach(function (l) { l.setVisible(true); });
lyr_Pandanmulyocopy_4.set('fieldAliases', {'GID_4': 'GID_4', 'GID_0': 'GID_0', 'COUNTRY': 'COUNTRY', 'GID_1': 'GID_1', 'NAME_1': 'NAME_1', 'GID_2': 'GID_2', 'NAME_2': 'NAME_2', 'GID_3': 'GID_3', 'NAME_3': 'NAME_3', 'NAME_4': 'NAME_4', 'VARNAME_4': 'VARNAME_4', 'TYPE_4': 'TYPE_4', 'ENGTYPE_4': 'ENGTYPE_4', 'CC_4': 'CC_4', });
lyr_output_jalan3lines_5.set('fieldAliases', {'fid': 'fid', 'osm_id': 'osm_id', 'name': 'name', 'highway': 'highway', 'waterway': 'waterway', });
lyr_fasilitas_6.set('fieldAliases', {'fid': 'fid', 'name': 'name', 'amenity': 'amenity', 'keterangan': 'keterangan', });
lyr_Pandanmulyocopy_4.set('fieldImages', {'GID_4': 'TextEdit', 'GID_0': 'TextEdit', 'COUNTRY': 'TextEdit', 'GID_1': 'TextEdit', 'NAME_1': 'TextEdit', 'GID_2': 'TextEdit', 'NAME_2': 'TextEdit', 'GID_3': 'TextEdit', 'NAME_3': 'TextEdit', 'NAME_4': 'TextEdit', 'VARNAME_4': 'TextEdit', 'TYPE_4': 'TextEdit', 'ENGTYPE_4': 'TextEdit', 'CC_4': 'TextEdit', });
lyr_output_jalan3lines_5.set('fieldImages', {'fid': 'TextEdit', 'osm_id': 'TextEdit', 'name': 'TextEdit', 'highway': 'TextEdit', 'waterway': 'TextEdit', });
lyr_fasilitas_6.set('fieldImages', {'fid': 'TextEdit', 'name': 'TextEdit', 'amenity': 'TextEdit', 'keterangan': 'TextEdit', });
lyr_Pandanmulyocopy_4.set('fieldLabels', {'GID_4': 'no label', 'GID_0': 'no label', 'COUNTRY': 'no label', 'GID_1': 'no label', 'NAME_1': 'no label', 'GID_2': 'no label', 'NAME_2': 'no label', 'GID_3': 'no label', 'NAME_3': 'no label', 'NAME_4': 'no label', 'VARNAME_4': 'no label', 'TYPE_4': 'no label', 'ENGTYPE_4': 'no label', 'CC_4': 'no label', });
lyr_output_jalan3lines_5.set('fieldLabels', {'fid': 'no label', 'osm_id': 'no label', 'name': 'inline label - always visible', 'highway': 'inline label - always visible', 'waterway': 'no label', });
lyr_fasilitas_6.set('fieldLabels', {'fid': 'no label', 'name': 'inline label - always visible', 'amenity': 'inline label - always visible', 'keterangan': 'no label', });
lyr_fasilitas_6.on('precompose', function(evt) {
    evt.context.globalCompositeOperation = 'normal';
});
