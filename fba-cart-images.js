
"use strict";

window.FBA_IMAGES = {};

const fbaDrivers = {
  verstappen: ["portrait", "monoplace", "champion"],
  hadjar: ["portrait", "monoplace", "podium"],
  leclerc: ["portrait", "monoplace", "victoire"],
  hamilton: ["portrait", "monoplace", "champion"],
  russell: ["portrait", "monoplace", "celebration"],
  antonelli: ["portrait", "racing", "celebration"],
  norris: ["portrait", "racing", "celebration"],
  piastri: ["portrait", "racing", "celebration"],
  alonso: ["portrait", "racing", "celebration"],
  stroll: ["portrait", "racing", "celebration"],
  albon: ["portrait", "racing", "celebration"],
  sainz: ["portrait", "racing", "celebration"],
  lawson: ["portrait", "racing", "celebration"],
  lindblad: ["portrait", "racing", "celebration"],
  gasly: ["portrait", "racing", "celebration"],
  colapinto: ["portrait", "racing", "celebration"],
  hulkenberg: ["portrait", "racing", "celebration"],
  bortoleto: ["portrait", "racing", "celebration"],
  ocon: ["portrait", "racing", "celebration"],
  bearman: ["portrait", "racing", "celebration"],
  perez: ["portrait", "racing", "celebration"],
  bottas: ["portrait", "racing", "celebration"]
};

Object.entries(fbaDrivers).forEach(([driver, variants]) => {
  variants.forEach((variant, index) => {
    const id = `f1-${driver}-0${index + 1}`;

    window.FBA_IMAGES[id] =
      `images/f1/f1-${driver}-${variant}-apercu.jpg`;
  });
});
