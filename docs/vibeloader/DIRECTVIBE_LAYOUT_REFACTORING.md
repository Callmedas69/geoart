# DirectVibe Layout Refactoring Plan

## Overview
Convert `/src/app/directvibe/` from step-based navigation to single-page section layout. **Keep all existing functionality** - only change the visual layout and user flow.

## Current vs Target Layout

### Current: Step-Based Navigation
- User sees one step at a time
- Auto-progression between steps
- Steps: `auth` → `upload` → `form` → `deploy`

### Target: Single Page with Progressive Sections
- User sees all 4 sections on one page
- Sections unlock progressively
- Same functionality, better visual layout

## New Layout Structure
```
┌─────────────────────────────────────────────────────────────┐
│ Section 1: Authentication        [ALWAYS ACTIVE]           │
│ ✅ Wallet Connected + Vibe Auth (keep existing logic)      │
├─────────────────────────────────────────────────────────────┤
│ Section 2: Image Uploader        [ACTIVE AFTER AUTH]       │
│ 📤 Upload Files (keep existing logic)                      │
├─────────────────────────────────────────────────────────────┤
│ Section 3: Collection Details    [UNLOCKED AFTER UPLOAD]   │
│ 📝 Form Fields (keep existing logic) [GREYED INITIALLY]    │
├─────────────────────────────────────────────────────────────┤
│ Section 4: Contract Deployment   [UNLOCKED AFTER UPLOAD]   │
│ 🚀 Deploy Contract (keep existing logic) [GREYED INITIALLY]│
└─────────────────────────────────────────────────────────────┘
```

## Simple Implementation Plan

### Step 1: Layout Only Change (2 hours max)
**Goal**: Show all 4 sections on one page instead of step-by-step

**What to change**:
1. **DirectVibeUploader.tsx**: Change from step-based rendering to section-based rendering
2. **Visual states**: Active sections vs greyed out sections
3. **Unlock logic**: Sections 3 & 4 become active after upload success

**What to keep exactly the same**:
- All existing hooks (`useVibeAuth`, `useAccount`, etc.)
- All existing components (`VibeFileUploadNew`, `VibeCollectionForm`, etc.) 
- All existing state management
- All existing API calls
- All existing business logic

### Simple Code Change Example:
```typescript
// Current: Render based on step
{step === "auth" && <AuthComponent />}
{step === "upload" && <UploadComponent />}

// New: Render all sections, control visibility
<Section title="Authentication" active={true}>
  <AuthComponent />
</Section>
<Section title="Image Upload" active={authComplete} disabled={!authComplete}>
  <UploadComponent />
</Section>
<Section title="Collection Details" active={uploadComplete} disabled={!uploadComplete}>
  <FormComponent />
</Section>
<Section title="Deploy" active={uploadComplete} disabled={!uploadComplete}>
  <DeployComponent />
</Section>
```

## Benefits
- **Better UX**: Users see full process
- **Same functionality**: No logic changes
- **Visual feedback**: Clear progress indication
- **Simple change**: Just layout, not functionality

---

**Estimated Time**: 2 hours
**Risk**: Very Low (layout only)
**Files to modify**: Only `DirectVibeUploader.tsx`