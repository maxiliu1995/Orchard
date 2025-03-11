# WorkPod Project Instructions

## Project Overview
WorkPod is a booking application designed to provide users with access to ergonomic, internet-equipped pods. Features include real-time reservations, add-ons management, smart lock integration, and secure payment options such as Apple Pay and PayPal.

---

# Instructions for Building the UI

This document outlines the guidelines and expectations for designing and implementing the UI for the WorkPod app. The goal is to align the UI with the existing styles of the register and login forms while allowing creative freedom to ensure the app adheres to modern UI design standards and best practices.

---

## **1. Design Goals**
- Ensure a cohesive and consistent visual identity across the app by using the same style as the existing register and login forms.
- Allow the designer/developer to use their expertise and creativity to craft pages that follow modern UI guidelines.
- Prioritize a clean, intuitive, and user-friendly design that is responsive on all devices.

---

## **2. Existing Style Guidelines**
### **Reference Register and Login Forms**
- Use the register and login form styles as the foundation for the app's visual identity.
- Key design elements to replicate:
  - Typography (fonts, sizes, weights).
  - Color palette (primary, secondary, and accent colors).
  - Button styles (e.g., rounded corners, hover states).
  - Input field design (e.g., borders, padding, error states).
  - Spacing and layout principles.

### **UI Components to Keep Consistent**
- Buttons: Style should match the register/login forms.
- Forms: Inputs, labels, and validation messages should follow the same style.
- Modal dialogs: Match the register/login modal style if applicable.

---

## **3. Developer/Designer Creative Freedom**
- You have the flexibility to design the remaining pages and components in a way that feels modern and professional, while maintaining consistency with the register/login forms.
- Feel free to introduce:
  - Advanced layouts (e.g., cards, grids, and sidebars).
  - Animations or transitions for smoother interactions.
  - Light and dark themes if it fits the design.

---

## **4. Pages to Build**
### **1. Home/Map View**
- Display WorkPod locations on a map.
- Include:
  - Floating card for selected WorkPod details.
  - Actions: "Reserve", "Join Waitlist" (if unavailable).
- **Creative Input:**
  - Decide how the map and floating card integrate visually.
  - Suggest how users switch between WorkPods (e.g., swipeable cards, clickable map pins).

### **2. Reservation and Session Management**
- **Reservation Screen:**
  - Show WorkPod details and a countdown timer (10 minutes).
  - Actions: "Cancel", "Start Rent".
- **In-Session Screen:**
  - Display session details, timer, and add-ons.
  - Actions: "Pause", "End".
- **Creative Input:**
  - Propose how to visually display session data and controls.
  - Suggest how to make add-ons intuitive (e.g., toggle switches, cards).

### **3. Feedback and Checkout**
- Feedback form for user reviews.
- Prompts for returning add-ons (e.g., monitor, headphones).
- **Creative Input:**
  - Design a visually engaging feedback system.
  - Make confirmation screens for returned add-ons clear and user-friendly.

### **4. Profile and Settings**
- Editable profile with fields like name, email, and payment methods.
- Include settings for:
  - Rental history.
  - Invite friends (promo codes).
  - Language selection.
- **Creative Input:**
  - Suggest how to organize profile and settings (e.g., tabs, sections).

---

## **5. Technical Implementation**
### **Frameworks and Tools**
- Use Tailwind CSS to ensure consistency and flexibility.
- Responsive design is a must. Ensure it looks great on:
  - Mobile
  - Tablet
  - Desktop

### **UI Development Workflow**
1. Build reusable components (e.g., buttons, modals, input fields).
2. Style components to match the existing register/login forms.
3. Use placeholder data or mock APIs to simulate dynamic behavior.

### **Folder Structure**
Organize the project like this:
src/ components/ ui/ Button.tsx InputField.tsx layouts/ MainLayout.tsx MapLayout.tsx pages/ Home.tsx Reservation.tsx Session.tsx Feedback.tsx Profile.tsx

---

## **6. Guidelines for Creative Freedom**
- Follow modern UI/UX best practices:
  - Use minimalistic and clean layouts.
  - Ensure sufficient spacing and alignment.
  - Use contrast effectively for readability.
  - Apply animations or transitions sparingly for a polished feel.
- Reference design systems for inspiration (e.g., Material Design, Fluent UI).
- Provide design decisions for:
  - Navigation: Decide between a top bar, side drawer, or bottom tab.
  - Page layouts: Offer suggestions for arranging elements visually.
  - State handling: Show how to communicate loading, errors, and success states.

---

## **7. Deliverables**
### **What to Deliver**
- Fully styled UI for all pages listed above.
- Components designed for reuse across the app.
- Screens connected with dummy data for presentation purposes.

### **Timeline**
- Provide an initial draft or wireframe for review within the first week.
- Iterate based on feedback to finalize the UI.

---

## **8. Next Steps After UI**
- Review and polish the UI based on feedback.
- Begin backend integration (e.g., payments, map data).
- Test the UI for responsiveness and usability.

