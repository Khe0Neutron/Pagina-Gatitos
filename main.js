const API_KEY = 'live_H7JqvuqouQODrZjKlVQwSnVN66gDvn7rcJ9kwmAIOYnIxtKGMTTGBzONc0LuA8Mi';

let boton = document.querySelector('#boton');
// Selecciona todos los elementos con la clase 'boton'
const botones_fav = document.querySelectorAll('.boton');
const container = document.getElementById('randomMichis');
container.className = "row mt-4";
const spanError = document.getElementById('error');
const container_fav = document.getElementById('favoritesMichis');
container_fav.className = "row mt-4";
const BASE_URL = 'https://api.thecatapi.com/v1/images/search';
const FAV_URL = 'https://api.thecatapi.com/v1/favourites/';
const UPLOAD_URL = 'https://api.thecatapi.com/v1/images/upload';
const DEL_URL = (id) => `https://api.thecatapi.com/v1/favourites/${id}`;

async function saveFavoritesMichis(id) {
    const res = await fetch(`${FAV_URL}`,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-API-KEY': `${API_KEY}`,
        },
        body: JSON.stringify({
             image_id: id
        }),
    });
    console.log('guardar')
    console.log(id)   
    const data = await res.json();   
    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        console.log('Michi agregado a favoritos')
        fetchFavoritesMichis();
    }
}

async function deleteFavoritesMichis(id){
    id = Number(id);
    console.log('id en dekete');
    console.log(typeof id);
    console.log(id);

    const res = await fetch(DEL_URL(id), {
        method: 'DELETE',
        headers: {
            'X-API-KEY': 'live_H7JqvuqouQODrZjKlVQwSnVN66gDvn7rcJ9kwmAIOYnIxtKGMTTGBzONc0LuA8Mi',
        },
      });
    const data = await res.json();   
    if (res.status !== 200) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
    } else {
        console.log('Michi eliminado de favoritos')
        fetchFavoritesMichis();
    }
}
async function uploadMichiPhoto() {
    const form = document.getElementById('uploadingForm') //agarra todos los inputs agregados a uploadingFOrm
    const formData = new FormData(form); //crea el FormData

    const res = await fetch(UPLOAD_URL, {
        method: 'POST',
        headers: {
            //'Content-Type': 'multipart/form-data',
            'X-API-KEY': `${API_KEY}`,
        },
        body: formData,
    })
    var fileInput = document.getElementById('file');
    if (fileInput.files.length === 0) {
        document.getElementById('mensajeSubida').style.color = 'red';
        document.getElementById('mensajeSubida').textContent = 'No subido!';
        document.getElementById('mensajeSubida').style.display = 'inline';
        return; // Salir de la función si no hay archivo seleccionado
    }
    document.getElementById('mensajeSubida').style.color = 'green';
    document.getElementById('mensajeSubida').textContent = 'Subido!';
    document.getElementById('mensajeSubida').style.display = 'inline';
    
    const data = await res.json();

    if (res.status !== 201) {
        spanError.innerHTML = "Hubo un error: " + res.status + data.message;
        console.log({data})
    } else {
        console.log('Foto de Michi Subida :D')
        console.log({data})
        console.log(data.url)
        console.log(data.id)
        saveFavoritesMichis(data.id);
    }
}
async function fetchFavoritesMichis() {
    const res = await fetch(`${FAV_URL}`,{
        method: 'GET',
        headers:{
            'X-API-KEY': `${API_KEY}`,
        },
        });
    try {
        const data = await res.json();
        // Elimina el contenido anterior del contenedor, si lo hubiera
        console.log('favoritos');
        console.log(data);
        console.log(data.length);
        container_fav.innerHTML = '';
        for (let i = 0; i < data.length; i++) {
            console.log('for');
            const img = document.createElement('img');
            const btn = document.createElement('button');
            const btnId = 'btn_del_fav' + i;
            const div1 = document.createElement('div');
            const div2 = document.createElement('div');
            const div3 = document.createElement('div');
            const div4 = document.createElement('div');
            const spanElement = document.createElement('h1');
            const spanElement2 = document.createElement('h1');
            btn.id = btnId;
            btn.onclick = function() {
                deleteFavoritesMichis(`${data[i].id}`); // Pasar el índice como argumento a la función
            };
            btn.textContent = 'Eliminar';
            btn.className = 'btn btn-outline-warning mb-2 ml-2 mr-2';
            img.className = "card-img-top";
            img.src = data[i].image.url;
            img.height = 250;
            img.style.padding = '10px';
            img.style.borderRadius = '25px';
            img.alt = 'Random cat photo';
            spanElement.className = "badge badge-success mr-2";
            spanElement2.className = "badge badge-warning mr-2";
            spanElement.textContent = "ID: " + data[i].id;
            spanElement2.textContent = "Favorita n° " + (i+1);
            div4.className = "badge mb-2";
            div3.className = "card-body";
            div3.style.padding = "0";
            div2.className = "card";
            div1.className = "col-sm-12 col-md-6 col-lg-2 mb-4";
            div4.appendChild(spanElement2);
            div4.appendChild(spanElement);
            div3.appendChild(div4);
            div2.appendChild(img);
            div2.appendChild(div3);
            div2.appendChild(btn);
            div1.appendChild(div2);
            container_fav.appendChild(div1);
        }
    } catch (error) {
        console.error('Error:', error);
        if (res.status !== 200) {
            spanError.textContent = spanError.textContent +"Hubo un error en favoritos:"+res.status;
        } 
    }
}

