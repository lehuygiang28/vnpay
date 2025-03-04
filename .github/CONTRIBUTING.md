# Contributing to VNPay

First off, thank you for considering contributing to the VNPay library! 🎉 Every contribution helps make this project better for everyone.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
  - [Project Structure](#project-structure)
  - [Setting Up Your Development Environment](#setting-up-your-development-environment)
  - [Running the Documentation Site Locally](#running-the-documentation-site-locally)
- [Contributing Workflow](#contributing-workflow)
  - [Finding Issues to Work On](#finding-issues-to-work-on)
  - [Making Changes](#making-changes)
  - [Commit Messages](#commit-messages)
  - [Pull Requests](#pull-requests)
- [Documentation Guidelines](#documentation-guidelines)
  - [Bilingual Documentation](#bilingual-documentation)
  - [Documentation Structure](#documentation-structure)
- [Testing](#testing)
  - [Running Tests](#running-tests)
  - [Writing Tests](#writing-tests)
- [Review Process](#review-process)
- [Style Guides](#style-guides)
- [Release Process](#release-process)
- [Additional Notes](#additional-notes)

## Code of Conduct

This project adheres to the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you are expected to uphold this code. Please report unacceptable behavior to [lehuygiang28@gmail.com](mailto:lehuygiang28@gmail.com).

## Getting Started

### Project Structure

The repository is organized as follows:

```
vnpay/
├── src/           # Source code for the VNPay library
│   ├── configs/   # Configuration interfaces and defaults
│   ├── constants/ # Constants and enumerations
│   ├── types/     # TypeScript type definitions
│   └── utils/     # Utility functions
├── docs/          # Documentation (Docusaurus)
│   ├── docs/      # Vietnamese documentation
│   └── i18n/en/   # English documentation
├── test/          # Tests
└── examples/      # Example implementations
```

### Setting Up Your Development Environment

1. **Fork the repository**:
   - Click the "Fork" button at the top right of the [repository page](https://github.com/lehuygiang28/vnpay)
   
2. **Clone your fork**:
   ```bash
   git clone https://github.com/YOUR_USERNAME/vnpay.git
   cd vnpay
   ```

3. **Install dependencies**:
   ```bash
   npm install
   ```

4. **Set up remote**:
   ```bash
   git remote add upstream https://github.com/lehuygiang28/vnpay.git
   ```

5. **Start coding!** 🎉

6. **Commit your changes**:
   - Commit message must follow the [commit message convention](#commit-messages)
   ```bash
   git add .
   git commit -m "feat: ✨ Add new feature"
   ```

### Running the Documentation Site Locally

The documentation is built with [Docusaurus](https://docusaurus.io/). To run it locally:

1. Navigate to the docs directory:
   ```bash
   cd docs
   ```

2. Install dependencies (if you haven't already):
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

4. Open your browser and visit [http://localhost:3000](http://localhost:3000)

5. For switching between languages, use the language dropdown in the top navigation bar

## Contributing Workflow

### Finding Issues to Work On

- Check the [Issues](https://github.com/lehuygiang28/vnpay/issues) page for open issues
- Look for issues labeled `good first issue` if you're new to the project
- Comment on an issue to express your interest before starting work
- If you want to work on something that doesn't have an issue yet, create one first to discuss

### Making Changes

1. **Create a branch**:
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/your-bug-fix
   ```

2. **Make your changes**:
   - Write clean, maintainable, and tested code
   - Follow the [style guide](#style-guides)
   - Add or update tests as necessary
   - Update documentation if needed (both English and Vietnamese)

3. **Keep your branch updated**:
   ```bash
   git fetch upstream
   git rebase upstream/main
   ```

### Commit Messages

We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

**Types include:**
- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (formatting, etc.)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `perf`: A code change that improves performance
- `test`: Adding missing tests or correcting existing tests
- `chore`: Changes to the build process or auxiliary tools

**Examples:**
```
feat: ✨ Add support for QR code payments
fix: 🐛 Fix amount calculation in refund process
docs: 📝 Update installation instructions
```

### Pull Requests

1. **Push your changes**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a pull request**:
   - Go to the [repository page](https://github.com/lehuygiang28/vnpay)
   - Click "Pull requests" > "New pull request"
   - Select "compare across forks"
   - Select your fork and branch
   - Click "Create pull request"

3. **Fill in the PR template**:
   - Provide a clear description of the changes
   - Include screenshots or examples if applicable
   - Reference any related issues
   - Make sure all tests pass
   - Ensure documentation is updated if necessary

## Documentation Guidelines

When updating documentation:

- Keep language simple and clear
- Use examples where possible
- Update both English and Vietnamese versions of the documentation
- Follow Markdown best practices
- Preview your changes locally before submitting

### Bilingual Documentation

This project maintains documentation in both Vietnamese and English:

- Vietnamese documentation is in `docs/docs/`
- English documentation is in `docs/i18n/en/docusaurus-plugin-content-docs/current/`

When making documentation changes, please update both language versions to keep them in sync.

### Documentation Structure

- Each feature should have its own documentation file
- Follow the existing numbering/naming convention in the docs directory
- Include code examples for all features
- Document any limitations or caveats
- Include links to related sections or external resources where appropriate

## Testing

### Running Tests

- Run existing tests before making changes:
  ```bash
  npm test
  ```

- Run specific tests:
  ```bash
  npm test -- -t "specific test name"
  ```

- Run tests with coverage report:
  ```bash
  npm run test:coverage
  ```

### Writing Tests

- Write tests for all new features and bug fixes
- Mock external APIs and dependencies when testing
- Test both success and error scenarios
- Aim for high test coverage, especially for critical functions
- Structure tests clearly with descriptive names

## Review Process

After submitting a PR:

1. Automatic checks will run (linting, tests, etc.)
2. Maintainers will review your code
3. They may request changes or ask questions
4. Address any feedback promptly
5. Once approved, a maintainer will merge your PR

The review will focus on:
- Code correctness and quality
- Test coverage
- Documentation completeness
- Adherence to style guides
- Potential edge cases

Please be patient during the review process. Maintainers are volunteers and may take some time to respond.

## Style Guides

### TypeScript Style Guide

All TypeScript code must adhere to the [TypeScript Style Guide](https://mkosir.github.io/typescript-style-guide/).

Key points:
- Use 2 spaces for indentation
- Use semicolons
- Use single quotes for strings
- Prefer `const` over `let` when possible
- Use PascalCase for classes, interfaces, types, and enums
- Use camelCase for variables, functions, and methods
- Add JSDoc comments for public APIs

### Documentation Style Guide

- Use Markdown for documentation
- Use clear headings and subheadings
- Include code examples with proper syntax highlighting
- Keep sentences concise and clear
- Use numbered lists for sequential steps
- Use bullet points for non-sequential items

## Release Process

The VNPay library follows semantic versioning (SEMVER):

- **Major releases** (1.0.0, 2.0.0): Incompatible API changes
- **Minor releases** (1.1.0, 1.2.0): Add functionality in a backward-compatible manner
- **Patch releases** (1.0.1, 1.0.2): Backward-compatible bug fixes

Contributors don't need to worry about versioning - the maintainers will handle this.

## Additional Notes

### Issue and Pull Request Labels

We use labels to categorize issues and PRs:

- `bug`: Something isn't working
- `documentation`: Improvements or additions to documentation
- `enhancement`: New features or improvements
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested
- `wontfix`: This will not be worked on

Thank you for contributing to VNPay! 🚀
