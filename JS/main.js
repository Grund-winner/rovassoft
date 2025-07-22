const buttonGetSignal = document.getElementById("get-signal");
const printSignal = document.getElementById("print-signal");
const stopTimer = document.getElementById("stop-timer");
const stopProgress = document.getElementById("stop-progress");
const stopBlock = document.getElementById("stop-signal-time-block");

function getRandomFloat(min, max, decimals) {
    const str = (Math.random() * (max - min) + min).toFixed(decimals);
    return parseFloat(str);
}

function startCooldown(seconds) {
    let remaining = seconds;
    stopBlock.classList.remove("deactivate");

    const interval = setInterval(() => {
        remaining--;
        stopTimer.innerText = `Prochain signal dans ${remaining} sec`;

        // Barre de progression
        const percent = ((seconds - remaining) / seconds) * 100;
        stopProgress.style.width = `${percent}%`;

        if (remaining <= 0) {
            clearInterval(interval);
            stopBlock.classList.add("deactivate");
            buttonGetSignal.disabled = false;
            buttonGetSignal.innerText = "NEXT SIGNAL";
            printSignal.innerHTML = `<span>Clickez sur<br>"NEXT SIGNAL"</span>`;
        }
    }, 1000);
}

buttonGetSignal.addEventListener("click", () => {
    buttonGetSignal.disabled = true;

    // Générer un signal
    let signal = getRandomFloat(1.20, 3.99, 2);
    if (signal.toString().length == 3) signal += "0";
    if (signal.toString().length == 1) signal += ".00";

    // Afficher le signal
    printSignal.innerHTML = `<span style="font-size: 40px;">${signal}x</span>`;

    // Lancer cooldown
    buttonGetSignal.innerText = "Veuillez patienter...";
    startCooldown(20);
});
