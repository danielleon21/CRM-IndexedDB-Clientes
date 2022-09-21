(function () {
    let DB

    document.addEventListener("DOMContentLoaded", () => {
        //Crea la base de datos
        crearDB()

        if (window.indexedDB.open("crm", 1)) {
            obtenerClientes()
        }
    })

    function crearDB() {
        const crearDB = window.indexedDB.open("crm", 1);

        crearDB.onerror = () => {
            console.log("Hubo un error");
        }

        crearDB.onsuccess = () => {
            DB = crearDB.result;
        }

        crearDB.onupgradeneeded = (e) => {
            const db = e.target.result

            const objectStore = db.createObjectStore("crm", {
                keyPath: "id",
                autoIncrement: true,
            })

            objectStore.createIndex("nombre", "nombre", { unique: false })
            objectStore.createIndex("email", "email", { unique: true })
            objectStore.createIndex("telefono", "telefono", { unique: false })
            objectStore.createIndex("empresa", "empresa", { unique: false })
            objectStore.createIndex("id", "id", { unique: true })

            console.log("DB Lista y creada")
        }
    }

    function obtenerClientes() {
        const abrirConexion = window.indexedDB.open("crm", 1)

        abrirConexion.onerror = function () {
            console.log("Hubo un error")
        };

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result
            // Leyendo contenido de la DB
            const objectStore = DB.transaction("crm").objectStore("crm")

            objectStore.openCursor().onsuccess = function (e) {
                const cursor = e.target.result

                if (cursor) {
                    const { nombre, telefono, empresa, email, id } = cursor.value

                    // Listado clientes
                    const listadoClientes = document.querySelector("#listado-clientes")

                    listadoClientes.innerHTML +=
                        `
                    <tr>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200">
                            <p class="text-sm leading-5 font-medium text-gray-700 text-lg  font-bold"> ${nombre} </p>
                            <p class="text-sm leading-10 text-gray-700"> ${email} </p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 ">
                            <p class="text-gray-700">${telefono}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200  leading-5 text-gray-700">    
                            <p class="text-gray-600">${empresa}</p>
                        </td>
                        <td class="px-6 py-4 whitespace-no-wrap border-b border-gray-200 text-sm leading-5">
                            <a href="editar-cliente.html?id=${id}" class="text-teal-600 hover:text-teal-900 mr-5">Editar</a>
                            <a href="#" data-cliente="${id}" class="text-red-600 hover:text-red-900">Eliminar</a>
                        </td>
                    </tr>
                    `
                    cursor.continue()
                }
            }
        }
    }

    function limpiarHTML() {
        while (listadoClientes.firstChild) {
            listadoClientes.removeChild(listadoClientes.firstChild)
        }
    }
})()
