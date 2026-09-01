---
type: outcome
skill: prosto-implement
---

# Detach a Long Render

## Given

A Blender render can run for an hour without model judgment while independent code and documentation tasks remain.

## When

The agent starts the render.

## Then

The agent records it as a process task, starts it without holding an agent turn, continues independent work, checks it only at a completion event or dependency boundary, and validates the rendered artifact before completion.
