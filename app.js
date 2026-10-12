
const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
// Middleware de vérification du token JWT
function verifierToken(req, res, next) {
const authHeader = req.headers.authorization;
if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
        message: "Token manquant ou format incorrect."
    });
}
const token = authHeader.split(" ")[1];
if (!token) {
    return res.status(401).json({
        message: "Token manquant."
    });
    
}
try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
}
catch (error) {
    return res.status(401).json({
        message: "Token invalide ou expiré."
    });
}
}
const Catway = require("./models/Catway");
const Reservation = require("./models/Reservation");
const User = require("./models/User");
require("dotenv").config();

// Création de l'application Express
const app = express();
app.set("view engine", "ejs");

// Permet de recevoir des données JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// =====================================
// CONNEXION À MONGODB
// =====================================

mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("Connexion à MongoDB réussie !");
    })
    .catch((error) => {
        console.error(
            "Erreur de connexion à MongoDB :",
            error.message
        );
    });

// =====================================
// ROUTE D'ACCUEIL
// =====================================

("/", (req, res) => {
    res.send("Bienvenue sur l'API du Port Russell !");
});

// =====================================
// GET : RÉCUPÉRER TOUS LES CATWAYS
// =====================================

app.get("/api/catways", async (req, res) => {
    try {
        const catways = await Catway.find();

        return res.status(200).json(catways);

    } catch (error) {
        console.error(error.message);

        return res.status(500).json({
            message: "Erreur lors de la récupération des catways"
        });
    }
});

// =====================================
// GET : RÉCUPÉRER UN CATWAY PAR NUMÉRO
// =====================================

app.get("/api/catways/:id", async (req, res) => {
    try {
        const id = Number(req.params.id);

        // Vérifier le numéro
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Numéro de catway invalide"
            });
        }

        // Rechercher le catway
        const catway = await Catway.findOne({
            catwayNumber: id
        });

        // Catway introuvable
        if (!catway) {
            return res.status(404).json({
                message: "Catway introuvable"
            });
        }

        // Envoyer le catway trouvé
        return res.status(200).json(catway);

    } catch (error) {
        console.error(error.message);

        return res.status(500).json({
            message: "Erreur lors de la récupération du catway"
        });
    }
});

// =====================================
// POST : CRÉER UN NOUVEAU CATWAY
// =====================================

app.post("/catways", async (req, res) => {
    try {
        // Récupérer les données envoyées
        const {
            catwayNumber,
            catwayType,
            catwayState
        } = req.body || {};

        // Vérifier le numéro
        if (!Number.isInteger(catwayNumber) || catwayNumber <= 0) {
            return res.status(400).json({
                message: "Numéro de catway invalide"
            });
        }

        // Vérifier le type
        if (catwayType !== "long" && catwayType !== "short") {
            return res.status(400).json({
                message: "Le type de catway doit être long ou short"
            });
        }

        // Vérifier l'état
        if (
            typeof catwayState !== "string" ||
            catwayState.trim() === ""
        ) {
            return res.status(400).json({
                message: "Veuillez renseigner l'état du catway"
            });
        }

        // Vérifier si le numéro existe déjà
        const catwayExistant = await Catway.findOne({
            catwayNumber: catwayNumber
        });

        if (catwayExistant) {
            return res.status(409).json({
                message: "Ce numéro de catway existe déjà"
            });
        }

        // Créapp.geter le nouveau catway dans MongoDB
        const nouveauCatway = await Catway.create({
            catwayNumber: catwayNumber,
            catwayType: catwayType,
            catwayState: catwayState.trim()
        });

        // Confirmer la création
        return res.status(201).json({
            message: "Catway créé avec succès",
            catway: nouveauCatway
        });

    
    } catch (error) {
        console.error(
            "Erreur lors de la création du catway :",
            error.message
        );

        return res.status(500).json({
            message: "Erreur lors de la création du catway"
        });
    }
});

// =====================================
// PUT : MODIFIER UN CATWAY
// =====================================

