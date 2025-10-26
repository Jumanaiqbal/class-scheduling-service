import csv from "csv-parser";
import stream from "stream";
import Registration from "../models/Registration.js";
import Student from "../models/Student.js";
import Instructor from "../models/Instructor.js";
import ClassType from "../models/ClassType.js";
import { validateBusinessRules } from "./validationService.js";

export const processCSVData = (fileBuffer) => {
  return new Promise((resolve, reject) => {
    const results = [];
    const bufferStream = new stream.PassThrough();
    bufferStream.end(fileBuffer);

    bufferStream
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", () => resolve(results))
      .on("error", reject);
  });
};

export const processRegistrationRow = async (row, lineNumber) => {
  try {
    const {
      "Registration ID": registrationId,
      "Student ID": studentId,
      "Instructor ID": instructorId,
      "Class ID": classId,
      "Class Start Time": classStartTime,
      Action: action,
    } = row;

    console.log(`📝 Processing line ${lineNumber}: ${action} action`);

    if (!action) {
      throw new Error("Action is required");
    }

    switch (action.toLowerCase()) {
      case "new":
        return await createNewRegistration(row, lineNumber);
      case "update":
        return await updateRegistration(row, lineNumber);
      case "delete":
        return await deleteRegistration(row, lineNumber);
      default:
        throw new Error(`Invalid action: ${action}`);
    }
  } catch (error) {
    return {
      line: lineNumber,
      success: false,
      error: error.message,
      data: row,
    };
  }
};

const createNewRegistration = async (row, lineNumber) => {
  const {
    "Student ID": studentId,
    "Instructor ID": instructorId,
    "Class ID": classId,
    "Class Start Time": classStartTime,
  } = row;

  if (!studentId || !instructorId || !classId || !classStartTime) {
    throw new Error("All fields are required for new registration");
  }

  const startTime = parseDate(classStartTime);
  if (!startTime) {
    throw new Error("Invalid date format. Use MM/DD/YYYY HH:mm");
  }

  const instructor = await Instructor.findOne({ instructorId });
  if (!instructor) {
    throw new Error(`Instructor with ID ${instructorId} not found`);
  }

  const classType = await ClassType.findOne({ classId: classId });
  if (!classType) {
    throw new Error(`Class type with ID ${classId} not found`);
  }

  let student = await Student.findOne({ studentId });
  if (!student) {
    student = await Student.create({
      studentId,
      name: `Student ${studentId}`,
      email: `student${studentId}@example.com`,
    });
  }

  const newRegistrationId = `REG${Date.now()}${Math.random()
    .toString(36)
    .substr(2, 5)}`.toUpperCase();

  // Validate business rules before creating registration
  await validateBusinessRules({
    studentId,
    instructorId,
    classType: classId,
    startTime,
    action: "new",
  });

  await Registration.create({
    registrationId: newRegistrationId,
    studentId,
    instructorId,
    classType: classId,
    startTime,
    action: "new",
    status: "scheduled",
  });

  return {
    line: lineNumber,
    success: true,
    message: "Registration created successfully",
    registrationId: newRegistrationId,
    data: row,
  };
};

const updateRegistration = async (row, lineNumber) => {
  const {
    "Registration ID": registrationId,
    "Student ID": studentId,
    "Instructor ID": instructorId,
    "Class ID": classId,
    "Class Start Time": classStartTime,
  } = row;

  if (!registrationId || registrationId === "null") {
    throw new Error("Registration ID is required for update");
  }

  const existing = await Registration.findOne({ registrationId });
  if (!existing) {
    throw new Error(`Registration with ID ${registrationId} not found`);
  }

  let startTime = existing.startTime;
  if (classStartTime && classStartTime !== "null") {
    startTime = parseDate(classStartTime);
    if (!startTime) {
      throw new Error("Invalid date format. Use MM/DD/YYYY HH:mm");
    }
  }

  await Registration.updateOne(
    { registrationId },
    {
      studentId:
        studentId && studentId !== "null" ? studentId : existing.studentId,
      instructorId:
        instructorId && instructorId !== "null"
          ? instructorId
          : existing.instructorId,
      classType: classId && classId !== "null" ? classId : existing.classType,
      startTime,
    }
  );

  return {
    line: lineNumber,
    success: true,
    message: "Registration updated successfully",
    registrationId,
    data: row,
  };
};

const deleteRegistration = async (row, lineNumber) => {
  const { "Registration ID": registrationId } = row;

  if (!registrationId || registrationId === "null") {
    throw new Error("Registration ID is required for delete");
  }

  const result = await Registration.deleteOne({ registrationId });
  if (result.deletedCount === 0) {
    throw new Error(`Registration with ID ${registrationId} not found`);
  }

  return {
    line: lineNumber,
    success: true,
    message: "Registration deleted successfully",
    registrationId,
    data: row,
  };
};

const parseDate = (dateString) => {
  if (!dateString || dateString === "null") return null;

  try {
    const [datePart, timePart] = dateString.split(" ");
    const [month, day, year] = datePart.split("/");
    const [hours, minutes] = timePart.split(":");

    return new Date(year, month - 1, day, hours, minutes);
  } catch (error) {
    return null;
  }
};
