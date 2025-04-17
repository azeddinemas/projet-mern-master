import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../axiosConfig';

const AuthForm = ({ setToken, setUser }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [profilePicture, setProfilePicture] = useState(null);
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);

  const location = useLocation();
  const successMessage = location.state?.successMessage || '';

  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (isLogin) {
        const res = await api.post('/auth/login', { email, password });
        setToken(res.data.token);
        setUser(res.data.user);
        localStorage.setItem('token', res.data.token);
        navigate('/', { replace: true })
      } else {
        const formData = new FormData();
        formData.append('fullName', fullName);
        formData.append('email', email);
        formData.append('password', password);
        if (profilePicture) {
          formData.append('profilePicture', profilePicture);
        }

        const res = await api.post('/auth/register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });

        if (res.status === 201) {
          alert('Inscription réussie, connectez-vous !');
          setIsLogin(true);
          setFullName('');
          setEmail('');
          setPassword('');
          setProfilePicture(null);
          navigate('/', { replace: true })
        }
      }
    } catch (err) {
      console.error('Erreur capturée:', err.response?.data || err.message);
      alert(err.response?.data?.message || 'Erreur lors de la soumission');
    }
  };

  return (
    <div className="auth-form max-w-md mx-auto mt-8">
      <h2 className="text-2xl font-bold mb-4">{isLogin ? 'Connexion' : 'Inscription'}</h2>

      {/* ✅ Message de succès après reset password */}
      {successMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mb-4 text-sm">
          <strong className="font-bold">Succès ! </strong>
          <span className="block sm:inline">{successMessage}</span>
        </div>
      )}


      <form onSubmit={handleSubmit} className="space-y-4">
        {!isLogin && (
          <input
            type="text"
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            placeholder="Nom complet"
            className="input input-bordered w-full"
          />
        )}
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Email"
          required
          className="input input-bordered w-full"
        />
        <div className="relative">
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Mot de passe"
            required
            className="input input-bordered w-full pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 flex items-center pr-3"
          >
            {showPassword ? '🙈' : '👁️'}
          </button>
        </div>

        {isLogin && (
          <div className="text-right text-sm">
            <a href="/reset-password" className="text-blue-500 hover:underline">
              Mot de passe oublié ?
            </a>
          </div>
        )}

        {!isLogin && (
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setProfilePicture(e.target.files[0])}
            className="file-input file-input-bordered w-full"
          />
        )}

        <button type="submit" className="btn btn-primary w-full">
          {isLogin ? 'Se connecter' : "S'inscrire"}
        </button>
      </form>

      <button
        onClick={() => setIsLogin(!isLogin)}
        className="btn btn-ghost mt-2 w-full"
      >
        {isLogin ? 'Pas de compte ? Inscrivez-vous' : 'Déjà un compte ? Connectez-vous'}
      </button>
    </div>
  );
};

export default AuthForm;