async function fetchData(numImages) {
    const response = await fetch(`${BASE_URL}?limit=${numImages}`,{
        headers: {
            'X-API-KEY':`${API_KEY}`,
        },
    });
    try {   
        const data = await response.json();
        console.log('dataset');
        console.log(data);
        // Elimina el contenido anterior del contenedor, si lo hubiera
        if (response.status !== 200) {
            spanError.textContent = "Hubo un error: " + response.status;
        } else {
            container.innerHTML = '';
            for (let i = 0; i < numImages; i++) {
                const img = document.createElement('img');
                const btn = document.createElement('button');
                const btnId = 'boton_' + i;
                const div1 = document.createElement('div');
                const div2 = document.createElement('div');
                const div3 = document.createElement('div');
                const div4 = document.createElement('div');
                const spanElement = document.createElement('h1');
                const spanElement2 = document.createElement('h1');
                btn.textContent = 'Favoritos';
                btn.id = btnId;
                btn.className = 'btn btn-outline-success mb-2 ml-2 mr-2';
                btn.onclick = function() {
                    if (data[i].id !== undefined && data[i].id !== null) {
                        saveFavoritesMichis(data[i].id);
                    } else {
                        console.error("ID is undefined or null.");
                    }
                };
                img.className = "card-img-top";
                img.src = data[i].url;
                img.height = 200;
                img.alt = "Random cat photo";
                spanElement.className = "badge badge-success mr-2";
                spanElement2.className = "badge badge-warning mr-2";
                spanElement.textContent = "ID: " + data[i].id;
                spanElement2.textContent = "Imagen n° " + (i+1);
                div4.className = "badge mb-2";
                div3.className = "card-body";
                div3.style.padding = "0";
                div2.className = "card";
                div1.className = "col-sm-12 col-md-6 col-lg-2 mb-4";
                div4.appendChild(spanElement2);
                div4.appendChild(spanElement);
                div3.appendChild(div4);
                div2.appendChild(img);
                div2.appendChild(div3);
                div2.appendChild(btn);
                div1.appendChild(div2);
                container.appendChild(div1);
            }
        }
    } catch (error) {
        console.error('Error:', error);
        if (res.status !== 200) {
            spanError.textContent = spanError.textContent +"Hubo un error en favoritos:"+res.status;
        }
    }
}

fetchData(6);
fetchFavoritesMichis();

//saveFavoritesMichis();
boton.addEventListener('click', function () {
    const cajaTexto = document.getElementById('cajaTexto');
    const numImages = parseInt(cajaTexto.value);

    if (!isNaN(numImages) && numImages > 0) {
        fetchData(numImages);
    } else {
        console.error('Invalid input. Please enter a valid number greater than 0.');
    }
});