import { Router } from "express";
import userModel from "../dao/mongo/models/user.js";
import passport from "passport";
const router = Router();

const getCurrentUser = (req,res)=>{
    if (req.session.user) {
      // Si hay un usuario en la sesión, lo devolvemos como respuesta
      res.json({ status: 'success', user: req.session.user });
    } else {
      // Si no hay un usuario en la sesión, significa que no está autenticado
      res.status(401).json({ status: 'error', message: 'Not authenticated' });
    }
  }

const registerUser =(req, res, next) => {
    passport.authenticate("register", (err, user, info) => {
      if (err) {
        return res.status(500).json({ status: "error", error: err });
      }
      if (!user) {
        return res.status(400).json({ status: "error", error: info.message });
      }
      res.json({ status: "success", payload: user });
    })(req, res, next);
  }

const loginUser = (req, res, next)=>{
    passport.authenticate("login", (err, user, info) => {
      if (err) {
        return res.status(500).json({ status: "error", error: err });
      }
      if (!user) {
        return res.status(400).json({ status: "error", error: info.message });
      }
      // Si la autenticación es exitosa, crea la sesión
      req.session.user = {
        name: `${user.first_name} ${user.last_name}`,
        email: user.email,
        age:user.age,
        rol: user.email === "adminCoder@coder.com" ? "admin" : "user",
      };
      res.json({ status: "success" });
    })(req, res, next);
  }

const logoutUser =(req, res) => {
    req.session.destroy((error) => {
      if (error) {
        console.error('Error during logout:', error);
        return res.status(500).json({ status: "Error", error });
      }
      res.json({ status: "Success", message: "Logout successful" });
    });
  }
  
export {
    getCurrentUser,
    registerUser,
    loginUser,
    logoutUser
}