import { IconButtonBase } from "./IconButtonBase";

function shareToTwitter() {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent('Check out this Sizzle poll:');
    const twitterUrl = `https://twitter.com/intent/tweet?text=${text}&url=${url}`;
    window.open(twitterUrl, '_blank');
}

export function TwitterIcon() {
    return <IconButtonBase onClick={shareToTwitter}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="white" d="M22.46 5.73c-.8.36-1.64.6-2.52.7.91-.54 1.62-1.4 1.95-2.42-.86.5-1.82.86-2.84 1.05-.81-.86-1.96-1.4-3.23-1.4-2.44 0-4.41 1.97-4.41 4.4 0 .35.04.7.1 1.03-3.66-.18-6.91-1.94-9.08-4.61-.38.63-.6 1.37-.6 2.16 0 1.5.76 2.83 1.92 3.61-.71 0-1.38-.22-1.95-.53v.06c0 2.1 1.48 3.85 3.45 4.25-.36.09-.73.14-1.11.14-.27 0-.55-.02-.81-.06.55 1.7 2.14 2.93 4.03 2.96-1.47 1.15-3.32 1.84-5.33 1.84-.35 0-.7-.02-1.05-.06 1.9 1.22 4.14 1.93 6.56 1.93 7.88 0 12.18-6.53 12.18-12.18 0-.19 0-.38-.01-.56.83-.6 1.55-1.35 2.13-2.2z"/>
        </svg>
    </IconButtonBase>
}