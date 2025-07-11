# BEEP: Genesis — Your Cognitive Co-Processor

**This is not another productivity app. This is a cognitive and operational sanctuary.**

Genesis is an interface engineered to create "the silence of true automation"—a focused environment designed as an intuitive extension of the human mind, particularly for those who are neurodivergent. Its primary directive is to serve as a powerful executive function partner, guiding your focus, chunking complexity, and forging a profoundly calm, controlled, and symbiotic relationship between you and your work.

This project is the first implementation of the **Symbiotic Ward Protocol**, a multi-layered defense system for your most valuable asset: your attention.

![Screenshot of BEEP: Genesis Interface](https://placehold.co/1200x600.png?text=BEEP%3A+Genesis)
*The Genesis environment. The central Obelisk, the top command strip, and the Sidecar are visible.*

---

## The Symbiotic Ward Protocol: An Attack on Distraction

The Ward operates on three interconnected layers, moving from passive ambiance to active, commanded focus. It doesn't just organize your work; it actively defends your ability to do it.

### Layer 1: The Ambient Ward (The Unconscious Dialogue)
*This layer is always active, providing constant, non-intrusive biofeedback. It's the environment breathing in sync with you.*

- **Mood-Linked Aurora:** The iridescent background is your cognitive mirror. High focus yields a vibrant, dynamic aurora; cognitive drift softens it to a slow, gentle flow.
- **Psyche-Fuel Gauge:** A razor-thin line in the TopBar provides a subtle, persistent signal of your mental energy reserves.
- **Color-Shift Notifications:** Non-critical alerts manifest as a gentle, directional pulse of color within the Aurora itself. You're aware, not interrupted.

### Layer 2: The Proactive Guide (The Cognitive Co-Processor)
*This is BEEP actively anticipating your needs, clearing friction from your path before you encounter it.*

- **Predictive Micro-Tasks:** BEEP learns your workflows and presents the next logical step as a subtle, one-click prompt in the **Sidecar Micro-App**. It eradicates the "what's next?" moment.
- **Adaptive Break Coach:** When the system detects patterns of fatigue, BEEP whispers a suggestion for a cognitive reset. No modals, no guilt.

### Layer 3: Commanded Focus (The Conscious Toolkit)
*This is you, the Commander, wielding direct, powerful instruments to shape your own focus.*

- **The Focus Tunnel:** Selecting a task causes everything else to recede into a soft, beautiful blur, creating a true "tunnel vision" effect.
- **The Obelisk as Action Hub:** The central monolith is your primary command nexus. Tapping it expands a glassmorphic overlay of your current task queue.
- **The Undo-Bar:** A persistent, predictable safety net. A slim, glowing bar at the bottom of the screen allows for instant, one-click reversal of the last significant action.

---

## Tech Stack

- **Framework:** [Next.js](https://nextjs.org/) (App Router)
- **UI:** [React](https://reactjs.org/) & [TypeScript](https://www.typescriptlang.org/)
- **AI:** [Firebase Genkit](https://firebase.google.com/docs/genkit)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/)
- **Components:** [ShadCN UI](https://ui.shadcn.com/)

---

## Join the Mission

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18 or later)
- npm

### Installation

1. **Clone the revolution:**
   ```sh
   git clone https://github.com/your-username/beep-genesis.git
   ```
2. **Enter the sanctuary:**
   ```sh
   cd beep-genesis
   ```
3. **Install dependencies:**
   ```sh
   npm install
   ```
4. **Set up your keys:**
   Create a `.env.local` file in the root directory and add your Firebase and Google AI API keys.
   ```
   GOOGLE_API_KEY=your_google_ai_api_key
   ```
5. **Ignite Genesis:**
   ```sh
   npm run dev
   ```

Open [http://localhost:9002](http://localhost:9002) with your browser and experience the future of focus.
