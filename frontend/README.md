# AI-Based Video Analytics Dashboard for Training Centre Compliance Monitoring

An enterprise-grade, government-tech/SaaS web application for monitoring vocational training centre compliance. The platform performs real-time cross-verification between **Aadhaar Enabled Biometric Attendance Systems (AEBAS)** and **AI CCTV vision headcounts**, verifies sanctioned physical lab equipment, detects missing/non-functional assets, and alerts auditors to compliance discrepancies.

---

## 1. Key Features

- **Government-Tech Enterprise UI/UX**: Professional navy blue, white, and cyan color palette, emerald green compliant indicators, amber warnings, and red critical alert badges. Dark & light mode support with smooth transitions.
- **11 Dedicated Functional Routes**:
  1. **Overview Dashboard** (`/`): 8 Primary KPI cards, attendance comparison bar charts, infrastructure donut charts, trend area charts, centre leaderboard, and live AI detection events.
  2. **Training Centres** (`/centres`): Search, filter by state/district/status, sort, register new centre modal, edit centre modal, and slide-out inspection drawer.
  3. **Live CCTV Monitoring** (`/cameras`): Multi-stream CCTV grid switcher (`1x1`, `2x2`, `3x3`, `4x4`), AI bounding box overlays, stream status badges, placeholder UI for unconfigured feeds, full-screen expansion, and timestamped forensic snapshot capture.
  4. **Attendance Analytics** (`/attendance`): Detailed audit logs comparing claimed biometric punch counts with AI camera headcount, discrepancy mismatch calculations, daily/weekly/monthly trends, and forensic discrepancy modal.
  5. **Infrastructure Compliance** (`/infrastructure`): Sanctioned vs detected asset audit, missing equipment detection, non-functional UPS/fire safety flags, category filters, and high-resolution AI vision evidence proof preview.
  6. **AI Detection Events** (`/events`): Anomaly detection event stream with severity filters (Critical, Warning, Info), confidence ratings, evidence frames with bounding boxes, and interactive review status workflows (Pending, Acknowledged, Resolved, False Positive).
  7. **Evidence & Reports** (`/reports`): Official audit report generator with print/PDF layout, date filters, and CSV downloads.
  8. **Alerts & Notifications** (`/alerts`): Full notification register, unread counter, mark as read, mark all read, and instant navigation to flagged facilities.
  9. **Sanctioned Inventory** (`/inventory`): Itemized asset ledger with technical specifications, government sanction order references, serial numbers, and QR barcode tags.
  10. **User Management** (`/users`): Role-Based Access Control (RBAC) directory for National Super Admins, State Nodal Officers, Central Compliance Auditors, and Centre Administrators.
  11. **Settings & Config** (`/settings`): Live Mock Data Mode switcher, backend health probe utility (`/health`), discrepancy tolerance threshold calibration, and API contract documentation.

---

## 2. Technology Stack

- **Framework**: React 19 + Vite 8
- **Styling**: Tailwind CSS v4 with custom glassmorphism and scanline animation
- **Routing**: React Router DOM v7
- **Data Visualization**: Recharts (Donut, Grouped Bar, and Gradient Area Charts)
- **Icons**: Lucide React
- **HTTP Client**: Centralized Axios client (`src/services/api.js`)
- **Forms**: React Hook Form with field-level validation
- **Notifications**: Sonner toast system + custom in-app notification center

---

## 3. Architecture & Folder Structure

```text
src/
├── components/
│   ├── layout/            # Sidebar, TopNav, Breadcrumbs, Layout container
│   ├── dashboard/         # StatCard, charts, leaderboard, recent events
│   ├── charts/            # Chart tooltips and badges
│   ├── tables/            # Reusable tables and pagination
│   ├── modals/            # AddCentreModal, EditCentreModal, CentreDetailsDrawer,
│   │                      # DiscrepancyModal, EventDetailDrawer, EvidencePreviewModal,
│   │                      # CameraSnapshotModal, AddUserModal
│   └── ui/                # Button, Input, Select, Badge, Skeleton, EmptyState, ErrorState
├── pages/                 # 11 Dedicated application pages
├── routes/                # Route definitions & wildcard redirects
├── services/              # API and Service layer (Centralized Axios + Mock Switcher)
│   ├── api.js             # Central Axios instance with base URL and interceptors
│   ├── healthService.js   # Backend health check & probe utility
│   ├── dashboardService.js
│   ├── centreService.js
│   ├── cameraService.js
│   ├── attendanceService.js
│   ├── inventoryService.js
│   ├── eventService.js
│   ├── reportService.js
│   ├── notificationService.js
│   └── userService.js
├── hooks/                 # Custom React hooks
├── context/               # ThemeContext, AppContext, NotificationContext
├── mocks/                 # Realistic sample datasets for demonstration mode
├── utils/                 # CSV exporter, date formatters, cn class combiner
├── App.jsx                # Application root with providers
├── main.jsx               # React DOM entry point
└── index.css              # Global styles & CCTV scanline effects
```

---

## 4. Environment Variables Configuration

The frontend root contains `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=AI Compliance Monitor
VITE_USE_MOCK_DATA=true
```

To run locally:
1. Copy `.env.example` to `.env`:
   ```bash
   cp .env.example .env
   ```
