# Terminal Integration & Workflow Guide

## 🚀 Quick Start Commands

### Development

```bash
# Start development server with pre-checks
npm run dev
# or use enhanced scripts
./scripts/dev.sh      # Unix/Linux/macOS
./scripts/dev.bat     # Windows

# PowerShell users can use enhanced functions:
sdev                  # Start development server
```

### Testing Workflows

```bash
npm run test          # Unit tests
npm run test:watch    # Watch mode
npm run test:coverage # With coverage
npm run test:e2e      # End-to-end tests

# PowerShell shortcuts:
stest                 # Unit tests
stest -Watch          # Watch mode
stest -Coverage       # With coverage
stest -E2E            # E2E tests
```

### Code Quality & Maintenance

```bash
npm run check         # Full check (lint + format + test + audit)
npm run fix           # Auto-fix issues (lint + format + audit)
npm run clean         # Clean generated files
```

### Deployment

```bash
npm run deploy        # Quick deploy
./scripts/deploy.sh   # Enhanced deploy (Unix)
./scripts/deploy.bat  # Enhanced deploy (Windows)

# PowerShell:
sdeploy              # Enhanced deployment with checks
```

## 🎯 VS Code Integration

### Tasks (Ctrl+Shift+P → "Tasks: Run Task")

- **Serve Website** - Start development server (auto-runs on folder open)
- **Dev: Quick Start** - Parallel server start + linting
- **Watch Tests** - Background test watcher
- **Pre-Deploy Check** - Full validation before deployment
- **Full Test Suite** - Complete testing pipeline

### Debug Configurations (F5)

- **Launch with Live Server** - Debug-ready dev server
- **Debug Jest Tests** - Unit test debugging
- **Debug Specific Test File** - File-focused debugging
- **Debug Playwright Tests** - E2E test debugging

### Terminal Enhancements

- Optimized PowerShell profiles
- Multi-line paste protection
- Enhanced font rendering (Cascadia Code/Fira Code)
- Improved scrollback and tab management

## 🔄 Automated Workflows

### Pre-commit Hooks

```bash
# Install pre-commit hook (run once)
cp scripts/pre-commit .git/hooks/pre-commit
chmod +x .git/hooks/pre-commit
```

### NPM Script Hooks

- **pretest** - Auto-lint before tests
- **predeploy** - Auto-validate before deployment
- **postinstall** - Helpful setup messages

## 🛠 Platform-Specific Features

### Windows PowerShell

- Enhanced function shortcuts (`sdev`, `stest`, `sdeploy`)
- Colorized output and progress indicators
- Automatic dependency checking
- Error handling with helpful messages

### Unix/Bash

- Shell script error handling (`set -e`)
- Dependency validation
- Cross-platform compatibility
- Progress feedback

## 📊 Performance Optimizations

### Task Configuration

- Background tasks for long-running processes
- Shared terminal panels for efficiency
- Problem matchers for error detection
- Smart focus management

### Terminal Settings

- Increased scrollback (10,000 lines)
- Optimized font rendering
- Reduced startup overhead
- Enhanced copy-paste behavior

## 🎮 Game Development Workflow

### Live Development

1. `npm run dev` - Start with auto-reload
2. Navigate to `/#game` section
3. Test RPG features interactively
4. Watch terminal for lint/test feedback

### Testing Game Features

1. `npm run test:watch` - Continuous test feedback
2. `npm run test:e2e:headed` - Visual E2E testing
3. Manual testing at `http://localhost:3000/#game`

### Pre-deployment Validation

1. `npm run check` - Full validation
2. `npm run test:e2e` - Cross-browser testing
3. `npm run deploy` - Automated deployment

## 🔧 Troubleshooting

### Common Issues

- **Port 3000 in use**: Kill process or use different port
- **Permission denied**: Run `chmod +x scripts/*.sh` on Unix
- **Wrangler not found**: Install globally with `npm i -g wrangler`
- **Tests failing**: Check `npm run lint:fix` first

### Debug Commands

```bash
npm run test:e2e:debug    # Debug E2E tests
npm run test:e2e:ui       # Interactive test UI
npx playwright show-trace # Analyze test traces
```
