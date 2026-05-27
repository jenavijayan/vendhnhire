# Vendhan InfoTech - Candidate Management System

A modern, responsive, and client-side single-page application (SPA) built for managing job applicants, streamlining recruitment workflows, and acting as a central hiring command center for Vendhan InfoTech.

## 🚀 Key Features

### Applicant Portal (Job Seekers)
* **Comprehensive Application Form:** Candidates can submit their personal details, educational background, typing skills, and experience.
* **Document Attachment:** Support for uploading a Candidate Photo, Resume (PDF/DOC), and National ID proof directly within the form.
* **Responsive Layout:** Mobile-friendly, ensuring a smooth application experience across all devices.

### Admin Dashboard (HR / Administration)
* **Secure Entry:** Protected by an administrative pin/login mechanism.
* **Hiring Command Center:** A unified view of all candidate applications with live tracking of their statuses (Pending, Ongoing, Selected, Rejected, Work from Home).
* **Sorting & Filtering:** Sort candidates alphabetically or by application date, and filter them by name, email, role, or hiring status.
* **Bulk Operations:** Select multiple candidates at once to bulk-update their application statuses.
* **CSV Export:** Easily export the entire list of filtered candidates into a CSV file for external reporting.
* **Detailed Applicant Profile & Offline Processing:** Dive deep into applicant data, view attached documents securely, and print/export a PDF summary of the candidate's profile for offline review.
* **Internal Notes & Application History:** Keep an immutable timeline of status transitions and add internal review notes/feedback for every candidate.

---

## 🏗️ Architecture

The app represents a sleek, maintainable client-side architecture built with the following modern stack:

*   **Framework:** React 18+ with Vite for blazing-fast development and optimized production builds.
*   **Language:** TypeScript, providing robust type safety across interfaces like `Applicant`, `TimelineEvent`, and `ApplicationStatus`.
*   **Styling:** Tailwind CSS, utilizing utility-first modular classes to craft the 'emerald/slate' visual identity, responsive layouts, and print-specific styling (`print:` modifiers). 
*   **Icons:** Lucide React for clean, consistent, and scalable vector icons.
*   **State Management & Persistence:** Local component state managed via React Hooks (`useState`, `useEffect`) and persisted offline securely in the browser's `localStorage` (`rp_applicants`, `rp_adminAuth`).
*   **File Structure:**
    *   `/src/types.ts`: Core data structures and enums.
    *   `/src/App.tsx`: The central application orchestrator capturing routing and global state.
    *   `/src/components/`: Modular isolated UI elements (`CoverPage`, `ApplicantForm`, `AdminDashboard`, `AdminLogin`).

---

## 🛠️ How to Run Locally

### Prerequisites
* Ensure you have [Node.js](https://nodejs.org/) (v18+) and `npm` installed.

### Installation & Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```
   *The application will boot up at `http://localhost:3000` (or another port if 3000 is occupied).*

3. **Build for production:**
   ```bash
   npm run build
   ```
   *This command outputs optimized static assets to the `/dist` directory, which can be deployed to any static web host.*

### Usage Notes
* **Mock Admin Login:** If prompted for an admin pin, you can use the default mock pin: `123456` (as set in `AdminLogin.tsx`).
* **Data Storage:** Data is stored in your computer's browser cache (Local Storage). Clearing your browser data will clear out the uploaded applicants.
