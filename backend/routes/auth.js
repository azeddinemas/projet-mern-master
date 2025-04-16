const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const upload = require("../middleware/upload");
const auth = require("../middleware/auth");

// Inscription
router.post("/register", upload.single("profilePicture"), async (req, res) => {
  const { fullName, email, password } = req.body;
  console.log("register", req.body);
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({
      fullName, // Ajout du nom complet (optionnel)
      email,
      password: hashedPassword,
      profilePicture: req.file ? `/uploads/${req.file.filename}` : null,
    });
    await user.save();
    console.log("Utilisateur créé avec succès:", user);
    res.status(201).json({ message: "Utilisateur créé avec succès" });
  } catch (err) {
    console.error("Erreur lors de l’inscription:", err);
    res
      .status(400)
      .json({ message: "Email déjà utilisé ou erreur lors de l’inscription" });
  }
});

// Connexion
router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.status(400).json({ message: "Email et mot de passe requis" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign({ id: user._id }, "votre_secret_jwt", {
      expiresIn: "1h",
    });
    res.json({
      token,
      user: {
        fullName: user.fullName,
        email: user.email,
        profilePicture: user.profilePicture,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Récupérer les infos de l'utilisateur connecté
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res.json({
      fullName: user.fullName,
      email: user.email,
      profilePicture: user.profilePicture,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});

// Réinitialisation du mot de passe
router.post("/reset-password", async (req, res) => {
  const { email, newPassword } = req.body;

  if (!email || !newPassword) {
    return res.status(400).json({ message: "Email et nouveau mot de passe requis" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.json({ message: "Mot de passe réinitialisé avec succès" });
  } catch (err) {
    console.error("Erreur lors de la réinitialisation du mot de passe :", err);
    res.status(500).json({ message: "Erreur serveur" });
  }
});


module.exports = router;
