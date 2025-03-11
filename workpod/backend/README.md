# Backend Source Directory Structure

## Directory Structure

### `/core`
- Feature-based modules
- Each module contains its own:
  - controllers/
  - services/
  - routes/
  - types/
  - __tests__/

### `/shared`
- Cross-cutting concerns
- Reusable utilities
- Configuration
- Middleware
- Database
- Error handling
- External integrations

### `/__tests__`
- Test setup
- Test helpers
- Mocks
- Integration tests

## Module Structure
Each core module follows this structure:

## Best Practices
- Use TypeScript for all files
- Follow consistent naming conventions
- Implement proper error handling
- Add comments for complex logic
- Write unit tests for critical functions