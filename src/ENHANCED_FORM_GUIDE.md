# 🎯 Enhanced PSU Position Review Form - Field Location Guide

## 📍 Where to Find the New Fields

The enhanced form is now live at: **`/submit-review`**

If you don't see the new fields, please **refresh your browser** or **hard refresh** (Ctrl+Shift+R / Cmd+Shift+R).

---

## 📋 Complete Field Breakdown (63 Total Fields)

### ⚡ **Section 1: Power Supply Information** (7 fields)
Located at: **Lines 202-314** in `SubmitReviewEnhanced.tsx`

1. ✅ PSU Brand *
2. ✅ PSU Model *
3. ✅ Wattage * (dropdown)
4. ✅ Efficiency Rating * (dropdown)
5. ✅ Modular Type * (dropdown)
6. ✅ PSU Price Paid *
7. ✅ Purchase Date

---

### 📦 **Section 2: PC Case Information** (6 NEW fields)
Located at: **Lines 316-387** in `SubmitReviewEnhanced.tsx`

8. ✅ **Case Name ***
9. ✅ **Case Manufacturer ***
10. ✅ **Case Model**
11. ✅ **Release Year**
12. ✅ **Case MSRP**
13. ✅ **Case Type *** (ATX/mATX/ITX/E-ATX)

**Visual Example:**
```
┌─────────────────────────────────────────────┐
│  📦 PC Case Information                     │
├─────────────────────────────────────────────┤
│  Case Name: [NZXT H510                   ]  │
│  Case Manufacturer: [NZXT                ]  │
│  Case Model: [H510                       ]  │
│  Release Year: [2019                     ]  │
│  Case MSRP: [$69.99                      ]  │
│  Case Type: [ATX ▼]                         │
└─────────────────────────────────────────────┘
```

---

### 🖥️ **Section 3: PSU Position & Configuration** (17 NEW fields)
Located at: **Lines 389-597** in `SubmitReviewEnhanced.tsx`

14. ✅ **PSU Position *** (bottom/top/side/dual)
15. ✅ **PSU Size Support** (ATX/SFX/SFX-L/TFX)
16. ✅ **Max PSU Length (mm)**
17. ✅ **Has PSU Shroud?** (Yes/No)
18. ✅ **PSU Shroud Material** (metal/plastic/tempered-glass)
19. ✅ **PSU Chamber Isolated?** (Yes/No)
20. ✅ **Shroud Ventilation** (solid/perforated/mesh)
21. ✅ **Bottom Ventilation** (filtered/open/solid)
22. ✅ **Clearance from Bottom (mm)**
23. ✅ **Fan Support (Bottom)** (120mm/140mm/none)
24. ✅ **PSU Mounting Style** (traditional-screws/sliding-bracket/tool-free)
25. ✅ **Vibration Dampening** (rubber-grommets/foam-pads/none)
26. ✅ **Dust Filter Type** (magnetic/slide-out/snap-in/none)
27. ✅ **Recommended Orientation** (fan-down/fan-up/either)
28. ✅ **Cable Routing Style** (direct/shroud-hidden/basement-channels)
29. ✅ **Cable Grommets Count**
30. ✅ **Power Cable Access** (rear-cutout/side-panel/bottom-cutout)

**Visual Example:**
```
┌─────────────────────────────────────────────┐
│  🖥️ PSU Position & Configuration            │
├─────────────────────────────────────────────┤
│  PSU Position: [bottom ▼]                   │
│  PSU Size Support: [ATX ▼]                  │
│  Max PSU Length: [200        ] mm           │
│  Has PSU Shroud: [Yes ▼]                    │
│  PSU Shroud Material: [metal ▼]             │
│  PSU Chamber Isolated: [Yes ▼]              │
│  Shroud Ventilation: [perforated ▼]         │
│  Bottom Ventilation: [filtered ▼]           │
│  Clearance from Bottom: [25    ] mm         │
│  Fan Support: [120mm ▼]                     │
│  Mounting Style: [traditional-screws ▼]     │
│  Vibration Dampening: [rubber-grommets ▼]   │
│  Dust Filter Type: [magnetic ▼]             │
│  Recommended Orientation: [fan-down ▼]      │
│  Cable Routing: [shroud-hidden ▼]           │
│  Cable Grommets: [3     ]                   │
│  Power Cable Access: [rear-cutout ▼]        │
└─────────────────────────────────────────────┘
```

---

### 🌡️ **Section 4: Thermal Performance** (10 NEW fields)
Located at: **Lines 599-718** in `SubmitReviewEnhanced.tsx`

31. ✅ **Thermal Rating** (A-F grade)
32. ✅ **Idle Temperature (°C)**
33. ✅ **Load Temperature (°C)**
34. ✅ **Ambient During Test (°C)**
35. ✅ **Test Components**
36. ✅ **Noise Level (dB under load)**
37. ✅ **Airflow Score (/10)**
38. ✅ **PSU Intake Dust Buildup** (minimal/moderate/heavy after 6 months)
39. ✅ **PSU Exhaust Blocking** (none/minor/significant)
40. ✅ **Compatibility Issues** (none/large-psu-clearance/modular-cables-only)

