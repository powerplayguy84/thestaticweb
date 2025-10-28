# Example: Using Copilot Instructions

This shows the difference when using `.github/copilot-instructions.md` for content creation.

---

## Without Custom Instructions

**Your prompt:**

```
Create an article about useState in React
```

**What Copilot generates:**

```markdown
# Understanding useState in React

useState is a React Hook that lets you add state to function components.

## What is useState?

useState is a function that returns an array with two elements...

[Content continues but missing front matter, wrong structure]
```

**Problems:**

- ❌ No front matter
- ❌ Missing required fields
- ❌ No SEO description
- ❌ No tags
- ❌ No filename suggestion
- ❌ Wrong structure

---

## With Custom Instructions

**Setup:**

```bash
cp .github/copilot-instructions-content.md .github/copilot-instructions.md
```

**Your prompt:**

```
Create an article about useState in React
```

**What Copilot generates:**

**Filename:** `content/tutorials/01-react-usestate.md`

````markdown
---
title: "Understanding useState in React"
description: "Learn how to manage state in React functional components using the useState Hook with practical examples and best practices"
date: "28-10-2025"
featured: true
tags: ["react", "hooks", "useState", "tutorial", "javascript"]
image: "https://images.unsplash.com/photo-1633356122544-f134324ef6db?w=1200&h=630&fit=crop"
---

# Understanding useState in React

> Learn how to manage component state in React using the powerful useState Hook

## Introduction

The useState Hook is one of React's most fundamental tools for managing state in functional components. Before Hooks, you needed class components to use state, but useState changed everything...

## What is useState?

useState is a React Hook that allows you to add state variables to your functional components. It returns an array with two elements:

1. The current state value
2. A function to update that value

### Basic Syntax

```jsx
import { useState } from "react";

function Counter() {
  const [count, setCount] = useState(0);

  return <button onClick={() => setCount(count + 1)}>Count: {count}</button>;
}
```
````

## How It Works

When you call useState, you provide an initial value...

[Content continues with proper structure, code examples, sections]

## Common Pitfalls

### Mistake 1: Mutating State Directly

**Problem:** Modifying state without using the setter function
**Solution:** Always use the setter function

```jsx
// ❌ Bad
const [user, setUser] = useState({ name: "John" });
user.name = "Jane"; // Don't do this!

// ✅ Good
setUser({ ...user, name: "Jane" });
```

## Best Practices

> 💡 **Pro Tip:** Use multiple useState calls for different pieces of state rather than one complex object

1. Keep state minimal
2. Derive values when possible
3. Use the functional update form for state based on previous state

## Conclusion

useState is a foundational Hook that you'll use in almost every React component. Key takeaways:

1. **Simple API** - Easy to learn and use
2. **Flexible** - Works with any data type
3. **Powerful** - Enables complex state management

### Next Steps

- Learn about [useEffect for side effects](/tutorials/react-useeffect)
- Explore [useReducer for complex state](/tutorials/react-usereducer)
- Practice with our [React Hooks exercises](/tutorials/react-hooks-practice)

### Resources

- [React Hooks Documentation](https://react.dev/reference/react/useState)
- [useState Examples on GitHub](https://github.com/example/react-hooks)

````

**Benefits:**
- ✅ Complete front matter with all fields
- ✅ Proper DD-MM-YYYY date format
- ✅ SEO-optimized title and description
- ✅ Relevant, lowercase tags
- ✅ Suggested image URL
- ✅ Proper markdown structure
- ✅ Code examples with language identifiers
- ✅ Tips and best practices
- ✅ Common pitfalls section
- ✅ Related links
- ✅ Filename suggestion included

---

## The Difference is Clear

| Aspect | Without Instructions | With Instructions |
|--------|---------------------|-------------------|
| Front Matter | Missing | Complete |
| Date Format | Wrong/Missing | DD-MM-YYYY ✓ |
| SEO Description | No | Yes, optimized |
| Tags | No | Yes, relevant |
| Structure | Generic | Template-based |
| Code Examples | Basic | With comments |
| Best Practices | Maybe | Always included |
| Filename | You figure it out | Suggested |
| Time to Edit | High | Minimal |
| Ready to Use | No | Yes |

---

## How to Set This Up

### One-Time Setup

```bash
# In your project root
cp .github/copilot-instructions-content.md .github/copilot-instructions.md
````

That's it! Copilot now understands your content structure.

### Test It

1. Open a new file in `content/tutorials/`
2. Type: "Create an article about [TOPIC]"
3. Watch Copilot generate perfectly formatted content

---

## Advanced: Customize for Your Needs

Edit `.github/copilot-instructions.md` to:

- Change default article length (600-800 → 1000-1500 words)
- Modify writing tone (professional → casual)
- Add custom tag categories
- Include your specific style preferences
- Add domain-specific guidelines

**Example customization:**

```markdown
### Custom Rule: Always Include Performance Section

For any tutorial about React components, always include:

- Performance considerations
- When to use React.memo
- Common optimization mistakes
```

---

## Real-World Example Prompts

With instructions set up, you can use simple prompts:

### Simple Prompt

```
Create a guide about TypeScript generics
```

**Copilot generates:** Complete article with all metadata, examples, proper structure

### Batch Prompt

```
Create 5 articles about Next.js App Router:
1. Introduction
2. Layouts and Pages
3. Data Fetching
4. Server Components
5. Route Handlers
```

**Copilot generates:** All 5 articles, properly numbered, with consistent tags and structure

### Series Prompt

```
Create a 3-part series on API development.
Make them progressively advanced.
```

**Copilot generates:** 3 connected articles that reference each other, proper progression

---

## Why This Works

Copilot learns from:

- ✅ Your file structure patterns
- ✅ Your content conventions
- ✅ Your writing style preferences
- ✅ Your quality standards

With custom instructions, it has a **permanent reference** instead of relying on you to explain every time.

---

## Tips for Best Results

1. **Be specific in prompts** - "Create a beginner tutorial about X" vs "Write about X"
2. **Reference the category** - "Create a tutorial..." vs "Create a guide..."
3. **Specify length** - "800 words" for consistency
4. **Ask for features** - "Include 3 code examples"
5. **Review and edit** - AI is great, but human touch makes it perfect

---

## Troubleshooting

**Q: Copilot still generates wrong format**  
A: Restart VS Code after creating/editing `.github/copilot-instructions.md`

**Q: Instructions too long?**  
A: Keep only the sections you need, remove examples

**Q: Want different instructions per category?**  
A: Reference the category in your prompt: "Create a BLOG post about..." vs "Create a TUTORIAL about..."

**Q: Copilot ignoring some rules?**  
A: Be more explicit in both the instructions and your prompt

---

## See It In Action

1. **Set up instructions:** `cp .github/copilot-instructions-content.md .github/copilot-instructions.md`
2. **Open VS Code:** Reload window if needed
3. **Create new file:** `content/tutorials/test-article.md`
4. **Type simple prompt:** "Create an article about CSS Grid"
5. **Watch magic happen:** Copilot generates complete, formatted content

---

**Ready to 10x your content creation speed?** Set up those custom instructions now! 🚀
