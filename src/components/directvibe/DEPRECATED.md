# DEPRECATED: File-Based Upload Components

The following components have been archived as part of the migration to API-based deployment approach.

## Archived Components:

### File Upload Components:
- `VibeFileUpload.tsx` → `src/components/archived/`
- `VibeFileUploadNew.tsx` → `src/components/archived/`  
- `VibeSpecsPanel.tsx` → `src/components/archived/`

### Functionality Replaced By:
- **API-based deployment** using `useVibeContractDeployment` hook
- **Vibe.Market integration** with draft IDs instead of direct file uploads
- **Server-side metadata handling** instead of client-side file processing

## Migration Impact:

### DirectVibeUploader.tsx
- Import of `VibeFileUploadNew` has been commented out
- Component needs refactoring to use API-based workflow
- File upload workflow must be replaced with draft ID workflow

### Components Still Using File-Based Approach:
These components need to be refactored or deprecated:
- `DirectVibeUploader.tsx` (uses archived components)
- Any components importing from archived file upload components

## Reason for Deprecation:

Following KISS principle and architectural cleanup:
- **Eliminated duplication:** File-based vs API-based approaches
- **Simplified workflow:** Single deployment path through Vibe.Market API
- **Better separation of concerns:** Client handles UI, server handles file processing
- **Improved maintainability:** Centralized configuration and error handling

## Next Steps:

1. **Refactor DirectVibeUploader** to use API-based approach
2. **Remove file upload logic** and replace with draft management
3. **Update UI flow** to match new architecture
4. **Remove or update** any components depending on archived file upload components

Date: 2025-09-10