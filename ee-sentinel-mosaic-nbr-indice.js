var dataSet = ee.ImageCollection("COPERNICUS/S2_SR")
  .filterBounds(table)
  .filterDate('2023-07-01', '2023-07-31')
  .filterMetadata('CLOUD_SHADOW_PERCENTAGE', 'less_than', 0.1);

Map.centerObject(table)

//calculating the median of all values at each pixel across the stack of all matching bands
var img = ee.Image(dataSet.median()).clip(table);

// Select bands
var blue  = img.select('B2');
var green = img.select('B3');
var red   = img.select('B4');
var nir   = img.select('B8');
var swir1 = img.select('B11');
var swir2 = img.select('B12');

// vegetation indices equation
var nbr  = nir.subtract(swir2).divide((nir.add(swir2)))

Map.addLayer(img, { bands: ['B4', 'B3', 'B2'], min: 1285, max: 2736 }, 'Sentinel')
Map.addLayer(nbr, {min: -0.54, max: 0.14, palette: [ '2424d2',  'fca9ee', 'f0e56e', '178247']}, 'NBR')

//Export sentinel mosaic
Export.image.toDrive({
    image: nbr,
    folder: 'ee/mosaico/indices',
    description: 'ee-sentinel-nbr-indice',
    region: table,
    scale: 10,
    crs: 'EPSG:31980',
    maxPixels: 1e13,
    fileFormat: 'TIFF'
})