**Visual Example:**
```
┌─────────────────────────────────────────────┐
│  🌡️ Thermal Performance                     │
├─────────────────────────────────────────────┤
│  Thermal Rating: [A - Excellent ▼]          │
│  Idle Temperature: [38    ] °C              │
│  Load Temperature: [52    ] °C              │
│  Ambient During Test: [22    ] °C           │
│  Test Components: [Ryzen 5600X + RTX 3070]  │
│  Noise Level: [28    ] dB                   │
│  Airflow Score: [8.5  ] /10                 │
│  Dust Buildup: [minimal ▼]                  │
│  Exhaust Blocking: [none ▼]                 │
│  Compatibility Issues: [none ▼]             │
└─────────────────────────────────────────────┘
```

---

### 🔧 **Section 5: Installation & Maintenance** (10 NEW fields)
Located at: **Lines 720-827** in `SubmitReviewEnhanced.tsx`

41. ✅ **Installation Difficulty** (easy/medium/hard)
42. ✅ **Cable Management Score (/10)**
43. ✅ **Tool Required** (none/screwdriver/custom)
44. ✅ **Accessibility** (excellent/good/poor)
45. ✅ **Maintenance Ease** (easy/moderate/difficult)
46. ✅ **PSU Removal Steps** (number)
47. ✅ **Warranty Period**
48. ✅ **Aesthetic Rating (/10)**
49. ✅ **RGB Support in PSU Area?** (Yes/No)
50. ✅ **Overall Recommendation** (highly-recommended/recommended/conditional/not-recommended)

**Visual Example:**
```
┌─────────────────────────────────────────────┐
│  🔧 Installation & Maintenance              │
├─────────────────────────────────────────────┤
│  Installation Difficulty: [easy ▼]          │
│  Cable Management Score: [9   ] /10         │
│  Tool Required: [screwdriver ▼]             │
│  Accessibility: [excellent ▼]               │
│  Maintenance Ease: [easy ▼]                 │
│  PSU Removal Steps: [4    ]                 │
│  Warranty Period: [2 years              ]   │
│  Aesthetic Rating: [8   ] /10               │
│  RGB Support: [Yes ▼]                       │
│  Overall Recommendation: [highly-rec ▼]     │
└─────────────────────────────────────────────┘
```

---

### ⭐ **Section 6: Ratings** (5 star ratings)
Located at: **Lines 829-867** in `SubmitReviewEnhanced.tsx`

51. ✅ Overall Rating (1-5 stars)
52. ✅ Performance (1-5 stars)
53. ✅ Noise Level (1-5 stars)
54. ✅ Value for Money (1-5 stars)
55. ✅ Build Quality (1-5 stars)

---

### 📝 **Section 7: Review Content** (5 fields)
Located at: **Lines 869-956** in `SubmitReviewEnhanced.tsx`

56. ✅ Review Title *
57. ✅ Detailed Review *
58. ✅ Pros
59. ✅ Cons
60. ✅ Would you recommend? (Yes/No)

---

### 👤 **Section 8: Contact Information** (2 fields)
Located at: **Lines 958-995** in `SubmitReviewEnhanced.tsx`

61. ✅ Name *
62. ✅ Email *

---

## 🎯 Total Count

- **Original Fields:** 20
- **NEW Fields Added:** 43
- **TOTAL FIELDS:** **63 comprehensive data points**

---

## 🚀 How to View

1. Go to your website
2. Click **"Submit Review"** in the navigation
3. You should see **8 sections** with expandable cards
4. Scroll through to see all 63 fields

### If you still don't see the new fields:

**Option 1: Hard Refresh**
- Windows/Linux: `Ctrl + Shift + R`
- Mac: `Cmd + Shift + R`

**Option 2: Clear Cache**
- Open DevTools (F12)
- Right-click the refresh button
- Select "Empty Cache and Hard Reload"

**Option 3: Incognito/Private Mode**
- Open a new incognito/private window
- Navigate to your site

---

## 📁 File Locations

- **New Enhanced Form:** `/components/SubmitReviewEnhanced.tsx`
- **App Router:** `/App.tsx` (updated to use SubmitReviewEnhanced)
- **Route:** `/submit-review`

---

## ✅ What Data Gets Saved

When you submit the form, all 63 fields are saved to `localStorage` under the key `psuReviews` with this structure:

```javascript
{
  id: "PSU-1734567890-ABC123XYZ",
  status: "Pending Review",
  submittedDate: "2025-12-13T...",
  lastUpdated: "2025-12-13T...",
  
  // PSU Info (7 fields)
  brand: "Corsair",
  model: "RM850x",
  wattage: "850W",
  efficiency: "80+ Gold",
  modular: "Fully Modular",
  price: "$139.99",
  purchaseDate: "2024-01-15",
  
  // Case Info (6 NEW fields)
  caseName: "NZXT H510",
  caseManufacturer: "NZXT",
  caseModel: "H510",
  releaseYear: "2019",
  msrpPrice: "$69.99",
  caseType: "ATX",
  
  // PSU Position (17 NEW fields)
  psuPosition: "bottom",
  psuSizeSupport: "ATX",
  maxPsuLength: "200",
  hasPsuShroud: "yes",
  psuShroudMaterial: "metal",
  psuChamberIsolated: "yes",
  // ... and so on for all 63 fields
}
```

---

## 🎨 Design Highlights

- ✅ Black background with green accents
- ✅ Pink shadow glow effects on focus
- ✅ Smooth animations with Motion
- ✅ Responsive grid layout (2 columns on desktop, 1 on mobile)
- ✅ Icon indicators for each section
- ✅ Organized into collapsible sections
- ✅ Form validation with required fields

---

**Need help?** The form is at `/submit-review` - just refresh your browser! 🎉
