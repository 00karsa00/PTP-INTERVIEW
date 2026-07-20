# Merchant Setup Guide — Kerala Ayurveda PDP Enhancements

This guide covers everything a merchant (store owner, content manager,
or ecommerce manager) needs to configure the Routine Quiz block through
Shopify Admin. **No code changes required.**

---

## Prerequisites

- Shopify Online Store 2.0 theme (Dawn, Refresh, Sense, Crave, or any theme
  that supports app blocks in the product template)
- The "Kerala Ayurveda PDP Enhancements" app installed from the Shopify app
  listing (or installed via Shopify CLI with `shopify app dev`)

---

## 1. Create the `quiz_config` metaobject definition

Go to **Shopify Admin → Settings → Custom data → Metaobjects → Add definition**.

| Field name           | Namespace/key          | Type                       |
|----------------------|------------------------|----------------------------|
| Config name          | `name`                 | Single-line text           |
| Question 1 text      | `question_1_text`      | Single-line text           |
| Question 1 options   | `question_1_options`   | **List** of single-line text |
| Question 2 text      | `question_2_text`      | Single-line text           |
| Question 2 options   | `question_2_options`   | **List** of single-line text |

> **Important:** Use the **List** type for the options fields — not a single
> comma-separated string. The block handles both, but a List is easier to
> edit and reorder in Admin.

Then create an **entry** (Settings → Custom data → Metaobjects → quiz_config → Add entry):

| Field               | Value                              |
|---------------------|------------------------------------|
| Config name         | `Ashwagandha default quiz`         |
| Question 1 text     | `What are you looking for?`        |
| Question 1 options  | `Stress & calm` / `Energy & focus` / `Sleep quality` |
| Question 2 text     | `How often do you plan to take it?` |
| Question 2 options  | `Once daily` / `Twice daily`       |

To change a question or add/remove options: open the entry → edit → Save.
No theme deploy needed.

---

## 2. Create the `routine_template` metaobject definition (backend-driven)

The backend API uses these entries to build personalised routine copy.
Create the definition the same way:

| Field name        | Namespace/key      | Type               |
|-------------------|--------------------|--------------------|
| Goal              | `goal`             | Single-line text   |
| Routine text      | `routine_text`     | Multi-line text    |
| Recommended pack  | `recommended_pack` | Single-line text   |

Create **three entries** (one per goal):

| Goal key        | Routine text (example)                               | Recommended pack         |
|-----------------|------------------------------------------------------|--------------------------|
| `stress_calm`   | Take 1 capsule in the evening with warm water.       | Standard — 60 Capsules   |
| `energy_focus`  | Take 1 capsule in the morning with water.            | Standard — 60 Capsules   |
| `sleep_quality` | Take 1 capsule 30–60 minutes before bed.             | Standard — 60 Capsules   |

> **Status:** These entries are currently read as hardcoded data in the backend
> dev config. Production would wire the NestJS service to fetch them from
> the Shopify Admin API on startup (documented in README).

---

## 3. Add benefit bullets to a product (product-specific metafield)

Go to **Shopify Admin → Settings → Custom data → Products → Add definition**.

| Field         | Value                          |
|---------------|--------------------------------|
| Name          | `Benefit Bullets`              |
| Namespace/key | `custom.benefit_bullets`       |
| Type          | **List** of single-line text   |

To edit bullets for a specific product:

1. Open the product in Admin.
2. Scroll to **Metafields** at the bottom.
3. Find **Benefit Bullets** → add, reorder, or delete lines → Save.

This is a **per-product** field — every product can have its own set.

---

## 4. Add the block in the Theme Editor

The quiz is a **Theme App Extension app block** with `"target": "main-product"`.
It drops directly into the product page main section — no theme file edits needed.

1. Open **Online Store → Themes → Customize**.
2. In the top bar select **Products → Default product** (or navigate to your
   Ashwagandha product page).
3. In the left panel click the **Product information** section (the section
   containing title, price, add-to-cart — usually called "Product information"
   or "Main product" depending on your theme).
4. Click **Add block** at the bottom of that section's block list.
5. Under **Apps**, find **KA Routine Quiz** and click it.
6. Configure the block settings on the right:

   | Setting | What it controls |
   |---------|-----------------|
   | **Heading** | Title shown above the quiz (e.g. "Is this right for me?") |
   | **Subheading** | Subtitle text below the heading |
   | **Recommendation API endpoint** | Full URL of your `/api/v1/recommendation` POST endpoint |
   | **Quiz question set** | The `quiz_config` metaobject entry to use |
   | **Show FDA disclaimer** | Toggle the disclaimer text on/off |

7. Drag the block to reorder it within the section.
8. Click **Save**.

> **If the block doesn't appear under Apps:** Make sure the app is installed
> and the theme is Online Store 2.0 compatible. Legacy themes (Debut, Brooklyn)
> do not support app blocks.

---

## 5. Summary: the 3+ merchant-editable properties

| Property               | Where to edit                           | Scope          |
|------------------------|-----------------------------------------|----------------|
| **Benefit bullets**    | Product Admin → Metafields              | Per-product ✅ |
| **Quiz questions/opts**| Settings → Custom data → Metaobjects    | Per section    |
| **Routine copy + pack**| Settings → Custom data → Metaobjects    | Backend-driven |
| Heading / Subheading   | Theme Editor → Block settings           | Per section    |
| API endpoint URL       | Theme Editor → Block settings           | Per section    |
| FDA disclaimer toggle  | Theme Editor → Block settings           | Per section    |

---

## 6. Troubleshooting

**Block doesn't show in "Add block" list**
→ Confirm the app is installed (Admin → Apps). If using `shopify app dev`, the
  dev server must be running.

**Quiz options don't match what's in my metaobject**
→ Check that the `question_1_options` field is set to **List** type, not
  single-line text. Re-save the metaobject entry after changing the field type.

**"Couldn't load your recommendation" error in the quiz**
→ Check the API endpoint URL in the block settings. The backend must be
  running and accessible from the browser (correct CORS headers, HTTPS in
  production).

**Benefit bullets not showing**
→ Confirm the `custom.benefit_bullets` metafield definition exists under
  Settings → Custom data → Products, and that the product has at least one
  bullet saved.
