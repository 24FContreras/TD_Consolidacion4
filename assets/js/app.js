console.log("🟢 Connected!");

const ranges = document.querySelectorAll(".range");
//const URL = "https://swapi.dev/api/people/";
const URL = "https://pokeapi.co/api/v2/pokemon/"; //RUTA ALTERNATIVA MIENTRAS VUELVE SWAPI.DEV
const template = document.querySelector("#characterCardTemplate");

//SETS
const principales = new Set();
const secundarios = new Set();
const otros = new Set();

//CLASE PARA PERSONAJES
class personaje {
  constructor(nombre, estatura, peso, tipo) {
    this.nombre = nombre;
    this.estatura = estatura;
    this.peso = peso;
    this.tipo = tipo;
  }
}

//REALIZA EL FETCH A LA API
const obtenerPersonaje = async (id) => {
  try {
    const res = await fetch(URL + id);
    const data = await res.json();

    return data;
  } catch (error) {
    console.log(error);
  }
};

//EN ESTA VERSIÓN NO FUE NECESARIO, PERO DECIDÍ DEJAR EL CÓDIGO QUE GUARDABA LOS PERSONAJES EN SUS SETS DE IGUAL MANERA
const agregarPersonaje = async (id, tipo, set) => {
  const data = await obtenerPersonaje(id);
  const { name, height, weight: mass } = data; //CAMBIAR A MASS CUANDO VUELVA SWAPI.DEV
  const nuevoPersonaje = new personaje(name, height, mass, tipo);

  set.add(nuevoPersonaje);
  renderizarPersonaje(nuevoPersonaje);
};

const renderizarPersonaje = (personaje) => {
  const templateClone = template.content.cloneNode(true);
  const listaSeleccionada = document.querySelector(`#lista${personaje.tipo}`);

  templateClone
    .querySelector(".circle")
    .classList.add(`${personaje.tipo.toLowerCase()}`);
  templateClone.querySelector(".card-nombre").textContent = personaje.nombre;
  templateClone.querySelector(
    ".card-info"
  ).textContent = `Estatura: ${personaje.estatura} cm. Peso: ${personaje.peso} kg.`;

  listaSeleccionada.appendChild(templateClone);

  const animated = listaSeleccionada.lastElementChild;

  gsap.fromTo(
    animated,
    { opacity: 0, y: "-1rem" },
    { opacity: 1, y: 0, duration: 1 }
  );
};

//GENERADOR BASE
function* generarPersonajes(inicio, fin, tipo, set) {
  for (let i = inicio; i <= fin; i++) {
    yield agregarPersonaje(i, tipo, set);
  }

  return "terminado";
}

//INSTANCIAS DE GENERADOR
const generadorPrincipales = generarPersonajes(
  1,
  5,
  "Principales",
  principales
);
const generadorSecundarios = generarPersonajes(
  6,
  11,
  "Secundarios",
  secundarios
);
const generadorOtros = generarPersonajes(12, 17, "Otros", otros);

//EVENTO MOUSEENTER PARA CADA RANGO
ranges.forEach((item) => {
  let cuenta = 1;
  item.addEventListener("mouseenter", (e) => {
    if (cuenta <= 5) {
      switch (e.target.dataset.generador) {
        case "Principales":
          generadorPrincipales.next();

          break;

        case "Secundarios":
          generadorSecundarios.next();
          break;

        case "Otros":
          generadorOtros.next();
          break;
      }

      cuenta++;
    } else return false;
  });
});
