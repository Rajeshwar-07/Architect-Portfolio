# Architect Portfolio — Testing Guide

A step-by-step guide to run and test both the backend and frontend locally,
even on a low-spec machine.

---

## Prerequisites (install once)

| Tool       | Version  | Install                                            |
|------------|----------|----------------------------------------------------|
| Java JDK   | 8 (1.8)  | https://adoptium.net/  (pick JDK 8)               |
| Maven      | 3.6+     | https://maven.apache.org/download.cgi              |
| Node.js    | 18+      | https://nodejs.org  (LTS version)                 |
| npm        | bundled with Node.js                                |

Verify installs:
```
java -version       # should say 1.8.x
mvn -version        # should say 3.x
node -v             # should say 18.x or higher
npm -v
```

---

## 1. Start the Backend (Spring Boot)

Open Terminal 1:

```bash
cd architect-portfolio/backend

# First run: download all dependencies (takes 1-2 min)
mvn clean install -DskipTests

# Start the server
mvn spring-boot:run
```

You should see:
```
Tomcat started on port(s): 8080
Started ArchitectPortfolioApplication
```

### Verify backend is running:
Open browser → http://localhost:8080/h2-console

- JDBC URL: `jdbc:h2:mem:portfoliodb`
- Username: `sa`
- Password: (leave blank)
- Click Connect

You will see the tables: `PROJECTS`, `PROJECT_IMAGES`, `VISITOR_LOGS`

---

## 2. Start the Frontend (React + Vite)

Open Terminal 2:

```bash
cd architect-portfolio/frontend

# Install dependencies (first time only)
npm install

# Start dev server
npm run dev
```

You should see:
```
  VITE v5.x  ready
  Local:   http://localhost:5173/
```

Open browser → http://localhost:5173

---

## 3. Test Each Feature

### 3.1 — Email Capture (Visitor Gate)

1. Open http://localhost:5173 in a fresh browser (or Incognito).
2. After ~1.5 seconds a modal appears asking for your email.
3. Enter `test@example.com` → click **Submit**.
4. Check H2 console → `SELECT * FROM VISITOR_LOGS` → you should see the row.
5. Refresh the page → modal should NOT appear again (stored in localStorage).

### 3.2 — Add a Project (Admin Panel)

1. Open http://localhost:5173/admin
2. Click **Add Project** tab.
3. Fill in: Title = "Test House", Category = "Residential", Year = 2024.
4. Check **Feature on home page**.
5. Click **Choose files** → select 1–3 JPEG/PNG images from your computer.
6. Click **Add Project**.
7. Success message: "✓ Project added successfully!"
8. Click **Projects** tab — you should see the new row.

### 3.3 — View on Home Page

1. Open http://localhost:5173
2. The project should appear in "Selected Work" (if marked featured).
3. Click the card → goes to the project detail page.
4. Click any image → lightbox opens.
5. Use arrow keys or buttons to navigate images.
6. Press Escape to close.

### 3.4 — Portfolio Page with Filter

1. Open http://localhost:5173/portfolio
2. Add 2–3 projects with different categories in Admin.
3. Category filter tabs appear automatically.
4. Click a category → grid filters in place.

### 3.5 — Visitor Emails List (Admin)

1. Open http://localhost:5173/admin → click **Visitors** tab.
2. You should see the email(s) captured in step 3.1.

### 3.6 — Run Unit Tests (Backend)

```bash
cd architect-portfolio/backend
mvn test
```

Expected: Tests run in `VisitorServiceTest` — all pass.

---

## 4. Quick API Test with curl

If you have curl installed (Windows: use Git Bash or WSL):

```bash
# Track a visitor
curl -X POST http://localhost:8080/api/visitors/track \
  -H "Content-Type: application/json" \
  -d '{"email":"demo@test.com"}'

# Get all projects
curl http://localhost:8080/api/projects

# Get visitor stats
curl http://localhost:8080/api/visitors/stats
```

---

## 5. Build for Production

### Backend JAR:
```bash
cd backend
mvn clean package -DskipTests
# Creates: target/architect-portfolio-1.0.0.jar
java -jar target/architect-portfolio-1.0.0.jar
```

### Frontend build:
```bash
cd frontend
npm run build
# Creates: dist/ folder — serve with Nginx or similar
```

---

## 6. Common Issues & Fixes

| Problem                            | Fix                                                               |
|------------------------------------|-------------------------------------------------------------------|
| Port 8080 already in use           | Kill the other process or change `server.port` in application.properties |
| Port 5173 in use                   | Vite auto-picks next port (5174). Update vite.config.js proxy if needed. |
| H2 console shows no data           | Make sure `spring.jpa.hibernate.ddl-auto=update` in properties.  |
| Images not loading on frontend     | Check backend is running on 8080. Vite proxy handles /uploads/. |
| CORS error in browser console      | Verify `app.cors.allowed-origins` includes `http://localhost:5173`.|
| `mvn: command not found`           | Add Maven `bin/` folder to your system PATH.                      |
| `node: command not found`          | Restart terminal after installing Node.js.                        |

---

## 7. Low-Spec Machine Tips

- H2 in-memory DB needs no extra installation — ideal for low-spec testing.
- Keep Terminal 1 (backend) and Terminal 2 (frontend) running simultaneously.
- If machine is slow to start, wait 30–60 seconds for `Tomcat started` message.
- Use `mvn spring-boot:run -q` for quieter (less CPU-heavy) logging.
- Close other heavy applications while running both servers.

---

## Project Structure at a Glance

```
architect-portfolio/
├── backend/
│   ├── pom.xml                          Maven build config (Java 8, Spring Boot 2.7)
│   └── src/main/java/com/portfolio/architect/
│       ├── ArchitectPortfolioApplication.java   Entry point
│       ├── config/    CorsConfig.java           CORS + static file serving
│       ├── entity/    Project.java              JPA entity
│       │              ProjectImage.java         Image per project
│       │              VisitorLog.java           Visitor email record
│       ├── repository/ (Spring Data JPA repos)
│       ├── dto/        ApiResponse, ProjectDTO, VisitorRequest
│       ├── service/    ProjectService, VisitorService, FileStorageService
│       └── controller/ ProjectController, VisitorController, GlobalExceptionHandler
│
└── frontend/
    ├── package.json
    ├── vite.config.js                   Dev proxy → backend
    └── src/
        ├── main.jsx                     React entry point
        ├── App.jsx                      Router + layout
        ├── styles/global.css            Design tokens + reset
        ├── services/api.js              Axios API calls
        ├── components/
        │   ├── Navbar.jsx / .module.css
        │   ├── Footer.jsx / .module.css
        │   ├── ProjectCard.jsx          Grid card
        │   └── EmailGate.jsx            Visitor email capture modal
        └── pages/
            ├── Home.jsx                 Hero + featured grid
            ├── Portfolio.jsx            Full grid + category filter
            ├── ProjectDetail.jsx        Detail + image gallery + lightbox
            ├── About.jsx                Bio page
            ├── Contact.jsx              Contact form
            └── Admin.jsx                Owner panel (add/delete/view visitors)
```
