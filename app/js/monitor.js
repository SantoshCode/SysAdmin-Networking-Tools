const ip = require('ip');
const ping = require('ping');
const osu = require('node-os-utils');
const mem = osu.mem;
const os = osu.os;
const { exec } = require('child_process');
const Traceroute = require('nodejs-traceroute');
// const ipLocation = require('iplocation');
// Run every 2 secondsoo

//IP
// Local Ip
document.getElementById('local-ip').innerText = ip.address();
// Public IP
const Http = new XMLHttpRequest();
const Http2 = new XMLHttpRequest();

Http.open('GET', 'https://ipinfo.io/ip');
Http.send();
Http.onreadystatechange = e => {
	document.getElementById('public-ip').innerText = Http.responseText;
};

Http2.open('GET', 'http://v6.ipv6-test.com/api/myip.php');
Http2.send();
Http2.onreadystatechange = e => {
	document.getElementById('public-ipv6').innerText = Http2.responseText;
};

setInterval(() => {
	// Uptime
	document.getElementById('sys-uptime').innerText = secondsToDhms(
		os.uptime()
	);
}, 2000);

// Computer Name
document.getElementById('comp-name').innerText = os.hostname();

// OS
document.getElementById('os').innerText = `${os.type()} ${os.arch()}`;

// Total Mem
mem.info().then(info => {
	document.getElementById('mem-total').innerText = info.totalMemMb;
});

// Show days, hours, mins, sec
function secondsToDhms(seconds) {
	seconds = +seconds;
	const d = Math.floor(seconds / (3600 * 24));
	const h = Math.floor((seconds % (3600 * 24)) / 3600);
	const m = Math.floor((seconds % 3600) / 60);
	const s = Math.floor(seconds % 60);
	return `${d}d, ${h}h, ${m}m, ${s}s`;
}

//ping
function pingReturn(host) {
	let res = ping.promise.probe(host);
	return res;
}

//show content
function showContent(content) {
	document.getElementById('content-show').innerText = `${content}`;
}

startBtn = document.getElementById('content-start-btn');

startBtn.addEventListener('click', () => {
	let sel = document.getElementById('content-select');
	selOption = sel.options[sel.selectedIndex].value;
	let optionVal = document.getElementById('content-url').value;
	switch (selOption) {
		case 'ping':
			showContent('');
			pingReturn(optionVal).then(res => {
				showContent(res.output);
			});
			let stopVal = setInterval(() => {
				pingReturn(optionVal).then(res => {
					showContent(res.output);
				});
			}, 1000);
			setTimeout(() => {
				clearInterval(stopVal);
			}, 3000);
			break;
		case 'nmap':
			showContent('');
			showContent('Scanning...');
			exec(`nmap ${optionVal}`, (error, stdout, stderr) => {
				if (error) {
					showContent(`error: ${error.message}`);
					return;
				}
				if (stderr) {
					showContent(`${stderr}`);
					return;
				}
				showContent(`${stdout}`);
			});
			break;
		case 'traceroute':
			showContent('');
			let mapObj = '';
			try {
				let results = '';
				const tracer = new Traceroute();
				tracer
					.on('pid', pid => {
						results += `pid: ${pid}\n`;
						showContent(results);
					})
					.on('destination', destination => {
						results += `destination: ${destination}\n`;
						showContent(results);
					})
					.on('hop', hop => {
						obj = JSON.stringify(hop);
						results += `hop: ${obj}\n`;
						mapObj += obj;
						showContent(results);
					})
					.on('close', code => {
						GetMap(mapObj);
						results += `close: code ${code}\n`;
						showContent(results);
					});
				tracer.trace(optionVal);
			} catch (ex) {
				showContent(ex);
			}
			break;
		case 'iplocation':
			showContent('');
			(async () => {
				let loc = await ipLocation(optionVal);
				GetMap(optionVal);
				showContent(`
        continent: ${loc.continent.code}
        country: ${loc.country.name}
        city: ${loc.city}
          latitude: ${loc.latitude}
          longitude: ${loc.longitude}
          region: ${loc.region.name}
        `);
			})();
	}
});
