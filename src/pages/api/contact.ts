import type { APIRoute } from 'astro';
import { Resend } from 'resend';

// Inicializa Resend con tu API key
const resend = new Resend(import.meta.env.RESEND_API_KEY);

// URL para validar Turnstile
const TURNSTILE_VERIFY_URL = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  try {
    // Obtener datos del formulario
    const formData = await request.formData();
    const firstName = formData.get('first-name') as string;
    const lastName = formData.get('last-name') as string;
    const phone = formData.get('phone') as string;
    const message = formData.get('message') as string;
    const turnstileToken = formData.get('cf-turnstile-response') as string;

    // Validar que todos los campos estén presentes
    if (!firstName || !lastName || !phone || !message) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'All fields are required' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Validar Turnstile
    if (!turnstileToken) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Please complete the security verification' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Verificar el token de Turnstile con Cloudflare
    const turnstileResponse = await fetch(TURNSTILE_VERIFY_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: import.meta.env.TURNSTILE_SECRET_KEY,
        response: turnstileToken,
      }),
    });

    const turnstileData = await turnstileResponse.json();

    if (!turnstileData.success) {
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Security verification failed. Please try again.' 
      }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Enviar email con Resend
    const { data, error } = await resend.emails.send({
      from: 'Egmechanic Contact <contact@egmechanic.com>',
      to: 'victor@egmechanic.com',
      subject: `New Contact from ${firstName} ${lastName}`,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${firstName} ${lastName}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return new Response(JSON.stringify({ 
        success: false, 
        message: 'Failed to send email. Please try again.' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Respuesta exitosa
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Message sent successfully! We will contact you soon.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error:', error);
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'An unexpected error occurred. Please try again.' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};