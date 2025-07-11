# BEEP: Genesis — Your Cognitive Co-Processor

Welcome to **BEEP: Genesis**, not an application, but a cognitive and operational sanctuary. Its primary directive is to create "the silence of true automation," reducing cognitive load by serving as a powerful executive function partner. Every element is designed to guide focus, chunk complexity, and provide a profoundly calm and controlled interaction.

This project is an implementation of the **[Symbiotic Ward Protocol](https://firebase.google.com)**, a multi-layered defense system for your attention.

![Screenshot of BEEP: Genesis Interface](https://placehold.co/1200x600.png?text=BEEP%3A+Genesis)
*A placeholder image of the Genesis environment. The central Obelisk, the top command strip, and the Sidecar are visible.*

---

## The Symbiotic Ward Protocol

The Ward operates on three interconnected layers, moving from passive ambiance to active, commanded focus.

### Layer 1: The Ambient Ward (The Unconscious Dialogue)
This layer is always active, providing constant, non-intrusive biofeedback. It's the environment breathing in sync with you.

-   **Mood-Linked Aurora:** The iridescent background is your cognitive mirror. High focus yields a vibrant, dynamic aurora; cognitive drift softens it to a slow, gentle flow.
-   **Psyche-Fuel Gauge:** A razor-thin line in the TopBar provides a subtle, persistent signal of your mental energy reserves.
-   **Color-Shift Notifications:** Non-critical alerts manifest as a gentle, directional pulse of color within the Aurora itself. You're aware, not interrupted.

### Layer 2: The Proactive Guide (The Cognitive Co-Processor)
This is BEEP actively anticipating your needs, clearing friction from your path before you encounter it.

-   **Predictive Micro-Tasks:** BEEP learns your workflows and presents the next logical step as a subtle, one-click prompt in the **Sidecar Micro-App**.
-   **Adaptive Break Coach:** When the system detects patterns of fatigue, BEEP whispers a suggestion for a cognitive reset. No modals, no guilt.

### Layer 3: Commanded Focus (The Conscious Toolkit)
This is you, the Commander, wielding direct, powerful instruments to shape your own focus.

-   **The Focus Tunnel:** Selecting a task causes everything else to recede into a soft, beautiful blur, creating a true "tunnel vision" effect.
-   **The Obelisk as Action Hub:** The central monolith is your primary command nexus. Tapping it expands a glassmorphic overlay of your current task queue.
-   **The Undo-Bar:** A persistent, predictable safety net. A slim, glowing bar at the bottom of the screen allows for instant, one-click reversal of the last significant action.

---

## Tech Stack

-   **Framework:** [Next.js](https://nextjs.org/) (App Router)
-   **UI:** [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
-   **AI:** [Firebase Genkit](https://firebase.google.com/docs/genkit)
-   **Styling:** [Tailwind CSS](https://tailwindcss.com/)
-   **Components:** [ShadCN UI](https://ui.shadcn.com/)

---

## Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

-   Node.js (v18 or later)
-   npm

### Installation

1.  **Clone the repo:**
    ```sh
    git clone https://github.com/your-username/beep-genesis.git
    ```
2.  **Navigate to the project directory:**
    ```sh
    cd beep-genesis
    ```
3.  **Install NPM packages:**
    ```sh
    npm install
    ```
4.  **Set up environment variables:**
    Create a `.env.local` file in the root directory and add your Firebase and Google AI API keys.
    ```
    GOOGLE_API_KEY=your_google_ai_api_key
    ```
5.  **Run the development server:**
    ```sh
    npm run dev
    ```

Open [http://localhost:9002](http://localhost:9002) with your browser to see the result.
