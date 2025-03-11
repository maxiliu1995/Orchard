'use client';

import { LoginForm } from '@/components/auth/LoginForm';
import './styles/auth.css';

export default function LoginPage() {
    console.log('LoginPage - Attempting to render');
    return (
        <div className="login-container" id="loginForm">
            <div className="logo-section">
                <svg className="logo" width="160" height="40" viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="30" cy="25" r="15" fill="#4F46E5"/>
                    <rect x="50" y="10" width="30" height="30" fill="#4F46E5" opacity="0.7"/>
                    <text x="90" y="35" fill="#111827" fontFamily="Inter" fontSize="24" fontWeight="600">WorkPod</text>
                </svg>
            </div>
            <LoginForm />
        </div>
    );
}