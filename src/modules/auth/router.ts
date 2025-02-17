import { Router } from 'express'

import { loginController } from './controller'

const router = Router()

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Login pengguna
 *     description: Endpoint untuk melakukan login pengguna dengan username, email, atau nomor telepon.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 description: Nama pengguna (opsional).
 *                 example: johndoe
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Alamat email pengguna (opsional).
 *                 example: johndoe@example.com
 *               phone:
 *                 type: string
 *                 description: "Nomor telepon pengguna (opsional, format: 08xxx atau 628xxx)."
 *                 example: "6281234567890"
 *               password:
 *                 type: string
 *                 description: Kata sandi pengguna.
 *                 example: password123
 *             required:
 *               - password
 *     responses:
 *       200:
 *         description: Login berhasil.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   description: Token JWT untuk autentikasi.
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
router.post('/login', loginController)

export default router
