import React, { useState } from 'react';
import { Button, InputField, NoticeBox } from '@dhis2/ui';
import PropTypes from 'prop-types';
import i18n from '../locales';

export function LoginPage({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        console.log('LoginPage: Attempting login with username:', username);

        try {
            const response = await fetch('/api/me', { // Use Vite proxy
                method: 'GET',
                headers: {
                    Authorization: `Basic ${btoa(`${username}:${password}`)}`,
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            console.log('LoginPage: API response status=', response.status);

            if (response.ok) {
                console.log('LoginPage: Login successful, calling onLogin');
                onLogin({ username, password });
            } else {
                const errorData = await response.json().catch(() => ({}));
                console.log('LoginPage: Login failed, error=', errorData);
                setError(
                    i18n.t(
                        errorData.message ||
                            'Invalid username or password. Please try again.'
                    )
                );
            }
        } catch (err) {
            console.log('LoginPage: Fetch error=', err.message);
            setError(
                i18n.t('Failed to connect to the server. Please check your connection.')
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div
            style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                minHeight: '100vh',
                backgroundColor: '#f7fafc',
                padding: '1rem',
            }}
        >
            <div
                style={{
                    maxWidth: '400px',
                    width: '100%',
                    backgroundColor: '#fff',
                    padding: '2rem',
                    borderRadius: '8px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                }}
            >
                <h2
                    style={{
                        fontSize: '1.5rem',
                        fontWeight: '600',
                        marginBottom: '1.5rem',
                        textAlign: 'center',
                        color: '#1a3c34',
                    }}
                >
                    {i18n.t('Login to DHIS2')}
                </h2>

                {error && (
                    <NoticeBox
                        title={i18n.t('Login Error')}
                        error
                        style={{ marginBottom: '1rem', borderRadius: '6px' }}
                    >
                        {error}
                    </NoticeBox>
                )}

                <form onSubmit={handleSubmit}>
                    <InputField
                        label={i18n.t('Username')}
                        value={username}
                        onChange={({ value }) => setUsername(value)}
                        placeholder={i18n.t('Enter your username')}
                        disabled={isLoading}
                        style={{ marginBottom: '1rem' }}
                        inputStyle={{ borderRadius: '6px' }}
                    />
                    <InputField
                        label={i18n.t('Password')}
                        type="password"
                        value={password}
                        onChange={({ value }) => setPassword(value)}
                        placeholder={i18n.t('Enter your password')}
                        disabled={isLoading}
                        style={{ marginBottom: '1.5rem' }}
                        inputStyle={{ borderRadius: '6px' }}
                    />
                    <Button
                        primary
                        large
                        type="submit"
                        disabled={isLoading || !username || !password}
                        style={{
                            width: '100%',
                            borderRadius: '6px',
                            fontWeight: '500',
                            transition: 'all 0.2s ease',
                        }}
                    >
                        {isLoading ? i18n.t('Logging in...') : i18n.t('Login')}
                    </Button>
                </form>
            </div>
        </div>
    );
}

LoginPage.propTypes = {
    onLogin: PropTypes.func.isRequired,
};

export default LoginPage;