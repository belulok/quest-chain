# Contributing to QuestChain Academy

Thank you for considering contributing to QuestChain Academy! This document outlines the process for contributing to the project.

## Code of Conduct

By participating in this project, you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

## How Can I Contribute?

### Reporting Bugs

- Check if the bug has already been reported in the [Issues](https://github.com/yourusername/questchain/issues)
- If not, create a new issue with a clear title and description
- Include steps to reproduce, expected behavior, and actual behavior
- Add screenshots if applicable
- Specify your environment (browser, OS, etc.)

### Suggesting Enhancements

- Check if the enhancement has already been suggested in the [Issues](https://github.com/yourusername/questchain/issues)
- If not, create a new issue with a clear title and description
- Explain why this enhancement would be useful
- Provide examples of how it would work

### Pull Requests

1. Fork the repository
2. Create a new branch (`git checkout -b feature/your-feature-name`)
3. Make your changes
4. Run tests to ensure they pass
5. Commit your changes (`git commit -m 'Add some feature'`)
6. Push to the branch (`git push origin feature/your-feature-name`)
7. Open a Pull Request

## Development Setup

1. Clone the repository
   ```bash
   git clone https://github.com/yourusername/questchain.git
   cd questchain
   ```

2. Install dependencies
   ```bash
   npm install
   ```

3. Copy the environment variables
   ```bash
   cp .env.example .env
   ```

4. Fill in the required environment variables in the `.env` file

5. Start the development server
   ```bash
   npm run dev
   ```

## Coding Guidelines

- Follow the existing code style
- Write clear, commented code
- Include tests for new features
- Update documentation as needed

## Commit Message Guidelines

- Use the present tense ("Add feature" not "Added feature")
- Use the imperative mood ("Move cursor to..." not "Moves cursor to...")
- Limit the first line to 72 characters or less
- Reference issues and pull requests liberally after the first line

## License

By contributing to QuestChain Academy, you agree that your contributions will be licensed under the project's [MIT License](LICENSE).
