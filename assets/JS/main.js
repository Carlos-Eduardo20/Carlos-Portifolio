//-------------------------------------------
// FUNÇÃO DE DIGITAÇÃO AUTOMÁTICA INICIAL
//-------------------------------------------
let typeEffectSeq = 0;
function typeEffect(text) {
    const output = document.getElementById("terminal-output");
    if (!output) return;

    typeEffectSeq++;
    const seq = typeEffectSeq;

    output.textContent = "";
    let index = 0;

    function type() {
        if (seq !== typeEffectSeq) return;
        if (index < text.length) {
            output.textContent += text.charAt(index);
            index++;
            setTimeout(type, 35);
        }
    }

    type();
}

//-------------------------------------------
// TEXTO QUE APARECE AO CARREGAR A PÁGINA
//-------------------------------------------
window.onload = () => {
    // Tela de tema será aberta no fluxo de inicialização abaixo
};


//-------------------------------------------
// CONTEÚDO DAS ABAS LATERAIS
//-------------------------------------------
const sections = {
    "sobre": "Meu nome é Carlos. Sou estudante de Redes de Computadores, Ciência da Computação e apaixonado por cibersegurança. Adoro criar interfaces hacker.",
    
    "projetos": 
        "• Portfólio Hacker (HTML/CSS/JS)\n" +
        "• Projetos de Redes Físicas\n" +
        "• Programas em C\n" +
        "• Experimentos de Segurança e Análise de Tráfego",

    "contato": 
        "EMAIL:\ncarloedus776@gmail.com\n\n" +
        "LINKEDIN:\nhttps://www.linkedin.com/in/carlos-eduardo-redes\n\n" +
        "GITHUB:\nhttps://github.com/Carlos-Eduardo20"
};


//-------------------------------------------
// AÇÃO DOS BOTÕES LATERAIS
//-------------------------------------------
function getCurrentTheme() {
    return document.body.getAttribute("data-theme") || localStorage.getItem("selectedTheme") || "hacker";
}

function navigateToPage(key) {
    const inPages = /\/pages\//i.test(window.location.pathname);
    const targets = {
        about: inPages ? "about.html" : "pages/about.html",
        projects: inPages ? "projects.html" : "pages/projects.html",
        contact: inPages ? "contact.html" : "pages/contact.html",
        resume: inPages ? "resume.html" : "pages/resume.html"
    };
    const href = targets[key];
    if (href) {
        const theme = getCurrentTheme();
        const url = `${href}?theme=${encodeURIComponent(theme)}`;
        window.location.href = url;
    }
}

const sideButtons = document.querySelectorAll(".side-btn");
if (sideButtons && sideButtons.length) {
    sideButtons.forEach(button => {
        button.addEventListener("click", () => {
            const sec = button.dataset.section;
            const keyMap = { sobre: "about", projetos: "projects", contato: "contact", resumo: "resume" };
            const key = keyMap[sec];
            if (key) navigateToPage(key);
        });
    });
}


//-------------------------------------------
// TERMINAL – ACEITA COMANDOS
//-------------------------------------------
const commandInput = document.getElementById("commandInput");
const output = document.getElementById("terminal-output");
const commands = ["help", "about", "projects", "contact", "resume", "clear", "theme"];

if (commandInput && output) {
    commandInput.addEventListener("keydown", (e) => {
        if (e.key === "Tab") {
            e.preventDefault();
            const prefix = commandInput.value.trim().toLowerCase();
            if (!prefix) return;
            const matches = commands.filter(c => c.startsWith(prefix));
            if (matches.length === 1) {
                commandInput.value = matches[0];
            } else if (matches.length > 1) {
                output.textContent += `\nPossíveis comandos: ${matches.join("  ")}\n`;
                output.scrollTop = output.scrollHeight;
            } else {
                const soundError = document.getElementById("soundError");
                if (soundError) soundError.play();
            }
            return;
        }

        if (e.key === "ArrowUp") {
            if (historyIndex > 0) historyIndex--;
            if (commandHistory[historyIndex] !== undefined) {
                commandInput.value = commandHistory[historyIndex];
            }
            e.preventDefault();
            return;
        }

        if (e.key === "ArrowDown") {
            if (historyIndex < commandHistory.length) historyIndex++;
            if (historyIndex === commandHistory.length) {
                commandInput.value = "";
            } else if (commandHistory[historyIndex] !== undefined) {
                commandInput.value = commandHistory[historyIndex];
            }
            e.preventDefault();
            return;
        }

        if (e.key === "Enter") {
            const command = commandInput.value.trim();
            if (!command) return;
            commandHistory.push(command);
            historyIndex = commandHistory.length;
            commandInput.value = "";
            const soundEnter = document.getElementById("soundEnter");
            if (soundEnter) soundEnter.play();
            processCommand(command);
        }
    });
}


