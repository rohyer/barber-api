import asyncHandler from "express-async-handler";
import UserModel from "./user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import cryptoLocal from "crypto";
import nodemailer from "nodemailer";
import { AuthenticatedRequest } from "../../shared/types/express.type.js";
import { Request as ExpressRequest, Response as ExpressResponse } from "express";
import { IUser } from "./user.type.js";

/**
 * @description Register user
 * @route       POST /api/users/register
 * @access      Public
 */
export const registerUser = asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
    const { name, email, password, password2, city, state, phone } = req.body;

    if (!name || !email || !password || !password2 || !state || !city || !phone) {
        res.status(400);
        throw new Error("Por favor, preencha todos os campos corretamente");
    }

    const userExists = await UserModel.getUser(email);

    if (userExists.length > 0) {
        res.status(500);
        throw new Error("Usuário já existente");
    }

    if (password !== password2) {
        res.status(400);
        throw new Error("Confirme sua senha digitando-as igualmente");
    }

    const salt = await bcrypt.genSalt(10);

    const passwordHashed = await bcrypt.hash(password, salt);

    const dateNow = new Date();

    const premiumExpiresAt = new Date(dateNow.getTime() + 31 * 24 * 60 * 60 * 1000);

    const userData = {
        name,
        email,
        password: passwordHashed,
        city,
        state,
        phone,
        premiumExpiresAt,
    };

    try {
        const result = await UserModel.addUser(userData);

        res.status(201);
        res.json({
            message: "Usuário criado",
            userId: result.insertId,
            token: generateToken(result.insertId),
        });
    } catch (error) {
        res.status(500);
        res.json({ message: "Erro ao criar usuário", error });
    }
});

/**
 * @description Login user
 * @route       POST /api/users/login
 * @access      Public
 */
export const loginUser = asyncHandler(async (req: ExpressRequest, res: ExpressResponse) => {
    const { email, password } = req.body;

    // Verifica os dados foram preenchidos
    if (!email || !password) {
        res.status(400);
        throw new Error("Por favor, preencha os campos.");
    }

    // Verifica se o usuário existe
    const userExists = await UserModel.getUser(email);

    if (userExists.length === 0) {
        res.status(400);
        throw new Error("Usuário não encontrado");
    }

    if (!userExists[0].password) {
        res.status(500);
        throw new Error("Senha do usuário não encontrada no banco de dados");
    }

    // Verifica se o usuário existe e se a senha é correta
    if (userExists.length > 0 && (await bcrypt.compare(password, userExists[0].password))) {
        res.json({
            data: {
                user: { ...userExists[0] },
                token: generateToken(userExists[0].id),
            },
        });
    } else {
        res.status(400);
        throw new Error("Acessos incorretos");
    }
});

/**
 * @description Update user data
 * @route       PUT /api/users/:id
 * @access      Private
 */
export const updateUserData = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) {
            res.status(401);
            throw new Error("Usuário não autenticado!");
        }

        const userExists = await UserModel.getUserById(req.user.id);

        if (userExists.length === 0) {
            res.status(400);
            throw new Error("Usuário não encontrado!");
        }

        const { name, city, state, phone } = req.body;

        if (!name || !city || !state || !phone) {
            res.status(400);
            throw new Error("Por favor, preencha os campos!");
        }

        if (Number(req.params.id) !== req.user.id) {
            res.status(400);
            throw new Error("Usuário não autorizado!");
        }

        const userData = { name, city, state, phone, id: Number(req.params.id) };

        const user = await UserModel.updateUserData(userData);

        res.status(200);
        res.json({
            user,
        });
    },
);

/**
 * @description Update user password
 * @route       PUT /api/users/password/:id
 * @access      Private
 */
export const updateUserPassword = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) {
            res.status(401);
            throw new Error("Usuário não autenticado!");
        }

        const userExists = await UserModel.getUserById(Number(req.params.id));

        if (userExists.length === 0) {
            res.status(400);
            throw new Error("Usuário não encontrado!");
        }

        if (Number(req.params.id) !== req.user.id) {
            res.status(400);
            throw new Error("Usuário não autorizado!");
        }

        const { currentPassword, newPassword } = req.body;

        if (!currentPassword || !newPassword) {
            res.status(400);
            throw new Error("Por favor, preencha os campos!");
        }

        if (!userExists[0].password) {
            res.status(500);
            throw new Error("Senha do usuário não encontrada no banco de dados");
        }

        if (
            userExists.length > 0 &&
            (await bcrypt.compare(currentPassword, userExists[0].password))
        ) {
            const salt = await bcrypt.genSalt(10);
            const passwordHashed = await bcrypt.hash(newPassword, salt);

            const updatedPassword = await UserModel.updateUserPassword(
                passwordHashed,
                Number(req.params.id),
            );

            res.status(200);
            res.json({
                message: "Senha Atualizada com sucesso!",
                ...updatedPassword,
            });
        } else {
            res.status(400);
            throw new Error("Senha atual incorreta!");
        }
    },
);

