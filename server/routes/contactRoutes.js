import { Router } from "express";
import {
  getContacts,
  addStudent,
  updateStudent,
  addGuardian,
  addRelationship,
  updateOtherInfo,
  getContactRelate,
  getContactById,
  checkRegistration,
  getContactStatus,
  addContact,
  softDeleteContact,
} from "../services/contactServices.js";

const contactRoutes = Router(); // Instantiate Router

// READ
contactRoutes.get("/contact", async (req, res) => {
  const data = await getContacts();
  res.json(data);
});

// CREATE CONTACT
contactRoutes.post("/contact", async (req, res) => {
  const data = await addContact(req.body);
  res.json(data);
});

// READ ONE
contactRoutes.get("/contact/:id", async (req, res) => {
  const data = await getContactById(req.params.id);
  res.json(data);
});

// CREATE STUDENT
contactRoutes.post("/student", async (req, res) => {
  const data = await addStudent(req.body);
  res.json(data);
});

// UPDATE STUDENT
contactRoutes.put("/student", async (req, res) => {
  const data = await updateStudent(req.body);
  res.json(data);
});

// CREATE GUARDIAN
contactRoutes.post("/guardian", async (req, res) => {
  const data = await addGuardian(req.body);
  res.json(data);
});

// CREATE RELATIONSHIP
contactRoutes.post("/add-relationship", async (req, res) => {
  const data = await addRelationship(req.body);
  res.json(data);
});

// CONTACT RELATIONSHIP
contactRoutes.get("/contactrelate/:id", async (req, res) => {
  const data = await getContactRelate(req.params.id);
  res.json(data);
});

// UPDATE OR CREATE OTHER INFORMATION TO A CONTACT
contactRoutes.put("/other-info/:id", async (req, res) => {
  const data = await updateOtherInfo(req.params.id, req.body);
  res.json(data);
});

contactRoutes.post("/checkRegistration", async (req, res) => {
  const { idToCheck } = req.body;

  try {
    const isRegistered = await checkRegistration(idToCheck);
    res.json({ isRegistered });
  } catch (err) {
    console.error("Error checking registration:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

contactRoutes.get("/api/contact/:id", async (req, res) => {
  try {
    const result = await getContactStatus(req.params.id);
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// SOFT DELETE
contactRoutes.delete("/contact/:id", async (req, res) => {
  await softDeleteContact(req.params.id);
  res.json({ message: "Contact has been soft deleted." });
});

export default contactRoutes; // Export the router
