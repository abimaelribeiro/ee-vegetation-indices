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

// vegetation indices equation
var ndwi = green.subtract(nir).divide((green.add(nir)))

Map.addLayer(img, { bands: ['B4', 'B3', 'B2'], min: 1285, max: 2736 }, 'Sentinel')
Map.addLayer(ndwi, {min: -0.54, max: 0.14, palette: ['44a045','d5ebd5', '2424d2']}, 'NDWI')

//Export sentinel mosaic
Export.image.toDrive({
    image: ndwi,
    folder: 'ee/mosaico/indices',
    description: 'ee-sentinel-ndwi-indice',
    region: table,
    scale: 10,
    crs: 'EPSG:31980',
    maxPixels: 1e13,
    fileFormat: 'TIFF'
})