var size = 0;
var placement = 'point';
function categories_output_jalan3lines_5(feature, value, size, resolution, labelText,
                       labelFont, labelFill, bufferColor, bufferWidth,
                       placement, textAlign, offsetX, offsetY, overflow, repeat) {
    var valueStr = (value !== null && value !== undefined) ? value.toString() : 'default';
    switch(valueStr) {
        case 'living_street':
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(254,240,217,0.5)', lineDash: null, lineCap: 'round', lineJoin: 'round', width: 1.9}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;

        case 'residential':
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(253,204,138,0.5)', lineDash: null, lineCap: 'round', lineJoin: 'round', width: 1.9}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;

        case 'service':
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(252,141,89,0.5)', lineDash: null, lineCap: 'round', lineJoin: 'round', width: 1.9}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;

        case 'unclassified':
            return [ new ol.style.Style({
        stroke: new ol.style.Stroke({color: 'rgba(252,141,89,0.5)', lineDash: null, lineCap: 'round', lineJoin: 'round', width: 1.9}),
        text: createTextStyle(feature, resolution, labelText, labelFont,
                              labelFill, placement, bufferColor,
                              bufferWidth, textAlign, offsetX, offsetY, overflow, repeat)
    })];
			break;
    }};

var style_output_jalan3lines_5 = function(feature, resolution){
    var context = {
        feature: feature,
        variables: {}
    };
    
    var labelText = ""; 
    var value = feature.get("highway");
    var labelFont = "13.0px \'Open Sans\', sans-serif";
    var labelFill = "#323232";
    var bufferColor = "";
    var bufferWidth = 0;
    var textAlign = 'left';
    var offsetX = 8;
    var offsetY = 3;
    var overflow = false;
    var repeat = 0;
    var placement = 'line';
    if ("" !== null) {
        labelText = String("");
    }
    
    var style = categories_output_jalan3lines_5(feature, value, size, resolution, labelText,
                          labelFont, labelFill, bufferColor,
                          bufferWidth, placement, textAlign, offsetX, offsetY, overflow, repeat);

    return style;
};
