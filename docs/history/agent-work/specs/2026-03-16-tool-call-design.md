# ToolCall Component Design

> Status: Historical archived design reference.
> This document is preserved for design archaeology and should not override the current implementation.

## Context

The agentic-craft library needs a universal `ToolCall` component -- the atomic unit for representing a single tool/function call in an agentic interface. It must work both standalone (sequential tool calls) and inside `ToolTree` (parallel execution). Currently, ToolTree has its own item primitives (`ToolTreeItem`, `ToolTreeItemTrigger`, `ToolTreeItemContent`) that duplicate what ToolCall should be. This spec unifies them.

## API

```tsx
// Standalone (sequential)
<ToolCall icon={CodeIcon} status="completed" timestamp="10:44 AM">
  <ToolCallLabel>Checking git status</ToolCallLabel>
  <ToolCallContent>
    <p>Branch: main, Status: clean</p>
  </ToolCallContent>
</ToolCall>

// Running state
<ToolCall icon={CodeIcon} status="running">
  <ToolCallLabel>Reading security_target.pdf</ToolCallLabel>
</ToolCall>

// Failed with retry
<ToolCall icon={CodeIcon} status="failed" error="Connection timeout" onRetry={handleRetry}>
  <ToolCallLabel>Fetching remote config</ToolCallLabel>
</ToolCall>

// Inside ToolTree (parallel)
<ToolTree>
  <ToolTreeTrigger icon={GitBranchIcon}>
    Running 3 tasks in parallel
  </ToolTreeTrigger>
  <ToolTreeContent>
    <ToolCall icon={CodeIcon} status="completed" timestamp="10:44 AM">
      <ToolCallLabel>Checking git status</ToolCallLabel>
      <ToolCallContent>Branch: main</ToolCallContent>
    </ToolCall>
    <ToolCall icon={SearchIcon} status="running">
      <ToolCallLabel>Searching documentation</ToolCallLabel>
    </ToolCall>
  </ToolTreeContent>
</ToolTree>
```

## Props

### ToolCall (root)
```typescript
interface ToolCallProps extends React.ComponentProps<"div"> {
  icon: IconSvgElement
  status?: "running" | "completed" | "failed"  // default: "completed"
  timestamp?: string
  error?: string
  onRetry?: () => void
  defaultExpanded?: boolean
}
```

### ToolCallLabel
```typescript
interface ToolCallLabelProps extends React.ComponentProps<"span"> {}
```
The text label. Renders inside the trigger button.

### ToolCallContent
```typescript
interface ToolCallContentProps extends React.ComponentProps<"div"> {}
```
Expandable detail section. Only shown when expanded. If absent, no chevron is rendered.

## Status States

| Status | Icon | Label | Chevron | Expanded |
|--------|------|-------|---------|----------|
| `running` | Pulse animation | Normal text | Hidden | No |
| `completed` | Static | Normal text | Shown if ToolCallContent present | Yes, on click |
| `failed` | Static | `text-destructive` | Shown | Yes, shows error + retry |

### Running animation
A subtle pulse on the icon (opacity oscillation via CSS keyframe). No spinner -- matches the understated design language.

## Visual Style

Matches ToolTree item pattern exactly:
- Borderless row with icon-mask circle (`size-5` icon, `size-6` bg-background mask)
- Timestamp appears on hover (right-aligned, `text-xs text-muted-foreground`)
- Expand chevron (`ArrowRight01Icon`, rotates 90deg when open)
- Expanded content indented with `pl-7 -mt-1 pb-1`

## ToolTree Refactor

Remove `ToolTreeItem`, `ToolTreeItemTrigger`, `ToolTreeItemContent` from `tool-tree.tsx`. ToolTree now expects `ToolCall` as direct children of `ToolTreeContent`.

ToolTree changes:
- `ToolTreeContent` renders the L-connectors around each `ToolCall` child
- The spine, mask, and connector logic stays in ToolTree
- `ToolCall` gets a `data-slot="tool-call"` for CSS targeting

The connector wrapping is handled by ToolTreeContent via `React.Children.map` -- each child gets wrapped in a div that renders the L-connector and spine mask.

## File Structure

| File | Contents | Action |
|------|----------|--------|
| `src/components/ui/tool-call.tsx` | ToolCall, ToolCallLabel, ToolCallContent | Create (~120 lines) |
| `src/components/ui/tool-tree.tsx` | ToolTree, ToolTreeTrigger, ToolTreeContent | Refactor (remove item primitives, wrap ToolCall children with connectors) |
| `src/components/ui/composer.css` | Add `animate-tool-call-pulse` keyframe | Edit |
| `src/views/actions-content.tsx` | Replace inline ToolCall + update parallel section | Edit |
| `src/views/demo-content.tsx` | Update parallel section to use ToolCall | Edit |

## Registry

Add `tool-call` as a new registry item. Update `tool-tree` to depend on `tool-call`.

## Verification

1. `/` demo page: ToolTree with ToolCall children renders correctly
2. `/actions` page: Both sequential and parallel modes use ToolCall
3. Standalone ToolCall works outside of ToolTree
4. Running, completed, failed states all render correctly
5. Hover timestamp works
6. Expand/collapse works
7. Error + retry button works
8. TypeScript: `pnpm tsc --noEmit` passes
9. Visual verification via agent-browser
