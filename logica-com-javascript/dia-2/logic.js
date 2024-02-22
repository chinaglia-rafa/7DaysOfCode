let word = "";
/** Timer até entrar no modo idle */
let idleTimer;
/** Handler para o intervalo idle do fundo */
let idleInterval;
/** Tempo em ms até o modo idle entrar em ação */
const IDLE_TIME = 10;
/** Velocidade em ms da animação do fundo enquanto idle */
const IDLE_SPEED = 650;
/** Lembra a última rotação em Z do fundo para que ela não se repita */
let previousRotateZ;
/** Respostas dadas pelo usuário */
let respostas = ["", "", "", ""];
/** Lista de perguntas do formulário */
let perguntas = [
  "Qual o seu nome?",
  "Quantos <span class='background'>anos</span> você tem?",
  "Qual linguagem de progra-<br />mação você está estudando?",
  "",
];
/** Em qual pergunta o usuário está no momento */
let currentQuestion = 0;

let first = true;

let iptNome;
let letters;
let slide1Content;
let slide1Fundo;
let slide1Button;
let pergunta;
let backTip;

let contentRotateY = 0;
let contentTranslateX = 0;

window.onload = (e) => {
  iptNome = document.querySelector("#nome");
  letters = document.querySelector("#letters");
  slide1Content = document.querySelector("#slide-1 .content");
  slide1Fundo = document.querySelector("#slide-1 .fundo");
  slide1Button = document.querySelector("#slide-1 .button");
  pergunta = document.querySelector("#pergunta");
  backTip = document.querySelector("#backTip");

  iptNome.focus();

  goIdle(slide1Fundo, 0, 0);

  backTip.innerHTML = `comece a digitar...`;
  backTip.classList.add("delay");
  backTip.classList.add("showing");

  slide1Button.addEventListener("click", (event) => {
    gotoQuestion(currentQuestion + 1);
  });

  document.addEventListener("click", (event) => {
    iptNome.focus();
  });

  iptNome.addEventListener("blur", (event) => {
    iptNome.focus();
  });

  iptNome.addEventListener("keyup", (event) => {
    keyup(event);
  });
};

function keyup(event = null, keepButtonHidden = false) {
  const value = iptNome.value;
  if (value.length > 42) return false;

  if (event && value !== "" && event.key === "Enter") {
    slide1Button.click();
    return false;
  }

  if (event && word === "" && value === "" && event.key === "Backspace") {
    if (currentQuestion > 0 && !iptNome.readOnly) {
      gotoQuestion(currentQuestion - 1);
    }
    return false;
  }

  if (value === "" && currentQuestion === 0) {
    backTip.innerHTML = `comece a digitar...`;
    backTip.classList.add("delay");
    backTip.classList.add("showing");
  } else if (value === "" && currentQuestion > 0) {
    backTip.innerHTML = `pressione
    <img width="13" src="assets/backspace.svg" alt="" /> para voltar á
    pergunta anterior...`;
    backTip.classList.remove("delay");
    backTip.classList.add("showing");
  } else {
    backTip.classList.remove("delay");
    backTip.classList.remove("showing");
  }

  // Lida com os timers da animação idle do fundo
  clearTimeout(idleTimer);
  if (first) first = false;
  else stopIdle(slide1Fundo);

  // Atualiza as letras do display
  for (let i = 0; i < Math.max(word.length, value.length); i++) {
    if (value[i] === undefined) {
      for (let j = i; j < word.length; j++) remove(j);
      break;
    }
    if (word[i] === undefined) {
      for (let j = i; j < value.length; j++) add(value[j], j);
      break;
    }
    if (word[i].toLocaleUpperCase() === value[i].toLocaleUpperCase()) continue;
    change(i, value[i]);
  }
  // Inclina a palavra conforme necessário
  word = value;
  const x = word.length;
  const threshold = 19;
  let rotateY = x > threshold ? Math.log(x - threshold + 1) * 8.1 : 0;
  letters.style.transform = `perspective(800px) rotateX(-12deg) rotateY(${rotateY}deg)`;
  // Translada as letras para que a perspectiva não quebre o container
  const left = 32 / threshold;
  letters.style.left = x > threshold ? `${left * x - threshold + 1}px` : 0;

  // Inclina o container conforme necessário
  contentRotateY = x > threshold ? Math.log(x - threshold + 1) * 2.1 : 0;
  contentTranslateX = x > threshold ? 4.1 * (x - threshold) : 0;
  slide1Content.style.transform = `perspective(600px) rotateY(${contentRotateY}deg) translateX(${contentTranslateX}px)`;
  // Inclina o fundo da mesma forma
  updateFundo(slide1Fundo, contentRotateY, contentTranslateX, 1.01);

  // Centraliza ou justifica à esquerda o texto digitado
  if (slide1Content.clientWidth > 1010)
    letters.style.justifyContent = "flex-start";
  else letters.style.justifyContent = "center";

  // Exibe e oculta o botão de continuar
  if (value === "" || keepButtonHidden) {
    hideButton();
  } else {
    showButton();
  }

  idleTimer = setTimeout(() => {
    goIdle(
      slide1Fundo,
      contentRotateY,
      x > threshold ? 4.1 * (x - threshold) : 0
    );
  }, IDLE_TIME);
}

