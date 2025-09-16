import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
        font-family: 'Inter', sans-serif;
    }

    body {
        margin: 0;
        padding: 0;
    }

    #root {
        max-width: 1280px;
        margin: 0 auto;
        text-align: center;
    }

    nav {
        background-color: var(--primary-dark);
        width: 100%;
        margin: auto;
    }

    :root {
        --primary-dark: #3E1929;
        --primary-light: #F8FCDA;
        --secondary-color-dark: #845A6D;
        --secondary-color-light: #FFBA08;
        --accent-green: #BFAB25;
        --accent-purple: #8D91C7;
        --accent-dark-purple: #6E75A8;
        --black-adjacent: #000000;
        --text-color-light: #F8FCDA;
        --text-color: #3E1929;
        --font-size-base: 16px;
        --spacing-unit: 8px;
    }
`;

export default GlobalStyles;
