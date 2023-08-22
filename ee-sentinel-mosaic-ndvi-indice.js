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
var ndvi = nir.subtract(red).divide(nir.add(red));

//Add layer map
Map.addLayer(img, { bands: ['B4', 'B3', 'B2'], min: 1285, max: 2736 }, 'Sentinel')
Map.addLayer(ndvi, {min: -0.37, max: 0.79, palette: ['0938e3','bd2102' , 'ebd35e', '26bd3f', '18852a']}, 'NDVI');


//Export sentinel mosaic
Export.image.toDrive({
  image: ndvi,
  folder: 'ee/mosaico/indices',
  description: 'ee-sentinel-ndvi-indice',
  region: table,
  scale: 10,
  crs: 'EPSG:31980',
  maxPixels: 1e13,
  fileFormat: 'TIFF'
})