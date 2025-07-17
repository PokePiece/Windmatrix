import '@styles/globals.css'
import { ReactNode } from 'react'; // Import ReactNode for typing children

import Nav from '../components/Nav';
import Provider from '../components/Provider' // Assuming Provider is still needed, though not used in the snippet
import { AuthProvider } from '../context/AuthContext';

export const metadata = {
    title: "The Nerves",
    description: "View & Deploy Crystallized Intelligence"
}

// Correctly type the children prop as ReactNode
const RootLayout = ({ children }: { children: ReactNode }) => {
    return (
        <html lang="en">
            <head>
                <link rel="icon" href="/assets/images/logo.svg" />
            </head>
            <body>
                <AuthProvider>
                    {/* The Provider component was imported but not used.
                        If it's meant to wrap the entire app, it should be placed here.
                        For now, I'm keeping it as is, assuming it might be used elsewhere
                        or was a placeholder. If it's for global state/session, it should
                        likely wrap AuthProvider or be a sibling depending on its purpose.
                    */}
                    {/* <Provider> */}
                        <div className="main">
                            <div className="gradient" />
                        </div>

                        <main className="app">
                            <Nav />
                            {children}
                        </main>
                    {/* </Provider> */}
                </AuthProvider>
            </body>
        </html>
    )
}

export default RootLayout;
