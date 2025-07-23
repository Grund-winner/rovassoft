document.addEventListener('DOMContentLoaded', function() {
    // --- Dictionnaire des traductions ---
    const translations = {
        fr: 'Ouvrir',
        en: 'Open'
        // Ajoutez d'autres langues ici si besoin, ex: 'ru': 'Открыть'
    };

    // --- Gestion de la traduction via les drapeaux ---
    const flags = document.querySelectorAll('.flag');
    const playButtonSpans = document.querySelectorAll('.play-button span');

    flags.forEach(flag => {
        flag.addEventListener('click', function() {
            const lang = this.getAttribute('data-lang'); // Récupère la langue (fr, en)
            const translatedText = translations[lang]; // Trouve le mot correspondant

            // Met à jour le texte de tous les boutons
            playButtonSpans.forEach(span => {
                span.textContent = translatedText;
            });

            // Met à jour le style du drapeau actif
            flags.forEach(f => f.classList.remove('active')); // Retire 'active' de tous les drapeaux
            this.classList.add('active'); // Ajoute 'active' au drapeau cliqué
        });
    });

    // --- Gestion du clic sur les boutons de jeu (inchangé) ---
    const playButtons = document.querySelectorAll('.play-button');

    playButtons.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); 
            const gameUrl = this.getAttribute('data-link');
            if (gameUrl) {
                window.location.href = gameUrl;
            } else {
                console.error('Aucun lien de jeu trouvé pour ce bouton.');
            }
        });
    });
});
