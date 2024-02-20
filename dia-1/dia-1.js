/**
 * O primeiro dia está falando sobre comparações em javascript, que é feita em tempo de execução
 * em virtude de ser uma linguagem interpretada e que pode causar muitas confusões porque podem
 * ocorrer conversões implícitas de tipo que não são vistas pelo desenvolvedor.
 */

/**
 * ENUNCIADO:
 *
 * (...) a sua tarefa de hoje é reescrever o código abaixo de maneira que ele imprima
 * as informações de maneira correta, que faça sentido e sem erros:
 */

let numeroUm = 1;
let stringUm = "1";
let numeroTrinta = 30;
let stringTrinta = "30";
let numeroDez = 10;
let stringDez = "10";

console.log("Variáveis usadas e seus tipos:");
console.table([
  ["numeroUm", typeof numeroUm, numeroUm],
  ["stringUm", typeof stringUm, stringUm],
  ["numeroTrinta", typeof numeroTrinta, numeroTrinta],
  ["stringTrinta", typeof stringTrinta, stringTrinta],
  ["numeroDez", typeof numeroDez, numeroDez],
  ["stringDez", typeof stringDez, stringDez],
]);

if (numeroUm == stringUm) {
  console.log(
    "As variáveis numeroUm e stringUm tem o mesmo valor, mas tipos diferentes"
  );
} else {
  console.log("As variáveis numeroUm e stringUm não tem o mesmo valor");
}

if (numeroTrinta === stringTrinta) {
  console.log(
    "As variáveis numeroTrinta e stringTrinta tem o mesmo valor e mesmo tipo"
  );
} else {
  console.log("As variáveis numeroTrinta e stringTrinta não tem o mesmo tipo");
}

if (numeroDez == stringDez) {
  console.log(
    "As variáveis numeroDez e stringDez tem o mesmo valor, mas tipos diferentes"
  );
} else {
  console.log("As variáveis numeroDez e stringDez não tem o mesmo valor");
}