app.put("/catways/:id", async (req, res) => {
    try {
        // Récupérer le numéro dans l'URL
        const id = Number(req.params.id);

        // Vérifier le numéro
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Numéro de catway invalide"
            });
        }

        // Récupérer le nouvel état
        const { catwayState } = req.body || {};

        // Vérifier le nouvel état
        if (typeof catwayState !== "string" || catwayState.trim() === "") {
            return res.status(400).json({
                message: "Veuillez renseigner le nouvel état du catway"
            });
        }

        // Modifier le catway dans MongoDB
        const catwayModifie = await Catway.findOneAndUpdate(
            { catwayNumber: id },
            { catwayState: catwayState.trim() },
            { new: true }
        );

        // Vérifier si le catway existe
        if (!catwayModifie) {
            return res.status(404).json({
                message: "Catway introuvable"
            });
        }

        // Confirmer la modification
        return res.status(200).json({
            message: "Catway modifié avec succès",
            catway: catwayModifie
        });

    } catch (error) {
        console.error("Erreur modification catway :", error.message);

        return res.status(500).json({
            message: "Erreur lors de la modification du catway"
        });
    }
});

// =====================================
// DELETE : SUPPRIMER UN CATWAY
// =====================================

// =====================================
// DELETE : SUPPRIMER UN CATWAY
// =====================================

app.delete("/catways/:id", async (req, res) => {
    try {
        // Récupérer le numéro du catway
        const id = Number(req.params.id);

        // Vérifier si le numéro est valide
        if (!Number.isInteger(id) || id <= 0) {
            return res.status(400).json({
                message: "Numéro de catway invalide"
            });
        }
        // Supprimer le catway dans MongoDB
const catwaySupprime = await Catway.findOneAndDelete({
    catwayNumber: id
});
// Vérifier si le catway existait
if (!catwaySupprime) {
    return res.status(404).json({
        message: "Catway introuvable"
    });
}
// Confirmer la suppression
return res.status(200).json({
    message: "Catway supprimé avec succès",
    catway: catwaySupprime
});

    } catch (error) {
        console.error("Erreur suppression catway :", error.message);

        return res.status(500).json({
            message: "Erreur lors de la suppression du catway"
        });
    }
});
// =====================================
// GET : RÉCUPÉRER TOUTES LES RÉSERVATIONS
// =====================================

app.get("/api/reservations", async (req, res) => {
    try {
        const reservations = await Reservation.find();
        return res.status(200).json(reservations);

    } catch (error) {
        console.error("Erreur récupération réservations :", error.message);

        return res.status(500).json({
            message: "Erreur lors de la récupération des réservations"
        });
    }
    
});

// =====================================
// GET : RÉCUPÉRER UNE SEULE RÉSERVATION
// =====================================

    // =====================================
// GET : RÉCUPÉRER UNE SEULE RÉSERVATION
// =====================================
// Afficher le formulaire de création


app.get("/api/reservations/:id", async (req, res) => {

    const id = req.params.id;

    try {
        const reservation = await Reservation.findById(id);
        if (!reservation) {
    return res.status(404).json({
        message: "Réservation introuvable"
    });
}
return res.status(200).json(reservation);

    } catch (error) {
        console.error("Erreur récupération réservation :", error.message);
        return res.status(500).json({
    message: "Erreur lors de la récupération de la réservation"
});
    }

});
// =====================================
// POST : CRÉER UNE NOUVELLE RÉSERVATION
// =====================================
app.post("/reservations", async (req, res) => {


    const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

    if (
        catwayNumber == null ||
        !clientName ||
        !boatName ||
        !startDate ||
        !endDate
    ) {
        return res.status(400).json({
            message: "Tous les champs sont obligatoires"
        });
    } // Ferme le IF

    try {
        const nouvelleReservation = new Reservation({
            catwayNumber,
            clientName,
            boatName,
            startDate,
            endDate
        });
        await nouvelleReservation.save();
        return res.status(201).json({
    message: "Réservation créée avec succès",
    reservation: nouvelleReservation
});

    } catch (error) {
        console.error("Erreur création réservation :", error.message);
        return res.status(500).json({
    message: "Erreur lors de la création de la réservation"
});
    }

}); // Ferme la route POST

// DELETE : SUPPRIMER UNE RÉSERVATION
app.delete("/reservations/:id", async (req, res) => {

    const id = req.params.id;

    try {
        const reservationSupprimee = await Reservation.findByIdAndDelete(id);
        if (!reservationSupprimee) {
    return res.status(404).json({
        message: "Réservation introuvable"
    });
}
return res.status(200).json({
    message: "Réservation supprimée avec succès"
});

    } catch (error) {
        console.error("Erreur suppression réservation :", error.message);

return res.status(500).json({
    message: "Erreur lors de la suppression de la réservation"
});

    }

}); // Ferme la route DELETE

