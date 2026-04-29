# MERN Auth Project - Bug Report

This document details all the bugs identified and resolved across the `mern-auth` project, covering both the frontend React application and the backend Express server.

## 1. Verify Email Silent Failure

### The Issues
* **Backend (`server/controllers/authController.js`)**: The `verifyEmail` controller expected `userId` from the request body (`req.body`), but the frontend only sends the OTP. The `userId` was actually being attached to the request object by the `userAuth` middleware (`req.userId`). Because `userId` wasn't found in the body, the backend returned `{ success: false, message: "missing details" }`.
* **Frontend (`client/src/pages/EmailVerify.jsx`)**: When the frontend received the `success: false` response, the `else` block executed `toast.error(error.response?.data?.message || error.message);`. However, the variable `error` was out of scope (it is only defined in the `catch` block), which threw a `ReferenceError` exception. This resulted in a silent failure where the UI did nothing instead of showing the error message.

### Resolution
* **Backend**: Extracted `userId` from `req.userId` instead of `req.body`.
* **Frontend**: Updated the error handling to use `toast.error(data.message)` when the API call succeeds but returns `success: false`.

## 2. Password Reset Component Bugs (`client/src/pages/ResetPassword.jsx`)

### The Issues
* **Missing Imports**: `useContext` and `AppContent` were used but never imported, which would cause an immediate crash when trying to access `backendUrl`.
* **Hook Syntax Error**: `const navigate = useNavigate;` lacked parentheses, so it didn't initialize the routing hook properly.
* **Incorrect State Mutation**: The OTP submission logic called the boolean state variable itself like a function `isOtpSubmitted(true)` instead of using the setter function `setIsOtpSumbitted(true)`. This throws a "not a function" error.
* **Unhandled API Response**: The result of the `/api/auth/verify-reset-otp` call was completely ignored and no feedback was shown to the user.
* **Typo in HTML attribute**: The `required` attribute on the input elements was misspelled as `requireed`.

### Resolution
* Added the missing imports `import React, { useState, useContext } from "react";` and `import { AppContent } from "../context/AppContext";`.
* Fixed the hook initialization: `const navigate = useNavigate();`.
* Corrected the state setter invocation.
* Added logic to display a success or error toast based on the API response.
* Fixed the typo `requireed` -> `required`.

## 3. Backend Logic & Typo Bugs (`server/controllers/authController.js`)

### The Issues
* **Model Property Mismatch**: The code referenced `user.reserOtpExpireAt`, but the database schema (`userModel.js`) defined the field as `resetOtpExpireAt`. This would prevent the OTP expiration validation from working correctly.
* **Undefined Variables in Error Handling**: The `catch` block in `resetPassword` referenced `message.error` instead of `error.message`, which would throw another exception.
* **Response Typos**: Multiple instances of `res.josn()` instead of `res.json()`, and `messasge` instead of `message` in the API response objects.

### Resolution
* Replaced all instances of `reserOtpExpireAt` with `resetOtpExpireAt`.
* Fixed error handling to correctly use `error.message`.
* Corrected spelling typos `josn` -> `json` and `messasge` -> `message`.