function showButton() {
  slide1Button.style.display = "block";
  slide1Button.classList.add("showing");
  slide1Button.removeAttribute("disabled");
}

function hideButton() {
  if (!slide1Button.classList.contains("showing")) return;
  slide1Button.classList.remove("showing");
  slide1Button.setAttribute("disabled", true);
  // Pequeno intervalo para adicionar o display: none; de forma
  // que a animação não fique brusca (esse 100ms vem do tempo de
  // transition de .button no CSS)
  setTimeout(() => {
    slide1Button.style.display = "none";
  }, 100);
}

function setLetters(w, backupWord) {
  hideButton();
  if (w === "") {
    word = backupWord;
    for (let i = 0; i < backupWord.length; i++) {
      setTimeout(() => {
        iptNome.value = iptNome.value.substring(0, iptNome.value.length - 1);
        keyup(null, i < backupWord.length - 1);
      }, 30 * i);
    }
    setTimeout(() => {
      iptNome.value = "";
      letters.innerHTML = "";
      backTip.classList.add("showing");
      iptNome.removeAttribute("readonly");
    }, 30 * backupWord.length);
    return;
  }

  for (let i = 0; i < w.length; i++) {
    setTimeout(() => {
      iptNome.value = iptNome.value + w[i];
      keyup(null, i < w.length - 1);
    }, 30 * i);
  }
  // Previne que o input seja focado selecionando todo o texto (acarretando no apagamento de todo
  // o conteúdo digitado ao adicionar uma letra)
  setTimeout(function () {
    iptNome.removeAttribute("readonly");
    iptNome.selectionStart = iptNome.selectionEnd = 10000;
    showButton();
  }, 30 * w.length);
}

/**
 * Reseta o estado dos elementos do formulário entre uma pergunta e outra
 */
function resetStates() {
  slide1Content.style.transform = `perspective(600px) rotateY(0deg) translateX(0px)`;
  const backupWord = word;
  word = "";
  setLetters(respostas[currentQuestion], backupWord);
  contentRotateY = 0;
  contentTranslateX = 0;
  stopIdle(slide1Fundo);
  updateFundo(slide1Fundo, 0, 0);
  goIdle(slide1Fundo, 0, 0);
}

function goIdle(obj, rotateY, rotateX) {
  stopIdle(obj);
  obj.style.transitionDuration = "200ms";
  idleInterval = setInterval((e) => {
    updateFundo(obj, rotateY, rotateX);
  }, IDLE_SPEED);
}

function stopIdle(obj) {
  clearInterval(idleInterval);
  obj.style.transitionDuration = "100ms";
}