// Bloc temporaire de diagnostic
console.log(
    "Routes enregistrées :",
    app.router.stack
        .filter(couche => couche.route)
        .map(couche => ({
            chemin: couche.route.path,
            methodes: couche.route.methods
        }))
);

const PORT = 3001;
app.get("/test-connexion", (req, res) => {
    res.send("MAGIC CHEF : serveur Port Russell !");
});
// Route d'inscription des utilisateurs
app.post("/api/users/register", async (req, res) => {
    console.log("TEST : route inscription appelée !");
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ message: "Tous les champs sont obligatoires." });
       

}
try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
    return res.status(409).json({
        message: "Cet email est déjà utilisé."
    });
}
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, password: hashedPassword });
    await newUser.save();
    return res.status(201).json({ message: "Utilisateur créé avec succès !" });

} catch (error) {
    console.error("Erreur inscription :", error.message);

    return res.status(500).json({
        message: "Erreur interne du serveur."
    });
}

});
// Route de connexion des utilisateurs

app.post("/api/users/login", async (req, res) => {

   const { email, password } = req.body || {};

    // 1. Vérifier les champs obligatoires
    if (!email || !password) {
        return res.status(400).json({
            message: "Email et mot de passe obligatoires."
        });
    }

    try {
        // 2. Rechercher l'utilisateur dans MongoDB
        const user = await User.findOne({ email });

        // 3. Vérifier si l'utilisateur existe
        if (!user) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect."
            });
        }

        // 4. Vérifier le mot de passe avec bcrypt
        const passwordValide = await bcrypt.compare(password, user.password);

        if (!passwordValide) {
            return res.status(401).json({
                message: "Email ou mot de passe incorrect."
            });
        }
const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);
        // 5. Connexion réussie
        return res.status(200).json({
    message: "Connexion réussie !",
    token: token
});

    } catch (error) {
        console.error("Erreur connexion :", error.message);

        return res.status(500).json({
            message: "Erreur interne du serveur."
        });
    }

});



// Route protégée : profil utilisateur
app.get("/api/users/profile", verifierToken, (req, res) => {
    res.status(200).json({
        message: "Bienvenue dans votre espace sécurisé !",
        userId: req.user.userId
    });
});


// Démarrage du serveur
// Page d'accueil du Port Russell
app.get("/", (req, res) => {
    res.render("index");
});

// Route du tableau de bord/
app.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
    return res.status(401).send("Email ou mot de passe incorrect.");
}
const passwordValide = await bcrypt.compare(password || "", user.password);
if (!passwordValide) {
    return res.status(401).send("Email ou mot de passe incorrect.");
}
const token = jwt.sign(
    { userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
);
res.cookie("token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 1000
});

    console.log("Tentative de connexion :", email);

    return res.redirect("/dashboard");
});

function verifierConnexion(req, res, next) {
    const token = req.cookies?.token;

    if (!token) {
        return res.redirect("/");
    }

    try {
        req.user = jwt.verify(token, process.env.JWT_SECRET);
        next();
    } catch (error) {
        res.clearCookie("token");
        return res.redirect("/");
    }
}

app.get("/dashboard", verifierConnexion, async (req, res) => {
    try {
        const utilisateur = await User.findById(req.user.userId);
        const maintenant = new Date();

const reservationsEnCours = await Reservation.find({
    startDate: { $lte: maintenant },
    endDate: { $gte: maintenant }
});

        if (!utilisateur) {
            res.clearCookie("token");
            return res.redirect("/");
        }

        res.render("dashboard", {
            username: utilisateur.name,
            email: utilisateur.email,
            dateDuJour: new Date().toLocaleDateString("fr-FR"),
            reservations: reservationsEnCours
        });

    } catch (error) {
        console.error("Erreur dashboard :", error.message);
        return res.status(500).send("Erreur lors du chargement du tableau de bord.");
    }
});

