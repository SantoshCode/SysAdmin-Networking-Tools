const ipLocation = require('iplocation');

async function getLatAndLng(ip) {
	let loc = await ipLocation(ip);
	return await loc;
}

function GetMap(ipaddrs) {
	let el = document.createElement('DIV');
	el.innerHTML = `
    <div
			id="myMap"
			style="position: relative; width: 1600px; height: 800px;"
		></div>
  `;
	document.getElementById('map-home').insertAdjacentElement('beforeend', el);
	let re = /[0-9]*(\.)[0-9]*(\.)[0-9]*(\.)[0-9]*/gm;

	ips = ipaddrs.match(re);
	console.log(ips);

	(async () => {
		const result = await ips.map(async ip => {
			let loc = await ipLocation(ip);
			return [loc.latitude, loc.longitude];
		});
		return await Promise.all(result);
	})().then(res => {
		res.shift();
		console.log(res);
		let map = new Microsoft.Maps.Map('#myMap', {});
		map.setView({
			mapTypeId: Microsoft.Maps.MapTypeId.aerial,
		});

		//Create array of locations
		let newCoords = [];
		res.forEach(item => {
			if (item[0] !== null) {
				newCoords.push(new Microsoft.Maps.Location(item[0], item[1]));
			}
			return newCoords;
		});
		console.log(newCoords);
		//Create a polyline
		let line = new Microsoft.Maps.Polyline(newCoords, {
			strokeColor: 'red',
			strokeThickness: 3,
			strokeDashArray: [3, 3],
		});

		//Add the polyline to map
		map.entities.push(line);

		newCoords.forEach(coord => {
			//Create custom Pushpin
			let pin = new Microsoft.Maps.Pushpin(coord, null);

			//Add the pushpin to the map
			map.entities.push(pin);
		});
	});
}
