/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                primary: "#5BC0BE",
                "primary-hover": "#489C9A",
                "background-light": "#F3F4F6",
                "background-dark": "#0B132B",
                "surface-light": "#FFFFFF",
                "surface-dark": "#1C2541",
                "text-primary-light": "#111827",
                "text-primary-dark": "#E5E7EB",
                "text-secondary-light": "#6B7280",
                "text-secondary-dark": "#9CA3AF",
                "border-light": "#E5E7EB",
                "border-dark": "#3A506B",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            },
        },
    },
    plugins: [],
}
