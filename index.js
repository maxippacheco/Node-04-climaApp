require('dotenv').config();

const { leerInput, pausa, inquirerMenu, listarLugares } = require("./helpers/inquirer");
const Busquedas = require("./models/busqueda");


const main = async () => {

    const busquedas = new Busquedas();
    let opt;

    do {

        opt = await inquirerMenu();

        switch (opt) {
            case 1:
            
                //Mostrar mensaje
                const termino = await leerInput('Ciudad: ');
                const lugares = await busquedas.ciudad(termino)
               
                //Buscar los lugares
                const id = await listarLugares(lugares);
        
                if (id === '0') continue;
                            

                //Seleccionar el lugar

                //buscamos por el id el lugar que la persona selecciono
                const lugarSeleccionado = lugares.find( lugar => lugar.id === id );
                //const { nombre, lat , lng } = lugarSeleccionado;

                //guardar en db
                busquedas.agregarHistorial(lugarSeleccionado.nombre)


                //Clima

                const clima = await busquedas.climaLugar(lugarSeleccionado.lat, lugarSeleccionado.lng);
                

                //Mostrar resultados
                console.clear();
                console.log('\nInformación de la ciudad\n'.green);
                console.log('Ciudad:', lugarSeleccionado.nombre );
                console.log('Lat:', lugarSeleccionado.lat );
                console.log('Lng:', lugarSeleccionado.lng );
                console.log('Temperatura:', clima.temp);
                console.log('Minima:', clima.min);
                console.log('Maxima:', clima.max);
                console.log('¿Cómo está el clima?:', clima.desc.green);

                break;

                case 2:
                    busquedas.historialCapitalizado.forEach((lugar, i) =>{
                        
                        const idx = `${i + 1}.`.green;

                        console.log(`${idx} ${lugar}`);
                    })
                break;

            default:
                break;
        }
        

        await pausa()

    } while (opt !== 0);
}

main();