import nodemailer from "nodemailer";

export async function POST(req: Request) {
  try {
    const { email, subject, message } = await req.json();

    console.log(process.env.SMTP_HOST)

    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST as string,
      port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT) : 465,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER as string,
        pass: process.env.SMTP_PASS as string,
      },
    });

    await transporter.sendMail({
      from: process.env.SMTP_USER as string,
      to: process.env.MY_EMAIL as string,
      subject: `Nuevo mensaje: ${subject}`,
      text: `Has recibido un nuevo mensaje desde el formulario de contacto:

          De: ${email}
          Asunto: ${subject}

          Mensaje:
          ${message}`,
        replyTo: email, // Así, al responder, se enviará al correo del usuario
      });

      // Enviar correo de confirmación al usuario
      await transporter.sendMail({
        from: process.env.SMTP_USER as string,
        to: email,
        subject: "Confirmación: He recibido tu mensaje",
        text: `
        Hola,

        He recibido tu mensaje correctamente y me pondre en contacto contigo a la brevedad.

        ¡Gracias por comunicarte conmigo!

        Saludos,
        Luis Araya`,
        });
      return new Response(
        JSON.stringify({ message: "Email enviado correctamente" }),
        { status: 200 }
      );
    } catch (error) {
      console.error("Error al enviar email 1", error);
      return new Response(
        JSON.stringify({ message: "Error al enviar email 2" }),
        { status: 500 }
      );
    }
  }