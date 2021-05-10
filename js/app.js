// campos del formulario
const mascotaInput = document.querySelector("#mascota");
const propietarioInput = document.querySelector("#propietario");
const telefonoInput = document.querySelector("#telefono");
const fechaInput = document.querySelector("#fecha");
const horaInput = document.querySelector("#hora");
const sintomasInput = document.querySelector("#sintomas");

// user interface
const formulario = document.querySelector("#nueva-cita");
const contenedorCitas = document.querySelector("#citas");

// variable para ingresar a la "modalidad de edicion"
let editando;

// clases

class Citas {
  // a citas si le agregamos un constructor, para que tenga el array vacio
  constructor() {
    this.citas = [];
  }

  agregarCitas(cita) {
    this.citas = [...this.citas, cita];
  }

  eliminarCita(id) {
    this.citas = this.citas.filter((cita) => cita.id !== id); // no traemos todos los elementos diferentes al seleccionado, el seleccionado se eleminará obviamente
  }
}

class UI {
  imprimirAlerta(mensaje, tipo) {
    // crear div
    const divMensaje = document.createElement("div");
    divMensaje.classList.add("text-center", "alert", "d-block", "col-12");

    // agregar clase de base al tipo de error
    if (tipo === "error") {
      divMensaje.classList.add("alert-danger");
    } else {
      divMensaje.classList.add("alert-success");
    }

    // mensaje de error
    divMensaje.textContent = mensaje;

    // agregar al DOM
    document
      .querySelector("#contenido")
      .insertBefore(divMensaje, document.querySelector(".agregar-cita")); // tener en cuenta como le pasamos el segundo parametro aca, con el document.querySelector, entender que lo estamos eligiendo con document., es decir, estamos haciendo una seleccion para aplicar algo puntual, en el parametro tambien debe ser asi, no podemos tirar la clase de la nada, sin la referencia del elemento desde el document.querySelector

    // sacar el alerta
    setTimeout(() => {
      divMensaje.remove();
    }, 3000);
  }
  // notar que aca estamos haciendo el destructuring desde el parametro!
  imprimirCitas({ citas }) {
    this.limpiarHTML(); // limpiamos el array antes de iterar
    // aca podemos hacer el forEach, porque hicimos el destructuring arriba, entonces, ya podemos acceder al arreglo de objetos
    citas.forEach((cita) => {
      const {
        mascota,
        propietario,
        telefono,
        fecha,
        hora,
        sintomas,
        id,
      } = cita;

      const divCita = document.createElement("div");
      divCita.classList.add("cita", "p-3");
      divCita.dataset.id = id;

      // scripting de los elementos de la cita
      const mascotaParrafo = document.createElement("h2");
      mascotaParrafo.classList.add("card-title", "font-weight-bolder");
      mascotaParrafo.textContent = mascota;

      const propietarioParrafo = document.createElement("p");
      propietarioParrafo.innerHTML = `
        <span class="font-weight-bolder">Propietario: </span> ${propietario}
      `;

      const telefonoParrafo = document.createElement("p");
      telefonoParrafo.innerHTML = `
        <span class="font-weight-bolder">Teléfono: </span> ${telefono}
      `;

      const fechaParrafo = document.createElement("p");
      fechaParrafo.innerHTML = `
        <span class="font-weight-bolder">Fecha: </span> ${fecha}
      `;

      const horaParrafo = document.createElement("p");
      horaParrafo.innerHTML = `
        <span class="font-weight-bolder">Hora: </span> ${hora}
      `;

      const sintomasParrafo = document.createElement("p");
      sintomasParrafo.innerHTML = `
        <span class="font-weight-bolder">Síntomas: </span> ${sintomas}
      `;

      // boton para eliminar cita

      const btnEliminar = document.createElement("button");
      btnEliminar.classList.add("btn", "btn-danger", "mr-2");
      btnEliminar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clip-rule="evenodd" />
    </svg>`;

      btnEliminar.onclick = () => {
        eliminarCita(id);
      };

      // boton para editar cita

      const btnEditar = document.createElement("button");
      btnEditar.classList.add("btn", "btn-info");
      btnEditar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
      <path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" />
      <path fill-rule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clip-rule="evenodd" />
      </svg>`;
      btnEditar.onclick = () => {
        cargarEdicion(cita); // le pasamos el objeto completo linea 69
      };

      // agregar los parrafos al divCita
      divCita.appendChild(mascotaParrafo);
      divCita.appendChild(propietarioParrafo);
      divCita.appendChild(telefonoParrafo);
      divCita.appendChild(fechaParrafo);
      divCita.appendChild(horaParrafo);
      divCita.appendChild(sintomasParrafo);
      divCita.appendChild(btnEliminar);
      divCita.appendChild(btnEditar);

      // agregamos el div de citas al HTML
      contenedorCitas.appendChild(divCita);
    });
  }