2. `.env` is automatically ignored in git via `.gitignore` to prevent secret leakage.

---

## 5. How to Switch from Demo Mode to Live Backend Mode

The frontend supports **two ways** to switch from Demonstration Mode to Live Backend Mode:

### Method A: Via Environment Variables (Recommended for Deployment)
1. Open your `.env` file.
2. Set:
   ```env
   VITE_API_BASE_URL=https://your-backend-api.gov.in/api
   VITE_USE_MOCK_DATA=false
   ```
3. Restart or rebuild the application (`npm run dev` or `npm run build`).
4. All services will immediately route requests through the configured Axios client to your live REST backend.
5. If the backend is unreachable or offline, the interface displays an informative red alert banner with retry buttons and a quick fallback option.

### Method B: Runtime Toggle in the Interface (Instant Demonstration Testing)
1. In the application header or on the **Settings & Config** page (`/settings`), toggle the **Demo Mode (Mock Data)** switch.
2. This toggles local demo mode on/off instantly without needing to restart the server.
3. You can click **"Probe Live API Server"** on the Settings page to test whether your backend `/health` endpoint responds before flipping the toggle.

---

## 6. Expected Backend REST API Contract

When developing the Node.js/Express backend, implement the following REST endpoints:

### 1. Health Probe
- **`GET /health`**
  ```json
  {
    "status": "healthy",
    "version": "1.0.0",
    "uptime": 128450,
    "timestamp": "2026-10-20T10:00:00Z"
  }
  ```

### 2. Dashboard Overview
- **`GET /dashboard/summary`**
  - Returns KPI metrics, attendance comparison chart data, infrastructure compliance breakdown, and recent detection events.
- **`GET /dashboard/attendance-trends?range=daily`**
  - Returns array of `{ date, submitted, detected }`.
- **`GET /dashboard/compliance-trends`**
  - Returns donut chart segments `{ name, value, fill }`.

### 3. Training Centres
- **`GET /centres?search=&state=&status=&sortBy=&order=`**
  - Returns `{ data: [...centres], total: number, states: string[] }`.
- **`GET /centres/:id`**
  - Returns single centre object with enrolled trainees, camera count, courses, and compliance score.
- **`POST /centres`**
  - Body: `{ name, scheme, state, district, address, nodalOfficer, contactEmail, contactPhone, sanctionedCapacity, camerasTotal, courses }`.
- **`PUT /centres/:id`**
  - Updates centre metadata.
- **`DELETE /centres/:id`**
  - Removes centre from surveillance roster.

### 4. CCTV Camera Streams
- **`GET /cameras?centreId=&status=&search=`**
  - Returns array of camera objects:
    ```json
    {
      "id": "CAM-01",
      "name": "CAM-01: Main Lecture Hall",
      "centreId": "TC-RAJ-101",
      "centreName": "Apex Skill Dev Centre",
      "location": "Lecture Hall A-101",
      "status": "Online",
      "streamConfigured": true,
      "streamType": "WebRTC",
      "streamUrl": "/api/streams/cam-01/live",
      "fps": 25,
      "resolution": "1920x1080 (FHD)",
      "traineesDetected": 28,
      "biometricTraineesExpected": 28,
      "discrepancy": 0,
      "equipmentDetected": ["Smart Screen", "Projector", "Fire Extinguisher"],
      "confidenceScore": 98.4
    }
    ```
- **`POST /cameras/:id/snapshot`**
  - Returns cryptographic timestamp and frame download URL.

### 5. Attendance Verification
- **`GET /attendance/summary`**
  - Returns `{ todaySubmitted, todayDetected, todayDiscrepancy, todayMismatchRate }`.
- **`GET /attendance?centreId=&auditStatus=&search=`**
  - Returns historical batch discrepancy records.

### 6. Physical Infrastructure & Inventory
- **`GET /inventory/summary`**
  - Returns `{ sanctionedTotal, detectedFunctional, missingCount, nonFunctionalCount, overallComplianceScore }`.
- **`GET /inventory?centreId=&category=&status=&search=`**
  - Returns itemized inventory with sanction order reference, serial number, QR tag, and detection status.

### 7. AI Detection Events
- **`GET /events?severity=&type=&reviewStatus=&search=`**
  - Returns event stream with timestamps, confidence ratings, and evidence descriptions.
- **`PATCH /events/:id/status`**
  - Body: `{ reviewStatus: "Acknowledged" | "Resolved" | "False Positive", investigationNotes: string }`.

### 8. System Notifications
- **`GET /notifications`**
- **`PATCH /notifications/:id/read`**
- **`POST /notifications/mark-all-read`**

---

## 7. Development & Production Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run production build (verifies types & bundles assets)
npm run build

# Preview production build locally
npm run preview
```

---

## 8. Compliance & Security Standards

- **Zero Credential Exposure**: Private RTSP camera credentials, NVR passwords, and UIDAI cryptographic biometric certificates are never exposed in frontend bundles or Vite client variables.
- **AEBAS UIDAI Standard**: Cross-verification adheres to NCVET biometric verification protocols.
- **Fail-Safe Disconnection Handling**: When offline or disconnected, the frontend provides clear retry prompts and demo fallback rather than masking connection failure.
