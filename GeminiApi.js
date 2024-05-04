// Importation des dépendances nécessaires depuis le package @google/generative-ai
const {
    GoogleGenerativeAI, // Importation de la classe GoogleGenerativeAI
    HarmCategory, // Importation de la classe HarmCategory
    HarmBlockThreshold, // Importation de la classe HarmBlockThreshold
} = require("@google/generative-ai");

// Définition du nom du modèle à utiliser
const MODEL_NAME = "gemini-1.5-pro-latest";

// Définition de la clé d'API pour l'authentification
const API_KEY = "AIzaSyBmc4RPIBuQqWFqACEzzY3OeNYXKI-Aj34";

// Définition de la fonction asynchrone runChat qui va exécuter le chatbot
async function runChat() {
    // Création d'une instance de GoogleGenerativeAI avec la clé d'API fournie
    const genAI = new GoogleGenerativeAI(API_KEY);

    // Récupération du modèle de génération de texte spécifié
    const model = genAI.getGenerativeModel({ model: MODEL_NAME });

    // Configuration de la génération de texte et des paramètres de sécurité
    const generationConfig = {
        temperature: 1, // Température pour la génération du texte
        topK: 0, // Nombre maximum de tokens à considérer pour chaque candidat de génération
        topP: 0.95, // Somme cumulative minimale de probabilités de tokens à garder
        maxOutputTokens: 8192, // Nombre maximum de tokens dans la sortie générée
    };

    // Paramètres de sécurité pour filtrer les types de contenu nuisibles
    const safetySettings = [
        { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
        { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_MEDIUM_AND_ABOVE },
    ];

    // Initialisation d'une conversation avec le modèle en fournissant un historique de messages
    const chat = model.startChat({
        generationConfig, // Configuration de la génération de texte
        safetySettings, // Paramètres de sécurité
        history: [
            {
                // Rôle de l'utilisateur
                role: "user",
                 // Historique du message de l'utilisateur
                parts: [{ text:
                     "donne moi l estimation de cout de cette maison ,Informations sur la maison: Surface habitable : 120 m²  Nombre de pièces : 6 (5 chambres, 2 salles de bains, cuisine, salon, salle à manger)Type de construction : Plain-piedMatériaux de construction : Brique, charpente en bois, couverture en tuilesNiveau de finition : StandardPerformances énergétiques : RT 2020Informations sur Contraintes du projet:Terrain accessiblePas de contraintes géologiques particulièresRéglementations locales : RT 2020Mode de construction:Constructeur de maisons individuelles"}],
            },
            {
                role: "model", // Rôle du modèle
                parts: [{ text: "" }], // Historique vide pour la réponse du modèle
            },
        ],
    });

    // Définition du message utilisateur à envoyer
    const userInput = "donne moi l estimation de cout de cette maison, donner seulement le cout dans la reponse";

    // Envoi du message utilisateur au modèle et récupération de la réponse
    const result = await chat.sendMessage(userInput);
    const response = result.response;

    // Affichage de la réponse du modèle dans la console
    console.log(response.text());
}

// Appel de la fonction runChat pour exécuter le chatbot
runChat();