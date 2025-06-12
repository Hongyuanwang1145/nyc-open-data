let data, info, output;
let map = undefined;

async function init(){
  let link = "https://data.cityofnewyork.us/resource/h9gi-nx95.json?$limit=200";
  info = await fetch(link);
  data = await info.json();
  console.log(data);
  
    output = document.getElementById("output");
  let build = "";
  for(let i = 0; i < data.length; i++){
    let persons = data[i];
    build += `<div class="card fitted">`;
    build += `     <h3>Victum: ${persons.number_of_persons_killed} ${persons.number_of_persons_injured}</h3>`;
    build += `</div>`;
  }
  output.innerHTML = build;
}
//cards
 
 //charts
function ByBorough(){
  let QU = 0, BK = 0, MA = 0, ST = 0;
  
  for(let i = 0; i < data.length; i++){
    let complaint = data[i];
    if(complaint.borough == "QUEENS"){
      QU++;
    }else if(complaint.borough == "MANHATTAN"){
      MA++;
    }else if(complaint.borough == "BROOKLYN"){
      BK++;
    }else if(complaint.borough == "STATEN ISLAND"){
      ST++; 
	}
	}
	let chartData = [
    ["QUEENS", q],
    ["MANHATTAN", m],
    ["BROOKLYN", bk],
    ["STATEN ISLAND", s]	
  ];
 
	let chartType = document.getElementById("chartType").value;
displayChart(chartData,"output",chartType);
  }
 
function displayChart( data, chart_id, chart_type ){
  let chart = c3.generate({
    bindto: `#${chart_id}`,
    data: {
      columns: data,
      type: chart_type
    }
  });
}

  //map
async function displayLocation(){
  let lat = document.getElementById("lat").value;
  let lon = document.getElementById("lon").value;
  let location = [lat, lon];
  let address = document.getElementById("address");  
  if(address.value != ""){
    location = await geocodeWithNominatim(address.value);
  }
  
  showMap(location);
}


function showMap(location){	
  if (map) {
    map.remove();
  }
  map = L.map("map").setView(location, 14);

  const tiles = L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
    attribution: "&copy; <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a>"
  }).addTo(map);

  let marker = L.marker(location).addTo(map);
}     


const geocodeWithNominatim = async (address) => {
  const encoded = encodeURIComponent(address);
  const url = `https://nominatim.openstreetmap.org/search?q=${encoded}&format=json`;

  try {
    const response = await fetch(url);
    const results = await response.json();

    if (results.length > 0) {
      const { lat, lon } = results[0];
      console.log(`Latitude: ${lat}, Longitude: ${lon}`);
      return [lat,lon];
    } else {
      console.log('No results found.');
    }
  } catch (err) {
    console.error('Error:', err);
  }
}