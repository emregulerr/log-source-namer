# Log Source Namer

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![version](https://img.shields.io/badge/version-1.0.0-green.svg)](https://github.com/emregulerr/log-source-namer)
[![GitHub Pages](https://img.shields.io/badge/demo-online-brightgreen.svg)](https://emregulerr.github.io/log-source-namer/)

*A flexible, client-side tool to generate standardized names based on highly configurable rules and processors.*

**✨ Live Demo ✨** [**https://emregulerr.github.io/log-source-namer/**](https://emregulerr.github.io/log-source-namer/)

---

## The Story: Order from Chaos

This tool was born from a real-world necessity. As a Cyber Security Engineer managing SIEM systems with hundreds, or even thousands, of log sources, I frequently faced a persistent problem: **inconsistent, chaotic, and meaningless log source names.**

When a new naming standard was established within the organization, manually renaming hundreds of sources was a slow, tedious, and extremely error-prone process. Names like `ACME_FW_LOGS`, `acme-firewall`, or `FirewallACME` not only slowed down analysis but also made automation nearly impossible.

**Log Source Namer** was designed to bring an end to this chaos. Its purpose is to automate complex, rule-based naming standards to generate consistent, meaningful, and error-free names in seconds. This small tool started with the idea of turning a task that could take hours into an enjoyable one.

## What Can It Do? ✅

This is not just a simple text joiner; it's an advanced naming engine:

- **Dynamic Fields:** Define as many input fields as you need, such as `Hostname`, `Customer`, or `IPAddress`.
- **Smart Template Builder:** Freely construct your template using static text (like `FW-` or `_LOGS`) and your dynamic fields.
- **Atomic Processors:** Apply transformation rules to each field independently:
  - **Cleanup:** Automatically trim leading and trailing whitespace.
  - **Casing:** Choose from a variety of casing options, including `UPPERCASE`, `lowercase`, `Title Case`, and true `Sentence case.`
  - **Word Joining:** Keep spaces between words or join them using `snake_case`, `kebab-case`, `dot.case`, or `camelCase`.
- **Client-Side Storage:** Your entire complex configuration is securely saved in your browser's local storage. Your settings are preserved even when you refresh or close the page.
- **Clean Interface:** The usage and settings views are separate, eliminating clutter from your daily workflow.

## How to Use 🚀

1.  Click the gear icon **`⚙️`** on the main screen to open the **Settings** panel.
2.  In the **Fields & Processors** section, create the fields you need and define rules like `Casing` and `Word Joining` for each.
3.  In the **Smart Template Builder** section, construct your final name template using clickable field pills and static text.
4.  Click **"Save & Close"** to save your configuration.
5.  You can now instantly generate and copy standard-compliant names using the form on the main screen!

## Contributing ❤️

If you found this tool useful, first please give a star to the repository! ⭐

This project can grow even more as a community project. Your contributions, bug reports, and feature suggestions are highly valued.

If you'd like to contribute, please follow these steps:

1.  **Fork** the Project.
2.  Create your Feature **Branch** (`git checkout -b feature/AmazingFeature`).
3.  Make your changes.
4.  **Commit** your Changes (`git commit -m 'Add some AmazingFeature'`).
5.  **Push** to the Branch (`git push origin feature/AmazingFeature`).
6.  Open a **Pull Request**.

To report a bug or suggest a new idea, please use the [Issues](https://github.com/emregulerr/log-source-namer/issues) section.

## License

Distributed under the MIT License. See `LICENSE` for more information.