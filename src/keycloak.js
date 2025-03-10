import Keycloak from "keycloak-js";

/**/
const keycloak = new Keycloak({
  url: "https://keycloak-auth.cocktailcloud.io/",
  realm: "acorn",
  clientId: "cocktail-virt-local-dev",
});
/**/

/*
const keycloak = new Keycloak({
  url: "http://localhost:8180",
  realm: "hpcvirtmanager",
  clientId: "hpcvirtmanager",
});
*/

/*
const keycloak = new Keycloak({
  url: "https://keycloak-auth.cocktailcloud.io/",
  realm: "acorn",
  clientId: "hpc-virt-manager",
});
*/

export default keycloak;
