// routes/contact.route.ts

import { Router } from "express";
import isAdminLoggedIn from "../middlewares/isAdminLoggedIn.middleware";
import { asyncHandler } from "../utils/asynchandler";
import {
  createAContact,
  deleteAContact,
  editAContact,
  getAContact,
  getAllContacts,
} from "../controllers/contact.controller";

const contactRouter = Router();

contactRouter.get("/",isAdminLoggedIn,asyncHandler(getAllContacts));
contactRouter.get("/:contactId",isAdminLoggedIn,asyncHandler(getAContact));
contactRouter.post("/create",asyncHandler(createAContact));
contactRouter.put("/edit/:contactId",isAdminLoggedIn,asyncHandler(editAContact));
contactRouter.delete("/delete/:contactId",isAdminLoggedIn,asyncHandler(deleteAContact));

export default contactRouter;
