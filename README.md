# VS Code Terminal Portfolio

An interactive, command-driven developer portfolio with a VS Code-themed interface. Built with Next.js 14, TypeScript, and Framer Motion.

![Portfolio Preview](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8?style=for-the-badge&logo=tailwind-css)

## 🎯 Overview

A unique portfolio website that mimics the VS Code interface, featuring an interactive terminal where visitors can explore your professional profile through commands. Perfect for developers who want to showcase their skills in a creative, tech-savvy way.

## ✨ Features

### 🖥️ VS Code Interface
- **Authentic VS Code Theme** - Dark/Light theme support with VS Code color schemes
- **Taskbar with Window Controls** - Mac-style window controls (close, minimize, fullscreen)
- **Sidebar Navigation** - File explorer-style navigation between sections
- **Terminal Integration** - Interactive terminal with command execution

### 💻 Interactive Terminal
- **Command-Driven Navigation** - Navigate through portfolio sections using terminal commands
- **Command History** - Arrow keys to navigate through previous commands
- **Auto-completion** - Tab completion for commands
- **Custom Commands** - Extensive command library including:
  - `help` - Display all available commands
  - `about` - Show information about you
  - `skills` - List your technical skills
  - `experience` - Display work experience
  - `projects` - Show your projects
  - `contact` - Display contact information
  - `goto <section>` - Navigate to specific sections
  - `theme <dark|light>` - Switch themes
  - `clear` - Clear terminal output
  - And many more...

### 🎨 Modern UI/UX
- **Smooth Animations** - Powered by Framer Motion
- **Responsive Design** - Works seamlessly on desktop, tablet, and mobile
- **Interactive Onboarding** - Guided tour for first-time visitors using react-joyride
- **Keyboard Shortcuts** - Backtick (`) to toggle terminal, F1 for guide
- **Accessibility** - ARIA labels and keyboard navigation support

### 🎓 Onboarding Tour
- **Step-by-step Guide** - Interactive walkthrough for new visitors
- **Spotlight Effects** - Highlights important UI elements
- **Pulsing Animations** - Draws attention to focused elements
- **Skip/Navigate** - Full control over the tour experience

## 🚀 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **UI Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Tour Guide**: [react-joyride](https://react-joyride.com/)
- **Font**: [JetBrains Mono](https://www.jetbrains.com/lp/mono/)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/PratikKamble99/vscode-portfolio.git
   cd vscode-portfolio
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.local.example .env.local
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🛠️ Configuration

### Update Portfolio Data

Edit `src/data/portfolio.ts` to customize your portfolio content:

```typescript
export const portfolioData: PortfolioData = {
  about: {
    name: "Your Name",
    title: "Your Title",
    summary: ["Your bio..."]
  },
  skills: [
    {
      category: "Frontend",
      items: ["React", "Next.js", "TypeScript"]
    }
  ],
  // ... more sections
};
```

### Customize Theme Colors

Modify CSS variables in `src/app/globals.css`:

```css
:root {
  --color-bg: #1e1e1e;
  --color-accent: #007acc;
  /* ... more colors */
}
```

### Add Custom Commands

Create new commands in `src/commands/`:

```typescript
export const myCommand: Command = {
  name: 'mycommand',
  description: 'Description of my command',
  execute: async (args, context) => {
    return {
      success: true,
      output: 'Command output'
    };
  }
};
```

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── (sections)/        # Section routes (about, skills, etc.)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── commands/              # Terminal command implementations
│   ├── core-commands.ts   # Core commands (help, clear, etc.)
│   ├── info-commands.ts   # Info commands (about, skills, etc.)
│   └── action-commands.ts # Action commands (goto, theme, etc.)
├── components/            # React components
│   ├── layout/           # Layout components (Sidebar, Taskbar)
│   ├── sections/         # Section components
│   ├── terminal/         # Terminal components
│   ├── ui/               # UI components
│   └── providers/        # Context providers
├── contexts/             # React contexts
├── hooks/                # Custom React hooks
├── services/             # Business logic services
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
└── data/                 # Portfolio data
```

## 🎮 Usage

### Terminal Commands

| Command | Description |
|---------|-------------|
| `help` | Display all available commands |
| `about` | Show information about you |
| `skills` | List your technical skills |
| `experience` | Display work experience |
| `projects` | Show your projects |
| `contact` | Display contact information |
| `goto <section>` | Navigate to a specific section |
| `theme <dark\|light>` | Switch between themes |
| `clear` | Clear terminal output |
| `history` | Show command history |
| `guide` | Show the onboarding tour |

### Keyboard Shortcuts

- **`** (Backtick) - Toggle terminal
- **F1** - Show onboarding guide
- **↑/↓** - Navigate command history
- **Tab** - Auto-complete commands
- **Ctrl+L** - Clear terminal
- **Esc** - Close terminal/guide

## 🎨 Customization

### Adding New Sections

1. Create a new section component in `src/components/sections/`
2. Add the section data to `src/data/portfolio.ts`
3. Create a route in `src/app/(sections)/[section-name]/page.tsx`
4. Add navigation item to `src/components/layout/Sidebar.tsx`

### Styling

The project uses Tailwind CSS with custom CSS variables for theming. All colors are defined in `globals.css` and can be easily customized.

## 🚢 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Deploy with one click

### Other Platforms

Build the project:
```bash
npm run build
```

The output will be in the `.next` folder. Deploy this to any static hosting service.

## 📝 License

This project is open source and available under the [MIT License](LICENSE).

## 👤 Author

**Pratik Kamble**
- GitHub: [@PratikKamble99](https://github.com/PratikKamble99)
- LinkedIn: [Pratik Kamble](https://www.linkedin.com/in/pratikpkamble/)

## 🙏 Acknowledgments

- Inspired by VS Code's interface design
- Built with modern web technologies
- Special thanks to the open-source community

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the [issues page](https://github.com/PratikKamble99/vscode-portfolio/issues).

## ⭐ Show Your Support

Give a ⭐️ if you like this project!

---

Made with ❤️ by Pratik Kamble
