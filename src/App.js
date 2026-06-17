import React, { useState } from "react";
import "./App.css";

const initialAppointments = [
  {
    id: 1,
    name: "Nikshith Dara",
    age: 22,
    phone: "+91 8008159818",
    drName: "Dr. Ananth",
    gender: "Male",
    visitDate: "2021-02-02",
    visitTime: "06:00 PM",
    visitType: "Consult",
  },
  {
    id: 2,
    name: "Hemanth",
    age: 24,
    phone: "+91 9876543215",
    drName: "Dr. Ananth",
    gender: "Male",
    visitDate: "2021-02-02",
    visitTime: "07:00 PM",
    visitType: "Revisit",
  },
];

export default function App() {
  const [appointments, setAppointments] = useState(initialAppointments);
  const [form, setForm] = useState({
    name: "",
    age: "",
    phone: "",
    drName: "",
    gender: "",
    visitDate: "",
    visitTime: "",
    visitType: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [toast, setToast] = useState({ message: "", type: "" });

  const showToast = (message, type = "toast-success") => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: "", type: "" }), 3000);
  };

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm((prev) => ({
      ...prev,
      [id === "dr-name"
        ? "drName"
        : id === "phone-number"
        ? "phone"
        : id === "visit-date"
        ? "visitDate"
        : id === "visit-time"
        ? "visitTime"
        : id === "visit-type"
        ? "visitType"
        : id]: value,
    }));
  };

  const validate = () => {
    const { name, age, phone, drName, gender, visitDate, visitTime, visitType } = form;
    if (!name || !age || !phone || !drName || !gender || !visitDate || !visitTime || !visitType) {
      showToast("All fields are required.", "toast-error");
      return false;
    }
    const phoneRegex = /^\+?\d{1,4}[\s-]?\d{5,12}$/;
    if (!phoneRegex.test(phone.trim())) {
      showToast("Invalid phone number", "toast-error");
      return false;
    }
    const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
    if (!timeRegex.test(visitTime)) {
      showToast("Invalid time format (HH:MM AM/PM)", "toast-error");
      return false;
    }
    return true;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    if (editingId) {
      setAppointments((prev) =>
        prev.map((a) => (a.id === editingId ? { ...a, ...form } : a))
      );
      setEditingId(null);
      showToast("Appointment updated successfully!");
    } else {
      const newAppointment = { id: Date.now(), ...form };
      setAppointments((prev) => [...prev, newAppointment]);
      showToast("Appointment booked successfully!");
    }
    setForm({
      name: "",
      age: "",
      phone: "",
      drName: "",
      gender: "",
      visitDate: "",
      visitTime: "",
      visitType: "",
    });
  };

  const handleEdit = (id) => {
    const appointment = appointments.find((a) => a.id === id);
    setForm(appointment);
    setEditingId(id);
  };

  const handleDelete = (id) => {
    setAppointments((prev) => prev.filter((a) => a.id !== id));
    showToast("Appointment deleted successfully!");
  };

  return (
    <div>
      <div className="header">Welcome to Gradious Doctor Appointment Booking</div>

      {toast.message && (
        <div className={`toast-message ${toast.type}`}>{toast.message}</div>
      )}

      <form className="form-container" onSubmit={handleSubmit}>
        <input id="name" placeholder="Patient Name *" value={form.name} onChange={handleChange} />
        <input id="phone-number" placeholder="Phone Number *" value={form.phone} onChange={handleChange} />
        <input id="dr-name" placeholder="Doctor Name *" value={form.drName} onChange={handleChange} />
        <select id="gender" value={form.gender} onChange={handleChange}>
          <option value="">Gender</option>
          <option>Male</option>
          <option>Female</option>
        </select>
        <input id="age" placeholder="Age *" value={form.age} onChange={handleChange} />
        <input id="visit-date" type="date" value={form.visitDate} onChange={handleChange} />
        <select id="visit-type" value={form.visitType} onChange={handleChange}>
          <option value="">Visit Type</option>
          <option>Consult</option>
          <option>Revisit</option>
        </select>
        <input id="visit-time" placeholder="Time*" value={form.visitTime} onChange={handleChange} />
        <button id="book-btn" type="submit">
          {editingId ? "Update Appointment" : "Book Appointment"}
        </button>
      </form>

      <table className="table">
        <thead>
          <tr>
            <th>Patient</th>
            <th>Status</th>
            <th>Appointment</th>
            <th>Phone</th>
            <th>Doctor</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {appointments.map((a) => (
            <tr key={a.id}>
     
              <td className="patient-cell">
              
                <div>
                  <div className="patient-name">{a.name}</div>
                  <div className="patient-details">{a.age} yrs, {a.gender}</div>
                </div>
              </td>
              <td><span className={`status ${a.visitType}`}>{a.visitType}</span></td>
              <td>{a.visitTime}<br />{new Date(a.visitDate).toDateString()}</td>
              <td>
                {a.phone}<br />
                <a href={`tel:${a.phone}`} className="contact-link">Contact</a>
              </td>
              <td>{a.drName}</td>
              <td>
                <button id="edit-btn" onClick={() => handleEdit(a.id)}>Edit</button>
                <button id="delete-btn" onClick={() => handleDelete(a.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
