# Glide Path Wizard - CLI Application

A modular, interactive Command-Line Interface (CLI) wizard that guides users through various configuration steps with clear instructions, input validation, and error handling.

## Features

- **Interactive Wizard Flow**: Step-by-step guidance through configuration process
- **Input Validation**: Robust validation for user inputs (email, non-empty strings, numbers)
- **Error Handling**: Graceful error handling with clear error messages
- **Navigation Commands**: 
  - Type `quit` or `exit` to quit at any time
  - Type `restart` to restart the wizard from the beginning
  - Type `back` to go to the previous step
- **Colorful Output**: ANSI color-coded terminal output for better readability
- **Modular Design**: Easy to add, remove, or modify wizard steps
- **State Management**: Tracks user progress and collected data throughout the wizard
- **Summary Report**: Displays a comprehensive summary at the end

## Installation

### Prerequisites

- Node.js (v18 or higher)
- npm (comes with Node.js)

### Setup

1. Install dependencies:
```bash
npm install
```

2. Make the CLI executable (optional):
```bash
chmod +x src/cli/wizard.js
```

## Usage

### Running the Wizard

You can run the CLI wizard in several ways:

#### Using npm script (recommended):
```bash
npm run wizard
```

#### Direct execution:
```bash
node src/cli/wizard.js
```

#### As an executable (after making it executable):
```bash
./src/cli/wizard.js
```

## Wizard Steps

The wizard guides you through the following steps:

### 1. Welcome & Introduction
- Greets the user
- Explains the wizard's purpose
- Provides instructions on available commands

### 2. User Information
- Collects your name (validated: non-empty)
- Collects your email address (validated: proper email format)

### 3. Project Configuration
- Project name (validated: non-empty)
- Project type selection:
  1. Web Application
  2. Mobile Application
  3. Desktop Application
  4. Command-Line Tool

### 4. Environment Setup
- Primary programming language selection:
  1. JavaScript/TypeScript
  2. Python
  3. Java
  4. Go
  5. Other
- Package manager selection (if JavaScript/TypeScript):
  1. npm
  2. yarn
  3. pnpm

### 5. Additional Features
- Enable CI/CD integration (yes/no)
- Set up automated testing (yes/no)
- Use Docker for containerization (yes/no)

### 6. Summary
- Displays a comprehensive summary of all configurations
- Shows confirmation that setup is complete

## Navigation Commands

At any point during the wizard, you can use these special commands:

- **`quit`** or **`exit`**: Exit the wizard immediately
- **`restart`**: Restart the wizard from the beginning (clears all data)
- **`back`**: Go back to the previous step

## Input Validation

The wizard includes robust input validation:

- **Email validation**: Ensures proper email format (e.g., user@example.com)
- **Non-empty validation**: Ensures required fields are not left empty
- **Number validation**: Ensures numeric inputs are within valid ranges
- **Error messages**: Clear error messages guide users to provide correct input

## Extending the Wizard

The wizard is designed to be easily extensible. To add new steps:

### 1. Create a new step function:

```javascript
async function myNewStep() {
  printHeader('Step X: My New Step');
  
  print('Description of what this step does.\n');
  
  // Collect input
  let input = '';
  while (!validateNonEmpty(input)) {
    input = await question('Your question? ');
    const command = handleSpecialCommands(input);
    if (command !== 'continue') return command;
    
    if (!validateNonEmpty(input)) {
      printError('Input cannot be empty. Please try again.');
    }
  }
  
  wizardState.userData.myField = input;
  printSuccess(`Data recorded: ${input}`);
  
  return 'continue';
}
```

### 2. Add the step to the steps array:

```javascript
const steps = [
  welcomeStep,
  userInfoStep,
  projectConfigStep,
  environmentSetupStep,
  additionalFeaturesStep,
  myNewStep,  // Add your new step here
];
```

### 3. Update the summary function:

```javascript
function displaySummary() {
  // ... existing code ...
  print(`My Field: ${wizardState.userData.myField}`, colors.bright);
  // ...
}
```

## Validation Functions

The wizard provides several validation utility functions:

- `validateEmail(email)`: Validates email format
- `validateNonEmpty(value)`: Validates non-empty strings
- `validateNumber(value, min, max)`: Validates numbers within range

You can create additional validation functions as needed.

## Output Functions

The wizard provides several output utility functions for consistent formatting:

- `print(text, color)`: Print colored text
- `printHeader(title)`: Print a section header
- `printSuccess(message)`: Print a success message (green)
- `printError(message)`: Print an error message (red)
- `printWarning(message)`: Print a warning message (yellow)
- `printInfo(message)`: Print an info message (blue)
- `clearScreen()`: Clear the console screen

## Architecture

### State Management

The wizard uses a simple state object to track progress:

```javascript
const wizardState = {
  currentStep: 0,           // Current step index
  userData: {},             // Collected user data
  completedSteps: [],       // Array of completed step indices
};
```

### Step Flow

1. Each step is a function that returns a string indicating the next action:
   - `'continue'`: Move to the next step
   - `'quit'`: Exit the wizard
   - `'restart'`: Restart from the beginning
   - `'back'`: Go to the previous step

2. The main `runWizard()` function manages the step flow and state transitions

3. Special commands are handled consistently across all steps using `handleSpecialCommands()`

## Error Handling

The wizard includes comprehensive error handling:

- Try-catch blocks around the main wizard flow
- Validation loops that re-prompt on invalid input
- Clear error messages for all validation failures
- Graceful exit on unexpected errors

## Testing

To run the automated tests for the CLI wizard:

```bash
npm test
```

The test suite includes:
- Validation function tests
- Input handling tests
- State management tests
- Step navigation tests

## Examples

### Example Session

```
============================================================
  Welcome to Glide Path Wizard
============================================================

This wizard will guide you through setting up your project configuration.
You can quit at any time by typing "quit" or "exit".
Type "restart" to restart the wizard from the beginning.
Type "back" to go to the previous step.

Press Enter to continue or type "quit" to exit: 

============================================================
  Step 1: User Information
============================================================

Let's start by collecting some basic information about you.

What is your name? John Doe
✓ Hello, John Doe!
What is your email address? john@example.com
✓ Email recorded: john@example.com

...

============================================================
  Configuration Summary
============================================================

Here's a summary of your configuration:

Name: John Doe
Email: john@example.com
Project Name: My Awesome Project
Project Type: Web Application
Primary Language: JavaScript/TypeScript
Package Manager: npm
CI/CD: Enabled
Testing: Enabled
Docker: Disabled

✓ Configuration complete!

Your project is ready to be set up with these settings.
```

## Troubleshooting

### Issue: Permission denied when running the script

**Solution**: Make the script executable:
```bash
chmod +x src/cli/wizard.js
```

### Issue: Module not found errors

**Solution**: Ensure you're using Node.js v18+ which supports ESM modules:
```bash
node --version  # Should be v18 or higher
```

### Issue: Colors not displaying correctly

**Solution**: Ensure your terminal supports ANSI color codes. Most modern terminals do, but some older terminals may not.

## Contributing

To contribute to the CLI wizard:

1. Fork the repository
2. Create a new branch for your feature
3. Add your changes
4. Add tests for your changes
5. Ensure all tests pass
6. Submit a pull request

## License

This project is part of the Glide Path Wizard repository.

## Support

For issues, questions, or contributions, please visit the GitHub repository.
