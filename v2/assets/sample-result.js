const sampleResult = {
  request_id: 'req_20260320_0001',
  status: 'completed',
  summary: {
    canonical_part_name: 'engine raw water pump assembly',
    canonical_part_number: '129670-42500',
    fit_confidence_overall: 'high',
    notes: [
      'Direct part-number match found',
      'One likely compatible alternative identified',
      'Shipping region preference favored southeastern US suppliers'
    ]
  },
  results: [
    {
      rank: 1,
      title: 'Yanmar Raw Water Pump Assembly',
      part_number: '129670-42500',
      supplier: 'Atlantic Marine Salvage',
      condition: 'Used',
      price: '$425',
      location: 'Florida, USA',
      fit_confidence: 'high',
      reason: 'Direct part-number match with matching application language and destination-friendly shipping.',
      url: 'https://example.com/item/1'
    },
    {
      rank: 2,
      title: 'Cooling Pump Replacement Option',
      part_number: 'ALT-129670-42500',
      supplier: 'Gulf Coast Diesel Supply',
      condition: 'Refurbished',
      price: '$510',
      location: 'Texas, USA',
      fit_confidence: 'medium',
      reason: 'Likely alternative based on cross-reference and model-family language, but should be verified before purchase.',
      url: 'https://example.com/item/2'
    },
    {
      rank: 3,
      title: 'Raw Water Pump Rebuild Kit',
      part_number: 'RK-129670',
      supplier: 'Marine Cooling Components',
      condition: 'New',
      price: '$139',
      location: 'Georgia, USA',
      fit_confidence: 'medium',
      reason: 'Useful fallback option if the goal is repair rather than full assembly replacement.',
      url: 'https://example.com/item/3'
    }
  ],
  alternatives: [
    'Cross-reference option ALT-129670-42500',
    'Rebuild kit option RK-129670'
  ],
  disclaimer: 'Fitment should be verified before purchase or installation.'
};
