import { IconButtonBase } from "./IconButtonBase";

function shareToFacebook() {
    const url = encodeURIComponent(window.location.href);
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}text=fjklds`;
    window.open(facebookUrl, '_blank');
}

export function FacebookIcon() {
    return <IconButtonBase onClick={shareToFacebook}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="white" d="M19.6 0H4.4C1.97 0 0 1.97 0 4.4v15.2C0 22.03 1.97 24 4.4 24h7.09v-9.29H6.81v-3.6h4.68v-2.66c0-4.6 2.82-7.1 6.89-7.1 1.96 0 3.64.15 4.12.22v4.8l-2.82.01c-2.22 0-2.65 1.06-2.65 2.6v3.41h5.29l-.69 3.59H16.9V24h2.7c2.43 0 4.4-1.97 4.4-4.4V4.4c0-2.43-1.97-4.4-4.4-4.4z"/>
        </svg>
    </IconButtonBase>
}