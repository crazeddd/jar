import { Router } from "express";
var users = Router();

import {
    signup,
    login,
} from "../../controllers/userController";


users.post("/signup", signup);
users.post("/login", login);

export default users;