//-------------------------------------------
// LISTA DE COMANDOS
//-------------------------------------------

let commandHistory = [];
let historyIndex = -1;

const terminalBody = document.querySelector(".terminal-body");
if (terminalBody && commandInput) {
    terminalBody.addEventListener("click", () => {
        commandInput.focus();
    });
}

// executa comando digitado
function processCommand(cmd) {
    const output = document.getElementById("terminal-output");
    const soundEnter = document.getElementById("soundEnter");
    const soundError = document.getElementById("soundError");

    typeEffectSeq++;

    let result = "";
    const normalized = cmd.toLowerCase();

    const themeMsg = processThemeCommand(cmd);
    if (themeMsg !== null) {
        output.textContent += `carlos@portfolio:~$ ${cmd}\n${themeMsg}\n\n`;
        output.scrollTop = output.scrollHeight;
        return;
    }
    
    switch (normalized) {
        case "help":
            result =
                "\nComandos disponíveis:\n" +
                "\nhelp - lista comandos\n" +
                "\nabout - abrir página Sobre Mim\n" +
                "\nprojects - abrir página Projetos\n" +
                "\ncontact - abrir página Contato\n" +
                "\nresume - abrir página Resumo\n" +
                "\nclear - limpa a tela\n" +
                "\ntheme - Abrir seleção de temas\n";
            break;

        case "about":
            navigateToPage("about");
            return;

        case "projects":
            navigateToPage("projects");
            return;

        case "contact":
            navigateToPage("contact");
            return;

        case "resume":
            navigateToPage("resume");
            return;

        case "clear":
            output.textContent = "";
            return;

        default:
            result = "Comando não reconhecido. Digite 'help'.";
    }

    output.textContent += `carlos@portfolio:~$ ${cmd}\n${result}\n\n`;
    output.scrollTop = output.scrollHeight;
}

// =======================
// MATRIX BACKGROUND EFFECT
// =======================

let canvas = document.getElementById("matrixBackground");
if (!canvas) {
    canvas = document.createElement("canvas");
    canvas.id = "matrixBackground";
    document.body.prepend(canvas);
}
const ctx = canvas.getContext("2d");
let matrixColor = "#00ff41";

// Inicialização do tamanho é feita no setupMatrix() para acompanhar zoom e resize

// Caracteres usados no efeito
const matrixChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789あいうえおカキクケコ";
const chars = matrixChars.split("");

// Tamanho da fonte e colunas responsivas
let fontSize = 18;
let columns = Math.floor(canvas.width / fontSize);

// Array que controla a "queda" dos caracteres
let drops = [];

const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

function setupMatrix() {
    fontSize = Math.max(12, Math.round(window.innerWidth * 0.018));
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    columns = Math.floor(canvas.width / fontSize);
    drops = new Array(columns).fill(0).map(() => Math.random() * canvas.height);
    ctx.font = fontSize + "px monospace";
}

setupMatrix();

// Função principal do Matrix
function drawMatrix() {
    // Fundo transparente para criar rastro
    ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Cor do texto (seguindo tema)
    ctx.fillStyle = matrixColor;
    ctx.font = fontSize + "px monospace";

    // Para cada coluna, desenha um caractere em queda
    for (let i = 0; i < drops.length; i++) {
        const char = chars[Math.floor(Math.random() * chars.length)];
        ctx.fillText(char, i * fontSize, drops[i] * fontSize);

        // Reinicia a queda ocasionalmente
        if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
        }

        // Faz o caractere cair
        drops[i]++;
    }
}

// Atualiza o efeito com FPS adaptativo em mobile
let matrixTimer = setInterval(drawMatrix, isMobile ? 50 : 33);

// Ajusta o fundo Matrix quando a tela redimensionar ou em zoom
window.addEventListener("resize", () => {
    setupMatrix();
    clearInterval(matrixTimer);
    matrixTimer = setInterval(drawMatrix, isMobile ? 50 : 33);
});

// ======================================
//  SISTEMA DE TEMAS - PORTFÓLIO HACKER
// ======================================

// Referências
const themeModal = document.getElementById("themeModal");
const closeThemeModal = document.getElementById("closeThemeModal");
const themeCards = document.querySelectorAll(".theme-card");
const themeButton = document.getElementById("openThemeBtn");
const hamburgerBtn = document.getElementById("hamburgerBtn");
const mobileDrawer = document.getElementById("mobileDrawer");