function add(letra, index) {
  const letters = document.querySelector("#letters");

  const span = document.createElement("span");
  span.id = "span-" + index;
  span.classList.add("letter");

  const font = `font-${Math.floor(Math.random() * 4)}`;
  // const font = "font-1";
  span.classList.add(font);
  span.innerHTML = letra.toLocaleUpperCase();
  letters.appendChild(span);

  const rotationDirection = Math.round(Math.random() * 8) - 4;
  const hasBackground = Math.round(Math.random() * 100) > 90;
  if (hasBackground && letra !== " ") span.classList.add("background");

  const animation = span.animate(
    [
      {
        top: "0px",
        left: "0px",
        maxWidth: "0px",
        opacity: 0.0,
        transform: `scale(1.4) rotate(${rotationDirection}deg)`,
      },
      {
        top: "0px",
        left: "0px",
        maxWidth: "111px",
        opacity: 1.0,
        transform: `scale(1.0) rotate(${rotationDirection}deg)`,
      },
    ],
    {
      duration: 100,
      easing: "ease-in",
      fill: "forwards",
    }
  );

  animation.finished.then((r) => {
    span.setAttribute(
      "style",
      `transform: rotate(${rotationDirection}deg) !important`
    );
  });
}

function remove(index) {
  const target = document.querySelector(`#span-${index}`);
  const animation = target.animate(
    [
      {
        left: "0px",
        maxWidth: "111px",
        opacity: 1,
      },
      {
        left: "-10px",
        maxWidth: "0px",
        opacity: 0,
      },
    ],
    {
      duration: 100,
      fill: "forwards",
      easing: "ease-in",
    }
  );
  animation.finished.then((r) => {
    target.remove();
  });
}

function change(index, letra) {
  const target = document.querySelector(`#span-${index}`);
  target.innerHTML = letra.toLocaleUpperCase();
}

function updateFundo(obj, rotateY, rotateX, scale = 1.0) {
  let rotateZ = Math.floor(Math.random() * 6) - 3;
  if (rotateZ === previousRotateZ) rotateZ *= -1;
  obj.style.transform = `perspective(600px) scale(${scale}) rotateZ(${rotateZ}deg) rotateY(${rotateY}deg) translateX(${rotateX}px)`;
  previousRotateZ = rotateZ;
}

/**
 * Vai para a próxima questão usando uma animação bonita
 */
function gotoQuestion(index) {
  if (index === perguntas.length) location.reload();
  if (index < 0 || index > perguntas.length) {
    console.error(`Índice ${index} não está entre 0 e ${perguntas.length - 1}`);
    return false;
  }
  // Armazena o valor da questão atual para que se possa ir para a seguinte.
  respostas[currentQuestion] = word;

  iptNome.setAttribute("readonly", true);

  const animation = slide1Content.animate(
    [
      {
        transform: `perspective(600px) rotateX(0deg) rotateY(${contentRotateY}deg) translateX(${contentTranslateX}px)`,
      },
      {
        transform: `perspective(600px) rotateX(-3deg) rotateY(${
          contentRotateY + 2
        }deg) translateX(${contentTranslateX}px)`,
      },
      {
        transform: `perspective(600px) rotateX(0deg) rotateY(${contentRotateY}deg) translateX(${contentTranslateX}px)`,
      },
    ],
    {
      duration: 200,
      easing: "cubic-bezier(0, 0, 0.79, 1.51)",
    }
  );

  animation.finished.then(() => {
    currentQuestion = index;
    if (currentQuestion === perguntas.length - 1) {
      console.log("Hora de enviar o formulário");
      done();
      return;
    }

    setTimeout(() => {
      pergunta.innerHTML = perguntas[currentQuestion];
    }, 30 * word.length);
    resetStates();
  });
}

function done() {
  backTip.remove();
  slide1Button.innerHTML = `
  <span class="font-2">D</span>
  <span class="font-0">E</span>
  <span class="font-0">_</span>
  <span class="font-1">N</span>
  <span class="font-2">O</span>
  <span class="font-2">V</span>
  <span class="font-0">O</span>
  <span class="font-1 background">?</span>`;
  iptNome.setAttribute("disabled", true);
  pergunta.style.whiteSpace = "normal";
  pergunta.style.lineHeight = "1.3em";
  letters.innerHTML = "";
  pergunta.innerHTML = `Olá <span class='capitalized background'>${respostas[0].toLocaleLowerCase()}</span>, você tem <span class='capitalized background'>${respostas[1].toLocaleLowerCase()}</span> anos e já está aprendendo <span class='capitalized background'>${respostas[2].toLocaleLowerCase()}</span>!`;
}
