# 🎓 MistakeFixer

An AI-powered educational tool that helps students learn from their math mistakes without giving away the answer. Upload a photo of your handwritten math problem, and MistakeFixer will identify errors, explain concepts, and provide helpful hints to guide you toward the correct solution.

## ✨ Features

- 📸 **Image Upload**: Snap a photo of handwritten math problems
- 🔍 **Mistake Detection**: AI-powered analysis identifies where you went wrong
- 📊 **Visual Learning**: Interactive charts and visualizations to understand concepts
- 💡 **Smart Hints**: Guided learning without revealing the answer
- 🎨 **Modern UI**: Clean, responsive interface built with React and Tailwind-inspired design
- ⚡ **Real-time Analysis**: Fast processing powered by Google Gemini AI

## 🚀 Tech Stack

- **Frontend**: React 19, TypeScript
- **Build Tool**: Vite
- **AI**: Google Gemini API
- **Charts**: Recharts
- **Icons**: Lucide React
- **Styling**: Custom CSS with modern design patterns

## 📋 Prerequisites

- Node.js (v16 or higher)
- A Google Gemini API key ([Get one here](https://ai.google.dev/))

## 🛠️ Installation & Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/chandril-mallick/mathmistake-visualizer.git
   cd mathmistake-visualizer
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure API Key**
   
   Create a `.env.local` file in the root directory and add your Gemini API key:
   ```env
   VITE_GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open in browser**
   
   Navigate to `http://localhost:3000`

## 📦 Build for Production

```bash
npm run build
```

The optimized production build will be in the `dist` folder.

## 🎯 How It Works

1. **Upload**: Take a photo of your handwritten math problem
2. **Analyze**: AI processes the image and identifies mistakes
3. **Learn**: Review the mistake explanation, visual aids, and hints
4. **Improve**: Apply the concepts to solve the problem correctly

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

## 👨‍💻 Author

**Chandril Mallick**
- GitHub: [@chandril-mallick](https://github.com/chandril-mallick)

## 🙏 Acknowledgments

- Powered by [Google Gemini AI](https://ai.google.dev/)
- Built with [Vite](https://vitejs.dev/) and [React](https://react.dev/)

---

**Made with ❤️ for better learning**
