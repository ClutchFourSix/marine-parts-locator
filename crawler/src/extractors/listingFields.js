export function extractListingFields(rawInput) {
  return {
    title: rawInput?.title || '',
    part_number: rawInput?.part_number || '',
    brand: rawInput?.brand || '',
    category: rawInput?.category || '',
    condition: rawInput?.condition || '',
    price: rawInput?.price || '',
    currency: rawInput?.currency || '',
    location: rawInput?.location || '',
    supplier: rawInput?.supplier || '',
    image_url: rawInput?.image_url || '',
    description: rawInput?.description || ''
  };
}
