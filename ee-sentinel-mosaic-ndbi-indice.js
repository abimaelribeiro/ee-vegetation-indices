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

// vegetation indices equation
var ndbi = swir1.subtract(nir).divide((swir1.add(nir)))

Map.addLayer(img, { bands: ['B4', 'B3', 'B2'], min: 1285, max: 2736 }, 'Sentinel')
Map.addLayer(ndbi, {min: -0.28, max: 0.23, palette: ['053cf0', '38d173', 'f9ff8f', 'edcf6d', 'f27052']}, 'NDBI')

//Export sentinel mosaic
Export.image.toDrive({
    image: ndbi,
    folder: 'ee/mosaico/indices',
    description: 'ee-sentinel-ndbi-indice',
    region: table,
    scale: 10,
    crs: 'EPSG:31980',
    maxPixels: 1e13,
    fileFormat: 'TIFF'
})