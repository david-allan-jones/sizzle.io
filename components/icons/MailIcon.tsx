import { IconButtonBase } from "./IconButtonBase";

function sendEmail() {
    const currentUrl = window.location.href;
    const subject = encodeURIComponent('Sizzle Poll Invite')
    const body = encodeURIComponent(`Check out this Sizzle poll:\n\n${currentUrl}\n\n`)
    const mailtoLink = `mailto:?subject=${subject}&body=${body}`;
    window.location.href = mailtoLink;
}
  

export function MailIcon() {
    return <IconButtonBase onClick={sendEmail}>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="24" height="24">
            <path fill="white" d="M22 3H2a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h20a2 2 0 0 0 2-2V5a2 2 0 0 0-2-2zM4 7.25l8 5.6 8-5.6v9.9H4v-9.9z"/>
        </svg>
    </IconButtonBase>
}