const fs = require('fs');
const axios = require('axios').default;


class Busquedas{
    historial = [];
    dbPath='./db/database.json';

    constructor(){
        //TODO: leer DB si existe
        this.leerDB();
    }

    get historialCapitalizado(){



        return this.historial.map(lugar => {
            let palabras = lugar.split(' ');
            palabras = palabras.map( palabra => palabra[0].toUpperCase() + palabra.substring(1) )
 
            return palabras.join(' ');
        });
    }

    get paramsMapbox(){
        return{
            'access_token': process.env.MAPBOX_KEY,
            'limit': 5,
            'language': 'es'
        }
    }

    async ciudad(lugar = ''){
        //Peticion http
        try {

            //const resp = await axios.get('https://api.mapbox.com/geocoding/v5/mapbox.places/Espa%C3%B1a.json?access_token=pk.eyJ1IjoibWF4aXBwYWNoZWNvIiwiYSI6ImNrbDZ6dzRldDF6bm0zMHQ3eWwzcmZocjcifQ.oIYFPnRoJ02EuAUcus9p7w&autocomplete=true&limit=5&language=es');
            //console.log(resp.data);


            //Peticion http
            const instance = axios.create({
                baseURL:`https://api.mapbox.com/geocoding/v5/mapbox.places/${ lugar }.json`,
                params: this.paramsMapbox

            });

            const resp = await instance.get();

            //devolvemos el objeto
            return resp.data.features.map( lugar =>({
                id: lugar.id,
                nombre: lugar.place_name,
                lng: lugar.center[0],
                lat: lugar.center[1]
            }))



        } catch (error) {

            console.log(error);

            return [];

        }

    }

    get paramsOpenWeather(){
        return{
            
            appid: process.env.OPENWEATHER_KEY,
            units:'metric',
            lang: 'es'

        }
    }

    async climaLugar(lat, lon) {

        try {
            
            // instance-axios
            
            const instance = axios.create({
                baseURL: `https://api.openweathermap.org/data/2.5/weather`,
                params: {...this.paramsOpenWeather, lat, lon}

            })

            //resp => extraer data
            const resp = await instance.get();

            const { weather, main } = resp.data;


            return{
                desc: weather[0].description,
                min: main.temp_min,
                max: main.temp_max,
                temp: main.temp
            }

            /* return { descripcion, temperatura minima, maxima, temp normal} */

        } catch (error) {
            console.log(error);
            
        }
        
    }

    agregarHistorial(lugar = ''){
        
        //prevenir duplicados
        if (this.historial.includes(lugar.toLocaleLowerCase())) {
            return
        }

        this.historial = this.historial.splice(0, 5);

        this.historial.unshift( lugar.toLocaleLowerCase() );
        

        //grabar en DB
        this.guardarDB();


    }

    guardarDB(){

        const payload = {
            historial: this.historial
        }

        fs.writeFileSync(this.dbPath, JSON.stringify(payload))

    }

    leerDB(){
        if (!fs.existsSync(this.dbPath)) return;

        const info = fs.readFileSync(this.dbPath, {encoding: 'utf-8'})

        const data = JSON.parse(info);

        this.historial = data.historial;
    }

}


module.exports = Busquedas;