var fs = require('fs'),
    xml2js = require('xml2js');
		
var parser = new xml2js.Parser();
fs.readFile('Untitled map.kml', (err, data) => {
    parser.parseString(data, (err, result) => {
        reduceKml(result);
    });
});

function reduceKml(data) {
	var paths = data.kml.Document[0].Folder;
	paths = paths.map(path => {
		var coordinates = path.Placemark[0].LineString[0].coordinates[0];
		var coordList = coordinates.split(" ");
		/*return coordList.map(c => {
			var coord = c.split(",");
			var lat = parseFloat(coord[0]).toFixed(5), 
				lng = parseFloat(coord[1]).toFixed(5);
			return `${lat.toString()}, ${lng.toString()}`;
		})*/
		
		return coordList.map(c => {
			var coord = c.split(",");
			var lat = parseFloat(coord[0]).toFixed(5), 
				lng = parseFloat(coord[1]).toFixed(5);
			return `
			new LatLng(${lng.toString()}, ${lat.toString()})`;
		}).join(",")
	})
	
	var result = paths.map(p => {
		return `d.add(map.addPolyline(new PolylineOptions().add(${p}
).visible(false)));
`;
	}).join(" ");
	
	/*
	d.add(map.addPolyline(new PolylineOptions().add(
				new LatLng(-123.25037, 49.26204),...
		)));
	*/
	
	fs.writeFile("test.txt", result);
}
