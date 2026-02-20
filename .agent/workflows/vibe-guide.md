---
description: Guides users through implementation by adding helpful comments to code instead of implementing directly. Use when the user wants to learn and implement features themselves, asks for guidance, or wants step-by-step instructions in code comments.
---

# Guided Implementation

## Core Principle

When this skill is active, **guide rather than implement**. Add helpful comments to the codebase that teach the user how to implement the feature themselves. Do not write the implementation code directly.

## Comment Types

Add three types of comments to guide implementation:

### 1. Instructions

Clear, step-by-step guidance on what to do:

```javascript
// TODO: Step 1 - Import the necessary function from the utils module
// TODO: Step 2 - Create a new function that validates the input
// TODO: Step 3 - Add error handling for edge cases
```

### 2. Hints

Point to relevant functions, modules, or patterns:

```javascript
// HINT: Check the `server/api/profile.post.ts` file for similar validation logic
// HINT: Use the `validateInput()` function from `server/utils/validation.ts`
// HINT: Consider using the existing `handleError()` pattern from other API routes
```

### 3. Examples

Show concrete code examples (commented out):

```javascript
// EXAMPLE: Here's how you might structure the validation:
// const isValid = validateInput(data, {
//   required: ['name', 'email'],
//   types: { email: 'email', name: 'string' }
// });
```

## Workflow

1. **Understand the requirement**: Read relevant files and understand what needs to be implemented
2. **Break it down**: Identify the key steps needed
3. **Add guidance comments**: Insert comments with instructions, hints, and examples at appropriate locations
4. **Reference existing patterns**: Point to similar implementations in the codebase when helpful
5. **Explain the "why"**: Include brief explanations of why certain approaches are recommended

## Comment Placement

- **At the top of functions/files**: Overall guidance and approach
- **Before complex logic**: Step-by-step instructions
- **Near similar code**: Hints pointing to existing patterns
- **Inline**: Brief hints for specific lines

## Comment Format

Use language-appropriate comment syntax:

- JavaScript/TypeScript: `//` or `/* */`
- Python: `#`
- Vue files: `<!-- -->` for template, `//` for script
- Markdown: `<!-- -->`

## Example Output

```typescript
// TODO: Implement user profile update endpoint
// Step 1: Validate the incoming request data
// HINT: See server/api/profile.post.ts for validation patterns
// EXAMPLE: const validation = validateProfileData(req.body);

// Step 2: Check if user exists and has permission
// HINT: Use the getUserById() function from server/utils/auth.ts
// EXAMPLE: const user = await getUserById(userId);

// Step 3: Update the user profile in the database
// HINT: Use Prisma's update method - see server/api/groups.post.ts for similar pattern
// EXAMPLE: const updatedUser = await prisma.user.update({ where: { id }, data: {...} });

// Step 4: Return the updated profile
// HINT: Follow the response format from server/api/profile.get.ts
```

## When NOT to Use This Skill

- User explicitly asks you to implement directly
- User says "do it for me" or similar
- Bug fixes or quick corrections (unless user wants to learn)
- Simple, trivial changes

## Best Practices

- **Be specific**: Vague hints like "add validation" are less helpful than "use the validateInput function from utils/validation.ts"
- **Reference the codebase**: Point to actual files and functions that exist
- **Progressive disclosure**: Start with high-level steps, then add detailed hints
- **Encourage exploration**: Suggest reading related files to understand patterns
- **Explain trade-offs**: When multiple approaches exist, briefly mention why one is recommended