// Page de gestion des catways
app.get("/catways", verifierConnexion, async (req, res) => {
    try {
        const catways = await Catway.find().sort({ catwayNumber: 1 });

        res.render("catways", {
            catways: catways
        });

    } catch (error) {
        console.error("Erreur chargement catways :", error.message);

        res.status(500).send(
            "Erreur lors du chargement des catways."
        );
    }
});

// Afficher le formulaire de modification d'un catway
app.get("/catways/:id/edit", verifierConnexion, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);

        if (!catway) {
            return res.status(404).send("Catway introuvable.");
        }

        res.render("edit-catway", { catway });

    } catch (error) {
        console.error("Erreur formulaire catway :", error.message);
        res.status(400).send("Identifiant de catway invalide.");
    }
});

// Enregistrer la modification de l'état d'un catway
app.post("/catways/:id/edit", verifierConnexion, async (req, res) => {
    try {
        const { catwayState } = req.body;

        // Vérifier que l'état est renseigné
        if (
            typeof catwayState !== "string" ||
            catwayState.trim() === ""
        ) {
            return res.status(400).send("Veuillez renseigner l'état du catway.");
        }

        // Modifier uniquement l'état dans MongoDB
        const catwayModifie = await Catway.findByIdAndUpdate(
            req.params.id,
            { catwayState: catwayState.trim() },
            { new: true, runValidators: true }
        );

        if (!catwayModifie) {
            return res.status(404).send("Catway introuvable.");
        }

        // Retourner à la liste après modification
        return res.redirect("/catways");

    } catch (error) {
        console.error("Erreur modification catway :", error.message);
        return res.status(400).send("Impossible de modifier ce catway.");
    }
});

// Afficher le formulaire de création
app.get("/catways/create", verifierConnexion, (req, res) => {
    res.render("create-catway");
});

// Enregistrer un nouveau catway
app.post("/catways/create", verifierConnexion, async (req, res) => {
    try {
        const catwayNumber = Number(req.body.catwayNumber);
        const { catwayType, catwayState } = req.body;

        // Vérifier les données
        if (!Number.isInteger(catwayNumber) || catwayNumber <= 0) {
            return res.status(400).send("Numéro de catway invalide.");
        }

        if (!["long", "short"].includes(catwayType)) {
            return res.status(400).send("Type de catway invalide.");
        }

        if (typeof catwayState !== "string" || !catwayState.trim()) {
            return res.status(400).send("L'état du catway est obligatoire.");
        }

        // Vérifier que le numéro n'existe pas déjà
        const catwayExistant = await Catway.findOne({ catwayNumber });

        if (catwayExistant) {
            return res.status(409).send("Ce numéro de catway existe déjà.");
        }

        // Enregistrer dans MongoDB
        await Catway.create({
            catwayNumber,
            catwayType,
            catwayState: catwayState.trim()
        });

        return res.redirect("/catways");

    } catch (error) {
        console.error("Erreur création catway :", error.message);
        return res.status(500).send("Impossible de créer le catway.");
    }
});

// Supprimer un catway depuis l'interface HTML
app.post("/catways/:id/delete", verifierConnexion, async (req, res) => {
    try {
        const catway = await Catway.findById(req.params.id);

        if (!catway) {
            return res.status(404).send("Catway introuvable.");
        }

        // Sécurité temporaire : seul le catway de test peut être supprimé
        if (catway.catwayNumber !== 25) {
            return res.status(403).send(
                "Suppression réservée au catway de test."
            );
        }

        await Catway.findByIdAndDelete(catway._id);

        return res.redirect("/catways");

    } catch (error) {
        console.error("Erreur suppression catway :", error.message);
        return res.status(400).send("Impossible de supprimer ce catway.");
    }
});

// Page de gestion des réservations
app.get("/reservations", verifierConnexion, async (req, res) => {
    try {
        const reservations = await Reservation.find().sort({
            startDate: 1
        });

        return res.render("reservations", {
            reservations: reservations
        });

    } catch (error) {
        console.error(
            "Erreur chargement réservations :",
            error.message
        );

        return res.status(500).send(
            "Erreur lors du chargement des réservations."
        );
    }
});

// Afficher le formulaire de création
app.get("/reservations/create", verifierConnexion, (req, res) => {
    res.render("create-reservation");
});