---

By following these guidelines, you can ensure the UI is consistent with the existing forms while giving the designer/developer room to apply their expertise and creativity. Let me know if you need additional clarifications!

## Key Features

### 1. **User Authentication**
- Login, signup, and logout functionality.
- JWT-based authentication with token storage in HTTP-only cookies for security.
- Optional support for OAuth in future iterations.

### 2. **Pod Reservation**
- Display WorkPods on a map with real-time availability.
- Allow users to reserve a pod for 10 minutes. Unused reservations auto-cancel after the window expires.
- Reservation states: "Available", "Reserved", "Occupied", and "Under Maintenance".

### 3. **Payment System**
- Support for Apple Pay (via Stripe) and PayPal.
- Payments are pre-authorized at the start of a session and finalized at checkout.

### 4. **Add-Ons Management**
- Users can select extras like monitors and headphones.
- Add-ons are released via RFID/NFC confirmation and logged in the final bill.

### 5. **Smart Lock Integration**
- TTLock API for unlocking/locking pods in sync with the reservation system.
- Real-time updates for pod lock status.

### 6. **Feedback and Overview**
- After checkout, users can provide feedback on their session.
- Display session summary, including duration, cost, and add-ons used.

---

## Feature-Specific Details

### **User Authentication**
- **Endpoints:**
  - `POST /api/users/signup`: Create a new user account.
  - `POST /api/users/login`: Authenticate users and issue JWT tokens.
  - `GET /api/users/profile`: Retrieve authenticated user details.
  - `PUT /api/users/profile`: Update user details (e.g., phone number, avatar).
- **Validation Rules:**
  - Email: Must be a valid email format.
  - Password: Minimum 8 characters, with at least one uppercase letter, number, and special character.

### **Pod Reservation**
- **Endpoints:**
  - `GET /api/pods`: Fetch all available WorkPods with real-time availability.
  - `POST /api/reservations`: Create a new reservation.
  - `DELETE /api/reservations/:id`: Cancel an existing reservation.
- **Edge Cases:**
  - Auto-cancel reservations if the user doesn’t check in within 10 minutes.
  - Prevent overlapping reservations for the same pod.

### **Payment System**
- **Endpoints:**
  - `POST /api/payments/authorize`: Pre-authorize payment at session start.
  - `POST /api/payments/charge`: Finalize payment at checkout.
- **Error Handling:**
  - Retry failed payment authorizations up to 3 times.
  - Provide clear error messages for declined payments.

### **Add-Ons Management**
- **Workflow:**
  - Users toggle add-ons during the session.
  - Add-ons are released via RFID/NFC confirmation.
  - Add-ons are added to the final bill only after confirmation.

### **Smart Lock Integration**
- **Workflow:**
  - When a session starts, the TTLock API unlocks the pod.
  - At session end, users must lock the pod to complete checkout.

---

## Data Models

### **User**
- `id` (string): Unique identifier.
- `email` (string): User's email.
- `password` (string): Hashed password.
- `firstName` (string, optional): User's first name.
- `lastName` (string, optional): User's last name.
- `phoneNumber` (string, optional): Contact number.
- `avatar` (string, optional): Profile picture URL.
- `preferences` (object): Notification and newsletter preferences.
- `createdAt` (datetime): Account creation timestamp.

### **Reservation**
- `id` (string): Unique reservation ID.
- `userId` (string): ID of the reserving user.
- `podId` (string): ID of the reserved pod.
- `startTime` (datetime): Start time of the reservation.
- `status` (string): "Reserved", "Active", "Completed", "Cancelled".

### **Add-Ons**
- `id` (string): Unique ID for the add-on.
- `name` (string): Add-on name (e.g., "Monitor").
- `price` (number): Price of the add-on.
- `status` (string): "Available", "In Use", "Returned".

---

## Dependencies

### **Frontend**
- React (Next.js) for user interface.
- TailwindCSS for styling.
- Stripe SDK for Apple Pay.
- PayPal JavaScript SDK for payment processing.

### **Backend**
- Node.js with Express for APIs.
- PostgreSQL for relational data.
- TTLock API for smart lock integration.
- Socket.io for real-time updates.

---

## Testing Requirements
1. Write unit tests for all key features:
   - Authentication, Reservations, Payments, Add-ons, Smart Locks.
2. Use Jest for backend testing and React Testing Library for frontend components.
3. Mock external APIs (Stripe, PayPal, TTLock) for reliability.

---

## Edge Cases and Assumptions

### **Pod Reservation:**
- If a pod is locked manually without completing checkout, prompt the user to finalize the session.
- Auto-cancel reservations after 10 minutes if no check-in occurs.

### **Payments:**
- If both Apple Pay and PayPal fail, notify the user to retry with another method.

### **Add-Ons:**
- Prevent users from ending a session unless all add-ons are returned and confirmed.

---

## Next Steps
1. Use this document to structure the development process.
2. Provide feedback or ask questions if clarification is needed.
3. Update this document as new features are added or specifications change.
