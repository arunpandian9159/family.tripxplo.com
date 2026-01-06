class PackageCardGenerator {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.cardWidth = 400;
    this.cardHeight = 750; // Increased height for enhanced design
  }

  // Initialize canvas
  initCanvas() {
    this.canvas = document.createElement('canvas');
    this.canvas.width = this.cardWidth;
    this.canvas.height = this.cardHeight;
    this.ctx = this.canvas.getContext('2d');

    // Enable high DPI rendering
    const dpr = window.devicePixelRatio || 1;
    this.canvas.width = this.cardWidth * dpr;
    this.canvas.height = this.cardHeight * dpr;
    this.canvas.style.width = this.cardWidth + 'px';
    this.canvas.style.height = this.cardHeight + 'px';
    this.ctx.scale(dpr, dpr);
  }

  // Load image helper
  loadImage(src) {
    return new Promise((resolve, reject) => {
      const img = new Image();

      // Only set crossOrigin for external URLs
      if (src.startsWith('http')) {
        img.crossOrigin = 'anonymous';
      }

      img.onload = () => resolve(img);
      img.onerror = error => {
        console.warn('Failed to load image:', src, error);
        reject(error);
      };
      img.src = src;
    });
  }

  // Draw rounded rectangle
  drawRoundedRect(x, y, width, height, radius) {
    this.ctx.beginPath();
    this.ctx.moveTo(x + radius, y);
    this.ctx.lineTo(x + width - radius, y);
    this.ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    this.ctx.lineTo(x + width, y + height - radius);
    this.ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    this.ctx.lineTo(x + radius, y + height);
    this.ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    this.ctx.lineTo(x, y + radius);
    this.ctx.quadraticCurveTo(x, y, x + radius, y);
    this.ctx.closePath();
  }

  // Draw gradient background
  drawGradientBackground() {
    const gradient = this.ctx.createLinearGradient(0, 0, 0, this.cardHeight);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.3, '#FFA500');
    gradient.addColorStop(1, '#FF8C00');

    this.drawRoundedRect(0, 0, this.cardWidth, this.cardHeight, 20);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();
  }

  // Draw destination image with enhanced visual appeal
  async drawDestinationImage(imageSrc, destination) {
    try {
      const img = await this.loadImage(imageSrc);

      // Create clipping path for image area
      this.ctx.save();
      this.drawRoundedRect(15, 15, this.cardWidth - 30, 220, 20);
      this.ctx.clip();

      // Calculate image scaling to cover the area while maintaining aspect ratio
      const imgAspect = img.width / img.height;
      const areaAspect = (this.cardWidth - 30) / 220;

      let drawWidth, drawHeight, drawX, drawY;

      if (imgAspect > areaAspect) {
        // Image is wider, scale by height
        drawHeight = 220;
        drawWidth = drawHeight * imgAspect;
        drawX = 15 - (drawWidth - (this.cardWidth - 30)) / 2;
        drawY = 15;
      } else {
        // Image is taller, scale by width
        drawWidth = this.cardWidth - 30;
        drawHeight = drawWidth / imgAspect;
        drawX = 15;
        drawY = 15 - (drawHeight - 220) / 2;
      }

      // Draw image with proper scaling
      this.ctx.drawImage(img, drawX, drawY, drawWidth, drawHeight);

      // Add sophisticated overlay gradient
      const overlay = this.ctx.createLinearGradient(0, 15, 0, 235);
      overlay.addColorStop(0, 'rgba(0,0,0,0.1)');
      overlay.addColorStop(0.6, 'rgba(0,0,0,0.3)');
      overlay.addColorStop(1, 'rgba(0,0,0,0.7)');
      this.ctx.fillStyle = overlay;
      this.ctx.fillRect(15, 15, this.cardWidth - 30, 220);

      this.ctx.restore();
    } catch (error) {
      console.warn('Could not load destination image, using enhanced fallback for:', destination);
      // Enhanced fallback gradient based on destination
      this.ctx.save();
      this.drawRoundedRect(15, 15, this.cardWidth - 30, 220, 20);

      const fallback = this.ctx.createLinearGradient(0, 15, 0, 235);

      // Enhanced destination-specific gradients
      const dest = destination.toLowerCase();
      if (dest.includes('andaman') || dest.includes('beach') || dest.includes('island')) {
        fallback.addColorStop(0, '#667eea');
        fallback.addColorStop(0.5, '#4facfe');
        fallback.addColorStop(1, '#00f2fe');
      } else if (dest.includes('kashmir') || dest.includes('mountain') || dest.includes('hill')) {
        fallback.addColorStop(0, '#ffecd2');
        fallback.addColorStop(0.5, '#a8edea');
        fallback.addColorStop(1, '#fed6e3');
      } else if (dest.includes('goa') || dest.includes('beach')) {
        fallback.addColorStop(0, '#ff9a9e');
        fallback.addColorStop(0.5, '#ffecd2');
        fallback.addColorStop(1, '#fcb69f');
      } else if (dest.includes('kerala') || dest.includes('backwater')) {
        fallback.addColorStop(0, '#a8edea');
        fallback.addColorStop(0.5, '#fed6e3');
        fallback.addColorStop(1, '#d299c2');
      } else if (dest.includes('rajasthan') || dest.includes('desert')) {
        fallback.addColorStop(0, '#ffecd2');
        fallback.addColorStop(0.5, '#fcb69f');
        fallback.addColorStop(1, '#ff8a80');
      } else {
        fallback.addColorStop(0, '#667eea');
        fallback.addColorStop(0.5, '#764ba2');
        fallback.addColorStop(1, '#f093fb');
      }

      this.ctx.fillStyle = fallback;
      this.ctx.fill();

      // Add subtle pattern overlay
      this.ctx.globalAlpha = 0.1;
      this.ctx.fillStyle = 'white';
      for (let i = 0; i < 10; i++) {
        this.ctx.beginPath();
        this.ctx.arc(
          Math.random() * (this.cardWidth - 30) + 15,
          Math.random() * 220 + 15,
          Math.random() * 20 + 5,
          0,
          Math.PI * 2
        );
        this.ctx.fill();
      }
      this.ctx.globalAlpha = 1;

      this.ctx.restore();
    }
  }

  // Draw gold badge
  drawGoldBadge() {
    // Gold badge background
    this.ctx.save();
    this.ctx.fillStyle = '#FFD700';
    this.ctx.beginPath();
    this.ctx.moveTo(25, 25);
    this.ctx.lineTo(80, 25);
    this.ctx.lineTo(90, 35);
    this.ctx.lineTo(80, 45);
    this.ctx.lineTo(25, 45);
    this.ctx.closePath();
    this.ctx.fill();

    // Gold badge text
    this.ctx.fillStyle = '#8B4513';
    this.ctx.font = 'bold 12px Arial';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('GOLD', 52, 38);
    this.ctx.restore();
  }

  // Draw destination title with enhanced typography
  drawDestinationTitle(destination, duration) {
    this.ctx.save();

    // Enhanced duration badge with gradient
    const badgeGradient = this.ctx.createLinearGradient(
      this.cardWidth - 90,
      25,
      this.cardWidth - 90,
      55
    );
    badgeGradient.addColorStop(0, 'rgba(0,0,0,0.8)');
    badgeGradient.addColorStop(1, 'rgba(0,0,0,0.6)');
    this.ctx.fillStyle = badgeGradient;
    this.drawRoundedRect(this.cardWidth - 90, 25, 70, 30, 15);
    this.ctx.fill();

    // Duration text with better font
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(duration, this.cardWidth - 55, 45);

    // Destination name with enhanced styling
    this.ctx.textAlign = 'center';

    // Text shadow effect
    this.ctx.fillStyle = 'rgba(0,0,0,0.5)';
    this.ctx.font = 'bold 42px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
    this.ctx.fillText(destination, this.cardWidth / 2 + 2, 200 + 2);

    // Main text with gradient
    const textGradient = this.ctx.createLinearGradient(0, 180, 0, 210);
    textGradient.addColorStop(0, '#ffffff');
    textGradient.addColorStop(1, '#f0f0f0');
    this.ctx.fillStyle = textGradient;
    this.ctx.font = 'bold 42px "Segoe UI", "Helvetica Neue", Arial, sans-serif';
    this.ctx.fillText(destination, this.cardWidth / 2, 200);

    // Text outline for better visibility
    this.ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    this.ctx.lineWidth = 1;
    this.ctx.strokeText(destination, this.cardWidth / 2, 200);

    this.ctx.restore();
  }

  // Draw enhanced content area with subtle shadow
  drawContentArea() {
    this.ctx.save();

    // Drop shadow
    this.ctx.fillStyle = 'rgba(0,0,0,0.1)';
    this.drawRoundedRect(17, 252, this.cardWidth - 30, this.cardHeight - 265, 20);
    this.ctx.fill();

    // Main content area with gradient
    const contentGradient = this.ctx.createLinearGradient(0, 250, 0, this.cardHeight);
    contentGradient.addColorStop(0, '#ffffff');
    contentGradient.addColorStop(1, '#fafafa');
    this.ctx.fillStyle = contentGradient;
    this.drawRoundedRect(15, 250, this.cardWidth - 30, this.cardHeight - 265, 20);
    this.ctx.fill();

    // Subtle border
    this.ctx.strokeStyle = 'rgba(0,0,0,0.05)';
    this.ctx.lineWidth = 1;
    this.drawRoundedRect(15, 250, this.cardWidth - 30, this.cardHeight - 265, 20);
    this.ctx.stroke();

    this.ctx.restore();
  }

  // Draw travel mode with enhanced styling
  drawTravelMode(mode) {
    this.ctx.save();

    // Background for travel mode
    this.ctx.fillStyle = 'rgba(102, 126, 234, 0.1)';
    this.drawRoundedRect(this.cardWidth / 2 - 80, 270, 160, 25, 12);
    this.ctx.fill();

    this.ctx.fillStyle = '#667eea';
    this.ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`🚂 BY ${mode}`, this.cardWidth / 2, 287);
    this.ctx.restore();
  }

  // Draw package details with enhanced typography
  drawPackageDetails(packageData) {
    const startY = 320;
    const lineHeight = 40;
    let currentY = startY;

    this.ctx.save();
    this.ctx.textAlign = 'left';

    // Hotel stay
    this.ctx.font = '18px "Segoe UI", Arial, sans-serif';
    this.ctx.fillStyle = '#667eea';
    this.ctx.fillText('🏨', 35, currentY);

    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    this.ctx.fillText(`${packageData.nights}N Hotel Stay`, 65, currentY);
    currentY += lineHeight;

    // Meal plan
    this.ctx.font = '18px "Segoe UI", Arial, sans-serif';
    this.ctx.fillStyle = '#28a745';
    this.ctx.fillText('🍽️', 35, currentY);

    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    this.ctx.fillText(packageData.mealPlan, 65, currentY);
    currentY += lineHeight;

    // Transportation
    this.ctx.font = '18px "Segoe UI", Arial, sans-serif';
    this.ctx.fillStyle = '#ff6b35';
    this.ctx.fillText('🚗', 35, currentY);

    this.ctx.fillStyle = '#333';
    this.ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';
    this.ctx.fillText('Cab + Sightseeing', 65, currentY);

    this.ctx.restore();
  }

  // Draw family type section with enhanced design and proper spacing
  drawFamilyTypeSection(familyData) {
    const sectionY = 430; // Moved up from 460

    this.ctx.save();

    // Family type badge with gradient
    const familyGradient = this.ctx.createLinearGradient(0, sectionY, 0, sectionY + 35);
    familyGradient.addColorStop(0, '#28a745');
    familyGradient.addColorStop(1, '#20c997');
    this.ctx.fillStyle = familyGradient;
    this.drawRoundedRect(30, sectionY, this.cardWidth - 60, 35, 17);
    this.ctx.fill();

    // Badge shadow
    this.ctx.fillStyle = 'rgba(40, 167, 69, 0.2)';
    this.drawRoundedRect(32, sectionY + 2, this.cardWidth - 60, 35, 17);
    this.ctx.fill();

    // Family type text
    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('FAMILY TYPE', this.cardWidth / 2, sectionY + 23);

    // Family icon
    this.ctx.font = '20px "Segoe UI", Arial, sans-serif';
    this.ctx.fillStyle = '#28a745';
    this.ctx.fillText('👨‍👩‍👧‍👦', this.cardWidth / 2, sectionY + 60);

    // Family name in 2 lines if needed
    this.ctx.fillStyle = '#28a745';
    this.ctx.font = 'bold 16px "Segoe UI", Arial, sans-serif';

    // Split family name into 2 lines if too long
    const familyName = familyData.name;
    const maxNameWidth = this.cardWidth - 80;
    const nameWords = familyName.split(' ');

    if (nameWords.length > 1 && this.ctx.measureText(familyName).width > maxNameWidth) {
      // Split into 2 lines
      const midPoint = Math.ceil(nameWords.length / 2);
      const line1 = nameWords.slice(0, midPoint).join(' ');
      const line2 = nameWords.slice(midPoint).join(' ');

      this.ctx.fillText(line1, this.cardWidth / 2, sectionY + 80);
      this.ctx.fillText(line2, this.cardWidth / 2, sectionY + 100);
    } else {
      // Single line
      if (this.ctx.measureText(familyName).width > maxNameWidth) {
        this.ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
      }
      this.ctx.fillText(familyName, this.cardWidth / 2, sectionY + 85);
    }

    // Family composition with better formatting and width constraint
    this.ctx.fillStyle = '#555';
    this.ctx.font = '11px "Segoe UI", Arial, sans-serif'; // Smaller for better fit

    // Split long composition text into multiple lines if needed
    const composition = familyData.composition;
    const maxWidth = this.cardWidth - 60; // Less margin for composition
    const words = composition.split(' ');
    let line = '';
    let lineY = sectionY + 125; // Adjusted for 2-line family name

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + ' ';
      const metrics = this.ctx.measureText(testLine);

      if (metrics.width > maxWidth && i > 0) {
        this.ctx.fillText(line.trim(), this.cardWidth / 2, lineY);
        line = words[i] + ' ';
        lineY += 16; // Reduced line height
      } else {
        line = testLine;
      }
    }
    this.ctx.fillText(line.trim(), this.cardWidth / 2, lineY);

    this.ctx.restore();
  }

  // Draw EMI section with enhanced design and proper spacing
  drawEMISection(emiData) {
    const sectionY = 580; // More space for 2-line family names

    this.ctx.save();

    // EMI badge with gradient and shadow
    this.ctx.fillStyle = 'rgba(255, 71, 87, 0.2)';
    this.drawRoundedRect(32, sectionY + 2, 140, 30, 15);
    this.ctx.fill();

    const emiGradient = this.ctx.createLinearGradient(0, sectionY, 0, sectionY + 30);
    emiGradient.addColorStop(0, '#ff4757');
    emiGradient.addColorStop(1, '#ff3742');
    this.ctx.fillStyle = emiGradient;
    this.drawRoundedRect(30, sectionY, 140, 30, 15);
    this.ctx.fill();

    this.ctx.fillStyle = 'white';
    this.ctx.font = 'bold 12px "Segoe UI", Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText(`PAY ${emiData.months} MONTHS`, 100, sectionY + 20);

    this.ctx.restore();
  }

  // Draw price section with enhanced styling
  drawPriceSection(price) {
    const sectionY = 630; // Adjusted for EMI section spacing

    this.ctx.save();

    // Price background shadow
    this.ctx.fillStyle = 'rgba(255, 215, 0, 0.3)';
    this.drawRoundedRect(32, sectionY + 4, this.cardWidth - 60, 85, 20);
    this.ctx.fill();

    // Price background with enhanced gradient
    const gradient = this.ctx.createLinearGradient(0, sectionY, 0, sectionY + 85);
    gradient.addColorStop(0, '#FFD700');
    gradient.addColorStop(0.5, '#FFC107');
    gradient.addColorStop(1, '#FF8F00');

    this.drawRoundedRect(30, sectionY, this.cardWidth - 60, 85, 20);
    this.ctx.fillStyle = gradient;
    this.ctx.fill();

    // Price border
    this.ctx.strokeStyle = 'rgba(255, 215, 0, 0.8)';
    this.ctx.lineWidth = 2;
    this.drawRoundedRect(30, sectionY, this.cardWidth - 60, 85, 20);
    this.ctx.stroke();

    // Currency symbol
    this.ctx.fillStyle = '#8B4513';
    this.ctx.font = 'bold 24px "Segoe UI", Arial, sans-serif';
    this.ctx.textAlign = 'center';
    this.ctx.fillText('₹', this.cardWidth / 2 - 60, sectionY + 50);

    // Price amount
    this.ctx.fillStyle = '#8B4513';
    this.ctx.font = 'bold 36px "Segoe UI", Arial, sans-serif';
    this.ctx.fillText(price.toLocaleString(), this.cardWidth / 2 + 10, sectionY + 50);

    // "Per Family" text
    this.ctx.fillStyle = '#8B4513';
    this.ctx.font = 'bold 14px "Segoe UI", Arial, sans-serif';
    this.ctx.fillText('Per Family', this.cardWidth / 2, sectionY + 70);

    this.ctx.restore();
  }

  // Draw clean brand logo without background
  async drawBrandLogo() {
    try {
      // TripXplo logo as base64 data URI (PNG)
      const logoDataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAAAoCAYAAABQn2AT...'; // (truncated for brevity, insert full base64 here)
      const logoImg = await this.loadImage(logoDataUri);

      this.ctx.save();

      // Draw logo directly without background
      const logoSize = 80;
      this.ctx.drawImage(logoImg, this.cardWidth - logoSize - 20, 265, logoSize, logoSize * 0.4);

      this.ctx.restore();
    } catch (error) {
      console.warn('Could not load brand logo, using clean fallback');
      // Clean fallback text logo without background
      this.ctx.save();

      // TripXplo text with gradient - no background, no tagline
      const logoGradient = this.ctx.createLinearGradient(0, 270, 0, 290);
      logoGradient.addColorStop(0, '#667eea');
      logoGradient.addColorStop(1, '#764ba2');

      this.ctx.fillStyle = logoGradient;
      this.ctx.font = 'bold 18px "Segoe UI", Arial, sans-serif'; // Slightly larger
      this.ctx.textAlign = 'right';
      this.ctx.fillText('TripXplo', this.cardWidth - 25, 285);

      this.ctx.restore();
    }
  }

  // Generate complete package card
  async generatePackageCard(packageData) {
    this.initCanvas();

    // Draw all elements
    this.drawGradientBackground();
    await this.drawDestinationImage(packageData.image, packageData.destination);
    this.drawGoldBadge();
    this.drawDestinationTitle(packageData.destination, packageData.duration);
    this.drawContentArea();
    await this.drawBrandLogo();
    this.drawTravelMode(packageData.travelMode);
    this.drawPackageDetails(packageData);
    this.drawFamilyTypeSection(packageData.family);
    this.drawEMISection(packageData.emi);
    this.drawPriceSection(packageData.price);

    return this.canvas;
  }

  // Download card as image
  downloadCard(canvas, filename = 'package-card.png') {
    const link = document.createElement('a');
    link.download = filename;
    link.href = canvas.toDataURL('image/png', 1.0);
    link.click();
  }

  // Share card (if Web Share API is available)
  async shareCard(canvas, packageData) {
    if (navigator.share && navigator.canShare) {
      try {
        canvas.toBlob(
          async blob => {
            const file = new File([blob], `${packageData.destination}-package.png`, {
              type: 'image/png',
            });

            if (navigator.canShare({ files: [file] })) {
              await navigator.share({
                title: `${packageData.destination} Family Package`,
                text: `Check out this amazing ${packageData.destination} package for ₹${packageData.price.toLocaleString()}!`,
                files: [file],
              });
            }
          },
          'image/png',
          1.0
        );
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to download
        this.downloadCard(canvas, `${packageData.destination}-package.png`);
      }
    } else {
      // Fallback to download
      this.downloadCard(canvas, `${packageData.destination}-package.png`);
    }
  }
}

// Export for use
window.PackageCardGenerator = PackageCardGenerator;