  limpiarHTML() {
    while (contenedorCitas.firstChild) {
      contenedorCitas.removeChild(contenedorCitas.firstChild);
    }
  }
}

const ui = new UI();

const administarCitas = new Citas();

// registrar eventos

eventListeners();

function eventListeners() {
  mascotaInput.addEventListener("input", datosCita);
  propietarioInput.addEventListener("input", datosCita);
  telefonoInput.addEventListener("input", datosCita);
  fechaInput.addEventListener("input", datosCita);
  horaInput.addEventListener("input", datosCita);
  sintomasInput.addEventListener("input", datosCita);

  formulario.addEventListener("submit", nuevaCita);
}

// objeto con la informacion de la cita

const citaObj = {
  mascota: "",
  propietario: "",
  telefono: "",
  fecha: "",
  hora: "",
  sintomas: "",
};

// agrega datos al objeto de cita

function datosCita(e) {
  citaObj[e.target.name] = e.target.value; // con corchetes accedemos a las propiedades del objeto, recordar
}

// valida y agrega una nueva cita a laclase de citas

function nuevaCita(e) {
  e.preventDefault();
  // extraer la informacion del objeto de citas
  const { mascota, propietario, telefono, fecha, hora, sintomas } = citaObj;

  // validar
  if (
    mascota === "" ||
    propietario === "" ||
    telefono === "" ||
    fecha === "" ||
    hora === "" ||
    sintomas === ""
  ) {
    ui.imprimirAlerta("Todos los campos son obligatorios", "error");

    return;
  }

  if (editando) {
    console.log("modalidad edicion");
    // mensaje de agregado correctamente
    ui.imprimirAlerta("Se editó correctamente");

    // pasar el objeto de la cita a edicion

    // cambiar el texto del boton de submit, lo volvemos a su estado original
    formulario.querySelector('button[type="submit"]').textContent =
      "Crear cita";

    // quitar modo edicion
    editando = false;
  } else {
    // generar un id unico

    citaObj.id = Date.now();

    // creando una nueva cita

    administarCitas.agregarCitas({ ...citaObj }); // notar aca que el spread operator ...citaObj, esto agrega una copia a agregarCitas, ya que si no lo agregamos asi, cada entrada que agreguemos reemplazara a la anterior, y tendremos todos elementos duplicados
    // mensaje de agregado correctamente
    ui.imprimirAlerta("Se agrego correctamente");
  }

  // reiniciar el objeto para la validacion
  // si lo no reiniciamos, aunque reseteemos el formulario, esos datos cargados, se seguiran imprimiendo al submitear

  reiniciarObjeto();

  // reseteamos el formulario

  formulario.reset();

  // mostrar el HTML de las citas
  ui.imprimirCitas(administarCitas);
}

// reiniciamos el objeto donde se guarda lo que carga el usurio
function reiniciarObjeto() {
  citaObj.mascota = "";
  citaObj.propietario = "";
  citaObj.telefono = "";
  citaObj.mafechascota = "";
  citaObj.hora = "";
  citaObj.simtomas = "";
}

function eliminarCita(id) {
  // eliminar la cita
  administarCitas.eliminarCita(id);
  // muestra mensaje
  ui.imprimirAlerta("La cita se eliminó correctamente");

  // refrescar las citas
  ui.imprimirCitas(administarCitas);
}

// carga los datos y el modo edicion

function cargarEdicion(cita) {
  // hacemos un destructuring para obtener los datos
  const { mascota, propietario, telefono, fecha, hora, sintomas, id } = cita; // tener en cuenta que cargamos el id tambien, super importante tenerlo

  // llenar los inputs
  mascotaInput.value = mascota;
  propietarioInput.value = propietario;
  telefonoInput.value = telefono;
  fechaInput.value = fecha;
  horaInput.value = hora;
  sintomasInput.value = sintomas;

  // llenar el objeto
  // hacemos esto porque si solo dejamos lo de arriba, aunque los campos del formulario esten completos, va a tirar un error de que falta completarlos, ya que la validacion del formulario esta en el objeto (funcion nuevaCita)
  citaObj.mascota = mascota;
  citaObj.propietario = propietario;
  citaObj.telefono = telefono;
  citaObj.fecha = fecha;
  citaObj.hora = hora;
  citaObj.sintomas = sintomas;
  citaObj.id = id;

  // cambiar el texto del boton de submit
  formulario.querySelector('button[type="submit"]').textContent =
    "Guardar Cambios";

  editando = true;
}
