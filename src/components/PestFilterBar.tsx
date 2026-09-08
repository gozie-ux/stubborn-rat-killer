import React from 'react';
import { useStore } from '../context/StoreContext';
import { Filter, SlidersHorizontal, ArrowUpDown, Check, X, Sparkles, Layers } from 'lucide-react';
import { PestCategory, ApplicationForm } from '../types';

export const PestFilterBar: React.FC<{ totalCount: number }> = ({ totalCount }) => {
  const {
    selectedCategory,
    setSelectedCategory,
    selectedPest,
    setSelectedPest,
    selectedForm,
    setSelectedForm,
    priceSort,
    setPriceSort,
    inStockOnly,
    setInStockOnly,
    searchQuery,
    setSearchQuery
  } = useStore();

  const categories: { label: string; value: string }[] = [
    { label: 'All Products', value: 'All' },
    { label: 'Bedbugs', value: 'Bedbugs' },
    { label: 'Cockroaches', value: 'Cockroaches' },
    { label: 'Termites', value: 'Termites & Woodborers' },
    { label: 'Rodents & Mice', value: 'Rodents & Mice' },
    { label: 'Traps & Adhesives', value: 'Traps & Adhesives' },
    { label: 'Mosquitoes & Flies', value: 'Mosquitoes & Flies' },
    { label: 'Snakes & Reptiles', value: 'Snakes & Reptiles' },
    { label: 'Sprayers & Gear', value: 'Safety Equipment & Sprayers' },
  ];

  const forms: { label: string; value: string }[] = [
    { label: 'All Types', value: 'All' },
    { label: 'Syringe Gel Bait', value: 'Syringe Gel Bait' },
    { label: 'Liquid Concentrate / Spray', value: 'Concentrated Liquid / Emulsion' },
    { label: 'Micro-Encapsulated', value: 'Micro-Encapsulated Spray' },
    { label: 'Wax Block Poison', value: 'Wax Block Poison' },
    { label: 'Thermal Fogging', value: 'Thermal Fogging Chemical' },
    { label: 'Granules & Dust', value: 'Powder / Dusting Formula' },
    { label: 'Adhesive Glue / Trap', value: 'Viscous Adhesive Glue / Sticky Trap' },
    { label: 'Lockable Bait Stations', value: 'Tamper-Proof Bait Station / Lockable Box' },
    { label: 'Glue Boards', value: 'Heavy Duty Glue Board' },
  ];

  const hasActiveFilters =
    selectedCategory !== 'All' ||
    selectedPest !== 'All' ||
    selectedForm !== 'All' ||
    inStockOnly ||
    searchQuery.trim() !== '' ||
    priceSort !== 'featured';

  const resetFilters = () => {
    setSelectedCategory('All');
    setSelectedPest('All');
    setSelectedForm('All');
    setInStockOnly(false);
    setSearchQuery('');
    setPriceSort('featured');
  };

  return (
    <div className="bg-neutral-950 border-2 border-neutral-800 rounded-3xl p-4 sm:p-5 shadow-2xl space-y-4 card-3d">
      {/* Top Filter Controls */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center text-yellow-300 shadow-[0_2px_0_#991b1b]">
            <Filter className="w-4 h-4" />
          </div>
          <span className="text-sm font-black text-white uppercase tracking-wider font-['Outfit']">
            ALL PRODUCTS <span className="text-yellow-400 font-mono">({totalCount})</span>
          </span>
          {hasActiveFilters && (
            <button
              onClick={resetFilters}
              className="text-xs text-red-400 hover:text-white font-black flex items-center gap-1 ml-2 bg-red-950/80 px-2.5 py-1 rounded-xl border-2 border-red-700/60 transition-colors"
            >
              <X className="w-3.5 h-3.5" /> CLEAR FILTERS
            </button>
          )}
        </div>

        {/* Sorting and In-Stock controls */}
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs w-full sm:w-auto">
          {/* In-Stock Filter Checkbox */}
          <label className="flex items-center gap-2 cursor-pointer bg-black px-3 py-2 rounded-2xl border-2 border-neutral-800 hover:border-yellow-500/40 text-neutral-200 transition-all">
            <input
              type="checkbox"
              checked={inStockOnly}
              onChange={(e) => setInStockOnly(e.target.checked)}
              className="rounded bg-neutral-900 border-neutral-700 text-yellow-400 focus:ring-yellow-400 w-4 h-4 accent-yellow-400"
            />
            <span className="font-black text-xs uppercase tracking-wide">In Stock</span>
          </label>

          {/* Form Filter Selector */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black px-3 py-2 rounded-2xl border-2 border-neutral-800 text-neutral-200">
            <Layers className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <select
              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
              className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer max-w-[130px] sm:max-w-none truncate"
            >
              {forms.map((f) => (
                <option key={f.value} value={f.value} className="bg-neutral-900 text-white">
                  {f.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-1.5 sm:gap-2 bg-black px-3 py-2 rounded-2xl border-2 border-neutral-800 text-neutral-200">
            <ArrowUpDown className="w-3.5 h-3.5 text-yellow-400 shrink-0" />
            <select
              value={priceSort}
              onChange={(e) => setPriceSort(e.target.value as any)}
              className="bg-transparent text-xs font-black text-white focus:outline-none cursor-pointer max-w-[120px] sm:max-w-none truncate"
            >
              <option value="featured" className="bg-neutral-900 text-white">Featured</option>
              <option value="price-low" className="bg-neutral-900 text-white">Price: Low</option>
              <option value="price-high" className="bg-neutral-900 text-white">Price: High</option>
              <option value="rating" className="bg-neutral-900 text-white">Rating</option>
              <option value="discount" className="bg-neutral-900 text-white">Discount %</option>
            </select>
          </div>
        </div>
      </div>

      {/* Category Pills (Jumia & Jiji style easy navigation with 3D buttons) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1.5 scrollbar-none pt-1 w-full max-w-full">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              onClick={() => {
                setSelectedCategory(cat.value);
                setSelectedPest('All');
              }}
              className={`px-4 py-2.5 rounded-2xl text-xs font-black whitespace-nowrap transition-all flex items-center gap-1.5 ${
                isActive
                  ? 'btn-3d-yellow text-black'
                  : 'btn-3d-black text-neutral-300 hover:text-white'
              }`}
            >
              <span>{cat.label}</span>
              {isActive && <Check className="w-3.5 h-3.5 stroke-[3]" />}
            </button>
          );
        })}
      </div>
    </div>
  );
};
