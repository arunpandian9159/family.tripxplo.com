// Preview Package PDF function - opens PDF in new tab instead of downloading
async function previewPackagePDF() {
  if (!window.currentCardData || !window.currentPackageData) {
    notificationManager.show('No package data available.', 'error');
    return;
  }

  const cardData = window.currentCardData;
  const pkg = window.currentPackageData;

  notificationManager.show('Generating PDF preview...', 'info');

  // Use window.jspdf.jsPDF for UMD build
  const jsPDF = window.jspdf && window.jspdf.jsPDF;
  if (!jsPDF) {
    notificationManager.show('PDF generation not available. Please refresh the page.', 'error');
    return;
  }

  // Optimized: fetch, down-scale and compress image to reduce PDF size
  async function getImageDataUrl(url, options = {}) {
    try {
      const response = await fetch(url, { mode: 'cors' });
      const blob = await response.blob();
      return await new Promise((resolve, reject) => {
        const img = new Image();
        img.crossOrigin = 'anonymous';
        img.onload = () => {
          // If options.fullQuality is true, use original size and PNG (lossless)
          if (options.fullQuality) {
            const canvas = document.createElement('canvas');
            canvas.width = img.width;
            canvas.height = img.height;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            resolve(canvas.toDataURL('image/png'));
          } else {
            // Down-scale very large images to a reasonable width before embedding
            const MAX_WIDTH = 600; // px – good balance of quality vs. size
            const scale = Math.min(1, MAX_WIDTH / img.width);
            const canvas = document.createElement('canvas');
            canvas.width = img.width * scale;
            canvas.height = img.height * scale;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
            // Export as JPEG at 0.7 quality for further compression
            resolve(canvas.toDataURL('image/jpeg', 0.7));
          }
        };
        img.onerror = reject;
        img.src = URL.createObjectURL(blob);
      });
    } catch (e) {
      return null;
    }
  }

  try {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 14; // smaller margin for more content
    const contentWidth = pageWidth - margin * 2;
    let yPosition = 50; // move header and main image down by 13cm (130mm)

    // --- Add a colored accent bar at the top of the first page ---
    doc.setFillColor(21, 171, 139); // #15ab8b
    doc.rect(0, 0, pageWidth, 6, 'F'); // Move this bar to the very top, above all content (logo/header)

    // --- Load PDF background images ---
    const bgPage1Url = 'img/tripxplo-pdf-bg-page-1.jpg';
    // Choose second page background based on EMI plan
    let bgPage2Url = 'img/tripxplo-pdf-bg-page-3.jpg';
    if (cardData.emi.months === 12 || pkg.emi_options?.find(e => e.selected)?.months === 12) {
      bgPage2Url = 'img/tripxplo-pdf-bg-page-2.jpg';
    } else if (
      cardData.emi.months === 3 ||
      cardData.emi.months === 6 ||
      pkg.emi_options?.find(e => e.selected)?.months === 3 ||
      pkg.emi_options?.find(e => e.selected)?.months === 6
    ) {
      bgPage2Url = 'img/tripxplo-pdf-bg-page-3.jpg';
    }
    const bgPage1DataUrl = await getImageDataUrl(bgPage1Url, { fullQuality: true });
    const bgPage2DataUrl = await getImageDataUrl(bgPage2Url, { fullQuality: true });

    // Helper to draw background for current page
    function drawBackground(pageNum) {
      if (pageNum === 1 && bgPage1DataUrl) {
        doc.addImage(bgPage1DataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
      } else if (pageNum === 2 && bgPage2DataUrl) {
        doc.addImage(bgPage2DataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
      } else if (bgPage2DataUrl) {
        doc.addImage(bgPage2DataUrl, 'PNG', 0, 0, pageWidth, pageHeight);
      }
    }

    // Draw background for first page
    drawBackground(1);
    let currentPage = 1;

    // --- Family Prepaid Emi Package Heading ---
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 171, 139);
    doc.text('Family Prepaid EMI Package', pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 12;

    // --- Package Title & Details ---
    yPosition += 5.5;
    doc.setFontSize(18);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(21, 171, 139);
    // Improved split logic for package title
    let mainTitle =
      pkg.quote_name || pkg.package_name || pkg.title || `${cardData.destination} Travel Package`;
    let line1 = mainTitle;
    let line2 = '';
    // Try to split at colon, hyphen, or comma
    let splitMatch = mainTitle.match(/(.+?)[\-:,](.+)/);
    if (splitMatch) {
      line1 = splitMatch[1].trim();
      line2 = splitMatch[2].trim();
    } else if (
      (pkg.destination || cardData.destination) &&
      mainTitle
        .toLowerCase()
        .includes('in ' + (pkg.destination || cardData.destination).toLowerCase())
    ) {
      // Split at 'in [Destination]'
      let dest = pkg.destination || cardData.destination;
      let idx = mainTitle.toLowerCase().indexOf('in ' + dest.toLowerCase());
      if (idx !== -1) {
        line1 = mainTitle.slice(0, idx + 2).trim();
        line2 = mainTitle.slice(idx + 2).trim();
      }
    } else if (
      (pkg.destination || cardData.destination) &&
      mainTitle !== (pkg.destination || cardData.destination)
    ) {
      line2 = pkg.destination || cardData.destination;
    }
    doc.text(line1, pageWidth / 2, yPosition, { align: 'center' });
    yPosition += 8.5;
    if (line2) {
      doc.setFontSize(18);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(21, 171, 139);
      doc.text(line2, pageWidth / 2, yPosition, { align: 'center' });
      yPosition += 7.5;
    }
    doc.setFontSize(13);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(40, 40, 40);
    const labelColor = [21, 171, 139];
    const valueColor = [40, 40, 40];
    const labelFont = { font: 'helvetica', style: 'bold' };
    const valueFont = { font: 'helvetica', style: 'normal' };
    const labelOffset = 10;
    let detailsRowY = yPosition + 2;
    // Destination
    doc.setFont(labelFont.font, labelFont.style);
    doc.setTextColor(...labelColor);
    doc.text('Destination:', margin + labelOffset, detailsRowY);
    doc.setFont(valueFont.font, valueFont.style);
    doc.setTextColor(...valueColor);
    doc.text(`${pkg.destination || cardData.destination}`, margin + 32 + labelOffset, detailsRowY);
    detailsRowY += 8.5;
    // Duration (robust display)
    doc.setFont(labelFont.font, labelFont.style);
    doc.setTextColor(...labelColor);
    doc.text('Duration:', margin + labelOffset, detailsRowY);
    doc.setFont(valueFont.font, valueFont.style);
    doc.setTextColor(...valueColor);
    let durationText = '';
    if (pkg.nights && pkg.duration_days) {
      durationText = `${pkg.nights}N/${pkg.duration_days}D`;
    } else if (pkg.nights) {
      durationText = `${pkg.nights}N`;
    } else if (pkg.duration_days) {
      durationText = `${pkg.duration_days}D`;
    } else {
      durationText = '';
    }
    doc.text(durationText, margin + 32 + labelOffset, detailsRowY);
    detailsRowY += 8.5;
    // Family Type
    doc.setFont(labelFont.font, labelFont.style);
    doc.setTextColor(...labelColor);
    doc.text('Family Type:', margin + labelOffset, detailsRowY);
    doc.setFont(valueFont.font, valueFont.style);
    doc.setTextColor(...valueColor);
    doc.text(
      `${pkg.family_type || (window.detectFamilyType && detectFamilyType().family_type) || 'Family'}`,
      margin + 32 + labelOffset,
      detailsRowY
    );
    detailsRowY += 8.5;
    // Total Price
    let price = (pkg.total_price || 0).toLocaleString();
    price = price.normalize('NFKD').replace(/[^0-9\d₹,]+/g, '');
    if (!price.startsWith('₹')) price = '₹' + price.replace(/^₹+/, '');
    price = price.replace('₹', 'INR ');
    doc.setFont(labelFont.font, labelFont.style);
    doc.setTextColor(...labelColor);
    doc.text('Total Price:', margin + labelOffset, detailsRowY);
    doc.setFont(valueFont.font, valueFont.style);
    doc.setTextColor(...valueColor);
    doc.text(`${price}`.trim(), margin + 32 + labelOffset, detailsRowY);
    detailsRowY += 8.5;
    // EMI Plan
    let emiPriceString = ('₹' + cardData.price.toLocaleString())
      .normalize('NFKD')
      .replace(/[^0-9₹,]+/g, '')
      .replace(/^₹+/, '₹');
    emiPriceString = emiPriceString.replace('₹', 'INR ');
    doc.setFont(labelFont.font, labelFont.style);
    doc.setTextColor(...labelColor);
    doc.text('EMI Plan:', margin + labelOffset, detailsRowY);
    doc.setFont(valueFont.font, valueFont.style);
    doc.setTextColor(...valueColor);
    doc.text(
      `${cardData.emi.months} months × ${emiPriceString}`.trim(),
      margin + 32 + labelOffset,
      detailsRowY
    );
    yPosition = detailsRowY + 8;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);

    // --- Overview Section ---
    // Draw colored box for section header (Package Overview, same as EMI Payment Schedule)
    const overviewHeaderBoxHeight = 9;
    // Calculate total number of lines for all inclusions/exclusions
    const sanitizeList = (list, fallback) => {
      const cleaned = (Array.isArray(list) ? list : [])
        .map(item => (item || '').toString().trim())
        .filter(Boolean);
      return (cleaned.length ? cleaned : fallback).slice(0, 5);
    };
    const inclusions = sanitizeList(pkg.inclusions, ['Accommodation', 'Transfers', 'Sight-seeing']);
    let domExclusions = [];
    try {
      const exclusionNodes = document.querySelectorAll('.package-exclusions .exclusion-item span');
      domExclusions = Array.from(exclusionNodes)
        .map(node => node.textContent.trim())
        .filter(Boolean);
    } catch (e) {
      domExclusions = [];
    }
    const exclusions = sanitizeList(domExclusions.length ? domExclusions : pkg.exclusions, [
      'Personal expenses',
      'Travel insurance',
      'Items not mentioned in inclusions',
    ]);
    let hotelInclusions = [];
    if (pkg.hotels_list && pkg.hotels_list.length > 0) {
      hotelInclusions = pkg.hotels_list.map(hotel => {
        const nights = hotel.nights || hotel.stay_nights || 1;
        const hotelName = hotel.hotel_name || 'Hotel Included';
        let mealPlan = hotel.meal_plan || 'Breakfast included';
        mealPlan = getMealPlanDescription(mealPlan);
        return `${nights}N - ${hotelName} (${mealPlan})`;
      });
    } else if (pkg.hotel_name) {
      let mealPlan = getMealPlanDescription(pkg.hotel_category);
      hotelInclusions = [`${pkg.hotel_name} (${mealPlan})`];
    }
    const allInclusions = hotelInclusions.concat(
      inclusions.filter(
        inc =>
          !hotelInclusions.some(hotelInc => {
            const codeMatch = inc.match(/\((CP|MAP|AP|EP)\)$/i);
            if (codeMatch) return true;
            return hotelInc.includes(inc.replace(/\((CP|MAP|AP|EP)\)$/i, '').trim());
          })
      )
    );
    const colWidth = (contentWidth - 8) / 2;
    let maxRows = Math.max(allInclusions.length, exclusions.length);
    // Calculate total number of lines for all inclusions/exclusions
    let totalIncExcLines = 0;
    for (let i = 0; i < maxRows; i++) {
      let inclusionLines = allInclusions[i]
        ? doc.splitTextToSize(allInclusions[i], colWidth - 10)
        : [];
      let exclusionLines = exclusions[i] ? doc.splitTextToSize(exclusions[i], colWidth - 10) : [];
      totalIncExcLines += Math.max(inclusionLines.length, exclusionLines.length, 1);
    }
    // --- Draw background box for entire Package Overview section ---
    let overviewBoxY = yPosition;
    let overviewBoxHeight = overviewHeaderBoxHeight + 2 + 6 + 4 + totalIncExcLines * 7.5 + 8; // header + gap + subheaders + gap + data + padding
    doc.setFillColor(206, 241, 236);
    doc.roundedRect(margin - 2, overviewBoxY - 2, contentWidth + 4, overviewBoxHeight, 6, 6, 'F');
    // Now draw the section header and content on top of the box
    doc.setFillColor(21, 171, 139);
    doc.roundedRect(margin, yPosition, contentWidth, overviewHeaderBoxHeight, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(15);
    doc.setFont('helvetica', 'bold');
    doc.text('Package Overview', margin + 4, yPosition + overviewHeaderBoxHeight / 2 + 2.5);
    yPosition += overviewHeaderBoxHeight + 2;
    yPosition += 6;
    doc.setTextColor(21, 171, 139);
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text("What's Included:", margin, yPosition);
    doc.text("What's Not Included:", margin + colWidth + 10, yPosition);
    doc.setFont('helvetica', 'normal');
    yPosition += 4;
    doc.setFontSize(11);
    let rowY = yPosition + 6;
    for (let i = 0; i < maxRows; i++) {
      let inclusionLines = allInclusions[i]
        ? doc.splitTextToSize(allInclusions[i], colWidth - 10)
        : [];
      let exclusionLines = exclusions[i] ? doc.splitTextToSize(exclusions[i], colWidth - 10) : [];
      let maxLines = Math.max(inclusionLines.length, exclusionLines.length, 1);
      for (let l = 0; l < maxLines; l++) {
        if (inclusionLines[l]) {
          doc.setTextColor(21, 171, 139);
          if (l === 0) doc.text('•', margin + 2, rowY);
          doc.setTextColor(40, 40, 40);
          doc.text(inclusionLines[l], margin + 8, rowY);
        }
        if (exclusionLines[l]) {
          doc.setTextColor(241, 90, 43);
          if (l === 0) doc.text('•', margin + colWidth + 10, rowY);
          doc.setTextColor(40, 40, 40);
          doc.text(exclusionLines[l], margin + colWidth + 16, rowY);
        }
        rowY += 7.5;
      }
    }
    yPosition = rowY + 12; // add extra gap after the box before itinerary section

    // --- Itinerary Section (multi-page robust) ---
    if (currentPage > 1) {
      yPosition = 30;
    }
    // --- Extract itinerary from DOM if available ---
    let domItinerary = [];
    try {
      const timeline = document.querySelector('.itinerary-timeline');
      if (timeline) {
        const dayNodes = timeline.querySelectorAll('.day-item');
        domItinerary = Array.from(dayNodes).map((node, idx) => {
          const dayNumEl = node.querySelector('.day-number');
          const dayNum = dayNumEl ? dayNumEl.textContent.trim() : idx + 1;
          const titleEl = node.querySelector('.day-header h5');
          const title = titleEl ? titleEl.textContent.trim() : '';
          const descEl = node.querySelector('.day-description');
          const description = descEl ? descEl.textContent.trim() : '';
          return { day: dayNum, title, description };
        });
      }
    } catch (e) {
      domItinerary = [];
    }
    // Use DOM itinerary if available, else pkg.itinerary
    const itineraryData =
      domItinerary && domItinerary.length > 0 ? domItinerary : pkg.itinerary || [];
    // Helper to draw itinerary section header and background box for the current page
    function drawItineraryHeaderAndBox(boxY, boxHeight, showHeader, isSubsequentPage) {
      let adjBoxY = boxY;
      if (isSubsequentPage) adjBoxY -= 8; // move up on 2nd+ pages
      doc.setFillColor(206, 241, 236); //rgb(206, 241, 236)
      doc.roundedRect(
        margin - 2,
        adjBoxY - 2,
        contentWidth + 4,
        boxHeight + (isSubsequentPage ? 8 : 0),
        6,
        6,
        'F'
      );
      if (showHeader) {
        doc.setFillColor(21, 171, 139);
        doc.roundedRect(margin, boxY, contentWidth, 9, 4, 4, 'F');
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.text('Detailed Itinerary', margin + 4, boxY + 9 / 2 + 2.5);
      }
      // Do not update yPosition here; extra space will be added to renderY in the loop
    }
    // Pre-calculate heights for each day
    let dayHeights = [];
    if (itineraryData && Array.isArray(itineraryData) && itineraryData.length > 0) {
      itineraryData.forEach((day, idx) => {
        let h = 6.5; // day header
        const detailsArr = [];
        if (Array.isArray(day.highlights) && day.highlights.length) {
          detailsArr.push(day.highlights.join(', '));
        }
        if (day.description) {
          detailsArr.push(day.description);
        }
        const detailText = detailsArr.join(' | ');
        if (detailText) {
          const splitted = doc.splitTextToSize(detailText, contentWidth - 10);
          h += splitted.length * 5.2;
        }
        if (idx < itineraryData.length - 1) {
          h += 2.5;
        }
        h += 2.5;
        dayHeights.push(h);
      });
    }
    // Render itinerary with page breaks, drawing background and header per page
    let lastDayBottom = yPosition;
    let itineraryHeaderBoxHeight = 9;
    let itineraryBoxPadding = 4;
    let i = 0;
    let isFirstItineraryPage = true;
    while (i < itineraryData.length) {
      let boxY = yPosition;
      let startY = yPosition + (isFirstItineraryPage ? itineraryHeaderBoxHeight + 2 + 2.5 : 0);
      let simY = startY;
      let daysThisPage = [];
      // Fit as many days as possible on this page
      for (; i < itineraryData.length; i++) {
        let h = dayHeights[i];
        if (simY + h > 285 && daysThisPage.length > 0) break;
        daysThisPage.push(i);
        simY += h;
      }
      // Calculate boxHeight as the actual content height for this page
      let boxHeight = simY - boxY + itineraryBoxPadding;
      // Only add header height on first page (already included in startY)
      // Do not add extra header height to boxHeight
      drawItineraryHeaderAndBox(boxY, boxHeight, isFirstItineraryPage, !isFirstItineraryPage);
      // Render the section header and content for this page
      let renderY = boxY + (isFirstItineraryPage ? itineraryHeaderBoxHeight + 2 + 2.5 + 7 : 0);
      let isFirstDayRendered = isFirstItineraryPage && daysThisPage[0] === 0;
      for (let localIdx = 0; localIdx < daysThisPage.length; localIdx++) {
        const idx = daysThisPage[localIdx];
        const day = itineraryData[idx];
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(21, 171, 139);
        doc.text(day.title ? day.title : `Day ${day.day ?? idx + 1}`, margin + 4, renderY);
        renderY += 6.5;
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(11);
        doc.setTextColor(40, 40, 40);
        const detailsArr = [];
        if (Array.isArray(day.highlights) && day.highlights.length) {
          detailsArr.push(day.highlights.join(', '));
        }
        if (day.description) {
          detailsArr.push(day.description);
        }
        const detailText = detailsArr.join(' | ');
        if (detailText) {
          const splitted = doc.splitTextToSize(detailText, contentWidth - 10);
          splitted.forEach(line => {
            doc.setTextColor(21, 171, 139);
            doc.text('•', margin + 7, renderY);
            doc.setTextColor(40, 40, 40);
            doc.text(line, margin + 13, renderY);
            renderY += 5.2;
          });
        }
        if (idx < itineraryData.length - 1) {
          doc.setDrawColor(230, 248, 245);
          doc.setLineWidth(1);
          doc.line(margin + 4, renderY, margin + contentWidth - 4, renderY);
          renderY += 2.5;
        }
        renderY += 2.5;
        lastDayBottom = renderY;
      }
      // Prepare for next page if needed
      if (i < itineraryData.length) {
        doc.addPage();
        currentPage++;
        drawBackground(currentPage);
        yPosition = 30;
        isFirstItineraryPage = false;
      } else {
        yPosition = lastDayBottom + 2;
      }
    }
    if (!itineraryData || !Array.isArray(itineraryData) || itineraryData.length === 0) {
      doc.setFont('helvetica', 'italic');
      doc.setFontSize(11);
      doc.setTextColor(100, 100, 100);
      doc.text('Itinerary details will be provided upon booking confirmation.', margin, yPosition);
      yPosition += 5;
      doc.text(
        'Our travel experts will create a personalized schedule based on your preferences.',
        margin,
        yPosition
      );
      yPosition += 5;
    }

    // --- EMI Schedule Section (Enhanced, full schedule, visible table) ---
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, yPosition, margin + contentWidth, yPosition);
    yPosition += 2.5;
    // Draw colored box for section header (rounded)
    const emiHeaderBoxHeight = 9;
    doc.setFillColor(21, 171, 139);
    doc.roundedRect(margin, yPosition, contentWidth, emiHeaderBoxHeight, 4, 4, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('EMI Payment Schedule', margin + 4, yPosition + emiHeaderBoxHeight / 2 + 2.5);
    yPosition += emiHeaderBoxHeight + 2;
    yPosition += 2.5;

    // Prepare EMI table data
    const selectedEmiOption =
      pkg.emi_options && pkg.emi_options.length > 0
        ? pkg.emi_options.find(emi => emi.selected) || pkg.emi_options[0]
        : null;
    let months = selectedEmiOption
      ? selectedEmiOption.months || cardData.emi.months
      : cardData.emi.months;
    let emiAmount = selectedEmiOption
      ? (selectedEmiOption.emi_amount ?? cardData.price)
      : cardData.price;
    if (typeof emiAmount !== 'number') {
      emiAmount = Number((emiAmount || '').toString().replace(/[^\d.]/g, '')) || 0;
    }
    let processingFee =
      selectedEmiOption && selectedEmiOption.processing_fee
        ? selectedEmiOption.processing_fee
        : 500;
    const today = new Date();
    // First payment (today) includes processing fee
    const firstPayment = emiAmount + processingFee;
    let emiRows = [];
    emiRows.push([
      today.toLocaleDateString('en-IN', { day: '2-digit', month: 'short', year: 'numeric' }),
      '1st EMI + Processing Fee',
      `INR ${String(firstPayment).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    ]);
    for (let i = 2; i <= months; i++) {
      const paymentDate = new Date(today);
      paymentDate.setMonth(paymentDate.getMonth() + (i - 1));
      emiRows.push([
        paymentDate.toLocaleDateString('en-IN', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        `${i}${getOrdinalSuffix(i)} EMI`,
        `INR ${String(emiAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
      ]);
    }
    // Add total row
    const totalAmount = emiAmount * months + processingFee;
    emiRows.push([
      '',
      'Total Amount',
      `INR ${String(totalAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`,
    ]);

    // Custom table rendering (no autoTable)
    const tableCol1 = margin + 10;
    const tableCol2 = margin + 44;
    const tableCol3 = margin + contentWidth - 25;
    const rowHeight = 8;
    // Header row with background and visible text
    doc.setFillColor(21, 171, 139);
    doc.rect(margin, yPosition, contentWidth, rowHeight, 'F');
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(margin, yPosition, contentWidth, rowHeight, 'S');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(255, 255, 255);
    doc.text('Date', tableCol1 + 8, yPosition + 5, { align: 'center' });
    doc.text('Description', tableCol2, yPosition + 5);
    doc.text('Amount', tableCol3, yPosition + 5, { align: 'right' });
    // Draw vertical column lines for header
    doc.line(tableCol2 - 8, yPosition, tableCol2 - 8, yPosition + rowHeight * (emiRows.length + 1));
    doc.line(
      tableCol3 - 20,
      yPosition,
      tableCol3 - 20,
      yPosition + rowHeight * (emiRows.length + 1)
    );
    yPosition += rowHeight;
    // Table rows
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    for (let i = 0; i < emiRows.length; i++) {
      // Alternating row backgrounds
      if (i % 2 === 0) {
        doc.setFillColor(230, 250, 245);
      } else {
        doc.setFillColor(245, 255, 250);
      }
      doc.rect(margin, yPosition, contentWidth, rowHeight, 'F');
      // Row borders
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.3);
      doc.rect(margin, yPosition, contentWidth, rowHeight, 'S');
      // Text
      doc.setFont('helvetica', i === emiRows.length - 1 ? 'bold' : 'normal');
      doc.setFontSize(i === emiRows.length - 1 ? 11 : 10);
      doc.setTextColor(
        i === emiRows.length - 1 ? 21 : 60,
        i === emiRows.length - 1 ? 171 : 60,
        i === emiRows.length - 1 ? 139 : 60
      );
      doc.text(emiRows[i][0], tableCol1 + 8, yPosition + 5, { align: 'center' });
      doc.text(emiRows[i][1], tableCol2, yPosition + 5);
      if (i === emiRows.length - 1) {
        doc.text(emiRows[i][2], tableCol3 + 4, yPosition + 5, { align: 'right' });
      } else {
        doc.text(emiRows[i][2], tableCol3, yPosition + 5, { align: 'right' });
      }
      yPosition += rowHeight;
    }
    // Table outer border
    doc.setDrawColor(200, 200, 200);
    doc.setLineWidth(0.3);
    doc.rect(
      margin,
      yPosition - rowHeight * (emiRows.length + 1),
      contentWidth,
      rowHeight * (emiRows.length + 1),
      'S'
    );
    // Draw vertical column lines for the whole table
    doc.line(tableCol2 - 8, yPosition - rowHeight * (emiRows.length + 1), tableCol2 - 8, yPosition);
    doc.line(
      tableCol3 - 20,
      yPosition - rowHeight * (emiRows.length + 1),
      tableCol3 - 20,
      yPosition
    );
    yPosition += 10;

    // Add General Terms & Conditions above FINAL PRICE
    const termsHeader = 'General Terms & Conditions';
    const terms = [
      '• Prices are subject to change without prior notice',
      '• Hotel check-in/check-out times are as per hotel policy',
      '• Rates are valid for the mentioned dates only',
    ];
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text(termsHeader, margin, yPosition);
    yPosition += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(11);
    doc.setTextColor(80, 80, 80);
    terms.forEach(term => {
      doc.text(term, margin + 2, yPosition);
      yPosition += 5;
    });
    yPosition += 4;

    // After EMI Payment Schedule table, add FINAL PRICE box
    const finalPrice = `INR ${String(totalAmount).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
    const finalPriceText = `FINAL PRICE (Incl. GST) - ${finalPrice}`;
    const boxHeight = 12;
    // Shadow effect for box: draw a dark, slightly offset rounded rect first
    doc.setFillColor(60, 60, 60, 0.25); // semi-transparent dark
    doc.roundedRect(margin + 2, yPosition + 2, contentWidth, boxHeight, 4, 4, 'F');
    // Main box
    doc.setFillColor(21, 171, 139); // var(--primary)
    doc.roundedRect(margin, yPosition, contentWidth, boxHeight, 4, 4, 'F');
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(13);
    // Shadow effect: draw shadow text first (slightly offset, dark color)
    doc.setTextColor(60, 60, 60);
    doc.text(finalPriceText, margin + contentWidth / 2 + 1, yPosition + boxHeight / 2 + 4, {
      align: 'center',
    });
    // Main text: white, on top
    doc.setTextColor(255, 255, 255);
    doc.text(finalPriceText, margin + contentWidth / 2, yPosition + boxHeight / 2 + 3, {
      align: 'center',
    });
    yPosition += boxHeight + 6;

    // Open PDF in new tab instead of downloading
    const pdfBlob = doc.output('blob');
    const pdfUrl = URL.createObjectURL(pdfBlob);
    window.open(pdfUrl, '_blank');

    notificationManager.show('PDF preview opened in new tab!', 'success');
  } catch (error) {
    console.error('Error creating PDF preview:', error);
    notificationManager.show('Error creating PDF preview. Please try again.', 'error');
  }

  // Helper for ordinal suffix
  function getOrdinalSuffix(num) {
    const j = num % 10,
      k = num % 100;
    if (j == 1 && k != 11) return 'st';
    if (j == 2 && k != 12) return 'nd';
    if (j == 3 && k != 13) return 'rd';
    return 'th';
  }

  // Helper to convert meal plan codes to descriptions (from HTML selection)
  function getMealPlanDescription(mealPlan) {
    if (!mealPlan) return 'Breakfast included';
    const code = mealPlan.toUpperCase();
    if (code === 'CP') return 'Breakfast included';
    if (code === 'MAP') return 'Breakfast & Dinner included';
    if (code === 'AP') return 'All meals included';
    if (code === 'EP') return 'No meals included';
    return mealPlan;
  }
}

// Make function globally available
window.previewPackagePDF = previewPackagePDF;