// =========================
// 1. Abrir o modal
// =========================
function openThemeModal() {
    themeModal.classList.remove("hidden");
}

// =========================
// 2. Fechar o modal
// =========================
function closeThemeWindow() {
    themeModal.classList.add("hidden");
    const terminalEl = document.querySelector(".terminal");
    if (terminalEl) terminalEl.classList.remove("hidden");
    typeEffect("Bem-vindo ao Meu Painel/Portfólio de Carlos.");
}

// Evento do botão fechar
closeThemeModal.addEventListener("click", closeThemeWindow);

function navigateBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        const inPages = /\/pages\//i.test(window.location.pathname);
        window.location.href = inPages ? "index.html" : "pages/index.html";
    }
}

if (themeButton) {
    themeButton.addEventListener("click", openThemeModal);
}

document.addEventListener("click", (e) => {
    if (e.target.closest("#openThemeBtn")) {
        openThemeModal();
    } else if (e.target.closest("#backBtn, .back-button")) {
        navigateBack();
    } else if (e.target.closest("#hamburgerBtn")) {
        if (mobileDrawer) mobileDrawer.classList.toggle("hidden");
    } else if (e.target.closest(".drawer-link")) {
        const btn = e.target.closest(".drawer-link");
        const target = btn.dataset.target;
        if (target === "theme") {
            openThemeModal();
        } else {
            navigateToPage(target);
        }
        if (mobileDrawer) mobileDrawer.classList.add("hidden");
    } else if (e.target.closest(".copy-btn")) {
        const btn = e.target.closest(".copy-btn");
        const value = btn.dataset.copy || btn.previousElementSibling?.textContent?.trim();
        if (value) {
            navigator.clipboard.writeText(value).then(() => {
                const original = btn.innerHTML;
                btn.innerHTML = "Copiado!";
                setTimeout(() => { btn.innerHTML = original; }, 1400);
            }).catch(() => {});
        }
    }
});

// =========================
// 3. Aplicar tema no site
// =========================
function setMatrixColorForTheme(themeName) {
    switch (themeName) {
        case "hacker":
            matrixColor = "#00ff41";
            break;
        case "purple":
            matrixColor = "#b966ff";
            break;
        case "light":
            matrixColor = "#007acc";
            break;
        case "dark":
            matrixColor = "#00d0ff";
            break;
        default:
            matrixColor = "#00ff41";
    }
    let meta = document.querySelector('meta[name="theme-color"]');
    if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'theme-color');
        document.head.appendChild(meta);
    }
    meta.setAttribute('content', matrixColor);
}

function applyTheme(themeName) {
    document.body.setAttribute("data-theme", themeName);
    localStorage.setItem("selectedTheme", themeName);
    setMatrixColorForTheme(themeName);
    closeThemeWindow();
}

// Evento dos cards de tema
themeCards.forEach(card => {
    card.addEventListener("click", () => {
        const selected = card.dataset.theme;
        applyTheme(selected);
    });
});

// =========================
// 4. Carregar tema salvo
// =========================
const qsTheme = new URLSearchParams(window.location.search).get("theme");
const terminalEl = document.querySelector(".terminal");
const hasStored = !!localStorage.getItem("selectedTheme");
let activeTheme = qsTheme || localStorage.getItem("selectedTheme") || "hacker";

document.body.setAttribute("data-theme", activeTheme);
setMatrixColorForTheme(activeTheme);
if (qsTheme) localStorage.setItem("selectedTheme", activeTheme);

// Detecta Android e ativa classe para mostrar hambúrguer
const isAndroid = /Android/i.test(navigator.userAgent);
if (isAndroid) {
    document.body.classList.add("android");
}

const isHome = /\/(index\.html)?$/i.test(window.location.pathname);

if (isHome && themeModal) {
    if (terminalEl) terminalEl.classList.add("hidden");
    openThemeModal();
}
// 5. Comando "theme" no terminal
// =========================
function processThemeCommand(cmd) {
    const parts = cmd.trim().toLowerCase().split(/\s+/);
    if (parts[0] !== "theme") return null;

    const valid = ["hacker", "purple", "light", "dark"];

    if (parts.length === 1) {
        openThemeModal();
        return "Abrindo seleção de temas...";
    }

    const chosen = parts[1];
    if (valid.includes(chosen)) {
        applyTheme(chosen);
        return `Tema aplicado: ${chosen}`;
    }

    return `Tema inválido. Opções: ${valid.join(", ")}`;
}
