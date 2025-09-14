Below is couples of my request and my question , give me the feedback, do not start to code until I say it. KISS Principle must applied, keep it simple, secure, high performance, professional best practice, not overdo nor overcomplicate

UPLOAD FILES TAB

FILEUPLOAD :
1. Users upload image + csv. CSV format “filename”,”rarity”
2. Upload Images container ;  make it 25% of current width. On the right side of Upload container add collections / images specification and validation.
3. Upload progress; currently while uploading each image shown it progress bar it self. Instead, i prefer to have 1 progress bar ( uploaded file / total images)

Image specs   :
•	Number of Image : 5 – 1000 images
•	Minimum ratio : 609 x 864 px
•	Maximum size : 10MB or 100megapixels (10.000 x 10.000)
•	Image format : PNG, JPG/JPEG, non-animated WebP

Validation :
•	Validate between CSV vs File
•	Validate image specs
•	Validate rarity (collection must contain each rarity ; common, rare, epic, legendary, mythic)


QUESTION :
What is API url that we used on current implementation :
1.	Image upload
2.	Metadatada draft
3.	Metadata confirm
4.	Request url

 CURRENT API ENDPOINTS (Your Question)

  1. Image Upload: https://build.wield.xyz/image/upload
  2. Metadata Draft:
  https://build.wield.xyz/vibe/boosterbox/metadata/draft
  3. Metadata Confirm:
  https://build.wield.xyz/vibe/boosterbox/metadata/confirm        
  4. Request URLs: All use https://build.wield.xyz base

---

## 🎯 IMPLEMENTATION PLAN - KISS PRINCIPLE

### **Phase 1: UI Layout Restructure (25/75 split)**
```
[Upload Area 25%] | [Specs & Validation Panel 75%]
├── CSV Upload     | ├── Image Specifications
├── Images Drop    | ├── Validation Rules  
└── Progress Bar   | └── Live Validation Status
```

**Components to Update:**
- `VibeFileUpload.tsx` → Split into 25% width
- Create `VibeSpecsPanel.tsx` → 75% specs/validation display
- Replace individual progress bars → Single progress counter

### **Phase 2: CSV Integration**
**New Component:** `CSVUploader.tsx`
- Drag-drop CSV file input
- Parse CSV: `"filename","rarity"`
- Store mapping: `Map<filename, rarity>`
- Validate CSV format immediately

### **Phase 3: Enhanced Validation Engine**
**New Utility:** `validators/imageValidation.ts`
```typescript
validateImageSpecs(file: File): ValidationResult
validateRarityDistribution(files: FileWithRarity[]): ValidationResult
validateCSVImageMatch(csv: CSVData, images: File[]): ValidationResult
```

**Validation Rules:**
1. **File Count:** 5-1000 images ✓
2. **Dimensions:** Min 609x864px ✓
3. **Size:** Max 10MB/100MP ✓
4. **Format:** PNG/JPG/WebP only ✓
5. **CSV Match:** All images have CSV entries ✓
6. **Rarity Complete:** Must contain all 5 rarities ✓

### **Phase 4: Streamlined Upload Flow**
**Current:** Individual progress bars per image
**New:** Single progress counter
```
"Uploading images... 15/47 (32%)"
[████████░░░░░░░░░░░░] 32%
"Currently uploading: dragon_001.png"
```

### **Phase 5: Error Prevention Strategy**
**Pre-Upload Validation:**
- Block upload button until all validations pass
- Real-time feedback as user adds files
- Clear error messages with specific fixes needed

**During Upload:**
- Fail-fast on first error
- Detailed error logging
- No placeholder URLs - proper error handling

### **🔧 TECHNICAL IMPLEMENTATION - LEVERAGE EXISTING CODE**

**✅ EXISTING CSV IMPLEMENTATION FOUND:**
- `src/hooks/vibeloader/useFileUpload.ts` - Full CSV parsing with Papa Parse
- `src/components/vibeloader/FileUpload.tsx` - Drag-drop UI with validation
- `src/types/vibeloader/index.ts` - Complete types & validation rules

