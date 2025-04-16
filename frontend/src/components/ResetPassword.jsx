import React, { useState } from 'react';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');

    const handleReset = (e) => {
        e.preventDefault();

        if (!email) {
            setMessage("Veuillez entrer une adresse email valide.");
            return;
        }

        if (!password || !confirmPassword) {
            setMessage("Veuillez remplir les deux champs de mot de passe.");
            return;
        }

        if (password !== confirmPassword) {
            setMessage("Les mots de passe ne correspondent pas.");
            return;
        }

        // Simule l'envoi du formulaire
        setMessage(`Mot de passe réinitialisé avec succès pour ${email}.`);
    };

    return (
        <div className="max-w-md mx-auto mt-16 p-6 bg-white shadow rounded-lg">
            <h2 className="text-2xl font-bold mb-4 text-center">Réinitialiser le mot de passe</h2>
            <form onSubmit={handleReset} className="space-y-4">
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Votre adresse email"
                    required
                    className="input input-bordered w-full"
                />
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nouveau mot de passe"
                    required
                    className="input input-bordered w-full"
                />
                <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirmer le mot de passe"
                    required
                    className="input input-bordered w-full"
                />
                <button type="submit" className="btn btn-primary w-full">
                    Réinitialiser le mot de passe
                </button>
            </form>
            {message && <p className="mt-4 text-center text-sm text-green-600">{message}</p>}
        </div>
    );
};

export default ResetPassword;