---

# 🚀 Homelab Command Dashboard 🚀

A sleek, customizable, and feature-rich dashboard for managing your entire homelab. Inspired by high-tech intelligence agency UIs, this dashboard isn't just for looking at—it's for *doing*.

 
*(You should replace this with a screenshot of your own finished dashboard!)*

---

## ✨ Features

This isn't your average dashboard. It's a command center packed with interactive widgets.

*   **🧩 Customizable Grid Layout:** Drag, drop, and resize widgets to create the perfect layout for your needs. Your layout is automatically saved!
*   **🖥️ Embedded Web Terminal:** A fully functional, real-time terminal connected directly to the backend server. Run commands, check logs, and manage services without ever leaving your browser.
*   **🔗 Interactive Link Management:**
    *   **Link Launchers:** Create beautiful, responsive cards for your most-used services (Plex, Home Assistant, etc.).
    *   **Live Status:** Each launcher has a live status indicator (🟢 Online / 🔴 Offline) so you know what's running at a glance.
    *   **Link Holders:** Group your launchers into stylish, themed containers inspired by the "Active Threats" panel from our mockup.
*   **✅ Service Health Pinger:** A dedicated widget to monitor the status of multiple services by pinging their URLs.
*   **📊 System Info Monitor:** Keep an eye on the CPU and RAM usage of your host machine.
*   **⏰ Themed Clock:** A stylish, configurable clock that can display local time or a specific IANA timezone (e.g., `America/New_York`).
*   **🚀 SSH Launcher:** A simple but powerful widget to instantly trigger SSH commands in the web terminal.
*   **🐳 Fully Dockerized:** The entire application (frontend, backend, database) is containerized with Docker and orchestrated with a single `docker-compose.yml` file for dead-simple deployment.

---

## 🛠️ Tech Stack

This project is built with a modern, reliable, and powerful stack.

*   **Backend:** Node.js, Express, Mongoose, WebSockets, `node-pty`
*   **Frontend:** React, Vite, Tailwind CSS
*   **Database:** MongoDB
*   **Grid System:** GridStack.js
*   **Deployment:** Docker & Docker Compose

---

## 🏁 Getting Started: Installation & Launch

Ready to take control of your homelab? Getting started is incredibly easy thanks to Docker.

### Prerequisites

Make sure you have the following installed on your machine:
*   [Git](https://git-scm.com/downloads)
*   [Docker](https://docs.docker.com/get-docker/)
*   [Docker Compose](https://docs.docker.com/compose/install/)

### Installation Steps

1.  **Clone the Repository**
    Open your terminal and clone this project to your machine.
    ```bash
    git clone https://github.com/shizuo-x/homelab-dashboard.git
    ```

2.  **Navigate to the Project Directory**
    ```bash
    cd homelab-dashboard
    ```

3.  **Launch the Application! 🚀**
    This one command builds the frontend, backend, and database images, connects them, and starts the entire application.
    ```bash
    docker-compose up --build
    ```
    The first time you run this, it will take a few minutes to download and build everything. Subsequent launches will be much faster!

4.  **Open Your Dashboard**
    Once the build is complete and the logs are running, open your favorite web browser and navigate to:
    👉 **http://localhost:5173**

---

## 🎮 How to Use Your New Dashboard

Your command center is online! Here's how to use it.

### Edit Mode vs. View Mode

*   **View Mode (Default):** In this mode, the dashboard is locked. You can click on and interact with your widgets (e.g., launch links, use the terminal), but you can't move them.
*   **Edit Mode:** Click the **`EDIT`** button in the header to enter Edit Mode. The widgets will now have a blue outline, and you can:
    *   **Drag & Drop:** Move widgets around the grid.
    *   **Resize:** Drag the corner of any widget to resize it.
    *   **Configure:** Click the **`⚙️` (Cog)** icon to open the configuration modal for that widget.
    *   **Delete:** Click the **`🗑️` (Trash)** icon to permanently delete a widget.
*   Click **`DONE`** in the header to save your changes and return to View Mode.

### Adding New Widgets

1.  Click the **`ADD WIDGET`** button in the header.
2.  A modal will appear with a list of all available widgets.
3.  Click on the widget you want to add, and it will automatically appear in the first available spot on your dashboard.

### Configuring the Link System

This is one of the most powerful features!

1.  First, add one or more **Link Holder** widgets. Configure them to give them a unique name (e.g., "MEDIA SERVERS") and a title color.
2.  Next, add a **Link Launcher** widget.
3.  Enter **Edit Mode** and click the `⚙️` icon on the new Link Launcher.
4.  Fill out its details: Name, URL, Icon, Color, and—most importantly—use the **"Assign to Holder"** dropdown to select the holder you created in step 1.
5.  Click **Save**. The Link Launcher will disappear from the main grid and magically appear inside your chosen Link Holder! ✨

---

## 🧑‍💻 For Developers

Want to contribute or build your own widgets? Awesome!

### Running in Development Mode

For the best development experience with hot-reloading, you'll want to run the frontend and backend services separately.

1.  **Start the Backend & Database:**
    In the project's root directory, run:
    ```bash
    docker-compose up -d database backend
    ```
    This starts the database and backend API in the background.

2.  **Start the Frontend Dev Server:**
    Navigate to the `frontend` directory and start the Vite dev server.
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    This will start the frontend on `http://localhost:5173` with full hot-reloading for React and Tailwind CSS.

### Project Structure

*   `/backend`: The Node.js/Express server.
    *   `/models`: Mongoose schemas for the database.
    *   `/routes`: API endpoint definitions.
    *   `server.js`: The main entry point.
*   `/frontend`: The React single-page application.
    *   `/src/components`: Reusable React components.
    *   `/src/components/widgets`: All the individual widget components live here. This is where you'll want to create new ones!

---

## 🗺️ Roadmap & Future Ideas

This project has a ton of potential! Here are some ideas for the future, inspired by our target mockup:

*   [ ] **Quick Actions Widget:** Create custom buttons to trigger shell commands (e.g., "Restart Plex Docker").
*   [ ] **Threat Level Widget:** A visually dynamic widget to represent system status.
*   [ ] **User Profile Widget:** A static card for a bit of extra flair.
*   [ ] **Multi-Node System Info:** Enhance the System Info widget to monitor other machines on the network.
*   [ ] **More Themes & Colors!**

---

## 📜 License

This project is licensed under the MIT License - see the `LICENSE` file for details.