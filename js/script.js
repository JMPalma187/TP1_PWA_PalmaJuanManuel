const timeElement = document.getElementById('time');
const dateElement = document.getElementById('date');
const currentWeatherItemEl = document.getElementById('current-weather-items');
const timezone = document.getElementById('time-zone');
const country = document.getElementById('country');
const weatherForecastEl = document.getElementById('weather-forecast');
const currentTempElement = document.getElementById('current-temp');
const weatherIconElement = document.getElementById('weather-icon');
const windSpeedElement = document.getElementById('wind-speed');
const button = document.getElementById("sendButton");
const getMapElement = document.getElementById("get-map");
const main = document.getElementById("main");
const inputElement = document.getElementById("search");
const API_KEY = "b5706435574e4c44185696af5e20c4bc";
const API_KEY_TT= "0aXDopUHs93IzKTqNaVZCRhwloXW3d93";
const URL = "https://api.openweathermap.org/data/2.5/";

const daysArray = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
const monthArray = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
setInterval(() => {
  const time = new Date();
  const month = time.getMonth();
  const date = time.getDate();
  const day = time.getDay();
  const hour = time.getHours();
  const minutes = time.getMinutes();

  timeElement.innerHTML =  (hour<10 ? '0'+ hour : hour) + ':' +  (minutes<10 ? '0'+ minutes : minutes);
  dateElement.innerHTML = daysArray[day] + ", " + date + ' de ' + monthArray[month];
}, 1000);

button.addEventListener("click", () => {
    buscarEnAPI(inputElement.value);
});

const valor_city = JSON.parse(localStorage.getItem('CiudadGuardada'));
const info_guardada = JSON.parse(localStorage.getItem('infoGuardada'));

if (valor_city != null && info_guardada != null){
  showWeatherData(info_guardada.main);
  showIconId(info_guardada.weather[0].icon);
  showWind(info_guardada.wind.speed);
  showCoordinates(info_guardada.coord);
  placeandcountry(info_guardada);
}

function buscarEnAPI(cityToSearch){     
    // El otro tipo de fetch("https://api.openweathermap.org/data/2.5/weather?q="+cityToSearch+"&appid="+API_KEY).then(function(response)
    fetch(`${URL}weather?q=${cityToSearch}&appid=${API_KEY}&lang=es&units=metric`).then(function(response)
      {
        console.log(response);
        return response.json();
    }).then(function(responseJson){
                console.log(responseJson);
                showWeatherData(responseJson.main);
                showIconId(responseJson.weather[0].icon);                
                showWind(responseJson.wind.speed);
                showCoordinates(responseJson.coord);
                saveCity(responseJson);
                placeandcountry(responseJson)
              })
    .catch(function(error){
        console.log('No existe la ciudad o la chingaste --> ', error);
    })          

}

function placeandcountry(responseJson){
  timezone.innerHTML= responseJson.name;
  country.innerHTML= responseJson.sys.country;
}

function saveCity(responseJson){
  localStorage.setItem('CiudadGuardada', JSON.stringify(responseJson.name));
  localStorage.setItem('infoGuardada', JSON.stringify(responseJson));
}

function showIconId(icon_id){
  weatherIconElement.innerHTML=`<img src="https://openweathermap.org/img/wn/${icon_id}@2x.png" alt="Icono Clima de hoy" class="w-icon">`;
}

function showWeatherData(main){  
  /*console.log("A ver los datos", main);*/
    
  currentWeatherItemEl.innerHTML=
  `  <div class="weather-item">
          <div>Húmedad: </div>
          <div><b>${main.humidity}%</b></div>
      </div>
      <div class="weather-item">
         <div>Presión: </div>
         <div><b>${main.pressure} hPA</b></div>
      </div>
   `;
   
  currentTempElement.innerHTML=
   `
                    <div class="weather-item">
                        <div class="temp">Térmica:</div>
                        <div><b>${main.feels_like}&#176; C</b></div>
                        <div class="temp">Máxima: </div>
                        <div><b>${main.temp_max}&#176; C</b></div>
                        <div class="temp">Mínima: </div>
                        <div><b>${main.temp_min}&#176; C</b></div>
                    </div>  
   `
}

function showWind(windSpeed){
  windSpeedElement.innerHTML= '<b>' + windSpeed + ' km/h</b>';
}

function showCoordinates(coord){
  getMapElement.innerHTML = `<iframe title="Mapa de la ciudad" width="700" height="500" frameborder="0"  src="https://api.tomtom.com/map/1/staticimage?key=${API_KEY_TT}&zoom=8&center=${coord.lon},${coord.lat}&format=jpg&layer=basic&style=night&width=1305&height=748&view=Unified&language=es-MX"></iframe>`;
  fetch(`${URL}onecall?lat=${coord.lat}&lon=${coord.lon}&exclude={current,minutely,hourly,alert}&appid=${API_KEY}&lang=es&units=metric`).then(function(respuesta)
      {
        console.log(respuesta);
        return respuesta.json();
    }).then(function(respuestaJson){               
                console.log(respuestaJson.daily);
                showFutureForecast(respuestaJson.daily);
              })
    .catch(function(error){
        console.log('No existe la ciudad o la chingaste --> ', error);
    })

  }


  function showFutureForecast(daily){    
    /* console.log(daily.length); 
    var esp = moment().locale('es-mx');*/
    let i;
    let futureWeatherCreator = "" ;
    for (i = 1; i < 7; i++) {          
      futureWeatherCreator+=`
          <div class="col-10 col-md-3 offset-1 weather-forecast-item">                
            <div class="title-forecast-day">${window.moment(daily[i].dt*1000).format('dddd')}</div>
            <img src="https://openweathermap.org/img/wn/${daily[i].weather[0].icon}@2x.png" alt="El clima va a estar ${daily[i].weather[0].description}" class="w-icon">
            <div class="temp">Térmica: <b>${daily[i].feels_like.day}&#176; C</b></div>
            <div class="temp">Máxima: <b>${daily[i].temp.max}&#176; C</b></div>
            <div class="temp">Mínima: <b>${daily[i].temp.min}&#176; C</b></div>
          </div>          
      `; 
      }
      weatherForecastEl.innerHTML=futureWeatherCreator;
  }

  /* EL SWTICH DEL VIDEO MÁGICO

  Para esta Function, pensé en traer el valor "weather[0].main", que es el nombre del grupo que engloba
  los distintos tipos de climas según la documentación de la OpenWeatherMap.

  Documentación de estructura del los datos --> https://openweathermap.org/current#current_JSON´
  Listado de estado --> https://openweathermap.org/weather-conditions#Weather-Condition-Codes-2

  Luego usaría un switch que en función del valor de main (aka estado del Clima), tendría un video_ID asignado.

  Y a partir de ese video_id asignado, generaría el video con innerHTML o la función de YT Api.

  function showVideoClima(main){
    var video_id = '';
    switch (main) {    
      case 'Thunderstorm':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Drizzle':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Rain':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Snow':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Clear':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Clouds':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Mist':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Smoke':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Haze':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Dust':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Fog':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Sand':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Ash':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Squall':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      case 'Tornado':
        video_id = 'ID_del_Video_de_YouTube';
        break;
      default:
        video_id = '31g0YE61PLQ';
    }

  getVideo.innerHTML=`URL de Youtube cambiando API_KEY por ${API_KEY_GL(declada como const global)} el ID por ${video_id }`;
  }
*/