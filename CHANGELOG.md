# Changelog

All notable changes to Silas Anderson's personal website will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Comprehensive testing infrastructure with Jest and Playwright
- GitHub Actions CI/CD pipeline
- Security and performance auditing
- Development configuration files

## [1.0.0] - 2025-11-10

### Added

- Personal website with bio, interests, gallery, and stories sections
- Embedded RPG adventure game with:
  - Character classes (Warrior, Archer, Mage, Rogue)
  - Multiple locations to explore (Castle, Forest, Cave, Village, Mountain, Swamp, Desert, Ruins)
  - Turn-based combat system with skills and equipment
  - Quest system with various quest types
  - Achievement system
  - Shop and inventory management
  - Character progression and leveling
- Password-protected edit mode for content management
- LocalStorage-based data persistence
- Responsive design for mobile and desktop
- Cloudflare Pages deployment configuration

### Security

- XSS protection via HTML escaping
- Session-based authentication for edit mode
- Client-side-only architecture with no server dependencies

### Performance

- Pure JavaScript implementation (no frameworks)
- Optimized for fast loading and smooth gameplay
- Mobile-responsive design

## [0.1.0] - Initial Development

### Added

- Basic project structure
- Core HTML, CSS, and JavaScript files
- Initial deployment setup

---

## Release Types

- **Major** (X.y.z) - Breaking changes, major new features
- **Minor** (x.Y.z) - New features, backward compatible
- **Patch** (x.y.Z) - Bug fixes, security patches

## Categories

- **Added** - New features
- **Changed** - Changes in existing functionality
- **Deprecated** - Soon-to-be removed features
- **Removed** - Removed features
- **Fixed** - Bug fixes
- **Security** - Security improvements
- **Performance** - Performance improvements
