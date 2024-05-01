import { Request, Response } from "express";
import { FindOperator, Like } from "typeorm";

import { User } from "../database/models/User";


//for admin:
export const getUsers = async (req: Request, res: Response) => {
    try {
        interface queryFilters {
            email?: FindOperator<string>,
            username?: FindOperator<string>
        }
        const queryFilters: queryFilters = {}

        // it searches dinamically (i.e. "email contains XXX")
        if (req.query.email) {
            queryFilters.email = Like("%" + req.query.email.toString().trim() + "%");
        }
        if (req.query.username) {
            queryFilters.username = Like("%" + req.query.username.toString().trim() + "%");
        }


        const users = await User.find({
            where: queryFilters,
            select: {
                id: true,
                username: true,
                email: true,
                createdAt: true,
                updatedAt: true
            },
            relations: {
                role: true
            }
        });

        res.status(200).json({
            success: true,
            message: "User(s) retrieved successfuly",
            data: users
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "User(s) cannot be retrieved",
            error: error
        })
    }

}

