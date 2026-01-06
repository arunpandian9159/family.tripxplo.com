/**
 * Direct Database Service for Family EMI
 * Connects directly to Supabase databases for live data
 */

class DatabaseService {
  constructor() {
    // Initialize Supabase clients
    this.initializeClients();
    this.sessionId = this.generateSessionId();

    console.log('🗄️ Database Service initialized');
  }

  initializeClients() {
    // Check if CONFIG is available
    if (typeof CONFIG === 'undefined') {
      console.error('❌ CONFIG not loaded. Please include config.js before databaseService.js');
      return;
    }

    // Validate configuration
    if (
      CONFIG.CRM_ANON_KEY === 'YOUR_CRM_DATABASE_ANON_KEY_HERE' ||
      CONFIG.QUOTE_ANON_KEY === 'YOUR_QUOTE_DATABASE_ANON_KEY_HERE'
    ) {
      console.warn('⚠️ Please update the database keys in js/config.js');
    }

    // CRM Database (Family Types)
    this.crmDB = supabase.createClient(CONFIG.CRM_DB_URL, CONFIG.CRM_ANON_KEY);

    // Quote Database (Packages & EMI)
    this.quoteDB = supabase.createClient(CONFIG.QUOTE_DB_URL, CONFIG.QUOTE_ANON_KEY);

    console.log('🔗 Database clients initialized');

    // Test database connections
    this.testConnections();
  }

  // Test database connections
  async testConnections() {
    try {
      console.log('🧪 Testing database connections...');

      // Test CRM database
      const { data: crmTest, error: crmError } = await this.crmDB
        .from('family_type')
        .select('count')
        .limit(1);

      if (crmError) {
        console.error('❌ CRM database connection failed:', crmError.message);
      } else {
        console.log('✅ CRM database connection successful');
      }

      // Test Quote database
      const { data: quoteTest, error: quoteError } = await this.quoteDB
        .from('family_type_prices')
        .select('count')
        .limit(1);

      if (quoteError) {
        console.error('❌ Quote database connection failed:', quoteError.message);
      } else {
        console.log('✅ Quote database connection successful');
      }

      // Test quote_mappings table specifically
      const { data: quoteMappingsTest, error: quoteMappingsError } = await this.quoteDB
        .from('quote_mappings')
        .select('id, quote_name, destination')
        .limit(5);

      if (quoteMappingsError) {
        console.error('❌ Quote mappings table access failed:', quoteMappingsError.message);
      } else {
        console.log('✅ Quote mappings table accessible');
        console.log('📊 Sample quote mappings data:', quoteMappingsTest);
        if (quoteMappingsTest && quoteMappingsTest.length > 0) {
          console.log(`📈 Found ${quoteMappingsTest.length} quote mappings in sample`);
        } else {
          console.warn('⚠️ Quote mappings table is empty');
        }
      }
    } catch (error) {
      console.error('❌ Database connection test failed:', error);
    }
  }

