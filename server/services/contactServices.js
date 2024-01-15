import db from "../db.js";

const getContacts = async () => {
  const [rows, fields] = await db.execute(
    "SELECT * FROM contacts WHERE active = 1"
  );
  return rows;
};

const getContactById = async (id) => {
  const [rows, fields] = await db.execute(
    "SELECT * FROM contacts WHERE contactid = ?",
    [id]
  );
  return rows;
};

const addContact = async (student) => {
  const fields = ["idno", "name", "dob", "nationality", "hpnumber", "address1"];
  const values = fields.map((field) => student[field]);
  const placeholders = fields.map(() => "?").join(", ");
  const sql = `INSERT INTO contacts (${fields.join(
    ", "
  )}) VALUES (${placeholders})`;
  const [result] = await db.query(sql, values);
  if (result) {
    const [rows] = await db.query(
      "SELECT * FROM contacts WHERE contactid = ?",
      [result.insertId]
    );
    return {
      message: "Student added successfully!",
      contactid: result.insertId,
      data: rows[0], // The newly inserted data
    };
  } else {
    throw new Error("Failed to add student!");
  }
};

const addStudent = async (student) => {
  const fields = [
    "name",
    "sex",
    "idno",
    "dob",
    "race",
    "placeofbirth",
    "nationality",
    "identificationtype",
    "address1",
    "address2",
    "address3",
    "addresspostalcode",
    "addresscountry",
    "phonenumber",
    "hpnumber",
    "emailaddress",
    "enteredby",
    "entereddate",
    "active",
  ];
  const values = fields.map((field) => student[field]);
  const placeholders = fields.map(() => "?").join(", ");
  const sql = `INSERT INTO contacts (${fields.join(
    ", "
  )}) VALUES (${placeholders})`;
  const [result] = await db.query(sql, values);
  if (result) {
    const [rows] = await db.query(
      "SELECT * FROM contacts WHERE contactid = ?",
      [result.insertId]
    );
    return {
      message: "Student added successfully!",
      contactid: result.insertId,
      data: rows[0], // The newly inserted data
    };
  } else {
    throw new Error("Failed to add student!");
  }
};

const updateStudent = async (student) => {
  const fields = [
    "name",
    "sex",
    "idno",
    "dob",
    "race",
    "placeofbirth",
    "nationality",
    "identificationtype",
    "address1",
    "address2",
    "address3",
    "addresspostalcode",
    "addresscountry",
    "phonenumber",
    "hpnumber",
    "emailaddress",
    "enteredby",
    "entereddate",
  ];
  const values = fields.map((field) => student[field]);
  const sql =
    "UPDATE contacts SET name = ?, sex = ?, idno = ?, dob = ?, race = ?, placeofbirth = ?, nationality = ?, identificationtype = ?, address1 = ?, address2 = ?, address3 = ?, addresspostalcode = ?, addresscountry = ?, phonenumber = ?, hpnumber = ?, emailaddress = ?, enteredby = ?, entereddate = ? WHERE contactid = ?";
  const [result] = await db.query(sql, [...values, student.contactid]);
  if (result) {
    const [rows] = await db.query(
      "SELECT * FROM contacts WHERE contactid = ?",
      [student.contactid]
    );
    return {
      message: "Student updated successfully!",
      data: rows[0], // The updated data
    };
  } else {
    throw new Error("Failed to update student!");
  }
};

const addGuardian = async (guardian) => {
  const fields = [
    "name",
    "sex",
    "idno",
    "dob",
    "race",
    "placeofbirth",
    "nationality",
    "identificationtype",
    "address1",
    "address2",
    "address3",
    "addresspostalcode",
    "addresscountry",
    "phonenumber",
    "hpnumber",
    "emailaddress",
    "enteredby",
    "entereddate",
    "active",
    "highestqual",
    "maritialstatus",
    "householdincome",
    "residencetype",
    "emergencycontact",
  ];
  const values = fields.map((field) => guardian[field]);
  const placeholders = fields.map(() => "?").join(", ");
  const sql = `INSERT INTO contacts (${fields.join(
    ", "
  )}) VALUES (${placeholders})`;
  const [result] = await db.query(sql, values);
  if (result) {
    return {
      message: "Guardian added successfully!",
      contactid: result.insertId,
    };
  } else {
    throw new Error("Failed to add guardian!");
  }
};