/**
 * @description Update user e-mail
 * @route       PUT /api/users/email/:id
 * @access      Private
 */
export const updateUserEmail = asyncHandler(
    async (req: AuthenticatedRequest, res: ExpressResponse) => {
        if (!req.user) {
            res.status(401);
            throw new Error("Usuário não autenticado!");
        }

        const { newEmail, password } = req.body;

        if (!newEmail || !password) {
            res.status(400);
            throw new Error("Por favor, preencha os campos!");
        }

        if (Number(req.params.id) !== req.user.id) {
            res.status(400);
            throw new Error("Usuário não autorizado!");
        }

        const userExists = await UserModel.getUserById(Number(req.params.id));

        if (userExists.length === 0) {
            res.status(400);
            throw new Error("Usuário não encontrado!");
        }

        if (!userExists[0].password) {
            res.status(500);
            throw new Error("Senha do usuário não encontrada no banco de dados");
        }

        const isMatch = await bcrypt.compare(password, userExists[0].password);

        if (!isMatch) {
            res.status(400);
            throw new Error("Senha incorreta!");
        }

        const emailExists = await UserModel.getUser(newEmail);

        if (emailExists.length > 0) {
            res.status(400);
            throw new Error("Novo e-mail já está em uso!");
        }

        // Generate token
        const emailToken = cryptoLocal.randomBytes(32).toString("hex");
        const emailTokenExpires = new Date(Date.now() + 3600 * 1000);

        const emailData = {
            newEmail,
            emailToken,
            emailTokenExpires,
            id: Number(req.params.id),
        };

        try {
            // Save request at database
            await UserModel.saveEmailChangeRequest(emailData);

            // Setup transporter
            const transporter = nodemailer.createTransport({
                service: "Gmail",
                auth: {
                    user: process.env.EMAIL_TRANSPORTER,
                    pass: process.env.EMAIL_PASSWORD,
                },
            });

            // Send e-mail
            const link = `http://localhost:5000/confirm-email-change?token=${emailToken}`;
            await transporter.sendMail({
                from: process.env.EMAIL_TRANSPORTER,
                to: newEmail,
                subject: "Confirmação de alteração de e-mail.",
                text: `Clique no link para confirmar a alteração de e-mail: ${link}`,
            });

            res.status(200);
            res.json({ message: "E-mail de confirmação enviado com sucesso!" });
        } catch (error) {
            res.status(400);
            throw new Error("Erro ao solicitar alteração de e-mail!", {
                cause: error,
            });
        }
    },
);

/**
 * @description Send e-mail to confirm user e-mail change
 * @route       GET /confirm-email-change
 * @access      Public
 */
// TODO: testar tipo do token que virá no req.query
export const confirmEmailChange = asyncHandler(async (req, res) => {
    const { token } = req.query;

    if (!token || typeof token !== "string") {
        res.status(400);
        throw new Error("Por favor, insira o token!");
    }

    const user = await UserModel.getUserByEmailToken(token);

    if (!user || !user.emailTokenExpires) {
        res.status(400);
        throw new Error("Token inválido ou expirado!");
    }

    if (user.emailTokenExpires < new Date()) {
        res.status(400);
        throw new Error("Token expirado!");
    }

    try {
        await UserModel.updateUserEmail(user.newEmail, user.id);

        res.status(200);
        res.json({ message: "E-mail atualizado com sucesso!" });
    } catch (error) {
        res.status(400);
        throw new Error("Erro ao atualizar e-mail!", { cause: error });
    }
});

const generateToken = (id: IUser["id"]) => {
    if (!process.env.JWT_SECRET) 
        throw new Error("Variável de ambiente não definida");

    return jwt.sign({ id }, process.env.JWT_SECRET);
};
