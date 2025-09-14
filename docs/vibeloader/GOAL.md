## Goal

My goal is to build a dedicated set of upload and deployment tools for **vibe.market**, which I plan to call **GeoTools**.

GeoTools automates the collection creation workflow by handling asset preparation, validation, metadata management, and contract deployment. This removes the need for manual rarity assignment and streamlines the current process on vibe.market.

> **Note:** This is a **high-level plan**. Terminology and workflow details may change depending on the actual implementation and terminology used by **vibe.market**.

---

## Workflow

1. **Asset Preparation**

   * Input:

     * **Images** (collection assets)
     * **CSV file** defining:

       * `filename` → matches image file
       * `rarity` → rarity tier for each image
   * Purpose: Automates rarity assignment, eliminating the manual process currently used on vibe.market.

2. **CSV Validation**

   * GeoTools parses and validates the CSV.
   * Validation checks include:

     * Filenames match uploaded images
     * Rarity values follow the required schema
     * No missing or duplicate entries

3. **Image Upload**

   * For each validated image:

     * `POST https://build.wield.xyz/boosterbox/image/upload`
     * Response returns an **image URI**

4. **Metadata Drafting**

   * Construct metadata objects from CSV + image URIs.
   * `POST https://build.wield.xyz/vibe/boosterbox/metadata/draft`
   * Response returns a **metadata draft ID**

5. **Contract Deployment**

6. **Confirmation**

7. **Collection Activation**

   * Once confirmed, the collection is fully live and displayed on **vibe.market**.

