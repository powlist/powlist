// Context Database - Entry types with categories and icons
export const contextDatabase = {
  categories: {
    pages: {
      id: 'pages',
      name: 'Pages',
      icon: 'page',
      iconColor: '#6B7280',
      description: 'Website pages and content'
    },
    product: {
      id: 'product',
      name: 'Product',
      icon: 'offer',
      iconColor: '#6B7280',
      description: 'Product information and details'
    },
    sku: {
      id: 'sku',
      name: 'SKU',
      icon: 'sku',
      iconColor: '#6B7280',
      description: 'Stock keeping units and inventory'
    },
    document: {
      id: 'document',
      name: 'Document',
      icon: 'IconFileText',
      iconColor: '#6B7280',
      description: 'Documents and files'
    },
    order: {
      id: 'order',
      name: 'Order',
      icon: 'IconShoppingCartSimple',
      iconColor: '#6B7280',
      description: 'Orders and transactions'
    },
    user: {
      id: 'user',
      name: 'User',
      icon: 'IconUser',
      iconColor: '#6B7280',
      description: 'User profiles and accounts'
    },
    campaign: {
      id: 'campaign',
      name: 'Campaign',
      icon: 'IconMegaphone',
      iconColor: '#6B7280',
      description: 'Marketing campaigns and promotions'
    },
    channel: {
      id: 'channel',
      name: 'Channel',
      icon: 'IconShareNetwork',
      iconColor: '#6B7280',
      description: 'Communication channels and platforms'
    }
  },

  // Mocked data for each category
  entries: {
    pages: [
      'Homepage Design',
      'Product Catalog Page',
      'About Us Page',
      'Contact Page',
      'Blog Landing Page',
      'FAQ Section',
      'Terms of Service',
      'Privacy Policy',
      'Landing Page Template',
      'Product Detail Page'
    ],
    product: [
      'Nike Air Max 270',
      'iPhone 15 Pro',
      'MacBook Pro M3',
      'Samsung Galaxy S24',
      'Tesla Model Y',
      'PlayStation 5',
      'Nintendo Switch',
      'AirPods Pro',
      'iPad Air',
      'Apple Watch Series 9'
    ],
    sku: [
      'SKU-001-NIKE-AM270',
      'SKU-002-APPLE-IP15P',
      'SKU-003-APPLE-MBP-M3',
      'SKU-004-SAMSUNG-GS24',
      'SKU-005-TESLA-MY',
      'SKU-006-SONY-PS5',
      'SKU-007-NINTENDO-NS',
      'SKU-008-APPLE-APP',
      'SKU-009-APPLE-IPA',
      'SKU-010-APPLE-AWS9'
    ],
    document: [
      'Marketing Strategy 2024',
      'Product Requirements Document',
      'User Research Report',
      'Brand Guidelines',
      'Technical Specifications',
      'Competitive Analysis',
      'User Journey Map',
      'Design System Documentation',
      'Project Timeline',
      'Budget Proposal'
    ],
    order: [
      'Order #12345 - Nike Air Max',
      'Order #12346 - iPhone 15 Pro',
      'Order #12347 - MacBook Pro',
      'Order #12348 - Samsung Galaxy',
      'Order #12349 - Tesla Model Y',
      'Order #12350 - PlayStation 5',
      'Order #12351 - Nintendo Switch',
      'Order #12352 - AirPods Pro',
      'Order #12353 - iPad Air',
      'Order #12354 - Apple Watch'
    ],
    user: [
      'John Smith - Premium User',
      'Sarah Johnson - Admin',
      'Mike Chen - Customer',
      'Emily Davis - VIP Member',
      'Alex Rodriguez - New User',
      'Lisa Wang - Power User',
      'David Brown - Beta Tester',
      'Maria Garcia - Support Agent',
      'Tom Wilson - Developer',
      'Anna Lee - Designer'
    ],
    campaign: [
      'Black Friday 2024',
      'Summer Sale Campaign',
      'New Product Launch',
      'Holiday Special Offer',
      'Back to School Promotion',
      'Valentine\'s Day Sale',
      'Mother\'s Day Campaign',
      'Father\'s Day Special',
      'Cyber Monday Deals',
      'End of Year Clearance'
    ],
    channel: [
      'Email Marketing',
      'Social Media - Instagram',
      'Social Media - Facebook',
      'Social Media - Twitter',
      'Google Ads',
      'YouTube Channel',
      'Newsletter',
      'Push Notifications',
      'SMS Marketing',
      'Influencer Partnerships'
    ]
  },

  // Recent items (simulated user behavior)
  recentItems: [
    'Black Friday 2024',
    'Product Requirements Document',
    'Nike Air Max 270',
    'Order #12345 - Nike Air Max',
    'John Smith - Premium User'
  ]
}

// Helper functions
export const getCategoryById = (categoryId) => {
  return contextDatabase.categories[categoryId]
}

export const getEntriesByCategory = (categoryId) => {
  return contextDatabase.entries[categoryId] || []
}

export const getAllEntries = () => {
  const allEntries = []
  Object.values(contextDatabase.entries).forEach(entries => {
    allEntries.push(...entries)
  })
  return allEntries
}

export const searchEntries = (query) => {
  const allEntries = getAllEntries()
  const lowerQuery = query.toLowerCase()
  return allEntries.filter(entry => 
    entry.toLowerCase().includes(lowerQuery)
  )
}

export const getRecentItems = () => {
  return contextDatabase.recentItems
}

export const addToRecentItems = (item) => {
  // Remove if already exists
  const filtered = contextDatabase.recentItems.filter(i => i !== item)
  // Add to beginning and keep only 5 items
  contextDatabase.recentItems = [item, ...filtered].slice(0, 5)
}

export const getContextCategory = (contextName) => {
  // Find which category contains this context
  for (const [categoryId, entries] of Object.entries(contextDatabase.entries)) {
    if (entries.includes(contextName)) {
      return getCategoryById(categoryId)
    }
  }
  // Default fallback
  return { icon: 'data', iconColor: '#6B7280' }
}
