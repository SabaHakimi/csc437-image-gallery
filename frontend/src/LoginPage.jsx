import React, { useActionState } from "react";
import { Link } from "react-router";
import { VALID_ROUTES } from "../../shared/ValidRoutes.js";
import "./LoginPage.css";

export function LoginPage({ isRegistering, onLoginSuccess }) {
    const usernameInputId = React.useId();
    const emailInputId = React.useId();
    const passwordInputId = React.useId();

    async function handleSubmit(prevState, formData) {
        const username = formData.get("username");
        const password = formData.get("password");
        const email = isRegistering ? formData.get("email") : null;

        const url = isRegistering ? "/api/users" : "/api/auth/tokens";
        const body = isRegistering ? { username, email, password } : { username, password };

        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(body),
            });

            const data = await response.json();

            if (!response.ok) {
                return data.message || "An error occurred";
            }

            if (isRegistering) {
                console.log("Successfully created account");
            } else {
                console.log("Successfully logged in");
                console.log("Auth token:", data.token);
            }

            if (data.token) {
                onLoginSuccess(data.token);
            }

            return null;
        } catch (error) {
            return "Failed to connect to the server";
        }
    }

    const [error, formAction, isPending] = useActionState(handleSubmit, null);

    return (
        <>
            <h2>{isRegistering ? "Register a new account" : "Login"}</h2>
            <form action={formAction} className="LoginPage-form">
                <label htmlFor={usernameInputId}>Username</label>
                <input id={usernameInputId} name="username" required disabled={isPending} />

                {isRegistering && (
                    <>
                        <label htmlFor={emailInputId}>Email</label>
                        <input id={emailInputId} name="email" type="email" required disabled={isPending} />
                    </>
                )}

                <label htmlFor={passwordInputId}>Password</label>
                <input id={passwordInputId} name="password" type="password" required disabled={isPending} />

                <input type="submit" value="Submit" disabled={isPending} />
            </form>

            <div aria-live="polite" className="LoginPage-error">
                {error && <p>{error}</p>}
            </div>

            <p>
                {isRegistering ? (
                    <>
                        Already have an account? <Link typeof="" to={VALID_ROUTES.LOGIN}>Login here</Link>
                    </>
                ) : (
                    <>
                        Don't have an account? <Link to={VALID_ROUTES.REGISTER}>Register here</Link>
                    </>
                )}
            </p>
        </>
    );
}