  generateSessionId() {
    return `sess_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
  }

  // Get all family types from CRM database
  async getFamilyTypes() {
    try {
      console.log('📊 Fetching family types from CRM database...');

      const { data, error } = await this.crmDB.from('family_type').select('*').order('family_type');

      if (error) {
        console.error('❌ Error fetching family types:', error);
        throw error;
      }

      console.log('✅ Loaded family types:', data.length);

      // Format data for frontend
      const formattedData = data.map(ft => ({
        ...ft,
        composition: this.formatFamilyComposition(ft),
      }));

      return { success: true, data: formattedData };
    } catch (error) {
      console.error('Database error in getFamilyTypes:', error);
      return { success: false, error: error.message };
    }
  }

  // Get destinations from quote database - using actual Quote Generator structure
  async getDestinations() {
    try {
      console.log('🗺️ Fetching destinations from Quote Generator database...');

      // Method 1: Try to get destinations from family_type_prices table (only destination_category available)
      const { data: pricesData, error: pricesError } = await this.quoteDB
        .from('family_type_prices')
        .select('destination_category')
        .eq('is_public_visible', true)
        .not('destination_category', 'is', null)
        .limit(50);

      if (!pricesError && pricesData && pricesData.length > 0) {
        console.log('📊 Found destination categories in family_type_prices:', pricesData.length);

        // Get unique destination categories
        const destinationMap = new Map();
        pricesData.forEach(item => {
          if (item.destination_category && item.destination_category.trim()) {
            const category = item.destination_category;
            if (!destinationMap.has(category)) {
              destinationMap.set(category, {
                destination: category,
                category: category,
                packages_available: 0,
              });
            }
            destinationMap.get(category).packages_available++;
          }
        });

        const destinations = Array.from(destinationMap.values()).sort((a, b) =>
          a.destination.localeCompare(b.destination)
        );

        console.log(
          '✅ Loaded destination categories from family_type_prices:',
          destinations.length
        );
        return { success: true, data: destinations };
      }

      // Method 2: Try to get destinations from quotes table via quote_mappings
      console.log('🔍 Trying quote_mappings table...');
      const { data: mappingsData, error: mappingsError } = await this.quoteDB
        .from('quote_mappings')
        .select('destination')
        .not('destination', 'is', null)
        .limit(50);

      if (!mappingsError && mappingsData && mappingsData.length > 0) {
        console.log('📊 Found destinations in quote_mappings:', mappingsData.length);

        const destinations = [...new Set(mappingsData.map(item => item.destination))]
          .filter(dest => dest && dest.trim() !== '')
          .map(dest => ({
            destination: dest,
            category: 'Available',
            packages_available: mappingsData.filter(item => item.destination === dest).length,
          }))
          .sort((a, b) => a.destination.localeCompare(b.destination));

        console.log('✅ Loaded destinations from quote_mappings:', destinations.length);
        return { success: true, data: destinations };
      }

      // Method 3: Try direct quotes table
      console.log('🔍 Trying quotes table...');
      const { data: quotesData, error: quotesError } = await this.quoteDB
        .from('quotes')
        .select('destination')
        .not('destination', 'is', null)
        .limit(50);

      if (!quotesError && quotesData && quotesData.length > 0) {
        console.log('📊 Found destinations in quotes table:', quotesData.length);

        const destinations = [...new Set(quotesData.map(item => item.destination))]
          .filter(dest => dest && dest.trim() !== '')
          .map(dest => ({
            destination: dest,
            category: 'Available',
            packages_available: quotesData.filter(item => item.destination === dest).length,
          }))
          .sort((a, b) => a.destination.localeCompare(b.destination));

        console.log('✅ Loaded destinations from quotes table:', destinations.length);
        return { success: true, data: destinations };
      }

      // Fallback: Return popular Indian destinations
      console.warn('⚠️ No destinations found in database, using popular destinations');
      return {
        success: true,
        data: [
          { destination: 'Kashmir', category: 'Hill Station', packages_available: 0 },
          { destination: 'Goa', category: 'Beach', packages_available: 0 },
          { destination: 'Manali', category: 'Hill Station', packages_available: 0 },
          { destination: 'Kerala', category: 'Backwaters', packages_available: 0 },
          { destination: 'Rajasthan', category: 'Desert', packages_available: 0 },
          { destination: 'Himachal Pradesh', category: 'Hill Station', packages_available: 0 },
          { destination: 'Uttarakhand', category: 'Hill Station', packages_available: 0 },
          { destination: 'Andaman', category: 'Island', packages_available: 0 },
        ],
      };
    } catch (error) {
      console.error('Database error in getDestinations:', error);
      return { success: false, error: error.message };
    }
  }

  // Search packages based on criteria
  async searchPackages(searchParams) {
    try {
      console.log('🔍 Searching packages with params:', searchParams);

      const { destination, adults, child, children, infants } = searchParams;

      // Step 1: Detect family type with correct field mapping
      const familyType = await this.detectFamilyType(
        adults,
        child || 0,
        children || 0,
        infants || 0
      );
      console.log('🎯 Detected family type:', familyType);

      // Step 2: Search for packages using Quote Generator database structure
      console.log('🔍 Searching packages in Quote Generator database...');
      console.log('🎯 Family Type:', familyType);
      console.log('🗺️ Destination:', destination);

      // Method 1: Try family_type_prices table with family type filtering
      // Note: family_type_prices doesn't have destination column, we'll filter later
      let query = this.quoteDB.from('family_type_prices').select('*').eq('is_public_visible', true);

      // Filter by family type - family_type_prices.family_type_id expects VARCHAR(50) from CRM
      if (familyType && familyType.family_id !== 'CUSTOM' && familyType.family_id) {
        // The family_type_prices table expects family_type_id as VARCHAR(50) from CRM database
        // Use the actual family_id from CRM (like 'SD', 'SF', etc.)
        console.log('🔄 Filtering by family_type_id:', familyType.family_id);
        query = query.eq('family_type_id', familyType.family_id);
      }

      // Order by display order and limit results
      query = query
        .order('public_display_order', { ascending: true })
        .order('created_at', { ascending: false })
        .limit(20);

      console.log('🔍 Executing family_type_prices query...');
      console.log('🔍 Query details:', {
        destination: destination,
        family_type_id: familyType?.family_id,
        family_type_valid: familyType && familyType.family_id !== 'CUSTOM' && familyType.family_id,
      });

      const { data: packagesData, error } = await query;
      let packages = packagesData;

      if (packagesData && packagesData.length > 0) {
        console.log('📦 Retrieved packages from family_type_prices:', packagesData.length);
        console.log(
          '💰 Package prices:',
          packagesData.map(pkg => ({
            id: pkg.id,
            family_type: pkg.family_type_name,
            total_price: pkg.total_price,
            subtotal: pkg.subtotal,
          }))
        );
      }

      if (error) {
        console.error('❌ Error in family_type_prices query:', error);
        console.error('❌ Error details:', {
          message: error.message,
          details: error.details,
          hint: error.hint,
          code: error.code,
        });
        console.log('🔄 Trying alternative approach...');

        // Method 2: Try to get packages from quote_mappings with quotes
        console.log('🔄 Trying quote_mappings table...');
        const { data: mappingsData, error: mappingsError } = await this.quoteDB
          .from('quote_mappings')
          .select(
            `
            *,
            quotes (
              id,
              destination,
              total_cost,
              package_name,
              customer_name,
              family_type,
              no_of_persons,
              children,
              infants,
              extra_adults,
              trip_duration
            )
          `
          )
          .ilike('destination', `%${destination}%`)
          .limit(10);

        if (mappingsError) {
          console.error('❌ Error in quote_mappings query:', mappingsError);
          console.log('🔄 Trying simple quote_mappings query...');

          // Try without join if the join fails
          const { data: simpleMappings, error: simpleError } = await this.quoteDB
            .from('quote_mappings')
            .select('*')
            .ilike('destination', `%${destination}%`)
            .limit(10);

          if (!simpleError && simpleMappings && simpleMappings.length > 0) {
            console.log('✅ Found packages via simple quote_mappings:', simpleMappings.length);
            const convertedPackages = await Promise.all(
              simpleMappings.map(async mapping => {
                const convertedPackage = this.convertQuoteMappingToPackage(mapping, familyType);
                // Ensure quote_name is properly set from quote_mappings
                convertedPackage.quote_name = mapping.quote_name;
                return convertedPackage;
              })
            );

            return {
              success: true,
              matched_family_type: familyType,
              packages: convertedPackages,
              search_params: searchParams,
            };
          }

          // Return sample packages as fallback
          return this.createSamplePackages(destination, familyType, searchParams);
        }

        if (mappingsData && mappingsData.length > 0) {
          console.log('✅ Found packages via quote_mappings:', mappingsData.length);

          // Convert quote mappings to package format
          const convertedPackages = await Promise.all(
            mappingsData.map(async mapping => {
              const convertedPackage = this.convertQuoteMappingToPackage(mapping, familyType);
              // Ensure quote_name is properly set from quote_mappings
              convertedPackage.quote_name = mapping.quote_name;
              return convertedPackage;
            })
          );

          return {
            success: true,
            matched_family_type: familyType,
            packages: convertedPackages,
            search_params: searchParams,
          };
        }

        // Method 3: Direct quotes table search
        const { data: quotesData, error: quotesError } = await this.quoteDB
          .from('quotes')
          .select('*')
          .ilike('destination', `%${destination}%`)
          .limit(10);

        if (!quotesError && quotesData && quotesData.length > 0) {
          console.log('✅ Found packages via quotes table:', quotesData.length);

          const convertedPackages = quotesData.map(quote =>
            this.convertQuoteToPackage(quote, familyType)
          );

          return {
            success: true,
            matched_family_type: familyType,
            packages: convertedPackages,
            search_params: searchParams,
          };
        }

        // Final fallback
        console.warn('⚠️ No packages found in any table, creating sample packages');
        return this.createSamplePackages(destination, familyType, searchParams);
      }

      console.log('📊 Raw packages from family_type_prices:', packages?.length || 0);
      if (packages && packages.length > 0) {
        console.log('📋 Sample package structure:', packages[0]);
        console.log('💰 Available price fields in package:', {
          total_price: packages[0].total_price,
          total_cost: packages[0].total_cost,
          price: packages[0].price,
          cost: packages[0].cost,
          package_cost: packages[0].package_cost,
          family_type_price: packages[0].family_type_price,
          base_price: packages[0].base_price,
          final_price: packages[0].final_price,
          all_keys: Object.keys(packages[0]),
        });
      }

      // Filter packages by destination if we have packages
      if (packages && packages.length > 0 && destination) {
        // For family_type_prices, we need to get destination from related quote data
        // For now, we'll try to match based on package metadata or use all packages
        console.log('🔍 Filtering packages by destination...');

        // Try to get quote data for each package to filter by destination
        const packagesWithQuotes = [];
        for (const pkg of packages) {
          if (pkg.quote_id) {
            try {
              const { data: quoteData, error: quoteError } = await this.quoteDB
                .from('quotes')
                .select(
                  'destination, package_name, total_cost, trip_duration, family_type, customer_name'
                )
                .eq('id', pkg.quote_id)
                .single();

              if (!quoteError && quoteData && quoteData.destination) {
                if (quoteData.destination.toLowerCase().includes(destination.toLowerCase())) {
                  packagesWithQuotes.push({
                    ...pkg,
                    destination: quoteData.destination,
                    package_name: quoteData.package_name,
                    quote_total_cost: quoteData.total_cost,
                    package_duration_days: quoteData.trip_duration,
                    quote_family_type: quoteData.family_type,
                    quote_customer_name: quoteData.customer_name,
                  });
                }
              }
            } catch (error) {
              console.warn('⚠️ Could not fetch quote data for package:', pkg.id);
            }
          }
        }

        if (packagesWithQuotes.length > 0) {
          packages = packagesWithQuotes;
          console.log('✅ Filtered packages by destination:', packages.length);
        } else {
          console.log('⚠️ No packages matched destination, using all packages');
        }
      }

      if (!packages || packages.length === 0) {
        console.log('🔄 No exact family type matches, trying broader search...');

        // Try without family type filter - just visibility
        let broadQuery = this.quoteDB
          .from('family_type_prices')
          .select('*')
          .eq('is_public_visible', true);

        broadQuery = broadQuery.order('public_display_order', { ascending: true }).limit(10);

        console.log('🔍 Executing broader family_type_prices query...');
        const { data: broadPackages, error: broadError } = await broadQuery;

        if (!broadError && broadPackages && broadPackages.length > 0) {
          console.log('✅ Found packages with broader search:', broadPackages.length);
          packages = broadPackages;
        } else if (broadError) {
          console.error('❌ Error in broader search:', broadError);
        }

        if (!broadPackages || broadPackages.length === 0) {
          console.warn('⚠️ No packages found even with broad search, creating sample packages');
          return this.createSamplePackages(destination, familyType, searchParams);
        }
      }

      // Step 3: Enhance packages with quote names from quote_mappings table
      if (packages && packages.length > 0) {
        try {
          // Get all unique destinations from packages
          const destinations = [
            ...new Set(packages.map(pkg => pkg.destination).filter(dest => dest)),
          ];

          if (destinations.length > 0) {
            console.log('🔍 Enhancing packages with quote names for destinations:', destinations);
            const quoteNamesMap = await this.getQuoteNamesForDestinations(destinations);

            // Enhance each package with quote_name if available
            packages = packages.map(pkg => {
              if (
                pkg.destination &&
                quoteNamesMap[pkg.destination] &&
                quoteNamesMap[pkg.destination].length > 0
              ) {
                // Use the first available quote name for this destination
                const quoteName = quoteNamesMap[pkg.destination][0].quote_name;
                console.log(
                  `✅ Enhanced package for ${pkg.destination} with quote name: ${quoteName}`
                );
                return {
                  ...pkg,
                  quote_name: quoteName,
                  quote_id: quoteNamesMap[pkg.destination][0].quote_id,
                };
              }
              return pkg;
            });
          }
        } catch (error) {
          console.warn('⚠️ Could not enhance packages with quote names:', error);
        }
      }

      // Step 4: Get EMI plans separately if packages found
      let packagesWithEMI = packages;
      if (packages && packages.length > 0) {
        try {
          // Try to get EMI plans separately
          const { data: emiPlans, error: emiError } = await this.quoteDB
            .from('family_type_emi_plans')
            .select('*');

          if (!emiError && emiPlans) {
            console.log('📊 Available EMI plans from database:', emiPlans.length);
            console.log(
              '📊 EMI plans family_price_ids:',
              emiPlans.map(emi => emi.family_price_id)
            );
            console.log(
              '📦 Package IDs to match:',
              packages.map(pkg => pkg.id)
            );
            // Attach EMI plans to packages - filter by family_price_id (correct foreign key)
            packagesWithEMI = packages
              .map(pkg => {
                // Try to match EMI plans by family_price_id (the correct relationship)
                let packageEmiPlans = emiPlans.filter(emi => emi.family_price_id === pkg.id);

                console.log(`🔍 Package ${pkg.id} EMI plans found:`, packageEmiPlans.length);

                // Get the actual total price for this package - prioritize family_type_prices fields
                const actualTotalPrice =
                  pkg.total_price || pkg.subtotal || pkg.total_cost || pkg.price || pkg.cost;

                if (!actualTotalPrice) {
                  console.error(`❌ No valid price found for package ${pkg.id}:`, {
                    total_price: pkg.total_price,
                    subtotal: pkg.subtotal,
                    total_cost: pkg.total_cost,
                    price: pkg.price,
                    cost: pkg.cost,
                    package_data: pkg,
                  });
                  // Skip this package if no price is available
                  return null;
                }

                // If no specific EMI plans found, use first 3 as fallback
                if (packageEmiPlans.length === 0) {
                  console.log(
                    `⚠️ No specific EMI plans found for package ${pkg.id}, using fallback plans`
                  );
                  packageEmiPlans = emiPlans.slice(0, 3);
                }

                console.log(
                  `💰 Using actual price ${actualTotalPrice} for package ${pkg.id} EMI calculation`
                );

                // ALWAYS recalculate EMI amounts based on actual package price - SIMPLE DIVISION (NO INTEREST/FEES)
                packageEmiPlans = packageEmiPlans.map(emi => {
                  const months = emi.emi_months || 6;

                  // Simple division: monthly_amount = total_price / months
                  // No interest rates, no processing fees - just split the DB total price
                  const recalculatedMonthlyAmount = Math.round(actualTotalPrice / months);
                  const recalculatedTotalAmount = actualTotalPrice; // Keep same as DB total price
                  const recalculatedProcessingFee = 0; // No processing fee for prepaid EMI
                  const recalculatedTotalInterest = 0; // No interest for simple division

                  console.log(`🔄 Recalculated EMI for ${months} months (Simple Division):`, {
                    monthly_amount: recalculatedMonthlyAmount,
                    total_amount: recalculatedTotalAmount,
                    package_price: actualTotalPrice,
                    calculation: `${actualTotalPrice} ÷ ${months} = ${recalculatedMonthlyAmount}`,
                  });

                  return {
                    ...emi,
                    monthly_amount: recalculatedMonthlyAmount,
                    total_amount: recalculatedTotalAmount,
                    processing_fee: recalculatedProcessingFee,
                    total_interest: recalculatedTotalInterest,
                    effective_annual_rate: 0, // No interest rate for simple division
                  };
                });

                console.log(`📋 EMI plans for package ${pkg.id}:`, packageEmiPlans);

                return {
                  ...pkg,
                  family_type_emi_plans: packageEmiPlans,
                };
              })
              .filter(pkg => pkg !== null); // Filter out packages with no valid price
          }
        } catch (emiError) {
          console.warn('⚠️ Could not load EMI plans, using packages without EMI:', emiError);
        }
      }

      console.log('✅ Found packages:', packagesWithEMI.length);

      // Format packages for frontend with enhanced data
      const formattedPackages = await Promise.all(
        packagesWithEMI.map(async pkg => await this.formatPackageForFrontendEnhanced(pkg))
      );

      return {
        success: true,
        matched_family_type: familyType,
        packages: formattedPackages,
        search_params: searchParams,
      };
    } catch (error) {
      console.error('Database error in searchPackages:', error);
      return { success: false, error: error.message };
    }
  }

  // Get package details
  async getPackageDetails(packageId) {
    try {
      console.log('📦 Fetching package details for ID:', packageId);

      // First, try to get from family_type_prices table
      let packageData = null;
      let dataSource = 'unknown';

      try {
        const { data: priceData, error: priceError } = await this.quoteDB
          .from('family_type_prices')
          .select('*')
          .eq('id', packageId)
          .single();

        if (!priceError && priceData) {
          packageData = priceData;
          dataSource = 'family_type_prices';
          console.log('✅ Found package in family_type_prices');
        }
      } catch (priceError) {
        console.log('📝 Package not found in family_type_prices, trying quote_mappings...');
      }

      // If not found in family_type_prices, try quote_mappings
      if (!packageData) {
        try {
          const { data: mappingData, error: mappingError } = await this.quoteDB
            .from('quote_mappings')
            .select('*')
            .eq('id', packageId)
            .single();

          if (!mappingError && mappingData) {
            packageData = mappingData;
            dataSource = 'quote_mappings';
            console.log('✅ Found package in quote_mappings');
          }
        } catch (mappingError) {
          console.log('📝 Package not found in quote_mappings, trying quotes...');
        }
      }

      // If still not found, try quotes table
      if (!packageData) {
        try {
          const { data: quoteData, error: quoteError } = await this.quoteDB
            .from('quotes')
            .select('*')
            .eq('id', packageId)
            .single();

          if (!quoteError && quoteData) {
            packageData = quoteData;
            dataSource = 'quotes';
            console.log('✅ Found package in quotes table');
          }
        } catch (quoteError) {
          console.error('❌ Package not found in any table');
        }
      }

      if (!packageData) {
        throw new Error('Package not found in any table');
      }

      console.log('✅ Loaded package details from:', dataSource);

      // Try to get EMI plans separately
      let emiPlans = [];
      try {
        // First, try to get all EMI plans and filter later if needed
        const { data: emiData, error: emiError } = await this.quoteDB
          .from('family_type_emi_plans')
          .select('*');

        if (!emiError && emiData) {
          // Filter EMI plans by family_price_id (correct foreign key relationship)
          const filteredEmiPlans = emiData.filter(emi => emi.family_price_id === packageData.id);

          console.log(
            `🔍 Package ${packageData.id} specific EMI plans found:`,
            filteredEmiPlans.length
          );

          // Get the actual total price for this package - prioritize family_type_prices fields
          const actualTotalPrice =
            packageData.total_price ||
            packageData.subtotal ||
            packageData.total_cost ||
            packageData.price ||
            packageData.cost;

          if (!actualTotalPrice) {
            console.error(`❌ No valid price found for package ${packageData.id}:`, {
              total_price: packageData.total_price,
              subtotal: packageData.subtotal,
              total_cost: packageData.total_cost,
              price: packageData.price,
              cost: packageData.cost,
              package_data: packageData,
            });
            // Use empty EMI plans if no price is available
            emiPlans = [];
            console.warn(
              `⚠️ Skipping EMI calculation for package ${packageData.id} due to missing price`
            );
          } else {
            // Use filtered plans if available, otherwise use first 3 as fallback
            if (filteredEmiPlans.length > 0) {
              emiPlans = filteredEmiPlans;
            } else {
              console.log(
                `⚠️ No specific EMI plans found for package ${packageData.id}, using fallback plans`
              );
              emiPlans = emiData.slice(0, 3);
            }

            console.log(
              `💰 Using actual price ${actualTotalPrice} for package ${packageData.id} EMI calculation`
            );

            // ALWAYS recalculate EMI amounts based on actual package price - SIMPLE DIVISION (NO INTEREST/FEES)
            emiPlans = emiPlans.map(emi => {
              const months = emi.emi_months || 6;

              // Simple division: monthly_amount = total_price / months
              // No interest rates, no processing fees - just split the DB total price
              const recalculatedMonthlyAmount = Math.round(actualTotalPrice / months);
              const recalculatedTotalAmount = actualTotalPrice; // Keep same as DB total price
              const recalculatedProcessingFee = 0; // No processing fee for prepaid EMI
              const recalculatedTotalInterest = 0; // No interest for simple division

              console.log(`🔄 Recalculated EMI for ${months} months (Simple Division):`, {
                monthly_amount: recalculatedMonthlyAmount,
                total_amount: recalculatedTotalAmount,
                package_price: actualTotalPrice,
                calculation: `${actualTotalPrice} ÷ ${months} = ${recalculatedMonthlyAmount}`,
              });

              return {
                ...emi,
                monthly_amount: recalculatedMonthlyAmount,
                total_amount: recalculatedTotalAmount,
                processing_fee: recalculatedProcessingFee,
                total_interest: recalculatedTotalInterest,
                effective_annual_rate: 0, // No interest rate for simple division
              };
            });
          }

          console.log('✅ Loaded EMI plans for package:', emiPlans.length);
          console.log('📊 EMI plans data:', emiPlans);
        } else if (emiError) {
          console.warn('⚠️ Could not load EMI plans:', emiError.message);
        }
      } catch (emiError) {
        console.warn('⚠️ EMI plans query failed:', emiError.message);
      }

      // Combine package data with EMI plans and add source info
      const packageWithEMI = {
        ...packageData,
        family_type_emi_plans: emiPlans,
        data_source: dataSource,
      };

      const formattedPackage = await this.formatPackageDetailsForFrontend(packageWithEMI);

      return { success: true, package: formattedPackage };
    } catch (error) {
      console.error('Database error in getPackageDetails:', error);
      return { success: false, error: error.message };
    }
  }

  // Submit quote request
  async submitQuoteRequest(quoteData) {
    try {
      console.log('📝 Submitting quote request:', quoteData);

      // Insert into public_family_quotes table
      const { data, error } = await this.quoteDB
        .from('public_family_quotes')
        .insert({
          customer_email: quoteData.customer_email,
          customer_phone: quoteData.customer_phone,
          customer_name: quoteData.customer_name,
          destination: quoteData.destination,
          travel_date: quoteData.travel_date,
          no_of_adults: quoteData.adults,
          no_of_child: quoteData.child || 0,
          no_of_children: quoteData.children || 0,
          no_of_infants: quoteData.infants || 0,
          matched_price_id: quoteData.selected_package_id,
          selected_emi_plan_id: quoteData.selected_emi_plan_id,
          utm_source: this.getUtmSource(),
          session_id: this.sessionId,
          lead_source: 'family_website',
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (error) {
        console.error('❌ Error submitting quote request:', error);
        throw error;
      }

      console.log('✅ Quote request submitted successfully:', data.id);

      return {
        success: true,
        quote_id: data.id,
        message: 'Quote request submitted successfully! Our team will contact you soon.',
      };
    } catch (error) {
      console.error('Database error in submitQuoteRequest:', error);
      return { success: false, error: error.message };
    }
  }

  // Helper: Detect family type based on traveler counts
  async detectFamilyType(adults, child, children, infants) {
    try {
      const familyTypesResponse = await this.getFamilyTypes();

      if (!familyTypesResponse.success) {
        return this.getDefaultFamilyType(adults, child, children, infants);
      }

      const familyTypes = familyTypesResponse.data;

      // Find exact match first - using correct field mapping
      let match = familyTypes.find(
        ft =>
          ft.no_of_adults === adults &&
          ft.no_of_child === child &&
          ft.no_of_children === children &&
          ft.no_of_infants === infants
      );

      // If no exact match, find closest match
      if (!match) {
        match = familyTypes.find(
          ft =>
            ft.no_of_adults === adults &&
            ft.no_of_child >= child &&
            ft.no_of_children >= children &&
            ft.no_of_infants >= infants
        );
      }

      // Default to first family type if no match
      if (!match) {
        match = familyTypes[0] || this.getDefaultFamilyType(adults, child, children, infants);
      }

      // Ensure the match has a valid family_id
      if (match) {
        // Use family_id if available, otherwise use id
        if (!match.family_id && match.id) {
          match.family_id = match.id;
        }

        // Normalize field names for consistency between databases
        match.no_of_children = match.no_of_children || match.no_of_child || 0;
        match.no_of_infants = match.no_of_infants || 0;
        match.no_of_adults = match.no_of_adults || 2; // Default to 2 adults

        // Ensure family_id is a string (not UUID object)
        if (typeof match.family_id === 'object') {
          match.family_id = match.family_id.toString();
        }
      }

      console.log('🎯 Family type detection result:', {
        input: { adults, children, infants },
        matched: match
          ? {
              family_id: match.family_id,
              family_type: match.family_type,
              composition: `${match.no_of_adults}A ${match.no_of_children}C ${match.no_of_infants}I`,
              database_fields: {
                no_of_adults: match.no_of_adults,
                no_of_children: match.no_of_children,
                no_of_child: match.no_of_child,
                no_of_infants: match.no_of_infants,
              },
            }
          : null,
      });

      return match;
    } catch (error) {
      console.error('Error detecting family type:', error);
      return this.getDefaultFamilyType(adults, children, infants);
    }
  }

  // Helper: Get default family type
  getDefaultFamilyType(adults, child, children, infants) {
    return {
      family_id: 'CUSTOM',
      family_type: 'Custom Family',
      no_of_adults: adults,
      no_of_child: child,
      no_of_children: children,
      no_of_infants: infants,
      composition: this.formatFamilyComposition({
        no_of_adults: adults,
        no_of_child: child,
        no_of_children: children,
        no_of_infants: infants,
      }),
    };
  }

  // Helper: Format family composition
  formatFamilyComposition(familyType) {
    let composition = `${familyType.no_of_adults} Adult${familyType.no_of_adults > 1 ? 's' : ''}`;

    if (familyType.no_of_child > 0) {
      composition += ` + ${familyType.no_of_child} Child (2-5 yrs)`;
    }

    if (familyType.no_of_children > 0) {
      composition += ` + ${familyType.no_of_children} Children (6-11 yrs)`;
    }

    if (familyType.no_of_infants > 0) {
      composition += ` + ${familyType.no_of_infants} Infant${familyType.no_of_infants > 1 ? 's' : ''}`;
    }

    return composition;
  }

  // Helper: Get quote names from quote_mappings table for specific destinations
  async getQuoteNamesForDestinations(destinations) {
    try {
      console.log('🔍 Fetching quote names for destinations:', destinations);

      if (!destinations || destinations.length === 0) {
        return {};
      }

      // Query quote_mappings table for matching destinations
      const { data: quoteMappings, error } = await this.quoteDB
        .from('quote_mappings')
        .select('destination, quote_name, quote_id')
        .in('destination', destinations)
        .not('quote_name', 'is', null);

      if (error) {
        console.error('❌ Error fetching quote names:', error);
        return {};
      }

      if (!quoteMappings || quoteMappings.length === 0) {
        console.log('⚠️ No quote names found for destinations');
        return {};
      }

      // Create a mapping of destination to quote names
      const destinationQuoteMap = {};
      quoteMappings.forEach(mapping => {
        const destination = mapping.destination;
        if (!destinationQuoteMap[destination]) {
          destinationQuoteMap[destination] = [];
        }
        destinationQuoteMap[destination].push({
          quote_name: mapping.quote_name,
          quote_id: mapping.quote_id,
        });
      });

      console.log('✅ Found quote names for destinations:', Object.keys(destinationQuoteMap));
      return destinationQuoteMap;
    } catch (error) {
      console.error('❌ Error in getQuoteNamesForDestinations:', error);
      return {};
    }
  }

  // Helper: Enhanced format package for frontend with complete data
  async formatPackageForFrontendEnhanced(packageData) {
    // First get the basic formatted package
    const basePackage = this.formatPackageForFrontend(packageData);

    // Try to get quote_name from quote_mappings if not already present
    if (!packageData.quote_name && packageData.destination) {
      try {
        const quoteNamesMap = await this.getQuoteNamesForDestinations([packageData.destination]);
        const destinationQuotes = quoteNamesMap[packageData.destination];
        if (destinationQuotes && destinationQuotes.length > 0) {
          // Use the first available quote name for this destination
          packageData.quote_name = destinationQuotes[0].quote_name;
          packageData.quote_id = destinationQuotes[0].quote_id;
          console.log(
            '✅ Enhanced package with quote name from quote_mappings:',
            packageData.quote_name
          );
        }
      } catch (error) {
        console.warn('⚠️ Could not fetch quote name from quote_mappings:', error);
      }
    }

    // If we have quote_id, try to get additional hotel and detailed information
    if (packageData.quote_id) {
      console.log('🏨 Attempting to fetch hotel data for quote_id:', packageData.quote_id);
      try {
        // Get hotel information directly from hotel_rows table
        const { data: hotelRowsData, error: hotelError } = await this.quoteDB
          .from('hotel_rows')
          .select('hotel_name, stay_nights, meal_plan, room_type, price')
          .eq('quote_id', packageData.quote_id);

        console.log('🏨 Hotel query result:', {
          error: hotelError,
          data_count: hotelRowsData?.length || 0,
          sample_data: hotelRowsData?.[0],
        });

        if (!hotelError && hotelRowsData && hotelRowsData.length > 0) {
          // Extract hotel information - Handle multiple hotels from hotel_rows
          const hotels = hotelRowsData;
          const destination = packageData.destination || 'Destination';

          // Calculate total nights and create hotel list
          let totalNights = 0;
          const hotelInclusions = [];
          const hotelNames = [];

          hotels.forEach(hotel => {
            const nights = hotel.stay_nights || 1;
            totalNights += nights;

            const hotelName = hotel.hotel_name || 'Hotel Included';
            hotelNames.push(hotelName);

            // Determine meal plan based on hotel data or default to breakfast
            let mealPlan = 'Breakfast included';
            if (hotel.meal_plan) {
              mealPlan = hotel.meal_plan;
            } else {
              // Default meal plan based on price range
              const price = hotel.price || 0;
              if (price > 8000) {
                mealPlan = 'Breakfast & Dinner included';
              } else if (price > 5000) {
                mealPlan = 'Breakfast included';
              } else {
                mealPlan = 'Breakfast included';
              }
            }

            // Add hotel inclusion in the required format
            hotelInclusions.push(`${nights}N - ${hotelName} (${mealPlan})`);
          });

          // Update package with multiple hotel information
          // Prioritize quote_name from quote_mappings table, apply transformation if needed, fallback to generated title
          const transformedName = this.transformPackageName(packageData.quote_name);
          basePackage.title =
            transformedName ||
            packageData.quote_name ||
            `${destination}: ${totalNights}N ${packageData.quote_family_type || 'Family Package'}`;
          basePackage.hotel_name = hotelNames.join(', '); // Combined hotel names
          basePackage.hotel_category = 'Standard'; // Default category
          basePackage.nights = totalNights;
          basePackage.hotels_list = hotels.map(hotel => ({
            hotel_name: hotel.hotel_name,
            nights: hotel.stay_nights,
            meal_plan: hotel.meal_plan || 'Breakfast included',
            room_type: hotel.room_type || 'Standard Room',
            price: hotel.price,
          })); // Store all hotel details in correct format
          basePackage.duration_days = totalNights; // Update duration to match total nights

          // Update inclusions with all hotel information
          basePackage.inclusions = [
            ...hotelInclusions, // All hotel inclusions
            'Airport transfers',
            'All sightseeing as per itinerary',
            'All applicable taxes',
          ];

          console.log('✅ Enhanced package with hotel data:', {
            hotels_count: hotels.length,
            total_nights: totalNights,
            hotel_names: hotelNames,
          });
        } else {
          console.warn('⚠️ No hotel data found for quote_id:', packageData.quote_id);
        }
      } catch (error) {
        console.warn('⚠️ Could not fetch enhanced package data:', error);
      }
    } else {
      console.log('ℹ️ No quote_id found in package data, using basic hotel information');

      // Fallback: Create basic hotel information if no quote_id
      if (packageData.destination) {
        const destination = packageData.destination;
        const duration = packageData.package_duration_days || packageData.duration_days || 5;

        // Create a basic hotel entry based on destination and price
        const hotelName = this.generateHotelName(destination);
        const mealPlan =
          packageData.total_price > 50000 ? 'Breakfast & Dinner included' : 'Breakfast included';

        basePackage.hotels_list = [
          {
            hotel_name: hotelName,
            nights: duration,
            meal_plan: mealPlan,
            room_type: 'Standard Room',
            price: Math.round((packageData.total_price || 45000) * 0.6), // Assume 60% of total price is hotel cost
          },
        ];

        basePackage.inclusions = [
          `${duration}N - ${hotelName} (${mealPlan})`,
          'Airport transfers',
          'All sightseeing as per itinerary',
          'All applicable taxes',
        ];

        console.log('✅ Created fallback hotel information:', {
          hotel_name: hotelName,
          nights: duration,
          meal_plan: mealPlan,
        });
      }
    }

    return basePackage;
  }

  // Helper: Format package for frontend - Enhanced for Quote Generator data
  formatPackageForFrontend(packageData) {
    // Ensure we have a valid total price - check all possible price fields
    const totalPrice =
      packageData.total_price ||
      packageData.total_cost ||
      packageData.price ||
      packageData.cost ||
      packageData.package_cost ||
      packageData.family_type_price ||
      packageData.base_price ||
      packageData.final_price ||
      45000; // fallback only if no price found

    console.log('💰 Price extraction for package:', {
      id: packageData.id,
      total_price: packageData.total_price,
      total_cost: packageData.total_cost,
      price: packageData.price,
      cost: packageData.cost,
      package_cost: packageData.package_cost,
      family_type_price: packageData.family_type_price,
      base_price: packageData.base_price,
      final_price: packageData.final_price,
      extracted_price: totalPrice,
    });

    // Extract real package information from Quote Generator database
    // Prioritize quote_name from quote_mappings table, apply transformation if needed
    const transformedName = this.transformPackageName(packageData.quote_name);
    let packageTitle =
      transformedName ||
      packageData.quote_name ||
      packageData.package_title ||
      packageData.title ||
      packageData.package_name;
    let destination = packageData.destination;
    let duration = packageData.package_duration_days || packageData.duration_days || 5;

    // If we have quote data, use it to enrich the package
    if (packageData.quote_id && !packageTitle) {
      // This will be enriched by the calling function
      packageTitle = packageData.quote_name || packageData.package_name;
    }

    // If still no title, generate one from available data
    if (!packageTitle) {
      if (destination) {
        const packageType = this.getPackageTypeByPrice(totalPrice);
        packageTitle = `${destination} ${packageType} Package (${duration}D/${duration + 1}N)`;
      } else {
        // Try to extract from family type name or other fields
        const familyTypeName = packageData.family_type_name || packageData.family_type;
        if (familyTypeName && familyTypeName !== 'Family Package') {
          packageTitle = `${familyTypeName} - ${duration}N Package`;
        } else {
          packageTitle = `Travel Package (${duration}D/${duration + 1}N)`;
        }
      }
    }

    // Store the quote_name for use in the frontend
    const quoteName = packageData.quote_name || packageTitle;

    // Create EMI options (use existing or generate)
    let emiOptions = [];

    if (packageData.family_type_emi_plans && packageData.family_type_emi_plans.length > 0) {
      // Use existing EMI plans from database and ALWAYS recalculate based on actual package price
      emiOptions = packageData.family_type_emi_plans.map(emi => {
        const months = emi.emi_months || 6;

        // ALWAYS recalculate EMI amounts based on actual package price - SIMPLE DIVISION (NO INTEREST/FEES)
        const recalculatedMonthlyAmount = Math.round(totalPrice / months);
        const recalculatedTotalAmount = totalPrice; // Keep same as package total price
        const recalculatedProcessingFee = 0; // No processing fee for prepaid EMI

        console.log(`📊 Recalculated EMI plan for ${months} months:`, {
          original_monthly_amount: emi.monthly_amount,
          recalculated_monthly_amount: recalculatedMonthlyAmount,
          original_total_amount: emi.total_amount,
          recalculated_total_amount: recalculatedTotalAmount,
          package_price: totalPrice,
          calculation: `${totalPrice} ÷ ${months} = ${recalculatedMonthlyAmount}`,
        });

        return {
          id: emi.id || `emi-${Math.random().toString(36).substring(2, 11)}`,
          months: months,
          monthly_amount: recalculatedMonthlyAmount,
          total_amount: recalculatedTotalAmount,
          processing_fee: recalculatedProcessingFee,
          label: emi.marketing_label || `${months} Months`,
          is_featured: emi.is_featured || false,
        };
      });
    } else {
      // Generate default EMI options
      emiOptions = this.generateEMIOptions(totalPrice, packageData.id);
    }

    // Extract inclusions based on package data
    let inclusions = packageData.inclusions || [];
    if (inclusions.length === 0) {
      inclusions = this.generateInclusionsFromPackageData(packageData);
    }

    // Determine package category and offer badge
    const category =
      packageData.destination_category || this.getCategoryByDestination(packageData.destination);
    const offerBadge = this.getOfferBadge(totalPrice);

    return {
      id: packageData.id || `pkg-${Math.random().toString(36).substring(2, 11)}`,
      title: packageTitle,
      quote_name: quoteName, // Include quote_name for frontend use
      destination: packageData.destination || 'Unknown',
      duration_days: packageData.package_duration_days || packageData.duration_days || 5,
      total_price: totalPrice,
      family_type: packageData.family_type_name || packageData.family_type || 'Family Package',
      family_type_id: packageData.family_type_id,
      emi_options: emiOptions,
      inclusions: inclusions,
      images: [this.getDestinationImage(packageData.destination)], // Travel backdrop based on destination
      offer_badge: offerBadge,
      category: category,
      season: packageData.season_category || 'All Season',
      validity: this.getPackageValidity(packageData),
      is_public_visible: packageData.is_public_visible !== false,
      created_from: packageData.created_from || 'family_type_prices',
      // Additional properties that may be set by enhanced formatting
      hotel_name: packageData.hotel_name || this.generateHotelName(packageData.destination),
      hotel_category: packageData.hotel_category || 'Standard',
      nights: packageData.nights || duration,
      hotels_list: packageData.hotels_list || [],
    };
  }

  // Helper: Generate inclusions from package data
  generateInclusionsFromPackageData(packageData) {
    const inclusions = [];

    // Basic inclusions
    inclusions.push('Accommodation');

    // Check for transportation
    if (packageData.vehicle_mappings || packageData.transport_cost > 0) {
      inclusions.push('Transportation');
    } else {
      inclusions.push('Local Transfers');
    }

    // Check for meals
    if (
      packageData.meal_cost_per_person > 0 ||
      packageData.additional_costs?.meal_cost_per_person > 0
    ) {
      inclusions.push('Meals');
    } else {
      inclusions.push('Breakfast');
    }

    // Standard inclusions
    inclusions.push('Sightseeing');

    // Additional based on price range
    if (packageData.total_price > 50000) {
      inclusions.push('Professional Guide');
    }

    if (packageData.total_price > 80000) {
      inclusions.push('Premium Hotels');
    }

    return inclusions;
  }

  // Helper: Get category by destination
  getCategoryByDestination(destination) {
    if (!destination) return 'General';

    const dest = destination.toLowerCase();
    if (dest.includes('kashmir') || dest.includes('manali') || dest.includes('shimla'))
      return 'Hill Station';
    if (dest.includes('goa') || dest.includes('andaman') || dest.includes('kerala')) return 'Beach';
    if (dest.includes('rajasthan') || dest.includes('jaipur') || dest.includes('udaipur'))
      return 'Heritage';
    if (dest.includes('ladakh') || dest.includes('spiti') || dest.includes('adventure'))
      return 'Adventure';

    return 'Popular';
  }

  // Helper: Get package validity
  getPackageValidity(packageData) {
    if (packageData.travel_date) {
      return `Valid for travel: ${new Date(packageData.travel_date).toLocaleDateString()}`;
    }
    if (packageData.created_at) {
      const validUntil = new Date(packageData.created_at);
      validUntil.setMonth(validUntil.getMonth() + 6); // Valid for 6 months
      return `Valid until: ${validUntil.toLocaleDateString()}`;
    }
    return 'Valid for booking';
  }

  // Helper: Generate hotel name based on destination
  generateHotelName(destination) {
    if (!destination) return 'Hotel Included';

    const dest = destination.toLowerCase();

    // Generate destination-specific hotel names
    if (dest.includes('andaman')) {
      return 'Grand Paradise - Port Blair';
    }
    if (dest.includes('goa')) {
      return 'Goa Beach Resort';
    }
    if (dest.includes('kashmir')) {
      return 'Kashmir Valley Hotel';
    }
    if (dest.includes('manali')) {
      return 'Manali Grand';
    }
    if (dest.includes('shimla')) {
      return 'Shimla Grand';
    }
    if (dest.includes('kerala')) {
      return 'Kerala Backwater Resort';
    }
    if (dest.includes('rajasthan')) {
      return 'Rajasthan Heritage Hotel';
    }

    // Default hotel name
    return `${destination} Grand Hotel`;
  }

  // Helper: Get destination-specific image
  getDestinationImage(destination) {
    if (!destination) return 'img/rectangle-14.png';

    const dest = destination.toLowerCase();

    // Map destinations to available images
    if (
      dest.includes('kashmir') ||
      dest.includes('manali') ||
      dest.includes('shimla') ||
      dest.includes('hill')
    ) {
      return 'img/rectangle-14.png'; // Mountain/Hill station image
    }
    if (dest.includes('goa') || dest.includes('beach')) {
      return 'img/rectangle-14-2.png'; // Beach image
    }
    if (dest.includes('andaman') || dest.includes('nicobar')) {
      return 'img/rectangle-14-3.png'; // Tropical island image
    }
    if (
      dest.includes('rajasthan') ||
      dest.includes('heritage') ||
      dest.includes('palace') ||
      dest.includes('jaipur') ||
      dest.includes('udaipur')
    ) {
      return 'img/rectangle-14-4.png'; // Heritage image
    }
    if (dest.includes('kerala') || dest.includes('backwater')) {
      return 'img/rectangle-14-5.png'; // Backwater image
    }

    // Default travel image
    return 'img/rectangle-14.png';
  }

  // Helper: Format package details for frontend
  async formatPackageDetailsForFrontend(packageData) {
    // First, try to get additional data from quotes table if we have quote_id
    let enrichedPackageData = { ...packageData };

    if (packageData.quote_id && !packageData.destination) {
      try {
        const { data: quoteData, error: quoteError } = await this.quoteDB
          .from('quotes')
          .select(
            'destination, package_name, total_cost, customer_name, family_type, no_of_persons, children, infants, extra_adults, trip_duration'
          )
          .eq('id', packageData.quote_id)
          .single();

        if (!quoteError && quoteData) {
          enrichedPackageData = {
            ...packageData,
            destination: quoteData.destination,
            package_name: quoteData.package_name,
            quote_total_cost: quoteData.total_cost,
            quote_customer_name: quoteData.customer_name,
            quote_family_type: quoteData.family_type,
            quote_duration: quoteData.trip_duration,
          };
          console.log('✅ Enriched package data with quote information');
        }
      } catch (error) {
        console.warn('⚠️ Could not enrich package data with quote information:', error);
      }
    }

    const basePackage = await this.formatPackageForFrontendEnhanced(enrichedPackageData);

    // Extract detailed information from Quote Generator database
    const hotelInfo = this.extractHotelDetails(enrichedPackageData);
    const mealPlanInfo = this.extractMealPlanDetails(enrichedPackageData);
    const detailedInclusions = this.extractDetailedInclusions(enrichedPackageData);
    const detailedExclusions = this.extractDetailedExclusions(enrichedPackageData);
    const packageDescription = this.generatePackageDescription(enrichedPackageData);
    const itinerary = this.generateDetailedItinerary(enrichedPackageData);

    return {
      ...basePackage,
      // Enhanced package information
      package_name:
        this.transformPackageName(enrichedPackageData.quote_name) ||
        enrichedPackageData.quote_name ||
        enrichedPackageData.package_name ||
        basePackage.title,
      hotel_name: hotelInfo.name,
      hotel_category: hotelInfo.category,
      nights:
        enrichedPackageData.package_duration_days ||
        enrichedPackageData.quote_duration ||
        enrichedPackageData.duration_days ||
        5,
      meal_plan: mealPlanInfo.plan,
      meal_details: mealPlanInfo.details,

      // Use destination from enriched data
      destination: enrichedPackageData.destination || basePackage.destination,

      // Detailed descriptions
      description: packageDescription,
      itinerary: itinerary,

      // Comprehensive inclusions and exclusions
      inclusions: detailedInclusions,
      exclusions: detailedExclusions,

      // Additional package details
      ferry_included: this.isFerryIncluded(enrichedPackageData),
      guide_included: this.isGuideIncluded(enrichedPackageData),
      activities_included: this.getIncludedActivities(enrichedPackageData),

      // Pricing breakdown
      cost_breakdown: this.generateCostBreakdown(enrichedPackageData),

      // Package metadata
      data_source: enrichedPackageData.data_source || 'quote_generator',
      last_updated: enrichedPackageData.updated_at || enrichedPackageData.created_at,
      validity: this.getPackageValidity(enrichedPackageData),
    };
  }

  // Helper: Extract hotel details from package data
  extractHotelDetails(packageData) {
    let hotelName = 'Hotel Included';
    let hotelCategory = '3-4 Star';

    // Try to get from quote_mappings hotel_mappings
    if (packageData.quote_mapping_data && packageData.quote_mapping_data.hotel_mappings) {
      const hotelMappings = packageData.quote_mapping_data.hotel_mappings;
      if (hotelMappings.length > 0) {
        hotelName = hotelMappings[0].hotel_name || hotelName;
      }
    }

    // Try to get from baseline_quote_data
    if (packageData.baseline_quote_data && packageData.baseline_quote_data.hotel_name) {
      hotelName = packageData.baseline_quote_data.hotel_name;
    }

    // Try to get from direct fields
    if (packageData.hotel_name) {
      hotelName = packageData.hotel_name;
    }

    // Determine hotel category based on price
    const totalPrice = packageData.total_price || 0;
    if (totalPrice > 80000) {
      hotelCategory = '4-5 Star Luxury';
    } else if (totalPrice > 50000) {
      hotelCategory = '3-4 Star Premium';
    } else if (totalPrice > 30000) {
      hotelCategory = '3 Star Standard';
    } else {
      hotelCategory = '2-3 Star Budget';
    }

    return {
      name: hotelName,
      category: hotelCategory,
    };
  }

  // Helper: Extract meal plan details
  extractMealPlanDetails(packageData) {
    let mealPlan = 'Breakfast Included';
    let mealDetails = [];

    // Check additional costs for meal information
    if (packageData.additional_costs) {
      const mealCost = packageData.additional_costs.meal_cost_per_person || 0;
      if (mealCost > 0) {
        if (mealCost > 1500) {
          mealPlan = 'All Meals Included (MAP)';
          mealDetails = ['Daily Breakfast', 'Daily Lunch', 'Daily Dinner'];
        } else if (mealCost > 800) {
          mealPlan = 'Breakfast & Dinner (CP)';
          mealDetails = ['Daily Breakfast', 'Daily Dinner'];
        } else {
          mealPlan = 'Breakfast Included (EP)';
          mealDetails = ['Daily Breakfast'];
        }
      }
    }

    // Check quote mapping data
    if (packageData.quote_mapping_data && packageData.quote_mapping_data.additional_costs) {
      const costs = packageData.quote_mapping_data.additional_costs;
      const mealCost = costs.meal_cost_per_person || 0;
      if (mealCost > 0) {
        if (mealCost > 1500) {
          mealPlan = 'All Meals Included (MAP)';
          mealDetails = ['Daily Breakfast', 'Daily Lunch', 'Daily Dinner'];
        } else if (mealCost > 800) {
          mealPlan = 'Breakfast & Dinner (CP)';
          mealDetails = ['Daily Breakfast', 'Daily Dinner'];
        }
      }
    }

    return {
      plan: mealPlan,
      details: mealDetails,
    };
  }

  // Helper: Extract detailed inclusions from package data
  extractDetailedInclusions(packageData) {
    const inclusions = [];

    // Standard inclusions
    inclusions.push('Accommodation as per itinerary');

    // Transportation
    if (
      packageData.vehicle_cost > 0 ||
      (packageData.quote_mapping_data && packageData.quote_mapping_data.vehicle_mappings)
    ) {
      inclusions.push('Private vehicle for all transfers and sightseeing');
    } else {
      inclusions.push('Airport transfers');
    }

    // Meals based on meal plan
    const mealInfo = this.extractMealPlanDetails(packageData);
    if (mealInfo.details.length > 0) {
      inclusions.push(...mealInfo.details);
    } else {
      inclusions.push('Daily breakfast');
    }

    // Ferry if included
    if (this.isFerryIncluded(packageData)) {
      inclusions.push('Ferry tickets (adults and children)');
    }

    // Guide if included
    if (this.isGuideIncluded(packageData)) {
      inclusions.push('Professional tour guide');
    }

    // Activities
    const activities = this.getIncludedActivities(packageData);
    if (activities.length > 0) {
      inclusions.push(...activities);
    } else {
      inclusions.push('All sightseeing as per itinerary');
    }

    // Additional inclusions based on price
    const totalPrice = packageData.total_price || 0;
    if (totalPrice > 50000) {
      inclusions.push('Welcome drink on arrival');
    }
    if (totalPrice > 80000) {
      inclusions.push('Complimentary Wi-Fi');
      inclusions.push('24/7 customer support');
    }

    // Standard inclusions
    inclusions.push('All applicable taxes');

    return inclusions;
  }

  // Helper: Extract detailed exclusions
  extractDetailedExclusions(packageData) {
    const exclusions = [
      'Airfare (can be arranged separately)',
      'Personal expenses like laundry, telephone calls, tips, etc.',
      'Travel insurance',
      'Any meals not mentioned in inclusions',
      'Entry fees to monuments and parks',
      'Camera fees at monuments',
      'Medical expenses',
      'Any expenses arising due to unforeseen circumstances',
      'Anything not mentioned in inclusions',
    ];

    // Add specific exclusions based on package type
    if (!this.isFerryIncluded(packageData)) {
      exclusions.unshift('Ferry tickets');
    }

    if (!this.isGuideIncluded(packageData)) {
      exclusions.unshift('Tour guide charges');
    }

    return exclusions;
  }

  // Helper: Check if ferry is included
  isFerryIncluded(packageData) {
    if (packageData.additional_costs && packageData.additional_costs.ferry_cost > 0) {
      return true;
    }
    if (
      packageData.quote_mapping_data &&
      packageData.quote_mapping_data.additional_costs &&
      packageData.quote_mapping_data.additional_costs.ferry_cost > 0
    ) {
      return true;
    }
    return false;
  }

  // Helper: Check if guide is included
  isGuideIncluded(packageData) {
    if (packageData.additional_costs && packageData.additional_costs.guide_cost_per_day > 0) {
      return true;
    }
    if (
      packageData.quote_mapping_data &&
      packageData.quote_mapping_data.additional_costs &&
      packageData.quote_mapping_data.additional_costs.guide_cost_per_day > 0
    ) {
      return true;
    }
    return packageData.total_price > 60000; // Include guide for premium packages
  }

  // Helper: Get included activities
  getIncludedActivities(packageData) {
    const activities = [];

    if (packageData.additional_costs && packageData.additional_costs.activity_cost_per_person > 0) {
      // Determine activities based on destination
      const destination = (packageData.destination || '').toLowerCase();

      if (destination.includes('kashmir')) {
        activities.push('Shikara ride in Dal Lake', 'Gondola ride in Gulmarg');
      } else if (destination.includes('goa')) {
        activities.push('Water sports activities', 'Beach activities');
      } else if (destination.includes('manali')) {
        activities.push('Adventure activities', 'Local sightseeing');
      } else if (destination.includes('andaman')) {
        activities.push('Snorkeling', 'Island hopping');
      } else {
        activities.push('Local activities and experiences');
      }
    }

    return activities;
  }

  // Helper: Generate package description
  generatePackageDescription(packageData) {
    const destination = packageData.destination || 'your destination';
    const nights = packageData.package_duration_days || packageData.duration_days || 5;
    const familyType = packageData.family_type_name || 'families';

    let description = `Experience the beauty and charm of ${destination} with our specially crafted ${nights}-night family package. `;
    description += `Perfect for ${familyType.toLowerCase()}, this package offers a perfect blend of comfort, adventure, and relaxation. `;

    // Add destination-specific description
    const dest = destination.toLowerCase();
    if (dest.includes('kashmir')) {
      description +=
        'Explore the paradise on earth with its pristine lakes, snow-capped mountains, and beautiful gardens. ';
    } else if (dest.includes('goa')) {
      description +=
        'Enjoy the sun, sand, and sea with beautiful beaches, vibrant nightlife, and Portuguese heritage. ';
    } else if (dest.includes('manali')) {
      description +=
        'Discover the hill station beauty with adventure activities, scenic landscapes, and pleasant weather. ';
    } else if (dest.includes('kerala')) {
      description +=
        "Experience God's own country with backwaters, spice plantations, and cultural heritage. ";
    }

    description +=
      'All arrangements are made to ensure a memorable and hassle-free vacation for your family.';

    return description;
  }

  // Helper: Generate detailed itinerary
  generateDetailedItinerary(packageData) {
    const destination = packageData.destination || 'Destination';
    const nights = packageData.package_duration_days || packageData.duration_days || 5;
    const itinerary = [];

    // Day 1 - Arrival
    itinerary.push({
      day: 1,
      title: `Arrival in ${destination}`,
      description: `Arrive at ${destination} airport/railway station. Meet and greet by our representative. Transfer to hotel and check-in. Rest of the day at leisure. Overnight stay at hotel.`,
    });

    // Middle days - Sightseeing
    for (let day = 2; day <= nights; day++) {
      if (day === nights) break; // Skip last day for departure

      let dayTitle = '';
      let dayDescription = '';

      // Destination-specific itinerary
      const dest = destination.toLowerCase();
      if (dest.includes('kashmir')) {
        if (day === 2) {
          dayTitle = 'Srinagar Local Sightseeing';
          dayDescription =
            'After breakfast, visit Mughal Gardens - Nishat Bagh, Shalimar Bagh, and Chashme Shahi. Enjoy Shikara ride in Dal Lake. Visit local markets. Overnight stay at hotel.';
        } else if (day === 3) {
          dayTitle = 'Srinagar to Gulmarg';
          dayDescription =
            'After breakfast, drive to Gulmarg (2 hours). Enjoy Gondola ride (Phase 1 & 2). Experience snow activities. Return to Srinagar. Overnight stay at hotel.';
        } else {
          dayTitle = 'Pahalgam Excursion';
          dayDescription =
            'After breakfast, full day excursion to Pahalgam. Visit Betaab Valley, Aru Valley, and Chandanwari. Return to Srinagar. Overnight stay at hotel.';
        }
      } else if (dest.includes('goa')) {
        if (day === 2) {
          dayTitle = 'North Goa Sightseeing';
          dayDescription =
            'After breakfast, visit North Goa beaches - Calangute, Baga, Anjuna. Visit Fort Aguada. Enjoy water sports. Overnight stay at hotel.';
        } else if (day === 3) {
          dayTitle = 'South Goa Sightseeing';
          dayDescription =
            'After breakfast, visit South Goa beaches - Colva, Benaulim. Visit Old Goa churches. Spice plantation tour. Overnight stay at hotel.';
        } else {
          dayTitle = 'Leisure Day';
          dayDescription =
            'Day at leisure. Enjoy beach activities, shopping, or optional tours. Overnight stay at hotel.';
        }
      } else {
        dayTitle = `${destination} Sightseeing - Day ${day - 1}`;
        dayDescription = `After breakfast, proceed for sightseeing tour of ${destination}. Visit major attractions and local markets. Return to hotel. Overnight stay at hotel.`;
      }

      itinerary.push({
        day: day,
        title: dayTitle,
        description: dayDescription,
      });
    }

    // Last day - Departure
    itinerary.push({
      day: nights + 1,
      title: 'Departure',
      description: `After breakfast, check-out from hotel. Transfer to airport/railway station for onward journey. Tour ends with sweet memories.`,
    });

    return itinerary;
  }

  // Helper: Generate cost breakdown
  generateCostBreakdown(packageData) {
    const breakdown = [];

    if (packageData.hotel_cost > 0) {
      breakdown.push({
        item: 'Accommodation',
        cost: packageData.hotel_cost,
        description: `${packageData.package_duration_days || 5} nights hotel stay`,
      });
    }

    if (packageData.vehicle_cost > 0) {
      breakdown.push({
        item: 'Transportation',
        cost: packageData.vehicle_cost,
        description: 'Private vehicle for transfers and sightseeing',
      });
    }

    if (packageData.additional_costs) {
      const costs = packageData.additional_costs;

      if (costs.meal_cost_per_person > 0) {
        const familyCount = packageData.family_count || 4;
        breakdown.push({
          item: 'Meals',
          cost: costs.meal_cost_per_person * familyCount,
          description: `Meals for ${familyCount} persons`,
        });
      }

      if (costs.ferry_cost > 0) {
        const ferryPersons =
          (packageData.no_of_adults || 2) +
          (packageData.no_of_children || 0) +
          (packageData.no_of_child || 0);
        breakdown.push({
          item: 'Ferry',
          cost: costs.ferry_cost * ferryPersons,
          description: `Ferry tickets for ${ferryPersons} persons (excluding infants)`,
        });
      }

      if (costs.activity_cost_per_person > 0) {
        const familyCount = packageData.family_count || 4;
        breakdown.push({
          item: 'Activities',
          cost: costs.activity_cost_per_person * familyCount,
          description: `Activities for ${familyCount} persons`,
        });
      }

      if (costs.guide_cost_per_day > 0) {
        const days = packageData.package_duration_days || 5;
        breakdown.push({
          item: 'Guide',
          cost: costs.guide_cost_per_day * days,
          description: `Professional guide for ${days} days`,
        });
      }
    }

    // Add total
    const total = breakdown.reduce((sum, item) => sum + item.cost, 0);
    if (total > 0 && total !== packageData.total_price) {
      breakdown.push({
        item: 'Other charges',
        cost: (packageData.total_price || 0) - total,
        description: 'Taxes, service charges, and other fees',
      });
    }

    return breakdown;
  }

  // Helper: Get UTM source
  getUtmSource() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('utm_source') || 'direct';
  }

  // Helper: Create sample packages when database is empty
  createSamplePackages(destination, familyType, searchParams) {
    console.log('🎨 Creating sample packages for:', destination);

    const samplePackages = [
      {
        id: 'sample-1',
        title: `${destination} Family Package`,
        destination: destination,
        duration_days: 5,
        total_price: 45000,
        family_type: familyType.family_type,
        emi_options: [
          {
            id: 'emi-1',
            months: 3,
            monthly_amount: 15000,
            total_amount: 45000,
            processing_fee: 1000,
            label: 'Quick Pay',
            is_featured: false,
          },
          {
            id: 'emi-2',
            months: 6,
            monthly_amount: 7500,
            total_amount: 45000,
            processing_fee: 1500,
            label: 'Best Value',
            is_featured: true,
          },
          {
            id: 'emi-3',
            months: 12,
            monthly_amount: 3750,
            total_amount: 45000,
            processing_fee: 2000,
            label: 'Low Monthly',
            is_featured: false,
          },
        ],
        inclusions: ['Flights', 'Hotels', 'Meals', 'Sightseeing'],
        images: [this.getDestinationImage(destination)],
        offer_badge: '15% OFF',
      },
      {
        id: 'sample-2',
        title: `${destination} Adventure Package`,
        destination: destination,
        duration_days: 7,
        total_price: 65000,
        family_type: familyType.family_type,
        emi_options: [
          {
            id: 'emi-4',
            months: 6,
            monthly_amount: 10833,
            total_amount: 65000,
            processing_fee: 2000,
            label: 'Popular',
            is_featured: true,
          },
        ],
        inclusions: ['Flights', 'Hotels', 'Meals', 'Adventure Activities'],
        images: [this.getDestinationImage(destination)],
        offer_badge: 'Best Value',
      },
    ];

    return {
      success: true,
      matched_family_type: familyType,
      packages: samplePackages,
      search_params: searchParams,
    };
  }

  // Helper: Convert quote mapping to package format
  convertQuoteMappingToPackage(mapping, familyType) {
    // Handle both joined and non-joined quote data
    const quote = mapping.quotes || mapping;

    // Apply package name transformation if needed
    let packageName =
      this.transformPackageName(mapping.quote_name) ||
      mapping.quote_name ||
      `${mapping.destination} Package`;

    // First, try to get the actual price from the database record
    let totalPrice =
      mapping.total_price ||
      mapping.total_cost ||
      mapping.price ||
      mapping.cost ||
      mapping.package_cost ||
      mapping.family_type_price ||
      mapping.base_price ||
      mapping.final_price;

    // If no database price found, calculate family type specific price
    if (!totalPrice) {
      const calculatedPrice = this.calculateFamilyTypePrice(mapping, familyType);
      totalPrice =
        calculatedPrice || quote?.total_cost || quote?.subtotal || mapping.subtotal || 45000; // fallback only if nothing else works
    }

    console.log('💰 Price selection for mapping:', {
      id: mapping.id,
      database_price: mapping.total_price || mapping.total_cost || mapping.price,
      final_price: totalPrice,
      family_type: familyType?.family_type,
    });

    return {
      id: mapping.id,
      title: packageName,
      destination: mapping.destination,
      duration_days: quote?.duration_days || mapping.duration_days || 5,
      total_price: totalPrice,
      family_type: familyType?.family_type || 'Family Package',
      emi_options: this.generateEMIOptions(totalPrice, mapping.id),
      inclusions: this.extractInclusions(mapping),
      images: [this.getDestinationImage(mapping.destination)],
      offer_badge: this.getOfferBadge(totalPrice),
      package_validity: quote?.travel_date || mapping.travel_date || 'Valid for booking',
      created_from: 'quote_mapping',
      // Add quote_name from quote_mappings table for package card display
      quote_name: mapping.quote_name,
      package_name: packageName, // Keep for backward compatibility
      // Add additional data from quote mapping
      hotel_name: this.extractHotelName(mapping),
      meal_plan: this.extractMealPlan(mapping),
      nights: quote?.duration_days || mapping.duration_days || 5,
    };
  }

  // Helper: Transform package names for better display
  transformPackageName(originalName) {
    if (!originalName) return null;

    // Define package name transformations
    const nameTransformations = {
      'Goa: 3N Cosmic Combo - 2 Adults + 1 Child (Above 5 yrs) + 1 Teenager (Above 11 yrs)':
        'Family Fun in Goa: 2N of Adventure and Bonding',
      // Add more transformations as needed
      // "Original Name": "Transformed Name",
    };

    // Check if there's a transformation for this name
    if (nameTransformations[originalName]) {
      console.log(
        `🔄 Transforming package name: "${originalName}" → "${nameTransformations[originalName]}"`
      );
      return nameTransformations[originalName];
    }

    return null; // No transformation needed
  }

  // Helper: Calculate family type specific price using quote mapping
  calculateFamilyTypePrice(mapping, familyType) {
    if (!mapping.additional_costs || !familyType) {
      return null;
    }

    try {
      const costs = mapping.additional_costs;
      const familyCount =
        familyType.family_count ||
        familyType.no_of_adults +
          familyType.no_of_children +
          familyType.no_of_child +
          familyType.no_of_infants;

      // Calculate ferry cost: per-person cost * eligible persons (adults + children + child, excluding infants)
      const ferryEligiblePersons =
        familyType.no_of_adults + (familyType.no_of_children || 0) + (familyType.no_of_child || 0);
      const ferryCost = (costs.ferry_cost || 0) * ferryEligiblePersons;
      const mealCost = (costs.meal_cost_per_person || 0) * familyCount;
      const activityCost = (costs.activity_cost_per_person || 0) * familyCount;
      const guideCost = (costs.guide_cost_per_day || 0) * 3; // Assume 3 days

      const additionalCosts = ferryCost + mealCost + activityCost + guideCost;

      // Get base quote price - try to get actual price from database first
      const quote = mapping.quotes || mapping;
      const basePrice =
        quote?.total_cost ||
        quote?.subtotal ||
        mapping.total_price ||
        mapping.total_cost ||
        mapping.price ||
        null; // Don't use fallback here, let caller handle it

      if (!basePrice) {
        console.log(
          '⚠️ No base price found for calculation, skipping family type price calculation'
        );
        return null;
      }

      console.log(`🧮 Family Type Price Calculation for ${familyType.family_type}:`);
      console.log(
        `   ⛴️ Ferry: ₹${costs.ferry_cost} × ${ferryEligiblePersons} persons (excluding ${familyType.no_of_infants} infants) = ₹${ferryCost}`
      );
      console.log(
        `   🍽️ Meals: ₹${costs.meal_cost_per_person} × ${familyCount} persons = ₹${mealCost}`
      );
      console.log(
        `   🎯 Activities: ₹${costs.activity_cost_per_person} × ${familyCount} persons = ₹${activityCost}`
      );
      console.log(`   👨‍🏫 Guide: ₹${costs.guide_cost_per_day} × 3 days = ₹${guideCost}`);
      console.log(`   💰 Total Additional: ₹${additionalCosts}`);
      console.log(
        `   💰 Final Price: ₹${basePrice} + ₹${additionalCosts} = ₹${basePrice + additionalCosts}`
      );

      return Math.round(basePrice + additionalCosts);
    } catch (error) {
      console.error('Error calculating family type price:', error);
      return null;
    }
  }

  // Helper: Convert quote to package format
  convertQuoteToPackage(quote, familyType) {
    const packageName = `${quote.destination} ${this.getPackageTypeByPrice(quote.total_cost)} Package`;
    const totalPrice =
      quote.total_cost || quote.subtotal || quote.total_price || quote.price || quote.cost || 45000; // Only use fallback if no price found at all

    console.log('💰 Quote to package conversion:', {
      quote_id: quote.id,
      total_cost: quote.total_cost,
      subtotal: quote.subtotal,
      final_price: totalPrice,
    });

    return {
      id: quote.id,
      title: packageName,
      destination: quote.destination,
      duration_days: quote.duration_days || 5,
      total_price: totalPrice,
      family_type: familyType.family_type,
      emi_options: this.generateEMIOptions(totalPrice, quote.id),
      inclusions: ['Flights', 'Hotels', 'Meals', 'Sightseeing'],
      images: [this.getDestinationImage(quote.destination)], // Destination-specific image
      offer_badge: this.getOfferBadge(totalPrice),
      package_validity: quote.travel_date || 'Valid for booking',
      created_from: 'quote',
    };
  }

  // Helper: Generate EMI options based on price - SIMPLE DIVISION (NO INTEREST/FEES)
  generateEMIOptions(totalPrice, packageId) {
    // Simple EMI calculation: just divide total price by months
    // No interest rates, no processing fees - keep same total as DB
    const calculateSimpleEMI = (principal, months) => {
      return Math.round(principal / months);
    };

    return [
      {
        id: `emi-3-${packageId}`,
        months: 3,
        monthly_amount: calculateSimpleEMI(totalPrice, 3), // Simple division
        total_amount: totalPrice, // Same as DB total price
        processing_fee: 0, // No processing fee for prepaid EMI
        label: 'Quick Pay',
        is_featured: false,
      },
      {
        id: `emi-6-${packageId}`,
        months: 6,
        monthly_amount: calculateSimpleEMI(totalPrice, 6), // Simple division
        total_amount: totalPrice, // Same as DB total price
        processing_fee: 0, // No processing fee for prepaid EMI
        label: 'Best Value',
        is_featured: true,
      },
      {
        id: `emi-12-${packageId}`,
        months: 12,
        monthly_amount: calculateSimpleEMI(totalPrice, 12), // Simple division
        total_amount: totalPrice, // Same as DB total price
        processing_fee: 0, // No processing fee for prepaid EMI
        label: 'Low Monthly',
        is_featured: false,
      },
    ];
  }

  // Helper: Extract inclusions from quote mapping
  extractInclusions(mapping) {
    const inclusions = ['Accommodation'];

    // Check hotel mappings
    if (mapping.hotel_mappings && mapping.hotel_mappings.length > 0) {
      inclusions.push('Hotels');
    }

    // Check vehicle mappings
    if (mapping.vehicle_mappings && mapping.vehicle_mappings.length > 0) {
      inclusions.push('Transportation');
    }

    // Check additional costs
    if (mapping.additional_costs) {
      const costs = mapping.additional_costs;
      if (costs.meal_cost_per_person > 0) inclusions.push('Meals');
      if (costs.ferry_cost > 0) inclusions.push('Ferry');
      if (costs.activity_cost_per_person > 0) inclusions.push('Activities');
      if (costs.guide_cost_per_day > 0) inclusions.push('Guide');
    }

    // Default inclusions if none found
    if (inclusions.length === 1) {
      inclusions.push('Sightseeing', 'Transfers');
    }

    return inclusions;
  }

  // Helper: Extract hotel name from quote mapping
  extractHotelName(mapping) {
    if (mapping.hotel_mappings && mapping.hotel_mappings.length > 0) {
      return mapping.hotel_mappings[0].hotel_name || 'Hotel Included';
    }

    // Try to get from quote data
    const quote = mapping.quotes || mapping;
    if (quote && quote.hotel_name) {
      return quote.hotel_name;
    }

    return 'Hotel Included';
  }

  // Helper: Extract meal plan from quote mapping
  extractMealPlan(mapping) {
    if (mapping.additional_costs && mapping.additional_costs.meal_cost_per_person > 0) {
      return 'Meals Included';
    }

    // Try to get from quote data
    const quote = mapping.quotes || mapping;
    if (quote && quote.meal_plan) {
      return quote.meal_plan;
    }

    return 'Breakfast Included';
  }

  // Helper: Get package type based on price
  getPackageTypeByPrice(price) {
    if (price < 30000) return 'Budget';
    if (price < 60000) return 'Standard';
    if (price < 100000) return 'Premium';
    return 'Luxury';
  }

  // Helper: Get offer badge based on price
  getOfferBadge(price) {
    if (price > 80000) return '15% OFF';
    if (price > 50000) return '10% OFF';
    if (price > 30000) return 'Best Value';
    return 'Great Deal';
  }

  // Get all family type prices data for info modal
  async getFamilyTypePricesData() {
    try {
      console.log('📊 Fetching all family type prices data from database...');

      const { data, error } = await this.quoteDB
        .from('family_type_prices')
        .select(
          `
          family_type_name,
          no_of_adults,
          no_of_children,
          no_of_child,
          no_of_infants,
          family_count
        `
        )
        .eq('is_public_visible', true)
        .order('family_type_name');

      if (error) {
        console.error('❌ Error fetching family type prices data:', error);
        // Return fallback data if database fails
        return this.getFallbackFamilyTypePricesData();
      }

      if (!data || data.length === 0) {
        console.warn('⚠️ No family type prices data found in database, using fallback data');
        return this.getFallbackFamilyTypePricesData();
      }

      console.log('✅ Successfully fetched family type prices data:', data.length);

      return {
        success: true,
        data: data,
        message: `Loaded ${data.length} family type price records from database`,
      };
    } catch (error) {
      console.error('❌ Database error in getFamilyTypePricesData:', error);
      // Return fallback data on any error
      return this.getFallbackFamilyTypePricesData();
    }
  }

  // Fallback family type prices data for demo purposes
  getFallbackFamilyTypePricesData() {
    console.log('📋 Using fallback family type prices data');

    const fallbackData = [
      {
        family_type_name: 'Stellar Duo',
        no_of_adults: 2,
        no_of_children: 0,
        no_of_child: 0,
        no_of_infants: 0,
        family_count: 2,
      },
      {
        family_type_name: 'Baby Bliss',
        no_of_adults: 2,
        no_of_children: 0,
        no_of_child: 0,
        no_of_infants: 1,
        family_count: 3,
      },
      {
        family_type_name: 'Tiny Delight',
        no_of_adults: 2,
        no_of_children: 0,
        no_of_child: 1,
        no_of_infants: 0,
        family_count: 3,
      },
      {
        family_type_name: 'Family Nest',
        no_of_adults: 2,
        no_of_children: 2,
        no_of_child: 0,
        no_of_infants: 0,
        family_count: 4,
      },
      {
        family_type_name: 'Dynamic Family Duo+',
        no_of_adults: 4,
        no_of_children: 0,
        no_of_child: 0,
        no_of_infants: 0,
        family_count: 4,
      },
      {
        family_type_name: 'Grand Family',
        no_of_adults: 2,
        no_of_children: 3,
        no_of_child: 1,
        no_of_infants: 0,
        family_count: 6,
      },
    ];

    return {
      success: true,
      data: fallbackData,
      message: `Loaded ${fallbackData.length} sample family type records (offline mode)`,
    };
  }
}

// Create global database service instance
const databaseService = new DatabaseService();

// Export for use in other scripts
window.databaseService = databaseService;

console.log('🚀 Database Service loaded successfully');
