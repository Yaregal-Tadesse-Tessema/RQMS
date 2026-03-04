"use strict";

async function sendBrevoEmail({ apiKey, to, fromEmail, fromName, subject, htmlContent, textContent }) {
  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "api-key": apiKey
    },
    body: JSON.stringify({
      sender: { email: fromEmail, name: fromName },
      to: Array.isArray(to) ? to : [to],
      subject,
      htmlContent,
      textContent
    })
  });

  if (!res.ok) {
    const body = await res.text();
    const err = new Error(`Brevo send failed: ${res.status} ${res.statusText} - ${body}`);
    err.status = res.status;
    throw err;
  }

  return await res.json();
}

module.exports = { sendBrevoEmail };

