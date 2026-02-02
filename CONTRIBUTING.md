# Contributing to AI Job Application Tracker

Thank you for your interest in contributing to the AI Job Application Tracker! This guide will help you get started with contributing to this project.

## Table of Contents

1. [Getting Started](#getting-started)
2. [Development Setup](#development-setup)
3. [Project Structure](#project-structure)
4. [Coding Standards](#coding-standards)
5. [Contribution Guidelines](#contribution-guidelines)
6. [Pull Request Process](#pull-request-process)
7. [Issue Reporting](#issue-reporting)
8. [Code Review Process](#code-review-process)

## Getting Started

### Prerequisites
- **Node.js** (v16 or higher)
- **MongoDB** (local or Atlas)
- **Git** for version control
- **Code Editor** (VS Code recommended)

### Fork and Clone
1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/your-username/JobO.git
   cd JobO
   ```

3. **Add upstream remote**:
   ```bash
   git remote add upstream https://github.com/original-owner/JobO.git
   ```

## Development Setup

### 1. Install Dependencies
```bash
# Server dependencies
cd server
npm install

# Client dependencies
cd ../client
npm install
```

### 2. Environment Setup
```bash
# Copy environment files
cp .env.example .env
cp client/.env.example client/.env

# Fill in your environment variables
# See README.md for details
```

### 3. Start Development Servers
```bash
# Terminal 1 - Start server
cd server
npm run dev

# Terminal 2 - Start client
cd client
npm start
```

### 4. Verify Setup
- Visit http://localhost:3000
- Ensure all pages load correctly
- Test authentication flow
- Verify AI functionality

## Project Structure

```
JobO/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── services/      # API services
│   │   ├── store/         # Redux store
│   │   ├── theme.js       # Material-UI theme
│   │   └── App.js         # Main App component
│   └── package.json
├── server/                # Express backend
│   ├── controllers/       # Route controllers
│   ├── models/           # Mongoose models
│   ├── routes/           # API routes
│   ├── middleware/       # Custom middleware
│   ├── services/         # Business logic
│   └── server.js         # Main server file
└── README.md
```

## Coding Standards

### JavaScript/React Standards

#### 1. Component Structure
```javascript
// Use functional components with hooks
import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';

const ComponentName = () => {
  const dispatch = useDispatch();
  const { data } = useSelector(state => state.reducer);
  
  // Hooks at the top
  const [localState, setLocalState] = useState('');
  
  // Effects after hooks
  useEffect(() => {
    // Effect logic
  }, []);
  
  // Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // Render at the bottom
  return (
    <div>
      {/* JSX content */}
    </div>
  );
};

export default ComponentName;
```

#### 2. Naming Conventions
- **Components**: PascalCase (`UserProfile.js`)
- **Files**: kebab-case (`user-profile.js`)
- **Variables**: camelCase (`userName`)
- **Constants**: UPPER_SNAKE_CASE (`API_BASE_URL`)
- **Functions**: camelCase (`getUserData`)

#### 3. Import Order
```javascript
// 1. React imports
import React, { useState } from 'react';

// 2. Third-party libraries
import { useSelector } from 'react-redux';
import { Button, Box } from '@mui/material';

// 3. Internal imports
import { getUserData } from '../services/userService';
import Component from '../components/Component';

// 4. Relative imports
import './Component.css';
```

### Material-UI Standards

#### 1. Theme Usage
```javascript
// Use theme colors
const useStyles = makeStyles((theme) => ({
  root: {
    color: theme.palette.primary.main,
    backgroundColor: theme.palette.background.paper,
  },
}));

// Or use sx prop
<Box sx={{
  p: 2,
  bgcolor: 'background.paper',
  borderRadius: 2,
}}>
```

#### 2. Component Usage
```javascript
// Use Material-UI components consistently
<Button
  variant="contained"
  color="primary"
  onClick={handleClick}
  sx={{ borderRadius: 2 }}
>
  Click Me
</Button>
```

### Redux Standards

#### 1. Slice Structure
```javascript
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

// Async thunks first
export const fetchData = createAsyncThunk(
  'slice/fetchData',
  async (params) => {
    const response = await apiService.getData(params);
    return response.data;
  }
);

// Then slice
const slice = createSlice({
  name: 'slice',
  initialState,
  reducers: {
    // Reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchData.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchData.fulfilled, (state, action) => {
        state.isLoading = false;
        state.data = action.payload;
      });
  },
});
```

## Contribution Guidelines

### 1. Branch Strategy
- **main**: Production-ready code
- **develop**: Development branch
- **feature/feature-name**: New features
- **bugfix/bug-description**: Bug fixes
- **hotfix/urgent-fix**: Critical fixes

### 2. Commit Messages
Follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

```
type(scope): description

feat(auth): add Google OAuth integration
fix(dashboard): resolve chart rendering issue
docs(readme): update installation instructions
style(ui): improve button hover effects
refactor(api): simplify error handling
test(auth): add unit tests for login
```

### 3. Code Quality
- **ESLint**: Follow existing linting rules
- **Prettier**: Use consistent formatting
- **Comments**: Add meaningful comments for complex logic
- **Tests**: Write tests for new features

### 4. Performance Considerations
- **React**: Use `useMemo` and `useCallback` where appropriate
- **API**: Implement proper error handling and loading states
- **Database**: Use efficient queries and indexing

## Pull Request Process

### 1. Before Creating PR
- [ ] Create a feature branch from `develop`
- [ ] Write clear, descriptive commit messages
- [ ] Ensure code follows project standards
- [ ] Add tests for new functionality
- [ ] Update documentation if needed
- [ ] Ensure all tests pass

### 2. Creating Pull Request
1. **Push your branch**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create Pull Request**:
   - Use descriptive title
   - Provide detailed description
   - Link to relevant issues
   - Add screenshots for UI changes

3. **PR Template**:
   ```markdown
   ## Description
   Brief description of changes

   ## Type of Change
   - [ ] Bug fix
   - [ ] New feature
   - [ ] Breaking change
   - [ ] Documentation update

   ## Testing
   - [ ] Unit tests pass
   - [ ] Integration tests pass
   - [ ] Manual testing completed

   ## Checklist
   - [ ] Code follows project standards
   - [ ] Self-review completed
   - [ ] Documentation updated
   ```

### 3. Code Review Process
1. **Request review** from maintainers
2. **Address feedback** promptly
3. **Update PR** based on suggestions
4. **Merge** when approved

## Issue Reporting

### Bug Reports
Use the bug report template:

```markdown
**Bug Description**
Clear description of the bug

**Steps to Reproduce**
1. Go to...
2. Click on...
3. See error

**Expected Behavior**
What should happen

**Actual Behavior**
What actually happens

**Environment**
- OS: [e.g. Ubuntu 20.04]
- Browser: [e.g. Chrome 91.0]
- Node.js: [e.g. 16.14.0]

**Additional Context**
Add any other context about the problem
```

### Feature Requests
```markdown
**Feature Description**
Clear description of the feature

**Problem Statement**
What problem does this solve?

**Proposed Solution**
How should this work?

**Alternatives Considered**
What other approaches did you consider?

**Additional Context**
Add any other context or screenshots
```

## Code Review Process

### Reviewer Guidelines
1. **Check Functionality**: Does the code work as intended?
2. **Code Quality**: Is the code clean and maintainable?
3. **Performance**: Are there any performance concerns?
4. **Security**: Are there any security vulnerabilities?
5. **Testing**: Are tests adequate?
6. **Documentation**: Is documentation updated?

### Reviewer Comments
- Be constructive and respectful
- Provide specific suggestions
- Explain reasoning behind feedback
- Offer solutions to identified issues

### Author Response
- Address all feedback points
- Explain decisions when disagreeing
- Update code promptly
- Thank reviewers for their time

## Recognition

### Contributors
All contributors are recognized in:
- `README.md` contributors section
- Release notes
- Project documentation

### Types of Contributions
- **Code**: Features, bug fixes, improvements
- **Documentation**: README, guides, comments
- **Design**: UI/UX improvements, graphics
- **Bug Reports**: Issue identification and reporting
- **Ideas**: Feature suggestions and feedback

## Resources

### Learning Resources
- [React Documentation](https://reactjs.org/docs/)
- [Material-UI Documentation](https://mui.com/)
- [Redux Toolkit Documentation](https://redux-toolkit.js.org/)
- [Node.js Best Practices](https://github.com/goldbergyoni/nodebestpractices)

### Tools
- [VS Code Extensions](https://marketplace.visualstudio.com/)
- [React Developer Tools](https://chrome.google.com/webstore/detail/react-developer-tools/)
- [Redux DevTools](https://chrome.google.com/webstore/detail/redux-devtools/)

## Community Guidelines

### Code of Conduct
- Be respectful and inclusive
- Welcome newcomers and help them learn
- Focus on constructive feedback
- Assume good intentions

### Communication
- Use clear and descriptive titles
- Provide context for questions
- Be patient with responses
- Help others when you can

## Getting Help

### For Questions
- Check existing documentation
- Search existing issues
- Ask in discussions
- Contact maintainers

### For Issues
- Check if issue already exists
- Use appropriate templates
- Provide detailed information
- Be responsive to feedback

---

**Thank you for contributing to the AI Job Application Tracker!**

Your contributions help make this project better for everyone. We appreciate your time and effort!