**File Structure (REUSE EXISTING):**
```
components/directvibe/
├── VibeFileUpload.tsx     (ADAPT from vibeloader/FileUpload.tsx)
├── VibeSpecsPanel.tsx     (NEW - 75% specs display)

hooks/directvibe/
└── useDirectFileUpload.ts (ADAPT from vibeloader/useFileUpload.ts)

validators/ (REUSE)
├── vibeloader/validation.ts (EXISTING - has image specs validation)
```

**ADAPTATION STRATEGY:**
1. **Copy & Modify**: Use existing FileUpload.tsx as base (25% width)
2. **Extend Validation**: Add new image specs (609x864, 10MB, format validation) 
3. **Rarity Mapping**: Convert rarity numbers (1-5) to strings (common, rare, epic, legendary, mythic)
4. **Progress Integration**: Replace individual bars with single counter

**Data Flow (Simple & Linear):**
1. User drops CSV → Parse & validate format
2. User drops images → Match with CSV entries
3. Validate all specs → Show pass/fail status
4. Upload button enabled → Single progress bar
5. Upload completes → Continue to collection form

**Performance Optimizations:**
- Image validation using `createImageBitmap()` (async, non-blocking)
- CSV parsing with streaming for large files
- Lazy validation - only validate changed files
- Single re-render per validation batch

**Security Measures:**
- File type validation (magic bytes, not just extension)
- Size limits enforced client & server side
- CSV sanitization (prevent injection)
- Image dimension validation before upload

### **🎨 UX/UI - Professional & Simple**

**Specs Panel Content:**
```
📊 COLLECTION SPECIFICATIONS
Images: 23/47 selected
Rarities: ✓ All required rarities present
Size: ✓ All images within limits
Format: ✓ PNG/JPG/WebP only
CSV: ✓ All images matched

⚠️ VALIDATION ISSUES
- 3 images exceed 10MB limit
- Missing "mythic" rarity
- 2 files not in CSV
```

**Upload Progress:**
```
🚀 UPLOADING COLLECTION
Progress: 15/47 images (32%)
Current: dragon_legendary_001.png
[████████░░░░░░░░░░░░] 32%
```

### **🔄 KEY ADAPTATIONS NEEDED**

**1. Rarity Format Conversion:**
```typescript
// Existing: uses numbers 1-5
const rarityData: RarityData[] = [
  { filename: "dragon.png", rarity: 5 }  // 5 = Mythic
]

// DirectVibe needs: string format
const directVibeData = [
  { file: File, rarity: "mythic" }
]

// Conversion mapping:
const RARITY_MAP = { 1: "common", 2: "rare", 3: "epic", 4: "legendary", 5: "mythic" }
```

**2. Layout Changes:**
```typescript
// Current: Full width upload area
<Card className="mb-6">
  <CardContent>
    <div className="p-8 text-center..."> {/* 100% width */}

// New: 25% width + 75% specs panel
<div className="grid grid-cols-4 gap-6">
  <Card className="col-span-1">        {/* 25% upload */}
  <Card className="col-span-3">        {/* 75% specs */}
```

**3. Progress Bar Integration:**
```typescript
// Current: Individual progress bars per image
uploadState.images.map(image => <ProgressBar />)

// New: Single counter
<div>Uploading... 15/47 (32%)</div>
<ProgressBar value={32} />
<div>Current: dragon_001.png</div>
```

**4. Enhanced Validation Rules:**
```typescript
// Add to existing validation:
- Image dimensions: >= 609x864px
- File size: <= 10MB 
- Format: PNG/JPG/WebP only
- Rarity completeness: Must have all 5 rarities
```

### **💡 KISS PRINCIPLES APPLIED**

1. **Simple:** Reuse existing CSV parser, just change UI layout
2. **Secure:** Keep existing validation + add image specs validation
3. **High Performance:** Same async Papa Parse + single progress bar
4. **Professional:** 25/75 layout with live validation feedback
5. **Not Overcomplicated:** 90% code reuse, minimal new logic

### **🚀 IMPLEMENTATION ESTIMATE**

**Effort Level:** **LOW** ✅
- **Reuse:** 90% of CSV logic already exists
- **New:** Only UI layout changes + rarity mapping
- **Time:** ~2-3 hours vs 1-2 days from scratch

**Ready for Implementation:** ✅ Leveraging existing proven code base
