# Agentic Craft positioning

## One-sentence positioning

Agentic Craft is an agnostic, HAX-informed reference for agentic UX patterns and interaction models, showing how complex human-AI experiences can be represented by composing shadcn/ui primitives.

## What Agentic Craft is not

- Not a design system
- Not a primitive component library
- Not an opinionated visual default for all products
- Not only a visual rendering of HAX research

## What Agentic Craft is

- A reference for higher-order agentic UX patterns
- A composition guide for complex human-AI interaction models
- A place to study how patterns behave, not just how they look
- A bridge between HAX research and practical implementation

## Substrate and composition model

- shadcn/ui primitives are the substrate
- visual defaults should come from the active shadcn theme and primitive variants rather than from Agentic Craft prescribing a canonical style
- base-nova and related shadcn capabilities are implementation infrastructure, not product identity
- the value of Agentic Craft is in composition, interaction, state modeling, motion, and explainability

Examples of the unit of value here:
- Composer
- Tool Call
- Tool Tree
- Workflow Steps
- Approval Gate
- Memory Surface
- Agent Routing / Handoff
- Observability surfaces

These are not primitive controls. They are higher-order interaction patterns.

## Recommended language

Prefer:
- agentic UX pattern reference
- HAX-informed interaction reference
- composition guide for agentic interfaces
- interaction models and patterns
- higher-order patterns built on shadcn/ui primitives

Avoid as primary positioning:
- design system
- component library
- UI kit
- primitive library

## Target information architecture

### 1. Overview

Purpose:
- orient new visitors
- explain what the project is
- show one or two composed examples

Suggested contents:
- project definition
- why this exists
- quick explanation of HAX grounding
- featured composed flow or scenario

### 2. Pattern Reference

Purpose:
- make the higher-order patterns the primary product

Candidate pages:
- Composer
- Tool Call
- Tool Tree
- Workflow Steps
- Thread Timeline
- Approval Gate
- Memory Surface
- Agent Card
- Citation / Provenance surfaces

Each pattern page should emphasize:
- what it solves
- anatomy
- states
- interactions
- motion
- composition rules
- anti-patterns
- implementation notes

### 3. Research Lenses

Purpose:
- preserve the HAX and topic framing without making it the primary navigation model

Candidate pages:
- Conversation
- Actions
- Trust
- Memory
- Multi-Agent
- Feedback
- Observability

These should explain why patterns exist, how they connect, and which patterns belong in each lens.

### 4. Composed Flows

Purpose:
- show how patterns work together in realistic scenarios

This is the right home for the current homepage/demo energy.

Examples:
- review assistant flow
- approval flow
- multi-agent handoff flow
- research flow
- audit / observability flow

### 5. Method

Purpose:
- explain the product philosophy and contribution criteria

Suggested topics:
- HAX grounding
- why composition over a fixed system
- how shadcn/ui is used here
- how to decide a pattern deserves inclusion

## Immediate IA moves worth making

1. Rename `Demo` to `Overview`
2. Keep research/topic routes, but stop treating them as the entire product definition
3. Add a dedicated pattern-reference layer over time
4. Treat the current homepage as a composed flow / overview, not as the definition of the project
5. Use the composer as the reference model for future pattern pages

## Canonical framing rule

If a future change makes Agentic Craft read like a design system or primitive library, it is probably drifting away from the intended product.

The canonical question should be:
- does this help someone understand how to represent a complex agentic UX pattern?

If yes, it belongs.
If it only defines base styling or primitive defaults, it probably does not.
