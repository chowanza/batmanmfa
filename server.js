// server.js
import express from "express";
import nodemailer from "nodemailer";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

// Middleware
app.use(cors({
  origin: "http://localhost:5173",
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(bodyParser.json());

// Almacén temporal para OTPs (en producción usar una base de datos)
const otpStorage = new Map();

// Configuración del transportador de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false, // true para puerto 465, false para otros puertos
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

// Verificar la conexión del transportador al iniciar
transporter.verify((error, success) => {
  if (error) {
    console.error('Error en la configuración del servidor de correo:', error);
  } else {
    console.log('Servidor listo para enviar correos');
  }
});

// Generar OTP de 6 dígitos
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Ruta para probar el envío de correo
app.get("/test-email", async (req, res) => {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: process.env.EMAIL_USER,
      subject: "Test Email",
      text: "Si recibes esto, el servidor de correo funciona correctamente."
    });
    res.send("Email de prueba enviado correctamente");
  } catch (error) {
    console.error('Error al enviar email de prueba:', error);
    res.status(500).json({ 
      error: "Error al enviar email de prueba",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Ruta para enviar OTP
app.post("/send-otp", async (req, res) => {
  console.log('Recibida solicitud de OTP:', req.body);
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "El correo electrónico es obligatorio." });
  }

  // Validación básica de email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Formato de correo electrónico inválido." });
  }

  try {
    const otp = generateOTP();
    
    // Guardar OTP con tiempo de expiración
    otpStorage.set(email, {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000 // 5 minutos
    });

    // Configurar el correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Tu código de verificación Batman",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #333;">Código de verificación</h1>
          <p>Tu código OTP es: <strong style="font-size: 24px; color: #007bff;">${otp}</strong></p>
          <p>Este código expirará en 5 minutos.</p>
          <hr>
          <p style="color: #666; font-size: 12px;">Este es un correo automático, por favor no responder.</p>
        </div>
      `
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    
    res.status(200).json({ 
      message: "OTP enviado correctamente",
      email: email // No enviar el OTP en la respuesta
    });

  } catch (error) {
    console.error('Error al enviar OTP:', error);
    res.status(500).json({ 
      error: "Error al enviar el OTP.",
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Ruta para verificar OTP
app.post("/verify-otp", (req, res) => {
  console.log('Recibida solicitud de verificación:', req.body);
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ error: "Email y OTP son obligatorios." });
  }

  const storedData = otpStorage.get(email);

  if (!storedData) {
    return res.status(400).json({ error: "No hay OTP pendiente para este email." });
  }

  if (Date.now() > storedData.expiresAt) {
    otpStorage.delete(email);
    return res.status(400).json({ error: "El OTP ha expirado. Por favor solicita uno nuevo." });
  }

  if (storedData.otp !== otp) {
    return res.status(400).json({ error: "OTP incorrecto." });
  }

  // OTP válido, eliminar del almacenamiento
  otpStorage.delete(email);
  
  res.status(200).json({ message: "OTP verificado correctamente." });
});

// Manejador de errores global
app.use((err, req, res, next) => {
  console.error('Error no manejado:', err);
  res.status(500).json({ 
    error: "Error interno del servidor",
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});