const addRelationship = async (relationship) => {
  const fields = ["contactid", "relatedtoid", "realatedtypeid"];
  const values = fields.map((field) => relationship[field]);
  const placeholders = fields.map(() => "?").join(", ");
  const sql = `INSERT INTO contactrelate (${fields.join(
    ", "
  )}) VALUES (${placeholders})`;
  const [result] = await db.query(sql, values);
  if (result) {
    return {
      message: "Relationship added successfully!",
      contactrelateid: result.insertId,
    };
  } else {
    throw new Error("Failed to add relationship!");
  }
};

const getContactRelate = async (id) => {
  const sql = "SELECT * FROM contactrelate WHERE contactid = ?";
  const [rows, fields] = await db.execute(sql, [id]);
  return rows;
};

const updateOtherInfo = async (id, other) => {
  const fields = [
    "langusedathome",
    "nameofschattended",
    "dateofschattended",
    "illness",
    "docobservation",
    "applotherinst",
    "emergencycontacname",
    "emergencycontactoffice",
    "emergencycontacthp",
    "emergencycontacthome",
    "emergencyrelation",
    "notes",
  ];
  const values = fields.map((field) => other[field]);
  const placeholders = fields.map(() => "?").join(", ");
  const sql = `UPDATE contacts SET ${fields.join(
    " = ?, "
  )} = ? WHERE contactid = ?`;
  const [result] = await db.query(sql, [...values, id]);
  if (result) {
    return {
      message: "Other Information updated successfully!",
      contactid: id,
    };
  } else {
    throw new Error("Failed to update Other Information!");
  }
};

const checkRegistration = async (idToCheck) => {
  const query = `SELECT COUNT(*) AS count FROM contacts WHERE idno = ?`;
  const [results] = await db.query(query, [idToCheck]);
  const count = results[0].count;
  return count > 0;
};

const getContactStatus = async (id) => {
  const [rows] = await db.execute(
    "SELECT * FROM contactrelate WHERE contactid = ? OR relatedtoid = ?",
    [id, id]
  );

  const contact = rows[0];
  let role = "";
  let relatedContacts = [];

  // Check if the contact has any other relations where they are the relatedtoid
  const [relatedRows] = await db.execute(
    "SELECT * FROM contactrelate WHERE relatedtoid = ?",
    [id]
  );

  if (relatedRows.length > 0) {
    // The contact is a parent
    role = "parent";
    for (let i = 0; i < relatedRows.length; i++) {
      const [studentRows] = await db.execute(
        "SELECT * FROM contacts WHERE contactid = ?",
        [relatedRows[i].contactid]
      );
      relatedContacts.push(studentRows[0]);
    }
  } else {
    // The contact is a student
    role = "student";
    for (let i = 0; i < rows.length; i++) {
      const [parentRows] = await db.execute(
        "SELECT * FROM contacts WHERE contactid = ?",
        [rows[i].relatedtoid]
      );
      relatedContacts.push(parentRows[0]);
    }
  }

  return { role, contact, relatedContacts };
};

const softDeleteContact = async (id) => {
  await db.execute(
    "UPDATE contacts SET active = 0 WHERE contactid = ? AND active = 1",
    [id]
  );
};

export {
  getContacts,
  getContactById,
  addContact,
  addStudent,
  updateStudent,
  addGuardian,
  addRelationship,
  getContactRelate,
  updateOtherInfo,
  checkRegistration,
  getContactStatus,
  softDeleteContact,
};
