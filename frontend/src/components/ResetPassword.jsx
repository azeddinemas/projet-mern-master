import React, { useState } from 'react';
import api from '../axiosConfig';
import { useNavigate } from 'react-router-dom';

const ResetPassword = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');

    const navigate = useNavigate();

    const handleReset = async (e) => {
        e.preventDefault();

        setMessage('');
        setError('');

        if (!email) {
            setError("Veuillez entrer une adresse email valide.");
            return;
        }

        if (!password || !confirmPassword) {
            setError("Veuillez remplir les deux champs de mot de passe.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Les mots de passe ne correspondent pas.");
            return;
        }

        try {
            const response = await api.post('/auth/reset-password', {
                email,
                newPassword: password,
            });

            const data = response;

            setMessage(data.message);
            setEmail('');
            setPassword('');
            setConfirmPassword('');
            navigate('/')

        } catch (err) {
            if (err.response && err.response.data && err.response.data.message) {
                setError(err.response.data.message);
            } else {
                setError("Erreur lors de la réinitialisation du mot de passe");
            }
        }

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
            {error && <p className="mt-4 text-center text-sm text-red-600">{error}</p>}
        </div>
    );
};

export default ResetPassword;