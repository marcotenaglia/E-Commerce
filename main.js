class Producto {
    constructor(nombre, talle, precio, id, cantidad, imagen) {
        this.nombre = nombre;
        this.talle = talle;
        this.precio = precio;
        this.id = id;
        this.cantidad = cantidad;
        this.imagen = imagen;
    }

    iva() {
        this.precio = parseFloat((this.precio * 1.20).toFixed(1));
    }
}


const grupo = [];

grupo.push(new Producto("Remera Azul", "", 3000, "1", 1, "images/Azul.jpg"));
grupo.push(new Producto("Remera Roja", "", 5000, "2", 1, "images/Roja.jpg"));
grupo.push(new Producto("Remera Verde", "", 4200, "3", 1, "images/Verde.jpg"));
grupo.push(new Producto("Remera Negra", "", 5500, "4", 1, "images/Negra.jpg"));
grupo.push(new Producto("Remera Celeste", "", 3500, "5", 1, "images/Celeste.jpg"));
grupo.push(new Producto("Remera Blanca", "", 7000, "6", 1, "images/Blanca.jpg"));


for (let cadaUno of grupo) {
    cadaUno.iva();
}

for (const producto of grupo) {
    let divProductos = document.createElement("div");
    divProductos.classList.add('caja-producto')
    divProductos.innerHTML = `
                                <div id="producto">${producto.nombre}</div>
                                <img class="imagen" src="${producto.imagen}" alt="">
                                <div id="precio">$${producto.precio}</div>                                
                                <div class="caja-select">
                                  <select class="select" id="${producto.id}" class="talles">
                                    <option value="XS">XS</option>
                                    <option value="S">S</option>
                                    <option value="M">M</option>
                                    <option value="L">L</option>
                                    <option value="XL">XL</option>
                                    <option value="XXL">XXL</option>
                                  </select>
                                  <button onClick=
                                   "setTimeout(() => {
                                    document.getElementById('confirm-btn').scrollIntoView({ behavior: 'smooth' });
                                }, 10);" id="${producto.id}" class="btns">AÑADIR AL CARRITO</button></div>
                                </div>
                                `
    const divContenedor = document.getElementById("div-contenedor");
    divContenedor.appendChild(divProductos);
}

let total = 0


let divTotalHijo = document.createElement("div")
divTotalHijo.classList.add("total")
divTotalHijo.innerHTML = `TOTAL ${total}`
const divTotal = document.getElementById("total")
divTotal.append(divTotalHijo)

let carrito = []

let divCarrito = document.getElementById("div-carrito")

if ("carrito" in localStorage) {

    const guardados = JSON.parse(localStorage.getItem("carrito"))

    for (const generico of guardados) {
        carrito.push(new Producto(generico.nombre, generico.talle, generico.precio, generico.id, generico.cantidad, generico.imagen))
    }

    total = carrito.reduce((acumulador, elemento) => acumulador + elemento.precio * elemento.cantidad, 0);

    carritoHTML(carrito);

    sumarTotal(0)
    confirmar()
}



let botones = document.getElementsByClassName("btns")
for (const boton of botones) {
    boton.addEventListener("click", function () {
        let seleccion = grupo.find(e => e.id == this.id)


        seleccion.talle = document.getElementById(this.id).value;

        if (carrito.find(e => e.id == seleccion.id))
            Swal.fire("Este elemento ya esta en el carrito.");
        else {
            nuevo = { ...seleccion }
            carrito.push(nuevo)
            carritoHTML(carrito);
            localStorage.setItem("carrito", JSON.stringify(carrito))
            sumarTotal()
            confirmar()
        }
    })
}

function carritoHTML(items) {
    divCarrito.innerHTML = ""
    divCarrito.classList.add('div-carrito')
    for (const elemento of items) {
        let divCarritoItem = document.createElement("div");
        let input = document.createElement('input');
        input.type = 'number'
        input.min = 1
        input.max = 10
        input.classList.add('inputs')
        input.value = elemento.cantidad
        input.addEventListener("change", function () {
            let span = this.parentElement.querySelector('span')
            elemento.cantidad = this.value
            span.innerText = elemento.precio * elemento.cantidad
            localStorage.setItem("carrito", JSON.stringify(carrito))
            totalInput = elemento.precio
            sumarTotal()
            confirmar()
        })
        divCarritoItem.innerHTML = ` ${elemento.nombre} <br> Talle ${elemento.talle} <br> <img class="imagen-carrito" src="${elemento.imagen}" alt=""> Precio <span>$${elemento.precio * elemento.cantidad}</span> `
        divCarritoItem.classList.add("carrito-item")
        divCarritoItem.append(input)
        divCarrito.append(divCarritoItem);
    }
}

function botonBorrarEvento(div) {
    let botonBorrar = document.getElementById("delete-btn")
    botonBorrar.addEventListener("click", function () {
        carrito = []
        carritoHTML(carrito)
        sumarTotal()
        div.innerHTML = ""
        localStorage.setItem("carrito", JSON.stringify(carrito))
    })
}

const fetchCall = async () => {
    const resp = await
        fetch("https://apis.datos.gob.ar/georef/api/provincias")
    const datos = await resp.json()
    let divConfirm = document.getElementById("div-confirm")
    divConfirm.innerHTML = `<h3>Provincia</h3>
                <select id="provFiltro"></select>`
    let provFiltro = document.getElementById("provFiltro")
    for (const provincia of datos.provincias) {
        provFiltro.innerHTML += `<option value="${provincia.id}">${provincia.nombre}</option>`
    }
    let municipioDiv = document.createElement("div")
    divConfirm.appendChild(municipioDiv);
    let idProvincia = provFiltro.value
    municipioDiv.innerHTML = ""
    municipioDiv.innerHTML = `<h3>Municipio</h3> 
                                  <select id="munFiltro"></select>`
    let rutaBusqueda = `https://apis.datos.gob.ar/georef/api/municipios?provincia=${idProvincia}&campos=id,nombre&max=100`
    fetch(rutaBusqueda)
        .then(response => response.json())
        .then(datos => {
            let munFiltro = document.getElementById("munFiltro")
            for (const municipio of datos.municipios) {
                munFiltro.innerHTML += `<option value="${municipio.id}">${municipio.nombre}</option>`
            }
        })
}

function direccion() {
    let seleccionDireccion = document.getElementById("div-direccion")
    seleccionDireccion.innerHTML = `<h3>Direccion</h3> 
                                         <input></input>
                                         <button id="btnEnvio">Enviar</button>`
}


function sumarTotal() {
    total = carrito.reduce((acumulador, elemento) => acumulador + elemento.precio * elemento.cantidad, 0);
    divTotalHijo.innerHTML = `<div class="caja-total"> 
                                <div> TOTAL: </div> 
                                <div> $${total} </div>
                             </div>
                              <div>
                                <button id="confirm-btn" class="btns">CONFIRMAR</button>
                                <button id="delete-btn" class="btns">VACIAR CARRITO</button>
                              </div>`


}
function confirmar() {
    let confirmBtn = document.getElementById("confirm-btn")
    let divConfirm = document.getElementById("div-confirm")
    let divDireccion = document.getElementById("div-direccion")

    botonBorrarEvento(divConfirm)
    botonBorrarEvento(divDireccion)
    confirmBtn.addEventListener("click", async () => {
        if (total != 0) {
            await fetchCall()
            direccion()
            divDireccion.scrollIntoView({ behavior: 'smooth' })
        }
    })
}