// Enregistrer une nouvelle réservation
app.post("/reservations/create", verifierConnexion, async (req, res) => {
    try {
        const {
            catwayNumber,
            clientName,
            boatName,
            startDate,
            endDate
        } = req.body;

        // Vérifier que tous les champs sont remplis
        if (!catwayNumber || !clientName?.trim() ||
            !boatName?.trim() || !startDate || !endDate) {
            return res.status(400).send("Tous les champs sont obligatoires.");
        }

        // Vérifier les dates
        const debut = new Date(startDate);
        const fin = new Date(endDate);

        if (isNaN(debut.getTime()) || isNaN(fin.getTime()) || fin <= debut) {
            return res.status(400).send("Les dates de réservation sont invalides.");
        }

        // Vérifier que le catway existe
        const catway = await Catway.findOne({
            catwayNumber: Number(catwayNumber)
        });

        if (!catway) {
            return res.status(404).send("Ce catway n'existe pas.");
        }

        // Vérifier qu'il n'est pas déjà réservé
        const conflit = await Reservation.findOne({
            catwayNumber: Number(catwayNumber),
            startDate: { $lt: fin },
            endDate: { $gt: debut }
        });

        if (conflit) {
            return res.status(409).send(
                "Ce catway est déjà réservé pour cette période."
            );
        }

        // Enregistrer dans MongoDB
        await Reservation.create({
            catwayNumber: Number(catwayNumber),
            clientName: clientName.trim(),
            boatName: boatName.trim(),
            startDate: debut,
            endDate: fin
        });

        return res.redirect("/reservations");

    } catch (error) {
        console.error("Erreur création réservation :", error.message);
        return res.status(500).send(
            "Impossible de créer la réservation."
        );
    }
});

// Afficher le formulaire de modification
app.get("/reservations/:id/edit", verifierConnexion, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).send("Réservation introuvable.");
        }

        return res.render("edit-reservation", { reservation });

    } catch (error) {
        console.error("Erreur récupération réservation :", error.message);
        return res.status(400).send("Identifiant de réservation invalide.");
    }
});

// Enregistrer les modifications
app.post("/reservations/:id/edit", verifierConnexion, async (req, res) => {
    try {
        const { catwayNumber, clientName, boatName, startDate, endDate } = req.body;

        const numero = Number(catwayNumber);
        const debut = new Date(startDate);
        const fin = new Date(endDate);

        if (
            !Number.isInteger(numero) ||
            numero < 1 ||
            !clientName?.trim() ||
            !boatName?.trim() ||
            !Number.isFinite(debut.getTime()) ||
            !Number.isFinite(fin.getTime()) ||
            fin <= debut
        ) {
            return res.status(400).send("Informations de réservation invalides.");
        }

        const catway = await Catway.findOne({ catwayNumber: numero });

        if (!catway) {
            return res.status(404).send("Ce catway n'existe pas.");
        }

        const conflit = await Reservation.findOne({
            _id: { $ne: req.params.id },
            catwayNumber: numero,
            startDate: { $lt: fin },
            endDate: { $gt: debut }
        });

        if (conflit) {
            return res.status(409).send(
                "Ce catway est déjà réservé pendant cette période."
            );
        }

        const reservation = await Reservation.findByIdAndUpdate(
            req.params.id,
            {
                catwayNumber: numero,
                clientName: clientName.trim(),
                boatName: boatName.trim(),
                startDate: debut,
                endDate: fin
            },
            { new: true, runValidators: true }
        );

        if (!reservation) {
            return res.status(404).send("Réservation introuvable.");
        }

        return res.redirect("/reservations");

    } catch (error) {
        console.error("Erreur modification réservation :", error.message);
        return res.status(400).send("Impossible de modifier la réservation.");
    }
});

// Supprimer une réservation
app.post("/reservations/:id/delete", verifierConnexion, async (req, res) => {
    try {
        const reservation = await Reservation.findById(req.params.id);

        if (!reservation) {
            return res.status(404).send("Réservation introuvable.");
        }

        // Sécurité temporaire : supprimer uniquement notre réservation de test
       if (
    reservation.catwayNumber !== 10 ||
    !(
        reservation.clientName === "Client Test Russell" ||
        reservation.clientName === "Ocean Test Modifié"
    ) ||
    !(
        reservation.boatName === "Ocean Test 10" ||
        reservation.boatName === "Ocean Test Modifié"
    )
) {
    return res.status(403).send(
        "Suppression réservée à notre réservation de test."
    );
}

        await Reservation.findByIdAndDelete(req.params.id);

        return res.redirect("/reservations");

    } catch (error) {
        console.error("Erreur suppression réservation :", error.message);
        return res.status(400).send(
            "Impossible de supprimer cette réservation."
        );
    }
});

