here this Is First ever srilankan Patient History Management, sliit project itpm

for the backend Use nodejs if need check type in your powershell node --version if show version node successfully installed your machine.
and install using npm i 

firstly clone this in your machine. 
then  go to each directory and install dependencies using npm i.
change directory "cd backend npm i" command
and samae as the frontend "cd frontend npm i"

and now run your backend using npm run dev and see db connected successfully message
then do same thing into your frontend and see success message.

and for now i already created login and regiatration forms and it works. i used simple ui for this. and you will able to implement your parts now. 

and also backend is created for all the parts. and if u want you can change as you want. 

check api s in your postman  
http://localhost:3000/api

Register User
Method: POST
URL: http://localhost:3000/api/auth/register
Body:{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "Password123",
  "role": "patient",
  "IdNumber": "991234567V",
  "contactNumber": "0771234567"
}

Login User
Method: POST
URL: http://localhost:3000/api/auth/login
Body:{
  "email": "john@example.com",
  "password": "Password123"
}

Get Current User
Method: GET
URL: http://localhost:3000/api/auth/me

Patient Endpoints
Get Patient Profile
Method: GET
URL: http://localhost:3000/api/patients/profile

Update Patient Profile
Method: PUT
URL: http://localhost:3000/api/patients/profile
Headers: Authorization: Bearer YOUR_TOKEN
Body:{
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "bloodType": "O+",
  "allergies": ["Peanuts", "Penicillin"],
  "emergencyContact": {
    "name": "Jane Doe",
    "relationship": "Spouse",
    "phone": "0772345678"
  }
}

Get Patient Medical History
Method: GET
URL: http://localhost:3000/api/patients/medical-records

Doctor Endpoints
Get Doctor Profile
Method: GET
URL: http://localhost:3000/api/doctors/profile

Update Doctor Profile
Method: PUT
URL: http://localhost:3000/api/doctors/profile
Body:{
  "specialization": "Cardiology",
  "licenseNumber": "SLMC12345",
  "hospitalAffiliations": ["Central Hospital", "St. Mary's Clinic"],
  "experience": 10,
  "qualifications": ["MBBS", "MD"]
}

Get Doctor's Patients
Method: GET
URL: http://localhost:3000/api/doctors/patients

Create Diagnosis
Method: POST
URL: http://localhost:3000/api/doctors/diagnoses
Body:{
  "patientId": "patient_id_here",
  "symptoms": ["Fever", "Cough", "Fatigue"],
  "diagnosis": "Common cold",
  "notes": "Rest and plenty of fluids recommended",
  "date": "2023-03-18T00:00:00.000Z"
}


Create Prescription
Method: POST
URL: http://localhost:3000/api/doctors/prescriptions
Body:{
  "patientId": "patient_id_here",
  "medications": [
    {
      "name": "Paracetamol",
      "dosage": "500mg",
      "frequency": "Every 6 hours",
      "duration": "5 days"
    },
    {
      "name": "Vitamin C",
      "dosage": "1000mg",
      "frequency": "Once daily",
      "duration": "10 days"
    }
  ],
  "instructions": "Take medication after meals"
}

Pharmacy Endpoints
Get Pharmacy Profile
Method: GET
URL: http://localhost:3000/api/pharmacies/profile
Headers: Authorization: Bearer YOUR_TOKEN
Update Pharmacy Profile
Method: PUT
URL: http://localhost:3000/api/pharmacies/profile
Headers: Authorization: Bearer YOUR_TOKEN
Body:{
  "name": "City Pharmacy",
  "address": "123 Main Street, Colombo",
  "licenseNumber": "PHA12345",
  "operatingHours": "9AM-9PM"
}


Data Entry API Endpoints - Patient History Management System

Base URL: `http://localhost:3000/api/dataentry`

> All protected routes require a Bearer token unless otherwise noted.

---

Create Data Entry Profile
POST `/create-profile`

_Public — No token required_
Request Body
```json
{
  "userId": "USER_ID_HERE",
  "workShift": "Morning",
  "supervisor": "SUPERVISOR_ID_HERE",
  "department": "General"
}
```

---

Get Data Entry Profile
GET `/profile`

_Requires token_

---

 Get Assigned Tasks
GET `/tasks`

_Requires token_

---

Get All Patients
GET `/patients`

_Requires token_

---

Diagnosis Endpoints

Create Diagnosis
POST `/diagnoses`

Request Body
```json
{
  "patientId": "PATIENT_ID_HERE",
  "doctorId": "DOCTOR_ID_HERE",
  "hospitalId": "HOSPITAL_ID_HERE",
  "condition": "Condition Name",
  "diagnosisDetails": "Details here",
  "symptoms": "Fever, Cough",
  "notes": "Optional notes",
  "followUpDate": "2025-05-10"
}
```

---

Get All Diagnoses
GET `/diagnoses`

---

Get Diagnosis by ID
GET `/diagnoses/:id`

---

Update Diagnosis
PUT `/diagnoses/:id`

---

Delete Diagnosis
DELETE `/diagnoses/:id`

---

Prescription Endpoints

Create Prescription
POST `/prescriptions`

Request Body
```json
{
  "patientId": "PATIENT_ID_HERE",
  "medications": [
    {
      "name": "Amoxicillin",
      "dosage": "500mg",
      "frequency": "3 times a day",
      "duration": "7 days"
    }
  ],
  "instructions": "Take after meals"
}
```

---

Get All Prescriptions
GET `/prescriptions`

---

## 🔍 Get Prescription by ID
**GET** `/prescriptions/:id`

---

Update Prescription
PUT `/prescriptions/:id`

---

Delete Prescription
DELETE `/prescriptions/:id`

---

For testing, use Postman or similar tools with proper Bearer token in headers for protected routes.



for the frontend u need to install using npm i react axios,react router dom, tailwind css, if want to code use https://tailwindcss.com/docs/installation/using-vite



