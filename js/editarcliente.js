(function () {
    let DB
    let idCliente

    const nombreInput = document.querySelector('#nombre')
    const emailInput = document.querySelector('#email')
    const telefonoInput = document.querySelector('#telefono')
    const empresaInput = document.querySelector('#empresa')

    const formulario = document.querySelector('#formulario')

    document.addEventListener('DOMContentLoaded', () => {

        conectarDB()

        //Actualiza el registro
        formulario.addEventListener('submit', actualizarCliente)

        // Leer parametros de la url
        const parametrosURL = new URLSearchParams(window.location.search)
        idCliente = parametrosURL.get('id')

        if (idCliente) {
            setTimeout(() => {
                obtenerCliente(idCliente)
            }, 100);
        }
    })

    function actualizarCliente(e) {
        e.preventDefault()

        if (nombreInput.value === "" || empresaInput.value === "" || telefonoInput.value === "" || emailInput.value === "") {
            imprimirAlerta('Todos los campos son obligatorios', 'error')
            return
        }

        //Actualizar cliente
        const clienteActualizado = {
            nombre: nombreInput.value,
            email: emailInput.value,
            telefono: telefonoInput.value,
            empresa: empresaInput.value,
            id: Number(idCliente)
        }

        const transaction = DB.transaction(['crm'], 'readwrite')

        const objectStore = transaction.objectStore('crm')

        objectStore.put(clienteActualizado)

        transaction.oncomplete = function () {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Cliente editado correctamente',
                showConfirmButton: false,
                timer: 1900
            })

            setTimeout(() => {
                window.location.href = "index.html"
            }, 2000)
        }

        transaction.onerror = function () {
            imprimirAlerta('Hubo un error', 'error')
        }
    }

    function obtenerCliente(id) {
        const transaction = DB.transaction(['crm'], 'readonly')
        const objectStore = transaction.objectStore('crm')

        const cliente = objectStore.openCursor()
        cliente.onsuccess = function (e) {
            const cursor = e.target.result

            if (cursor) {

                if (cursor.value.id === Number(id)) {
                    llenarFormulario(cursor.value)
                }

                cursor.continue()
            }
        }
    }

    function llenarFormulario(cliente) {
        const { nombre, telefono, empresa, email } = cliente

        nombreInput.value = nombre
        emailInput.value = email
        telefonoInput.value = telefono
        empresaInput.value = empresa
    }

    function conectarDB() {
        const abrirConexion = window.indexedDB.open('crm', 1)

        abrirConexion.onerror = function () {
            console.log('Hubo un error')
        }

        abrirConexion.onsuccess = function () {
            DB = abrirConexion.result
        }
    }
})()