// Afficher la page de gestion des utilisateurs
app.get("/users", verifierConnexion, async (req, res) => {
    try {
        const users = await User.find()
            .select("name email")
            .sort({ name: 1 });

        return res.render("users", { users });

    } catch (error) {
        console.error("Erreur récupération utilisateurs :", error.message);

        return res.status(500).send(
            "Impossible de charger les utilisateurs."
        );
    }
});

// Afficher le formulaire de création d'utilisateur
app.get("/users/create", verifierConnexion, (req, res) => {
    res.render("create-user");
});

// Enregistrer un nouvel utilisateur
app.post("/users/create", verifierConnexion, async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Vérifier les champs
        if (
            !name?.trim() ||
            !email?.trim() ||
            typeof password !== "string" ||
            password.length < 8
        ) {
            return res.status(400).send(
                "Tous les champs sont obligatoires. Le mot de passe doit contenir au moins 8 caractères."
            );
        }

        const emailNormalise = email.trim().toLowerCase();

        // Vérifier si l'email existe déjà
        const utilisateurExistant = await User.findOne({
            email: emailNormalise
        });

        if (utilisateurExistant) {
            return res.status(409).send(
                "Cette adresse email est déjà utilisée."
            );
        }

        // Hacher le mot de passe
        const motDePasseHache = await bcrypt.hash(password, 10);

        // Créer l'utilisateur dans MongoDB
        await User.create({
            name: name.trim(),
            email: emailNormalise,
            password: motDePasseHache
        });

        return res.redirect("/users");

    } catch (error) {
        console.error("Erreur création utilisateur :", error.message);

        return res.status(500).send(
            "Impossible de créer cet utilisateur."
        );
    }
});

// Afficher le formulaire de modification
app.get("/users/:email/edit", verifierConnexion, async (req, res) => {
    try {
        const user = await User.findOne({
            email: req.params.email
        }).select("name email");

        if (!user) {
            return res.status(404).send("Utilisateur introuvable.");
        }

        return res.render("edit-user", { user });

    } catch (error) {
        console.error("Erreur récupération utilisateur :", error.message);
        return res.status(500).send("Impossible de charger l'utilisateur.");
    }
});


// Enregistrer les modifications
app.post("/users/:email/edit", verifierConnexion, async (req, res) => {
    try {
        const { name, password } = req.body;

        if (typeof name !== "string" || !name.trim()) {
            return res.status(400).send("Le nom est obligatoire.");
        }

        const modifications = {
            name: name.trim()
        };

        // Modifier le mot de passe uniquement s'il est renseigné
        if (password) {
            if (typeof password !== "string" || password.length < 8) {
                return res.status(400).send(
                    "Le mot de passe doit contenir au moins 8 caractères."
                );
            }

            modifications.password = await bcrypt.hash(password, 10);
        }

        const user = await User.findOneAndUpdate(
            { email: req.params.email },
            modifications,
            { new: true, runValidators: true }
        );

        if (!user) {
            return res.status(404).send("Utilisateur introuvable.");
        }

        return res.redirect("/users");

    } catch (error) {
        console.error("Erreur modification utilisateur :", error.message);
        return res.status(500).send("Impossible de modifier l'utilisateur.");
    }
});

// Supprimer notre utilisateur de démonstration
app.post("/users/:email/delete", verifierConnexion, async (req, res) => {
    try {
        if (req.params.email !== "demo.russell@example.com") {
            return res.status(403).send(
                "Suppression réservée à l'utilisateur de démonstration."
            );
        }

        const user = await User.findOneAndDelete({
            email: req.params.email
        });

        if (!user) {
            return res.status(404).send("Utilisateur introuvable.");
        }

        return res.redirect("/users");

    } catch (error) {
        console.error("Erreur suppression utilisateur :", error.message);
        return res.status(500).send(
            "Impossible de supprimer cet utilisateur."
        );
    }
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur http://localhost:${PORT}`);
});