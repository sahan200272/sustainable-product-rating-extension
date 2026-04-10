/**
 * SustainabilityTags.jsx
 *
 * Multi-select tag picker for optional sustainability-related feedback.
 * These are purely optional labels the customer can attach to their review
 * to highlight eco-friendly aspects they noticed while using the product.
 *
 * The selected tags are forwarded to the parent via `onChange(tags[])`.
 *
 * Props:
 *   selected   {string[]}              – Currently selected tag IDs
 *   onChange   {(tags: string[])=>void} – Callback when selection changes
 */

import { FaLeaf, FaRecycle, FaWind, FaBox, FaHeart, FaSeedling } from "react-icons/fa";
import { MdWaterDrop } from "react-icons/md";

// Curated eco-feedback tags — mapped from the product's sustainability model
const TAGS = [
  { id: "eco_friendly",    label: "Eco-Friendly",      icon: FaLeaf,     colour: "emerald" },
  { id: "recyclable",      label: "Recyclable",         icon: FaRecycle,  colour: "green" },
  { id: "low_carbon",      label: "Low Carbon",         icon: FaWind,     colour: "sky" },
  { id: "minimal_packing", label: "Minimal Packaging",  icon: FaBox,      colour: "amber" },
  { id: "cruelty_free",    label: "Cruelty-Free",       icon: FaHeart,    colour: "pink" },
  { id: "biodegradable",   label: "Biodegradable",      icon: FaSeedling, colour: "lime" },
  { id: "water_efficient", label: "Water Efficient",    icon: MdWaterDrop,colour: "cyan" },
];

// Tailwind class maps — must use complete class strings for purge safety
const COLOUR_MAP = {
  emerald: {
    base:     "border-emerald-200 bg-emerald-50 text-emerald-700 hover:border-emerald-400 hover:bg-emerald-100",
    active:   "border-emerald-500 bg-emerald-100 text-emerald-800 ring-2 ring-emerald-300",
    icon:     "text-emerald-500",
  },
  green: {
    base:   "border-green-200 bg-green-50 text-green-700 hover:border-green-400 hover:bg-green-100",
    active: "border-green-500 bg-green-100 text-green-800 ring-2 ring-green-300",
    icon:   "text-green-500",
  },
  sky: {
    base:   "border-sky-200 bg-sky-50 text-sky-700 hover:border-sky-400 hover:bg-sky-100",
    active: "border-sky-500 bg-sky-100 text-sky-800 ring-2 ring-sky-300",
    icon:   "text-sky-500",
  },
  amber: {
    base:   "border-amber-200 bg-amber-50 text-amber-700 hover:border-amber-400 hover:bg-amber-100",
    active: "border-amber-500 bg-amber-100 text-amber-800 ring-2 ring-amber-300",
    icon:   "text-amber-500",
  },
  pink: {
    base:   "border-pink-200 bg-pink-50 text-pink-700 hover:border-pink-400 hover:bg-pink-100",
    active: "border-pink-500 bg-pink-100 text-pink-800 ring-2 ring-pink-300",
    icon:   "text-pink-500",
  },
  lime: {
    base:   "border-lime-200 bg-lime-50 text-lime-700 hover:border-lime-400 hover:bg-lime-100",
    active: "border-lime-500 bg-lime-100 text-lime-800 ring-2 ring-lime-300",
    icon:   "text-lime-500",
  },
  cyan: {
    base:   "border-cyan-200 bg-cyan-50 text-cyan-700 hover:border-cyan-400 hover:bg-cyan-100",
    active: "border-cyan-500 bg-cyan-100 text-cyan-800 ring-2 ring-cyan-300",
    icon:   "text-cyan-500",
  },
};

export default function SustainabilityTags({ selected = [], onChange }) {
  const toggle = (tagId) => {
    const next = selected.includes(tagId)
      ? selected.filter((t) => t !== tagId)
      : [...selected, tagId];
    onChange(next);
  };

  return (
    <div>
      {/* Section label */}
      <p className="text-sm font-semibold text-gray-700 mb-2 flex items-center gap-1.5">
        <FaLeaf className="text-emerald-500 w-3.5 h-3.5" />
        Sustainability Highlights
        <span className="text-xs text-gray-400 font-normal ml-1">(optional)</span>
      </p>

      {/* Tag grid */}
      <div
        role="group"
        aria-label="Sustainability feedback tags"
        className="flex flex-wrap gap-2"
      >
        {TAGS.map(({ id, label, icon: Icon, colour }) => {
          const isActive = selected.includes(id);
          const cls = COLOUR_MAP[colour];
          return (
            <button
              key={id}
              type="button"
              aria-pressed={isActive}
              onClick={() => toggle(id)}
              className={[
                "flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-sm font-medium",
                "transition-all duration-200 cursor-pointer select-none",
                "focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-emerald-400",
                isActive ? cls.active : cls.base,
              ].join(" ")}
            >
              <Icon className={`w-3.5 h-3.5 ${isActive ? cls.icon : ""}`} />
              {label}
              {/* Checkmark when active */}
              {isActive && (
                <span className="ml-0.5 text-xs font-bold">✓</span>
              )}
            </button>
          );
        })}
      </div>

      {/* Selection count badge */}
      {selected.length > 0 && (
        <p className="text-xs text-emerald-600 mt-2 font-medium">
          {selected.length} highlight{selected.length > 1 ? "s" : ""} selected
        </p>
      )}
    </div>
  );
}
